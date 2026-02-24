'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Zap, TrendingUp, Layers, BarChart3 } from 'lucide-react'

export function WhyAMDMatters() {
  const [expanded, setExpanded] = useState(false)

  const benefits = [
    {
      icon: <Zap size={20} />,
      title: 'Reduced Inference Latency',
      description: 'Hardware-optimized execution reduces model inference time by up to 50%, enabling real-time trust calibration.',
    },
    {
      icon: <TrendingUp size={20} />,
      title: 'Higher Throughput Under Load',
      description: 'Parallel processing capabilities allow 2.1× more claims to be verified per second under sustained workloads.',
    },
    {
      icon: <Layers size={20} />,
      title: 'Edge-First Deployment Readiness',
      description: 'Optimized for edge environments with reduced memory footprint and on-device verification capabilities.',
    },
    {
      icon: <BarChart3 size={20} />,
      title: 'Trust Calibration at Scale',
      description: 'Maintain calibration stability above 95% even under high-volume production scenarios.',
    },
  ]

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-900/20 flex items-center justify-center">
            <Zap className="text-red-400" size={16} />
          </div>
          <span className="text-white font-semibold">Why AMD Acceleration Matters</span>
        </div>
        {expanded ? (
          <ChevronUp className="text-zinc-400" size={20} />
        ) : (
          <ChevronDown className="text-zinc-400" size={20} />
        )}
      </button>

      {expanded && (
        <div className="px-6 pb-6 border-t border-zinc-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-zinc-800/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-900/20 flex items-center justify-center flex-shrink-0 text-red-400">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm mb-1">
                      {benefit.title}
                    </h4>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-zinc-800/30 rounded-lg border border-zinc-700">
            <p className="text-xs text-zinc-400 leading-relaxed">
              AMD hardware acceleration enables trust calibration systems to operate at production scale
              with enterprise-grade performance. By leveraging GPU parallelization and edge-optimized
              architectures, organizations can deploy AI trust monitoring in latency-sensitive and
              high-throughput environments.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
