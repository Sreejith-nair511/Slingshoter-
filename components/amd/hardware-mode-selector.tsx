'use client'

import { Cpu, Zap, Layers } from 'lucide-react'

export type HardwareMode = 'standard' | 'gpu-optimized' | 'edge-accelerated'

interface HardwareModeOption {
  value: HardwareMode
  label: string
  description: string
  icon: React.ReactNode
}

const modes: HardwareModeOption[] = [
  {
    value: 'standard',
    label: 'Standard CPU Mode',
    description: 'Traditional CPU-based inference',
    icon: <Cpu size={16} />,
  },
  {
    value: 'gpu-optimized',
    label: 'GPU Optimized Mode',
    description: 'Parallel GPU acceleration',
    icon: <Layers size={16} />,
  },
  {
    value: 'edge-accelerated',
    label: 'Edge Acceleration Mode (AMD)',
    description: 'AMD hardware-optimized edge inference',
    icon: <Zap size={16} />,
  },
]

interface HardwareModeSelectorProps {
  value: HardwareMode
  onChange: (mode: HardwareMode) => void
  disabled?: boolean
}

export function HardwareModeSelector({ value, onChange, disabled }: HardwareModeSelectorProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <label className="block text-sm font-semibold text-white mb-3">
        Inference Execution Mode
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {modes.map((mode) => (
          <button
            key={mode.value}
            onClick={() => onChange(mode.value)}
            disabled={disabled}
            className={`p-3 rounded-lg border-2 transition-all text-left ${
              value === mode.value
                ? mode.value === 'edge-accelerated'
                  ? 'border-red-600 bg-red-900/20'
                  : 'border-blue-600 bg-blue-900/20'
                : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`${
                value === mode.value
                  ? mode.value === 'edge-accelerated'
                    ? 'text-red-400'
                    : 'text-blue-400'
                  : 'text-zinc-400'
              }`}>
                {mode.icon}
              </div>
              <span className={`text-sm font-semibold ${
                value === mode.value ? 'text-white' : 'text-zinc-300'
              }`}>
                {mode.label}
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              {mode.description}
            </p>
          </button>
        ))}
      </div>
      
      {value === 'edge-accelerated' && (
        <div className="mt-3 px-3 py-2 bg-red-900/20 border border-red-900/30 rounded flex items-center gap-2">
          <Zap className="text-red-400" size={14} />
          <span className="text-xs text-red-400 font-semibold">AMD Acceleration Active</span>
        </div>
      )}
    </div>
  )
}
