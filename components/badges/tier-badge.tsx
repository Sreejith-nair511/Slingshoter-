'use client'

import { getTierBadgeColor } from '@/lib/user-utils'
import { Award } from 'lucide-react'

interface TierBadgeProps {
  badge: string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

export function TierBadge({ badge, size = 'md', showIcon = true }: TierBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  }

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  }

  return (
    <span
      className={`${getTierBadgeColor(badge)} ${sizeClasses[size]} rounded-full text-white font-semibold inline-flex items-center gap-1`}
    >
      {showIcon && <Award size={iconSizes[size]} />}
      {badge.charAt(0).toUpperCase() + badge.slice(1)}
    </span>
  )
}
