'use client'

import { useState, useEffect } from 'react'
import { Clock, AlertCircle } from 'lucide-react'

interface RateLimitInfo {
  remaining: number
  limit: number
  resetTime: Date
}

export function RateLimitDisplay() {
  const [rateLimit, setRateLimit] = useState<RateLimitInfo>({
    remaining: 95,
    limit: 100,
    resetTime: new Date(Date.now() + 3600000), // 1 hour from now
  })

  useEffect(() => {
    // Simulate rate limit updates
    const interval = setInterval(() => {
      setRateLimit(prev => ({
        ...prev,
        remaining: Math.max(0, prev.remaining - Math.floor(Math.random() * 2)),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const percentage = (rateLimit.remaining / rateLimit.limit) * 100
  const timeUntilReset = Math.floor((rateLimit.resetTime.getTime() - Date.now()) / 60000)

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-white">API Rate Limit</h4>
        {percentage < 20 && (
          <AlertCircle className="text-amber-500" size={16} />
        )}
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400">Remaining Requests</span>
            <span className="text-sm font-bold text-white">
              {rateLimit.remaining} / {rateLimit.limit}
            </span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                percentage > 50 ? 'bg-emerald-500' :
                percentage > 20 ? 'bg-amber-500' :
                'bg-red-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Clock size={12} />
          <span>Resets in {timeUntilReset} minutes</span>
        </div>

        {percentage < 20 && (
          <div className="p-2 bg-amber-900/20 border border-amber-900/30 rounded text-xs text-amber-400">
            Rate limit approaching. Consider upgrading your plan.
          </div>
        )}
      </div>
    </div>
  )
}
