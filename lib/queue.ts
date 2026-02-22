import { Queue, Worker, Job } from 'bullmq'
import { redis } from './redis'

// Create queues
export const verificationQueue = new Queue('verification', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
})

export const reportQueue = new Queue('reports', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
})

// Job types
export interface VerificationJob {
  analysisId: string
  query: string
  claims: Array<{ text: string; confidence: number }>
  language?: string
}

export interface ReportJob {
  analysisId: string
  format: 'pdf' | 'json'
  userId?: string
}

// Add jobs
export async function addVerificationJob(data: VerificationJob) {
  return await verificationQueue.add('verify', data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  })
}

export async function addReportJob(data: ReportJob) {
  return await reportQueue.add('generate', data, {
    attempts: 2,
    backoff: {
      type: 'fixed',
      delay: 5000,
    },
  })
}

// Get job status
export async function getJobStatus(jobId: string, queueName: 'verification' | 'reports') {
  const queue = queueName === 'verification' ? verificationQueue : reportQueue
  const job = await queue.getJob(jobId)
  
  if (!job) {
    return { status: 'not_found' }
  }
  
  const state = await job.getState()
  const progress = job.progress
  
  return {
    status: state,
    progress,
    data: job.data,
    returnvalue: job.returnvalue,
  }
}
