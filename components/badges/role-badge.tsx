'use client'

import { getRoleDisplayName, getRoleBadgeColor } from '@/lib/user-utils'

interface RoleBadgeProps {
  role: string
  size?: 'sm' | 'md' | 'lg'
}

export function RoleBadge({ role, size = 'md' }: RoleBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  }

  return (
    <span
      className={`${getRoleBadgeColor(role)} ${sizeClasses[size]} rounded-full text-white font-semibold inline-flex items-center gap-1`}
    >
      {getRoleDisplayName(role)}
    </span>
  )
}
