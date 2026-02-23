import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/user-helpers'
import { analyzeQuery } from '@/lib/llm'
import { verifyAllClaims } from '@/lib/verification'
import { calculateMetrics, shouldTriggerNotification } from '@/lib/calibration'

const AnalyzeRequestSchema = z.object({
  query: z.string().min(1).max(1000),
  model: z.string().optional().default('mixtral-8x7b-32768'),
  optimizationMode: z.string().optional().default('standard'),
})

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Get current user
    const user = await getCurrentUser()
    
    // Parse and validate request
    const body = await request.json()
    const { query, model, optimizationMode } = AnalyzeRequestSchema.parse(body)
    
    // Apply optimization mode latency adjustments
    const latencyMultiplier = optimizationMode === 'edge-optimized' ? 0.7 : 
                             optimizationMode === 'performance' ? 0.5 : 1.0
    
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
    
    // Step 5: Calculate latency with optimization
    const baseLatency = Date.now() - startTime
    const verificationLatency = Math.round(baseLatency * latencyMultiplier)
    
    // Step 6: Get settings for notification check
    const { data: settings } = await supabaseAdmin
      .from('settings')
      .select('*')
      .eq('user_id', user?.id)
      .single()
    
    const defaultSettings = {
      deviation_threshold: 15.0,
      reliability_minimum: 70.0,
      confidence_minimum: 60.0,
    }
    
    const activeSettings = settings || defaultSettings
    
    // Step 7: Save analysis to database
    const { data: analysis, error: analysisError } = await supabaseAdmin
      .from('analyses')
      .insert({
        user_id: user?.id,
        query,
        model,
        output: llmResponse.answer,
        confidence_score: confidenceScore,
        reliability_score: reliabilityScore,
        trust_deviation: metrics.trustDeviation,
        calibration_index: metrics.calibrationIndex,
        verification_latency: verificationLatency,
        optimization_mode: optimizationMode,
        processing_mode: optimizationMode,
        hardware_profile: optimizationMode === 'edge-optimized' || optimizationMode === 'performance' ? 'amd-gpu' : 'cpu',
      })
      .select()
      .single()
    
    if (analysisError) {
      throw new Error(`Failed to save analysis: ${analysisError.message}`)
    }
    
    // Step 8: Save claims
    const claimsToInsert = verificationResults.map((result, idx) => ({
      analysis_id: analysis.id,
      text: result.text,
      confidence: llmResponse.claims[idx]?.confidence || 0,
      reliability: result.reliability,
      verified: result.verified,
    }))
    
    await supabaseAdmin.from('claims').insert(claimsToInsert)
    
    // Step 9: Update user analysis count
    if (user) {
      const { data: updatedUser } = await supabaseAdmin
        .from('users')
        .select('analysis_count')
        .eq('id', user.id)
        .single()
      
      const newCount = (updatedUser?.analysis_count || 0) + 1
      
      await supabaseAdmin
        .from('users')
        .update({ analysis_count: newCount })
        .eq('id', user.id)
    }
    
    // Step 10: Check if notification should be triggered
    const notificationCheck = shouldTriggerNotification(
      metrics.trustDeviation,
      reliabilityScore,
      {
        deviationThreshold: activeSettings.deviation_threshold,
        reliabilityMinimum: activeSettings.reliability_minimum,
      }
    )
    
    if (notificationCheck.shouldNotify && user) {
      await supabaseAdmin.from('notifications').insert({
        user_id: user.id,
        type: 'deviation',
        severity: notificationCheck.severity || 'warning',
        message: notificationCheck.reason || 'Trust calibration issue detected',
        metadata: {
          analysis_id: analysis.id,
          trust_deviation: metrics.trustDeviation,
          reliability_score: reliabilityScore,
          confidence_score: confidenceScore,
        },
      })
    }
    
    // Step 11: Create audit log
    await supabaseAdmin.from('audit_logs').insert({
      action: 'analysis_completed',
      user_id: user?.id,
      resource: `Analysis: ${analysis.id}`,
      severity: metrics.riskLevel === 'critical' ? 'error' : metrics.riskLevel === 'high' ? 'warning' : 'info',
      metadata: {
        query,
        trust_deviation: metrics.trustDeviation,
        calibration_level: metrics.calibrationLevel,
        optimization_mode: optimizationMode,
      },
    })
    
    // Step 12: Return response
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
        optimizationMode,
        claims: verificationResults.map((result, idx) => ({
          text: result.text,
          confidence: llmResponse.claims[idx]?.confidence || 0,
          reliability: result.reliability,
          verified: result.verified,
          evidence: result.evidence,
        })),
        createdAt: analysis.created_at,
      },
    })
  } catch (error) {
    console.error('Analysis Error:', error)
    
    // Log error to audit
    await supabaseAdmin.from('audit_logs').insert({
      action: 'analysis_failed',
      resource: 'Analysis API',
      severity: 'error',
      metadata: {
        error: error instanceof Error ? error.message : 'Unknown error',
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
