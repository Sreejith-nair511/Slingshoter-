import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const timeframe = searchParams.get('timeframe') || '24h'
    
    // Calculate time range
    const now = new Date()
    let startDate = new Date()
    
    switch (timeframe) {
      case '1h':
        startDate.setHours(now.getHours() - 1)
        break
      case '24h':
        startDate.setHours(now.getHours() - 24)
        break
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      default:
        startDate.setHours(now.getHours() - 24)
    }
    
    // Fetch analyses in timeframe
    const analyses = await prisma.analysis.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: { createdAt: 'asc' },
    })
    
    // Calculate metrics
    const totalAnalyses = analyses.length
    const avgTrustDeviation = totalAnalyses > 0
      ? analyses.reduce((sum, a) => sum + a.trustDeviation, 0) / totalAnalyses
      : 0
    const avgVerificationLatency = totalAnalyses > 0
      ? analyses.reduce((sum, a) => sum + a.verificationLatency, 0) / totalAnalyses
      : 0
    const avgCalibrationIndex = totalAnalyses > 0
      ? analyses.reduce((sum, a) => sum + a.calibrationIndex, 0) / totalAnalyses
      : 0
    const avgConfidence = totalAnalyses > 0
      ? analyses.reduce((sum, a) => sum + a.confidenceScore, 0) / totalAnalyses
      : 0
    const avgReliability = totalAnalyses > 0
      ? analyses.reduce((sum, a) => sum + a.reliabilityScore, 0) / totalAnalyses
      : 0
    
    // Calculate trend data (group by hour or day)
    const trendData = analyses.map(a => ({
      timestamp: a.createdAt,
      trustDeviation: a.trustDeviation,
      calibrationIndex: a.calibrationIndex,
      confidence: a.confidenceScore,
      reliability: a.reliabilityScore,
      latency: a.verificationLatency,
    }))
    
    // Count by calibration level
    const calibrationDistribution = {
      balanced: analyses.filter(a => a.trustDeviation < 10).length,
      moderate: analyses.filter(a => a.trustDeviation >= 10 && a.trustDeviation < 25).length,
      high: analyses.filter(a => a.trustDeviation >= 25 && a.trustDeviation < 40).length,
      critical: analyses.filter(a => a.trustDeviation >= 40).length,
    }
    
    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalAnalyses,
          avgTrustDeviation: Math.round(avgTrustDeviation * 10) / 10,
          avgVerificationLatency: Math.round(avgVerificationLatency),
          avgCalibrationIndex: Math.round(avgCalibrationIndex * 10) / 10,
          avgConfidence: Math.round(avgConfidence * 10) / 10,
          avgReliability: Math.round(avgReliability * 10) / 10,
        },
        trend: trendData,
        distribution: calibrationDistribution,
        timeframe,
      },
    })
  } catch (error) {
    console.error('Fetch Metrics Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
}
