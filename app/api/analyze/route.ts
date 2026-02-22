import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { analyzeQuery } from '@/lib/llm'
import { calculateMetrics, shouldTriggerNotification } from '@/lib/calibration'
import { getCached, setCache, checkRateLimit, publishNotification } from '@/lib/redis'
import { addVerificationJob } from '@/lib/queue'

const AnalyzeRequestSchema = z.object({
  query: z.string().min(1).max(1000),
  model: z.string().optional().default('gpt-4o'),
  language: z.string().optional().default('en'),
})

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimit = await checkRateLimit(clientIp, 10, 60)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded', remaining: rateLimit.remaining },
        { status: 429 }
      )
    }
    
    // Parse and validate request
    const body = await request.json()
    const { query, model, language } = AnalyzeRequestSchema.parse(body)
    
    // Check cache
    const cacheKey = `analysis:${query}:${model}:${language}`
    const cached = await getCached(cacheKey)
    if (cached) {
      console.log('Cache hit for query:', query)
      return NextResponse.json({
        success: true,
        data: cached,
        cached: true,
      })
    }
    
    // Step 1: Analyze with LLM
    const llmResponse = await analyzeQuery(query)
    
    // Step 2: Create initial analysis record
    const confidenceScore = llmResponse.overallConfidence
    
    const analysis = await prisma.analysis.create({
      data: {
        query,
        model,
        output: llmResponse.answer,
        confidenceScore,
        reliabilityScore: 0, // Will be updated by worker
        trustDeviation: 0, // Will be updated by worker
        calibrationIndex: 0,
        verificationLatency: 0,
        claims: {
          create: llmResponse.claims.map(claim => ({
            text: claim.text,
            confidence: claim.confidence,
            reliability: 0, // Will be updated by worker
            verified: false,
          })),
        },
      },
      include: {
        claims: true,
      },
    })
    
    // Step 3: Queue verification job (async processing)
    const verificationJob = await addVerificationJob({
      analysisId: analysis.id,
      query,
      claims: llmResponse.claims,
      language,
    })
    
    // Step 4: Call Python verification service directly for immediate response
    let pythonResult
    try {
      const pythonResponse = await fetch(
        process.env.PYTHON_SERVICE_URL || 'http://localhost:8000/verify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            claims: llmResponse.claims.map(c => ({
              text: c.text,
              confidence: c.confidence,
            })),
            language,
          }),
          signal: AbortSignal.timeout(10000), // 10 second timeout
        }
      )
      
      if (pythonResponse.ok) {
        pythonResult = await pythonResponse.json()
      }
    } catch (error) {
      console.error('Python service error:', error)
      // Continue without Python verification
    }
    
    // Step 5: Update with Python results if available
    let reliabilityScore = confidenceScore // Fallback
    let verifiedClaims = llmResponse.claims.map(c => ({
      ...c,
      reliability: c.confidence,
      verified: false,
      evidence: [],
    }))
    
    if (pythonResult) {
      reliabilityScore = pythonResult.overallReliability
      verifiedClaims = pythonResult.claims
      
      // Update analysis
      await prisma.analysis.update({
        where: { id: analysis.id },
        data: {
          reliabilityScore,
          trustDeviation: Math.abs(confidenceScore - reliabilityScore),
          verificationLatency: pythonResult.processingTime,
        },
      })
      
      // Update claims with embeddings
      for (let i = 0; i < pythonResult.claims.length; i++) {
        const claim = pythonResult.claims[i]
        const dbClaim = analysis.claims[i]
        
        await prisma.claim.update({
          where: { id: dbClaim.id },
          data: {
            reliability: claim.reliability,
            verified: claim.verified,
            embedding: claim.embedding ? {
              create: {
                vector: claim.embedding,
                dimension: claim.embedding.length,
              },
            } : undefined,
          },
        })
      }
    }
    
    // Step 6: Calculate calibration metrics
    const metrics = calculateMetrics(confidenceScore, reliabilityScore)
    
    await prisma.analysis.update({
      where: { id: analysis.id },
      data: {
        calibrationIndex: metrics.calibrationIndex,
      },
    })
    
    // Step 7: Get settings for notification check
    let settings = await prisma.settings.findFirst()
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          deviationThreshold: 15.0,
          reliabilityMinimum: 70.0,
          confidenceMinimum: 60.0,
        },
      })
    }
    
    // Step 8: Check if notification should be triggered
    const notificationCheck = shouldTriggerNotification(
      metrics.trustDeviation,
      reliabilityScore,
      settings
    )
    
    if (notificationCheck.shouldNotify) {
      const notification = await prisma.notification.create({
        data: {
          type: 'deviation',
          severity: notificationCheck.severity || 'warning',
          message: notificationCheck.reason || 'Trust calibration issue detected',
          metadata: {
            analysisId: analysis.id,
            trustDeviation: metrics.trustDeviation,
            reliabilityScore,
            confidenceScore,
          },
        },
      })
      
      // Publish to Redis for real-time updates
      await publishNotification(notification)
    }
    
    // Step 9: Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'analysis_completed',
        resource: `Analysis: ${analysis.id}`,
        severity: metrics.riskLevel === 'critical' ? 'error' : metrics.riskLevel === 'high' ? 'warning' : 'info',
        metadata: {
          query,
          trustDeviation: metrics.trustDeviation,
          calibrationLevel: metrics.calibrationLevel,
          verificationJobId: verificationJob.id,
        },
      },
    })
    
    // Step 10: Prepare response
    const responseData = {
      id: analysis.id,
      query,
      output: llmResponse.answer,
      confidenceScore,
      reliabilityScore,
      trustDeviation: metrics.trustDeviation,
      calibrationIndex: metrics.calibrationIndex,
      calibrationLevel: metrics.calibrationLevel,
      riskLevel: metrics.riskLevel,
      verificationLatency: pythonResult?.processingTime || 0,
      language: pythonResult?.language || language,
      claims: verifiedClaims,
      contradictions: pythonResult?.contradictions || [],
      verificationJobId: verificationJob.id,
      verificationStatus: 'processing',
      createdAt: analysis.createdAt,
    }
    
    // Cache result
    await setCache(cacheKey, responseData, 1800) // 30 minutes
    
    return NextResponse.json({
      success: true,
      data: responseData,
    })
  } catch (error) {
    console.error('Analysis Error:', error)
    
    // Log error to audit
    await prisma.auditLog.create({
      data: {
        action: 'analysis_failed',
        resource: 'Analysis API',
        severity: 'error',
        metadata: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      },
    }).catch(console.error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to analyze query' },
      { status: 500 }
    )
  }
}
