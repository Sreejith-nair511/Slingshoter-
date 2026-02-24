'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'

interface DeviationGaugeProps {
  deviation: number
  confidence: number
  reliability: number
}

export function DeviationGauge({ deviation, confidence, reliability }: DeviationGaugeProps) {
  const [animatedDeviation, setAnimatedDeviation] = useState(0)
  const [animatedConfidence, setAnimatedConfidence] = useState(0)
  const [animatedReliability, setAnimatedReliability] = useState(0)

  useEffect(() => {
    // Animate deviation
    const deviationInterval = setInterval(() => {
      setAnimatedDeviation(prev => {
        if (prev >= deviation) {
          clearInterval(deviationInterval)
          return deviation
        }
        return Math.min(prev + deviation / 20, deviation)
      })
    }, 50)

    // Animate confidence
    const confidenceInterval = setInterval(() => {
      setAnimatedConfidence(prev => {
        if (prev >= confidence) {
          clearInterval(confidenceInterval)
          return confidence
        }
        return Math.min(prev + confidence / 20, confidence)
      })
    }, 50)

    // Animate reliability
    const reliabilityInterval = setInterval(() => {
      setAnimatedReliability(prev => {
        if (prev >= reliability) {
          clearInterval(reliabilityInterval)
          return reliability
        }
        return Math.min(prev + reliability / 20, reliability)
      })
    }, 50)

    return () => {
      clearInterval(deviationInterval)
      clearInterval(confidenceInterval)
      clearInterval(reliabilityInterval)
    }
  }, [deviation, confidence, reliability])

  const getDeviationColor = (dev: number) => {
    if (dev < 10) return 'text-emerald-500'
    if (dev < 25) return 'text-amber-500'
    return 'text-red-500'
  }

  const getDeviationBgColor = (dev: number) => {
    if (dev < 10) return 'bg-emerald-500'
    if (dev < 25) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const getDeviationLabel = (dev: number) => {
    if (dev < 10) return 'Balanced'
    if (dev < 25) return 'Moderate'
    return 'High Risk'
  }

  const getDeviationIcon = (dev: number) => {
    if (dev < 10) return <TrendingUp className="text-emerald-500" size={24} />
    if (dev < 25) return <AlertTriangle className="text-amber-500" size={24} />
    return <TrendingDown className="text-red-500" size={24} />
  }

  // Calculate gauge rotation (0-180 degrees)
  const gaugeRotation = Math.min((animatedDeviation / 50) * 180, 180)

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Trust Deviation Analysis</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gauge Visualization */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-64 h-32">
            {/* Gauge Background */}
            <svg className="w-full h-full" viewBox="0 0 200 100">
              {/* Background Arc */}
              <path
                d="M 20 90 A 80 80 0 0 1 180 90"
                fill="none"
                stroke="#27272a"
                strokeWidth="12"
                strokeLinecap="round"
              />
              
              {/* Colored Sections */}
              <path
                d="M 20 90 A 80 80 0 0 1 100 10"
                fill="none"
                stroke="#10b981"
                strokeWidth="12"
                strokeLinecap="round"
                opacity="0.3"
              />
              <path
                d="M 100 10 A 80 80 0 0 1 140 25"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="12"
                strokeLinecap="round"
                opacity="0.3"
              />
              <path
                d="M 140 25 A 80 80 0 0 1 180 90"
                fill="none"
                stroke="#ef4444"
                strokeWidth="12"
                strokeLinecap="round"
                opacity="0.3"
              />

              {/* Needle */}
              <line
                x1="100"
                y1="90"
                x2="100"
                y2="20"
                stroke={deviation < 10 ? '#10b981' : deviation < 25 ? '#f59e0b' : '#ef4444'}
                strokeWidth="3"
                strokeLinecap="round"
                style={{
                  transformOrigin: '100px 90px',
                  transform: `rotate(${gaugeRotation - 90}deg)`,
                  transition: 'transform 0.5s ease-out'
                }}
              />
              
              {/* Center Dot */}
              <circle cx="100" cy="90" r="6" fill="#18181b" stroke="#52525b" strokeWidth="2" />
            </svg>

            {/* Labels */}
            <div className="absolute bottom-0 left-0 text-xs text-emerald-500 font-semibold">0%</div>
            <div className="absolute bottom-0 right-0 text-xs text-red-500 font-semibold">50%</div>
          </div>

          {/* Deviation Value */}
          <div className="mt-4 text-center">
            <div className={`text-5xl font-bold ${getDeviationColor(animatedDeviation)}`}>
              {animatedDeviation.toFixed(1)}%
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              {getDeviationIcon(deviation)}
              <span className={`text-sm font-semibold ${getDeviationColor(deviation)}`}>
                {getDeviationLabel(deviation)}
              </span>
            </div>
          </div>
        </div>

        {/* Metrics Breakdown */}
        <div className="space-y-4">
          {/* Confidence Score */}
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-400">Model Confidence</span>
              <span className="text-lg font-bold text-white">{animatedConfidence.toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-zinc-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${animatedConfidence}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              How confident the model is in its output
            </p>
          </div>

          {/* Reliability Score */}
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-400">Verified Reliability</span>
              <span className="text-lg font-bold text-white">{animatedReliability.toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-zinc-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-500"
                style={{ width: `${animatedReliability}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              External verification of claim accuracy
            </p>
          </div>

          {/* Calibration Index */}
          <div className={`rounded-lg p-4 border ${
            deviation < 10
              ? 'bg-emerald-900/20 border-emerald-900/30'
              : deviation < 25
              ? 'bg-amber-900/20 border-amber-900/30'
              : 'bg-red-900/20 border-red-900/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Calibration Index</span>
              <span className={`text-lg font-bold ${getDeviationColor(deviation)}`}>
                {getDeviationLabel(deviation)}
              </span>
            </div>
            <p className={`text-xs mt-2 ${
              deviation < 10
                ? 'text-emerald-400'
                : deviation < 25
                ? 'text-amber-400'
                : 'text-red-400'
            }`}>
              {deviation < 10 && 'Model predictions are well-calibrated with verification'}
              {deviation >= 10 && deviation < 25 && 'Moderate misalignment detected'}
              {deviation >= 25 && 'Significant trust deviation - review recommended'}
            </p>
          </div>
        </div>
      </div>

      {/* Interpretation Guide */}
      <div className="mt-6 pt-6 border-t border-zinc-800">
        <p className="text-xs text-zinc-400 mb-3">Interpretation Guide:</p>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-zinc-400">
              <span className="text-emerald-400 font-semibold">&lt;10%</span> - Well calibrated
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-zinc-400">
              <span className="text-amber-400 font-semibold">10-25%</span> - Moderate risk
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-zinc-400">
              <span className="text-red-400 font-semibold">&gt;25%</span> - High risk
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
