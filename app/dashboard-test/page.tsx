'use client'

import { useUser, UserButton } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export default function DashboardTestPage() {
  const { user, isLoaded } = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-white">Please sign in</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard Test</h1>
          <UserButton afterSignOutUrl="/" />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
          <div>
            <p className="text-zinc-400 text-sm">Signed in as:</p>
            <p className="text-white text-lg font-semibold">{user.emailAddresses[0]?.emailAddress}</p>
          </div>

          <div>
            <p className="text-zinc-400 text-sm">User ID:</p>
            <p className="text-white font-mono text-sm">{user.id}</p>
          </div>

          <div>
            <p className="text-zinc-400 text-sm">Full Name:</p>
            <p className="text-white">{user.fullName || 'Not set'}</p>
          </div>

          <div className="pt-4 border-t border-zinc-800">
            <p className="text-emerald-500 font-semibold">✓ Authentication Working!</p>
            <p className="text-zinc-400 text-sm mt-2">
              Your Clerk session is active and persisting correctly.
            </p>
          </div>
        </div>

        <div className="mt-6 bg-blue-900/20 border border-blue-800 rounded-lg p-4">
          <p className="text-blue-400 font-semibold mb-2">Next Steps:</p>
          <ul className="text-zinc-300 text-sm space-y-1">
            <li>• Your user will be automatically created in Supabase</li>
            <li>• Default role: Student</li>
            <li>• Default badge: Bronze</li>
            <li>• You can now use the full dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
