// Client-safe utility functions for user management
// These functions don't import any server-only code

export function getBadgeFromCount(count: number): 'bronze' | 'silver' | 'gold' | 'platinum' {
  if (count >= 200) return 'platinum'
  if (count >= 51) return 'gold'
  if (count >= 11) return 'silver'
  return 'bronze'
}

export function getRoleDisplayName(role: string): string {
  const roleNames: Record<string, string> = {
    student: 'Student',
    researcher: 'Researcher',
    enterprise: 'Enterprise',
    admin: 'Administrator',
    amd_partner: 'AMD Partner',
  }
  return roleNames[role] || role
}

export function getRoleBadgeColor(role: string): string {
  const colors: Record<string, string> = {
    student: 'bg-blue-500',
    researcher: 'bg-purple-500',
    enterprise: 'bg-emerald-500',
    admin: 'bg-red-500',
    amd_partner: 'bg-gradient-to-r from-red-600 to-red-800',
  }
  return colors[role] || 'bg-gray-500'
}

export function getTierBadgeColor(badge: string): string {
  const colors: Record<string, string> = {
    bronze: 'bg-amber-700',
    silver: 'bg-gray-400',
    gold: 'bg-yellow-500',
    platinum: 'bg-cyan-400',
  }
  return colors[badge] || 'bg-gray-500'
}

export function canAccessFeature(role: string, feature: string): boolean {
  const permissions: Record<string, string[]> = {
    student: ['basic_analysis', 'basic_metrics'],
    researcher: ['basic_analysis', 'basic_metrics', 'advanced_graphs', 'claim_details', 'export'],
    enterprise: ['basic_analysis', 'basic_metrics', 'advanced_graphs', 'claim_details', 'export', 'audit_logs', 'risk_heatmaps', 'system_health'],
    amd_partner: ['basic_analysis', 'basic_metrics', 'advanced_graphs', 'claim_details', 'export', 'amd_optimization', 'benchmarks'],
    admin: ['all'],
  }

  const userPermissions = permissions[role] || []
  return userPermissions.includes('all') || userPermissions.includes(feature)
}
