import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types
export interface User {
  id: string
  clerk_id: string
  email: string
  role: 'student' | 'researcher' | 'enterprise' | 'admin' | 'amd_partner'
  tier: 'standard' | 'pro' | 'enterprise'
  badge: 'bronze' | 'silver' | 'gold' | 'platinum'
  analysis_count: number
  optimization_mode: 'standard' | 'edge-optimized' | 'performance'
  created_at: string
  updated_at: string
}

export interface Analysis {
  id: string
  user_id?: string
  query: string
  model: string
  output: string
  confidence_score: number
  reliability_score: number
  trust_deviation: number
  calibration_index: number
  verification_latency: number
  optimization_mode: string
  processing_mode: string
  hardware_profile: string
  created_at: string
}

export interface Claim {
  id: string
  analysis_id: string
  text: string
  confidence: number
  reliability: number
  verified: boolean
  created_at: string
}

export interface Notification {
  id: string
  user_id?: string
  type: string
  severity: string
  message: string
  metadata?: any
  read: boolean
  created_at: string
}

export interface Settings {
  id: string
  user_id?: string
  deviation_threshold: number
  reliability_minimum: number
  confidence_minimum: number
  optimization_mode: string
  updated_at: string
  created_at: string
}

export interface AuditLog {
  id: string
  action: string
  user_id?: string
  resource: string
  metadata?: any
  severity: string
  created_at: string
}

export interface Benchmark {
  id: string
  user_id?: string
  mode: string
  avg_verification_time: number
  claim_extraction_time: number
  total_processing_time: number
  calibration_stability: number
  throughput: number
  memory_usage: number
  created_at: string
}
