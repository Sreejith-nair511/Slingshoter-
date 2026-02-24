import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env')
  }

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error: Verification failed', { status: 400 })
  }

  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data
    
    const email = email_addresses[0]?.email_address || ''
    
    // Create user in Supabase with default role
    const { error } = await supabaseAdmin
      .from('users')
      .insert({
        clerk_id: id,
        email,
        role: 'student', // Default role
        tier: 'standard',
        badge: 'bronze',
        analysis_count: 0,
        optimization_mode: 'standard',
      })

    if (error) {
      console.error('Error creating user in Supabase:', error)
      return new Response('Error: Failed to create user', { status: 500 })
    }

    console.log('User created:', email)
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses } = evt.data
    
    const email = email_addresses[0]?.email_address || ''
    
    // Update user in Supabase
    const { error } = await supabaseAdmin
      .from('users')
      .update({ email })
      .eq('clerk_id', id)

    if (error) {
      console.error('Error updating user in Supabase:', error)
    }
  }

  return new Response('Webhook processed', { status: 200 })
}
