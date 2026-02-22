import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { generatePDFReport } from '@/lib/pdf-generator'
import { addReportJob } from '@/lib/queue'

const ExportRequestSchema = z.object({
  analysisId: z.string(),
  format: z.enum(['pdf', 'json']).default('pdf'),
  async: z.boolean().default(false),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { analysisId, format, async } = ExportRequestSchema.parse(body)
    
    // Fetch analysis
    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
      include: { claims: true },
    })
    
    if (!analysis) {
      return NextResponse.json(
        { success: false, error: 'Analysis not found' },
        { status: 404 }
      )
    }
    
    // If async, queue the job
    if (async) {
      const job = await addReportJob({
        analysisId,
        format,
      })
      
      return NextResponse.json({
        success: true,
        jobId: job.id,
        status: 'queued',
        message: 'Report generation queued',
      })
    }
    
    // Synchronous generation
    if (format === 'json') {
      return NextResponse.json({
        success: true,
        data: analysis,
        format: 'json',
      })
    }
    
    // Generate PDF
    const pdfPath = await generatePDFReport({
      id: analysis.id,
      query: analysis.query,
      output: analysis.output,
      confidenceScore: analysis.confidenceScore,
      reliabilityScore: analysis.reliabilityScore,
      trustDeviation: analysis.trustDeviation,
      calibrationIndex: analysis.calibrationIndex,
      calibrationLevel: analysis.trustDeviation < 10 ? 'balanced' : 
                        analysis.trustDeviation < 25 ? 'moderate' : 'high',
      riskLevel: analysis.trustDeviation > 30 ? 'critical' :
                 analysis.trustDeviation > 20 ? 'high' : 
                 analysis.trustDeviation > 10 ? 'medium' : 'low',
      verificationLatency: analysis.verificationLatency,
      createdAt: analysis.createdAt,
      claims: analysis.claims.map(c => ({
        text: c.text,
        confidence: c.confidence,
        reliability: c.reliability,
        verified: c.verified,
      })),
    })
    
    // Log export
    await prisma.auditLog.create({
      data: {
        action: 'report_exported',
        resource: `Analysis: ${analysisId}`,
        severity: 'info',
        metadata: {
          format,
          path: pdfPath,
        },
      },
    })
    
    return NextResponse.json({
      success: true,
      path: pdfPath,
      format: 'pdf',
      downloadUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${pdfPath}`,
    })
    
  } catch (error) {
    console.error('Export error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to export report' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const jobId = searchParams.get('jobId')
    
    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'Job ID required' },
        { status: 400 }
      )
    }
    
    // Get job status from queue
    const { getJobStatus } = await import('@/lib/queue')
    const status = await getJobStatus(jobId, 'reports')
    
    return NextResponse.json({
      success: true,
      ...status,
    })
    
  } catch (error) {
    console.error('Job status error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get job status' },
      { status: 500 }
    )
  }
}
