'use client'

import { Wifi, WifiOff } from 'lucide-react'

interface EdgeSimulationToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  disabled?: boolean
}

export function EdgeSimulationToggle({ enabled, onChange, disabled }: EdgeSimulationToggleProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            enabled ? 'bg-emerald-900/20' : 'bg-zinc-800'
          }`}>
            {enabled ? (
              <Wifi className="text-emerald-400" size={20} />
            ) : (
              <WifiOff className="text-zinc-500" size={20} />
            )}
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm">Simulate Edge Deployment</h4>
            <p className="text-zinc-400 text-xs">
              {enabled ? 'On-device verification active' : 'Cloud-based verification'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onChange(!enabled)}
          disabled={disabled}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
            enabled ? 'bg-emerald-600' : 'bg-zinc-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {enabled && (
        <div className="mt-4 pt-4 border-t border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">Network Latency</span>
            <span className="text-emerald-400 font-semibold">-85ms (edge local)</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">Verification Mode</span>
            <span className="text-emerald-400 font-semibold">On-Device</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">Data Transfer</span>
            <span className="text-emerald-400 font-semibold">Minimized</span>
          </div>
        </div>
      )}
    </div>
  )
}
