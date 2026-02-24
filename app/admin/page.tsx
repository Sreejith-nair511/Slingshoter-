'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'
import type { User } from '@/lib/supabase'
import { RoleBadge } from '@/components/badges/role-badge'
import { TierBadge } from '@/components/badges/tier-badge'

export default function AdminPage() {
  const { user: clerkUser } = useUser()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    loadUsers()
    loadCurrentUser()
  }, [clerkUser])

  async function loadCurrentUser() {
    if (!clerkUser) return
    
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkUser.id)
      .single()
    
    setCurrentUser(data)
  }

  async function loadUsers() {
    setLoading(true)
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      setUsers(data)
    }
    setLoading(false)
  }

  async function updateUserRole(userId: string, newRole: string) {
    const { error } = await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', userId)
    
    if (!error) {
      loadUsers()
    }
  }

  // Check if current user is admin
  if (currentUser?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-zinc-400">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">User Management</h1>

        {loading ? (
          <div className="text-white">Loading...</div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="text-left p-4 text-zinc-300 font-semibold">Email</th>
                  <th className="text-left p-4 text-zinc-300 font-semibold">Role</th>
                  <th className="text-left p-4 text-zinc-300 font-semibold">Badge</th>
                  <th className="text-left p-4 text-zinc-300 font-semibold">Analyses</th>
                  <th className="text-left p-4 text-zinc-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-zinc-800">
                    <td className="p-4 text-zinc-300">{user.email}</td>
                    <td className="p-4">
                      <RoleBadge role={user.role} size="sm" />
                    </td>
                    <td className="p-4">
                      <TierBadge badge={user.badge} size="sm" />
                    </td>
                    <td className="p-4 text-zinc-300">{user.analysis_count}</td>
                    <td className="p-4">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        className="bg-zinc-800 text-white px-3 py-1 rounded border border-zinc-700 text-sm"
                      >
                        <option value="student">Student</option>
                        <option value="researcher">Researcher</option>
                        <option value="enterprise">Enterprise</option>
                        <option value="amd_partner">AMD Partner</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
