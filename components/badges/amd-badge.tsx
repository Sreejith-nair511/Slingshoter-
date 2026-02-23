'use client'

import { Zap } from 'lucide-react'

interface AMDBadgeProps {
  size?: 'sm' | 'md' | 'lg'
}

export function AMDBadge({ size = 'md' }: AMDBadgeProps) {
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
      className={`bg-gradient-to-r from-red-600 to-red-800 ${sizeClasses[size]} rounded-full text-white font-semibold inline-flex items-center gap-1 shadow-lg`}
    >
      <Zap size={iconSizes[size]} className="fill-current" />
      AMD Accelerated
    </span>
  )
}
