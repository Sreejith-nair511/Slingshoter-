'use client'

import { useState, useEffect } from 'react'
import { Cpu, HardDrive, Activity, Zap } from 'lucide-react'

interface SystemStats {
  cpuUsage: number
  gpuUsage: number
  memoryUsage: number
  ramUsed: number
  ramTotal: number
}

export function SystemMonitor() {
  const [stats, setStats] = useState<SystemStats>({
    cpuUsage: 0,
    gpuUsage: 0,
    memoryUsage: 0,
    ramUsed: 0,
    ramTotal: 16,
  })

  useEffect(() => {
    // Simulate system monitoring (in production, this would call actual system APIs)
    const interval = setInterval(() => {
      setStats({
        cpuUsage: Math.floor(Math.random() * 40) + 20, // 20-60%
        gpuUsage: Math.floor(Math.random() * 60) + 10, // 10-70%
        memoryUsage: Math.floor(Math.random() * 30) + 40, // 40-70%
        ramUsed: (Math.random() * 6 + 4).toFixed(1) as any, // 4-10 GB
        ramTotal: 16,
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-white mb-4">System Resources</h4>
      
      <div className="space-y-3">
        {/* CPU Usage */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Cpu className="text-blue-500" size={14} />
              <span className="text-xs text-zinc-400">CPU Usage</span>
            </div>
            <span className="text-xs font-semibold text-white">{stats.cpuUsage}%</span>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${stats.cpuUsage}%` }}
            />
          </div>
        </div>

        {/* GPU Usage */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Zap className="text-red-500" size={14} />
              <span className="text-xs text-zinc-400">GPU Usage</span>
            </div>
            <span className="text-xs font-semibold text-white">{stats.gpuUsage}%</span>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-500"
              style={{ width: `${stats.gpuUsage}%` }}
            />
          </div>
        </div>

        {/* RAM Usage */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <HardDrive className="text-emerald-500" size={14} />
              <span className="text-xs text-zinc-400">RAM</span>
            </div>
            <span className="text-xs font-semibold text-white">
              {stats.ramUsed} / {stats.ramTotal} GB
            </span>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${stats.memoryUsage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
