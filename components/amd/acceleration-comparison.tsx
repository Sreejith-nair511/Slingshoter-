'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { HardwareMode } from './hardware-mode-selector'

interface AccelerationComparisonProps {
  currentMode: HardwareMode
  baseLatency: number
}

export function AccelerationComparison({ currentMode, baseLatency }: AccelerationComparisonProps) {
  const data = [
    {
      name: 'CPU',
      mode: 'standard',
      latency: baseLatency,
      color: '#71717a',
    },
    {
      name: 'GPU',
      mode: 'gpu-optimized',
      latency: Math.round(baseLatency * 0.7),
      color: '#3b82f6',
    },
    {
      name: 'AMD Edge',
      mode: 'edge-accelerated',
      latency: Math.round(baseLatency * 0.5),
      color: '#dc2626',
    },
  ]

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Acceleration Comparison</h3>
      
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(113, 113, 122, 0.2)" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#a1a1aa"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="#a1a1aa"
            fontSize={12}
            tickLine={false}
            label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft', style: { fill: '#a1a1aa', fontSize: 12 } }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#18181b',
              border: '1px solid #3f3f46',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value: number) => [`${value}ms`, 'Latency']}
          />
          <Bar dataKey="latency" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.mode === currentMode ? entry.color : `${entry.color}80`}
                opacity={entry.mode === currentMode ? 1 : 0.5}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        {data.map((item) => (
          <div
            key={item.mode}
            className={`p-3 rounded-lg ${
              item.mode === currentMode
                ? 'bg-zinc-800 border-2 border-zinc-700'
                : 'bg-zinc-800/50'
            }`}
          >
            <div className="text-xs text-zinc-400 mb-1">{item.name}</div>
            <div className="text-lg font-bold text-white">{item.latency}ms</div>
            {item.mode !== 'standard' && (
              <div className="text-xs text-emerald-500 mt-1">
                {Math.round((1 - item.latency / baseLatency) * 100)}% faster
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
