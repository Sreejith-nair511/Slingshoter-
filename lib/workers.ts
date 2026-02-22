import { Worker, Job } from 'bullmq'
import { prisma } from './prisma'
import { VerificationJob, ReportJob } from './queue'
import { publishNotification } from './redis'

// Verification Worker
export const verificationWorker = new Worker(
  'verification',
  async (job: Job<VerificationJob>) => {
    console.log(`Processing verification job ${job.id}`)
    
    try {
      const { analysisId, claims, language } = job.data
      
      // Call Python verification service
      const response = await fetch('http://localhost:8000/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claims: claims.map(c => ({ text: c.text, confidence: c.confidence })),
          language: language || 'en',
        }),
      })
      
      if (!response.ok) {
        throw new Error(`Verification service error: ${response.statusText}`)
      }
      
      const result = await response.json()
      
      // Update analysis in database
      await prisma.analysis.update({
        where: { id: analysisId },
        data: {
          reliabilityScore: result.overallReliability,
          trustDeviation: Math.abs(
            result.overallConfidence - result.overallReliability
          ),
        },
      })
      
      // Update claims
      for (let i = 0; i < result.claims.length; i++) {
        const claim = result.claims[i]
        await prisma.claim.updateMany({
          where: {
            analysisId,
            text: claim.text,
          },
          data: {
            reliability: claim.reliability,
            verified: claim.verified,
          },
        })
      }
      
      // Publish notification
      await publishNotification({
        type: 'verification_complete',
        analysisId,
        reliability: result.overallReliability,
      })
      
      await job.updateProgress(100)
      
      return result
    } catch (error) {
      console.error('Verification worker error:', error)
      throw error
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    },
    concurrency: 5,
  }
)

// Report Worker
export const reportWorker = new Worker(
  'reports',
  async (job: Job<ReportJob>) => {
    console.log(`Processing report job ${job.id}`)
    
    try {
      const { analysisId, format } = job.data
      
      // Fetch analysis data
      const analysis = await prisma.analysis.findUnique({
        where: { id: analysisId },
        include: { claims: true },
      })
      
      if (!analysis) {
        throw new Error('Analysis not found')
      }
      
      await job.updateProgress(50)
      
      if (format === 'pdf') {
        // Generate PDF (implementation in separate file)
        const pdfPath = await generatePDFReport(analysis)
        await job.updateProgress(100)
        return { path: pdfPath, format: 'pdf' }
      } else {
        // Return JSON
        await job.updateProgress(100)
        return { data: analysis, format: 'json' }
      }
    } catch (error) {
      console.error('Report worker error:', error)
      throw error
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    },
    concurrency: 3,
  }
)

// Placeholder for PDF generation
async function generatePDFReport(analysis: any): Promise<string> {
  // This will be implemented in the PDF service
  return `/reports/${analysis.id}.pdf`
}

// Error handlers
verificationWorker.on('failed', (job, err) => {
  console.error(`Verification job ${job?.id} failed:`, err)
})

reportWorker.on('failed', (job, err) => {
  console.error(`Report job ${job?.id} failed:`, err)
})

// Success handlers
verificationWorker.on('completed', (job) => {
  console.log(`Verification job ${job.id} completed`)
})

reportWorker.on('completed', (job) => {
  console.log(`Report job ${job.id} completed`)
})
