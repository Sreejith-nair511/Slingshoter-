'use client'

import { useState } from 'react'
import { Zap, Cpu, Activity, HardDrive } from 'lucide-react'
import { AMDBadge } from '@/components/badges/amd-badge'

interface OptimizationPanelProps {
  onModeChange: (mode: string) => void
  currentMode: string
}

export function AMDOptimizationPanel({ onModeChange, currentMode }: OptimizationPanelProps) {
  const [enabled, setEnabled] = useState(currentMode !== 'standard')

  const handleToggle = () => {
    const newEnabled = !enabled
    setEnabled(newEnabled)
    onModeChange(newEnabled ? 'edge-optimized' : 'standard')
  }

  // Simulated metrics based on mode
  const metrics = {
    latency: enabled ? '2.8ms' : '4.2ms',
    throughput: enabled ? '12,500' : '8,500',
    memory: enabled ? '1.2GB' : '1.8GB',
    improvement: enabled ? '+48%' : '0%',
  }

  return (
    <div className="bg-gradient-to-br from-red-950/20 to-zinc-900 border-2 border-red-900/30 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="text-red-500" size={24} />
            AMD Acceleration Layer
          </h3>
          <p className="text-zinc-400 text-sm mt-1">
            Hardware-optimized inference pipeline
          </p>
        </div>
        {enabled && <AMDBadge size="md" />}
      </div>

      {/* Toggle */}
      <div className="mb-6 p-4 bg-zinc-900/50 rounded-lg border border-red-900/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-semibold">Enable Edge Acceleration</p>
            <p className="text-zinc-400 text-sm">Optimize with AMD hardware</p>
          </div>
          <button
            onClick={handleToggle}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              enabled ? 'bg-red-600' : 'bg-zinc-700'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                enabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900/50 p-4 rounded-lg border border-red-900/20">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="text-red-500" size={16} />
            <p className="text-zinc-400 text-sm">Inference Latency</p>
          </div>
          <p className="text-2xl font-bold text-white">{metrics.latency}</p>
          {enabled && (
            <p className="text-emerald-500 text-xs mt-1">↓ 33% faster</p>
          )}
        </div>

        <div className="bg-zinc-900/50 p-4 rounded-lg border border-red-900/20">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="text-red-500" size={16} />
            <p className="text-zinc-400 text-sm">Throughput</p>
          </div>
          <p className="text-2xl font-bold text-white">{metrics.throughput}</p>
          <p className="text-zinc-400 text-xs mt-1">claims/sec</p>
        </div>

        <div className="bg-zinc-900/50 p-4 rounded-lg border border-red-900/20">
          <div className="flex items-center gap-2 mb-2">
            <HardDrive className="text-red-500" size={16} />
            <p className="text-zinc-400 text-sm">Memory Usage</p>
          </div>
          <p className="text-2xl font-bold text-white">{metrics.memory}</p>
          {enabled && (
            <p className="text-emerald-500 text-xs mt-1">↓ 33% reduction</p>
          )}
        </div>

        <div className="bg-zinc-900/50 p-4 rounded-lg border border-red-900/20">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="text-red-500" size={16} />
            <p className="text-zinc-400 text-sm">Performance</p>
          </div>
          <p className="text-2xl font-bold text-white">{metrics.improvement}</p>
          <p className="text-zinc-400 text-xs mt-1">vs baseline</p>
        </div>
      </div>

      {enabled && (
        <div className="mt-4 p-3 bg-red-900/10 border border-red-900/30 rounded-lg">
          <p className="text-red-400 text-sm flex items-center gap-2">
            <Zap size={14} />
            AMD hardware acceleration active
          </p>
        </div>
      )}
    </div>
  )
}
