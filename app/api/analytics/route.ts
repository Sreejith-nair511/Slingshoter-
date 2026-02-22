import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCached, setCache } from '@/lib/redis'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const timeframe = searchParams.get('timeframe') || '7d'
    
    // Check cache
    const cacheKey = `analytics:${timeframe}`
    const cached = await getCached(cacheKey)
    if (cached) {
      return NextResponse.json({ success: true, data: cached, cached: true })
    }
    
    // Calculate time range
    const now = new Date()
    let startDate = new Date()
    
    switch (timeframe) {
      case '24h':
        startDate.setHours(now.getHours() - 24)
        break
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      default:
        startDate.setDate(now.getDate() - 7)
    }
    
    // Fetch all analyses in timeframe
    const analyses = await prisma.analysis.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: { createdAt: 'asc' },
    })
    
    // Calculate comprehensive analytics
    const totalAnalyses = analyses.length
    
    if (totalAnalyses === 0) {
      return NextResponse.json({
        success: true,
        data: {
          summary: {
            totalAnalyses: 0,
            avgTrustDeviation: 0,
            avgVerificationLatency: 0,
            avgCalibrationIndex: 0,
          },
          trends: [],
          distribution: { balanced: 0, moderate: 0, high: 0, critical: 0 },
          languageStats: {},
          performanceMetrics: {},
        },
      })
    }
    
    // Summary statistics
    const avgTrustDeviation = analyses.reduce((sum, a) => sum + a.trustDeviation, 0) / totalAnalyses
    const avgVerificationLatency = analyses.reduce((sum, a) => sum + a.verificationLatency, 0) / totalAnalyses
    const avgCalibrationIndex = analyses.reduce((sum, a) => sum + a.calibrationIndex, 0) / totalAnalyses
    const avgConfidence = analyses.reduce((sum, a) => sum + a.confidenceScore, 0) / totalAnalyses
    const avgReliability = analyses.reduce((sum, a) => sum + a.reliabilityScore, 0) / totalAnalyses
    
    // Calibration distribution
    const distribution = {
      balanced: analyses.filter(a => a.trustDeviation < 10).length,
      moderate: analyses.filter(a => a.trustDeviation >= 10 && a.trustDeviation < 25).length,
      high: analyses.filter(a => a.trustDeviation >= 25 && a.trustDeviation < 40).length,
      critical: analyses.filter(a => a.trustDeviation >= 40).length,
    }
    
    // Time-series trends (group by day or hour)
    const trends = analyses.map(a => ({
      timestamp: a.createdAt,
      trustDeviation: a.trustDeviation,
      calibrationIndex: a.calibrationIndex,
      confidence: a.confidenceScore,
      reliability: a.reliabilityScore,
      latency: a.verificationLatency,
    }))
    
    // Model usage statistics
    const modelStats: Record<string, number> = {}
    analyses.forEach(a => {
      modelStats[a.model] = (modelStats[a.model] || 0) + 1
    })
    
    // Performance metrics
    const performanceMetrics = {
      minLatency: Math.min(...analyses.map(a => a.verificationLatency)),
      maxLatency: Math.max(...analyses.map(a => a.verificationLatency)),
      p50Latency: calculatePercentile(analyses.map(a => a.verificationLatency), 50),
      p95Latency: calculatePercentile(analyses.map(a => a.verificationLatency), 95),
      p99Latency: calculatePercentile(analyses.map(a => a.verificationLatency), 99),
    }
    
    // Deviation trends
    const deviationTrend = {
      increasing: analyses.slice(-10).reduce((sum, a) => sum + a.trustDeviation, 0) / 10 >
                  analyses.slice(0, 10).reduce((sum, a) => sum + a.trustDeviation, 0) / 10,
      avgLast24h: analyses.filter(a => 
        a.createdAt >= new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).reduce((sum, a) => sum + a.trustDeviation, 0) / 
      analyses.filter(a => a.createdAt >= new Date(Date.now() - 24 * 60 * 60 * 1000)).length || 0,
    }
    
    // Risk distribution
    const riskDistribution = {
      low: analyses.filter(a => a.trustDeviation < 10 && a.reliabilityScore >= 80).length,
      medium: analyses.filter(a => 
        (a.trustDeviation >= 10 && a.trustDeviation < 20) || 
        (a.reliabilityScore >= 65 && a.reliabilityScore < 80)
      ).length,
      high: analyses.filter(a => 
        (a.trustDeviation >= 20 && a.trustDeviation < 30) || 
        (a.reliabilityScore >= 50 && a.reliabilityScore < 65)
      ).length,
      critical: analyses.filter(a => a.trustDeviation >= 30 || a.reliabilityScore < 50).length,
    }
    
    const analyticsData = {
      summary: {
        totalAnalyses,
        avgTrustDeviation: Math.round(avgTrustDeviation * 10) / 10,
        avgVerificationLatency: Math.round(avgVerificationLatency),
        avgCalibrationIndex: Math.round(avgCalibrationIndex * 10) / 10,
        avgConfidence: Math.round(avgConfidence * 10) / 10,
        avgReliability: Math.round(avgReliability * 10) / 10,
      },
      trends,
      distribution,
      riskDistribution,
      modelStats,
      performanceMetrics,
      deviationTrend,
      timeframe,
      generatedAt: new Date().toISOString(),
    }
    
    // Cache for 5 minutes
    await setCache(cacheKey, analyticsData, 300)
    
    return NextResponse.json({
      success: true,
      data: analyticsData,
    })
    
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

function calculatePercentile(values: number[], percentile: number): number {
  const sorted = values.slice().sort((a, b) => a - b)
  const index = Math.ceil((percentile / 100) * sorted.length) - 1
  return sorted[index] || 0
}
