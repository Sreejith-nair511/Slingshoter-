// Server-only user helper functions
// DO NOT import this file in client components!
// Use lib/user-utils.ts for client-safe utilities

import { currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin, type User } from './supabase'

// Re-export client-safe utilities
export { 
  getBadgeFromCount, 
  getRoleDisplayName, 
  getRoleBadgeColor, 
  getTierBadgeColor, 
  canAccessFeature 
} from './user-utils'

export async function getCurrentUser(): Promise<User | null> {
  const clerkUser = await currentUser()
  
  if (!clerkUser) {
    return null
  }

  // Check if user exists in Supabase
  const { data: existingUser } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('clerk_id', clerkUser.id)
    .single()

  if (existingUser) {
    return existingUser
  }

  // Create user if doesn't exist
  const email = clerkUser.emailAddresses[0]?.emailAddress || ''
  const role = (clerkUser.publicMetadata?.role as string) || 'student'

  const { data: newUser, error } = await supabaseAdmin
    .from('users')
    .insert({
      clerk_id: clerkUser.id,
      email,
      role,
      tier: 'standard',
      badge: 'bronze',
      analysis_count: 0,
      optimization_mode: 'standard',
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating user:', error)
    return null
  }

  return newUser
}

export async function updateUserRole(clerkId: string, role: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .update({ role })
    .eq('clerk_id', clerkId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update user role: ${error.message}`)
  }

  return data
}

export async function incrementAnalysisCount(userId: string) {
  // First get current count
  const { data: currentUser } = await supabaseAdmin
    .from('users')
    .select('analysis_count')
    .eq('id', userId)
    .single()

  if (!currentUser) return null

  // Then update with incremented value
  const { data, error } = await supabaseAdmin
    .from('users')
    .update({ analysis_count: currentUser.analysis_count + 1 })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error incrementing analysis count:', error)
  }

  return data
}
