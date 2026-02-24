'use client'

import { Clock, Activity, HardDrive, Zap, TrendingUp } from 'lucide-react'
import type { HardwareMode } from './hardware-mode-selector'

interface PerformanceMetricsProps {
  mode: HardwareMode
  baseLatency: number
  claimCount: number
}

export function PerformanceMetrics({ mode, baseLatency, claimCount }: PerformanceMetricsProps) {
  // Calculate metrics based on hardware mode
  const getMetrics = () => {
    const multipliers = {
      standard: { latency: 1.0, throughput: 1.0, memory: 1.0, acceleration: 1.0, stability: 85 },
      'gpu-optimized': { latency: 0.7, throughput: 1.5, memory: 0.85, acceleration: 1.4, stability: 92 },
      'edge-accelerated': { latency: 0.5, throughput: 2.1, memory: 0.65, acceleration: 2.1, stability: 96 },
    }

    const m = multipliers[mode]
    
    return {
      latency: Math.round(baseLatency * m.latency),
      throughput: Math.round((claimCount / (baseLatency / 1000)) * m.throughput),
      memory: (1.8 * m.memory).toFixed(2),
      acceleration: m.acceleration.toFixed(1),
      stability: m.stability,
    }
  }

  const metrics = getMetrics()

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Hardware Performance Metrics</h3>
        {mode === 'edge-accelerated' && (
          <div className="px-3 py-1 bg-red-900/20 border border-red-900/30 rounded-full flex items-center gap-2">
            <Zap className="text-red-400" size={14} />
            <span className="text-xs text-red-400 font-semibold">AMD Optimized</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Inference Latency */}
        <div className="bg-zinc-800/50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-blue-500" size={16} />
            <p className="text-zinc-400 text-xs">Inference Latency</p>
          </div>
          <p className="text-2xl font-bold text-white">{metrics.latency}ms</p>
          {mode !== 'standard' && (
            <p className="text-emerald-500 text-xs mt-1">
              ↓ {Math.round((1 - (mode === 'gpu-optimized' ? 0.7 : 0.5)) * 100)}% faster
            </p>
          )}
        </div>

        {/* Verification Throughput */}
        <div className="bg-zinc-800/50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="text-emerald-500" size={16} />
            <p className="text-zinc-400 text-xs">Throughput</p>
          </div>
          <p className="text-2xl font-bold text-white">{metrics.throughput}</p>
          <p className="text-zinc-400 text-xs mt-1">claims/sec</p>
        </div>

        {/* Memory Footprint */}
        <div className="bg-zinc-800/50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <HardDrive className="text-purple-500" size={16} />
            <p className="text-zinc-400 text-xs">Memory Footprint</p>
          </div>
          <p className="text-2xl font-bold text-white">{metrics.memory}GB</p>
          {mode !== 'standard' && (
            <p className="text-emerald-500 text-xs mt-1">
              ↓ {Math.round((1 - (mode === 'gpu-optimized' ? 0.85 : 0.65)) * 100)}% reduction
            </p>
          )}
        </div>

        {/* Acceleration Factor */}
        <div className="bg-zinc-800/50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="text-amber-500" size={16} />
            <p className="text-zinc-400 text-xs">Acceleration Factor</p>
          </div>
          <p className="text-2xl font-bold text-white">×{metrics.acceleration}</p>
          <p className="text-zinc-400 text-xs mt-1">vs baseline</p>
        </div>

        {/* Calibration Stability */}
        <div className="bg-zinc-800/50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-cyan-500" size={16} />
            <p className="text-zinc-400 text-xs">Calibration Stability</p>
          </div>
          <p className="text-2xl font-bold text-white">{metrics.stability}%</p>
          <p className="text-zinc-400 text-xs mt-1">index</p>
        </div>
      </div>

      {/* Performance Bar */}
      <div className="mt-6 pt-6 border-t border-zinc-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-zinc-400">Overall Performance</span>
          <span className="text-sm font-semibold text-white">
            {mode === 'standard' ? 'Baseline' : mode === 'gpu-optimized' ? '+40%' : '+110%'}
          </span>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              mode === 'edge-accelerated'
                ? 'bg-gradient-to-r from-red-600 to-red-500'
                : mode === 'gpu-optimized'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500'
                : 'bg-zinc-600'
            }`}
            style={{
              width: mode === 'standard' ? '33%' : mode === 'gpu-optimized' ? '66%' : '100%',
            }}
          />
        </div>
      </div>
    </div>
  )
}
