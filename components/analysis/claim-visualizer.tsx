'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'

interface Claim {
  text: string
  confidence: number
  reliability: number
  verified: boolean
}

interface ClaimVisualizerProps {
  claims: Claim[]
}

export function ClaimVisualizer({ claims }: ClaimVisualizerProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const getStatusIcon = (claim: Claim) => {
    if (claim.verified && claim.reliability >= 70) {
      return <CheckCircle2 className="text-emerald-500" size={20} />
    }
    if (!claim.verified || claim.reliability < 50) {
      return <XCircle className="text-red-500" size={20} />
    }
    return <AlertCircle className="text-amber-500" size={20} />
  }

  const getStatusColor = (claim: Claim) => {
    if (claim.verified && claim.reliability >= 70) return 'border-emerald-900/30 bg-emerald-900/10'
    if (!claim.verified || claim.reliability < 50) return 'border-red-900/30 bg-red-900/10'
    return 'border-amber-900/30 bg-amber-900/10'
  }

  const getBarColor = (value: number) => {
    if (value >= 70) return 'bg-emerald-500'
    if (value >= 50) return 'bg-amber-500'
    return 'bg-red-500'
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Extracted Claims</h3>
        <span className="text-sm text-zinc-400">{claims.length} claims</span>
      </div>

      <div className="space-y-3">
        {claims.map((claim, index) => (
          <div
            key={index}
            className={`border rounded-lg transition-all ${getStatusColor(claim)}`}
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            >
              <div className="flex items-start gap-3">
                {getStatusIcon(claim)}
                <div className="flex-1">
                  <p className="text-white text-sm leading-relaxed">{claim.text}</p>
                  
                  {expandedIndex !== index && (
                    <div className="mt-3 flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-zinc-400">Confidence</span>
                          <span className="text-white font-semibold">{claim.confidence}%</span>
                        </div>
                        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getBarColor(claim.confidence)} transition-all duration-500`}
                            style={{ width: `${claim.confidence}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-zinc-400">Reliability</span>
                          <span className="text-white font-semibold">{claim.reliability}%</span>
                        </div>
                        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getBarColor(claim.reliability)} transition-all duration-500`}
                            style={{ width: `${claim.reliability}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <button className="text-zinc-400 hover:text-white">
                  {expandedIndex === index ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
              </div>
            </div>

            {expandedIndex === index && (
              <div className="px-4 pb-4 space-y-4 border-t border-zinc-800/50 pt-4">
                {/* Detailed Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-zinc-400 mb-2">Model Confidence</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getBarColor(claim.confidence)} transition-all duration-500`}
                          style={{ width: `${claim.confidence}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-white w-12 text-right">
                        {claim.confidence}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-400 mb-2">Verified Reliability</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getBarColor(claim.reliability)} transition-all duration-500`}
                          style={{ width: `${claim.reliability}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-white w-12 text-right">
                        {claim.reliability}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Deviation */}
                <div className="p-3 bg-zinc-800/50 rounded">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Claim Deviation</span>
                    <span className={`text-sm font-bold ${
                      Math.abs(claim.confidence - claim.reliability) > 15
                        ? 'text-red-400'
                        : Math.abs(claim.confidence - claim.reliability) > 10
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}>
                      {Math.abs(claim.confidence - claim.reliability).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Verification Status */}
                <div className="flex items-center gap-2 text-xs">
                  {claim.verified ? (
                    <>
                      <CheckCircle2 className="text-emerald-500" size={14} />
                      <span className="text-emerald-400">Verification passed</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="text-red-500" size={14} />
                      <span className="text-red-400">Verification failed</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-4 pt-4 border-t border-zinc-800 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-emerald-500">
            {claims.filter(c => c.verified && c.reliability >= 70).length}
          </p>
          <p className="text-xs text-zinc-400 mt-1">Verified</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-amber-500">
            {claims.filter(c => c.reliability >= 50 && c.reliability < 70).length}
          </p>
          <p className="text-xs text-zinc-400 mt-1">Uncertain</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-500">
            {claims.filter(c => !c.verified || c.reliability < 50).length}
          </p>
          <p className="text-xs text-zinc-400 mt-1">Failed</p>
        </div>
      </div>
    </div>
  )
}
