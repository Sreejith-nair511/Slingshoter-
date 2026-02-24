import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, data } = body

    if (type === 'benchmark') {
      // Generate benchmark report
      const { standard, amd, userName } = data

      const reportContent = generateBenchmarkReport(standard, amd, userName)

      // Return as downloadable text file (simplified version)
      // In production, you would use PDFKit here
      return new NextResponse(reportContent, {
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': `attachment; filename="benchmark-report-${new Date().toISOString().split('T')[0]}.txt"`,
        },
      })
    }

    return NextResponse.json({ error: 'Invalid report type' }, { status: 400 })
  } catch (error: any) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: error.message || 'Export failed' },
      { status: 500 }
    )
  }
}

function generateBenchmarkReport(standard: any, amd: any, userName: string): string {
  const timestamp = new Date().toLocaleString()
  
  let report = `
================================================================================
                    AMD PERFORMANCE BENCHMARK REPORT
================================================================================

Generated: ${timestamp}
User: ${userName}

================================================================================
                           BENCHMARK RESULTS
================================================================================

`

  if (standard) {
    report += `
STANDARD MODE (CPU-based)
-------------------------
Iterations:        ${standard.iterations}
Avg Latency:       ${standard.avgLatency}ms
P95 Latency:       ${standard.p95Latency}ms
Throughput:        ${standard.throughput} req/sec
Avg Deviation:     ${standard.avgDeviation}%
Stability Index:   ${standard.stabilityIndex}%
Memory Usage:      ${standard.memoryUsage}GB

`
  }

  if (amd) {
    report += `
AMD ACCELERATED MODE (GPU-optimized)
------------------------------------
Iterations:        ${amd.iterations}
Avg Latency:       ${amd.avgLatency}ms
P95 Latency:       ${amd.p95Latency}ms
Throughput:        ${amd.throughput} req/sec
Avg Deviation:     ${amd.avgDeviation}%
Stability Index:   ${amd.stabilityIndex}%
Memory Usage:      ${amd.memoryUsage}GB

`
  }

  if (standard && amd) {
    const accelerationFactor = (standard.avgLatency / amd.avgLatency).toFixed(2)
    const latencyReduction = (((standard.avgLatency - amd.avgLatency) / standard.avgLatency) * 100).toFixed(1)
    const throughputIncrease = (((amd.throughput - standard.throughput) / standard.throughput) * 100).toFixed(1)

    report += `
================================================================================
                        PERFORMANCE COMPARISON
================================================================================

Acceleration Factor:     ${accelerationFactor}x
Latency Reduction:       ${latencyReduction}%
Throughput Increase:     +${throughputIncrease}%

AMD Advantages:
- ${latencyReduction}% faster inference
- ${throughputIncrease}% higher throughput
- Improved parallel processing
- Better resource utilization

`
  }

  report += `
================================================================================
                              CONCLUSION
================================================================================

${amd && standard ? `
AMD GPU acceleration provides a ${(standard.avgLatency / amd.avgLatency).toFixed(2)}x performance improvement
over standard CPU-based inference, making it ideal for high-throughput
production workloads and real-time AI applications.
` : 'Run both benchmarks to see performance comparison.'}

================================================================================
                    Trust Calibration Layer - AMD Optimized
================================================================================
`

  return report
}
