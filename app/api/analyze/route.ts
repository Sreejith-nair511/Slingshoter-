import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { analyzeQuery } from '@/lib/llm'
import { verifyAllClaims } from '@/lib/verification'
import { calculateMetrics, shouldTriggerNotification } from '@/lib/calibration'

const AnalyzeRequestSchema = z.object({
  query: z.string().min(1).max(1000),
  model: z.string().optional().default('gpt-4o'),
})

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Parse and validate request
    const body = await request.json()
    const { query, model } = AnalyzeRequestSchema.parse(body)
    
    // Step 1: Analyze with LLM
    const llmResponse = await analyzeQuery(query)
    
    // Step 2: Verify claims
    const verificationResults = await verifyAllClaims(llmResponse.claims)
    
    // Step 3: Calculate aggregate scores
    const avgReliability = verificationResults.reduce((sum, r) => sum + r.reliability, 0) / verificationResults.length
    const confidenceScore = llmResponse.overallConfidence
    const reliabilityScore = Math.round(avgReliability * 10) / 10
    
    // Step 4: Calculate calibration metrics
    const metrics = calculateMetrics(confidenceScore, reliabilityScore)
    
    // Step 5: Calculate latency
    const verificationLatency = Date.now() - startTime
    
    // Step 6: Get settings for notification check
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
    
    // Step 7: Save analysis to database
    const analysis = await prisma.analysis.create({
      data: {
        query,
        model,
        output: llmResponse.answer,
        confidenceScore,
        reliabilityScore,
        trustDeviation: metrics.trustDeviation,
        calibrationIndex: metrics.calibrationIndex,
        verificationLatency,
        claims: {
          create: verificationResults.map(result => ({
            text: result.text,
            confidence: llmResponse.claims.find(c => c.text === result.text)?.confidence || 0,
            reliability: result.reliability,
            verified: result.verified,
          })),
        },
      },
      include: {
        claims: true,
      },
    })
    
    // Step 8: Check if notification should be triggered
    const notificationCheck = shouldTriggerNotification(
      metrics.trustDeviation,
      reliabilityScore,
      settings
    )
    
    if (notificationCheck.shouldNotify) {
      await prisma.notification.create({
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
        },
      },
    })
    
    // Step 10: Return response
    return NextResponse.json({
      success: true,
      data: {
        id: analysis.id,
        query,
        output: llmResponse.answer,
        confidenceScore,
        reliabilityScore,
        trustDeviation: metrics.trustDeviation,
        calibrationIndex: metrics.calibrationIndex,
        calibrationLevel: metrics.calibrationLevel,
        riskLevel: metrics.riskLevel,
        verificationLatency,
        claims: verificationResults.map((result, idx) => ({
          text: result.text,
          confidence: llmResponse.claims[idx]?.confidence || 0,
          reliability: result.reliability,
          verified: result.verified,
          evidence: result.evidence,
        })),
        createdAt: analysis.createdAt,
      },
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
