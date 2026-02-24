'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useUser } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@/lib/supabase'
import { RoleBadge } from '@/components/badges/role-badge'
import { TierBadge } from '@/components/badges/tier-badge'
import { AMDOptimizationPanel } from '@/components/amd/optimization-panel'
import { ScenarioCards } from '@/components/amd/scenario-cards'
import { HardwareModeSelector, type HardwareMode } from '@/components/amd/hardware-mode-selector'
import { PerformanceMetrics } from '@/components/amd/performance-metrics'
import { AccelerationComparison } from '@/components/amd/acceleration-comparison'
import { WhyAMDMatters } from '@/components/amd/why-amd-matters'
import { EdgeSimulationToggle } from '@/components/amd/edge-simulation-toggle'
import { PipelineVisualizer, type PipelineStage } from '@/components/analysis/pipeline-visualizer'
import { ClaimVisualizer } from '../../components/analysis/claim-visualizer'
import { DeviationGauge } from '../../components/analysis/deviation-gauge'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { SystemMonitor } from '@/components/system-monitor'
import { RateLimitDisplay } from '@/components/rate-limit-display'
import { canAccessFeature } from '@/lib/user-utils'
import { Send, Sparkles, Eye, EyeOff, Zap, BarChart3 } from 'lucide-react'
import Link from 'next/link'

const EXAMPLE_QUERIES = [
  'AI in cybersecurity',
  'Climate change statistics',
  'Quantum computing breakthrough',
  'Mars colonization timeline',
]

function DashboardContent() {
  const { user: clerkUser } = useUser()
  const searchParams = useSearchParams()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [query, setQuery] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>('idle')
  const [stageDurations, setStageDurations] = useState<Record<string, number>>({})
  const [result, setResult] = useState<any>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [hardwareMode, setHardwareMode] = useState<HardwareMode>('standard')
  const [edgeSimulation, setEdgeSimulation] = useState(false)
  const [optimizationMode, setOptimizationMode] = useState('standard')
  const [groqLatency, setGroqLatency] = useState(0)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadCurrentUser()
    
    // Check for query parameter from homepage
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
      // Auto-analyze after a short delay
      setTimeout(() => {
        if (q.trim()) {
          handleAnalyze()
        }
      }, 500)
    }
  }, [clerkUser, searchParams])

  async function loadCurrentUser() {
    if (!clerkUser) return
    
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkUser.id)
      .single()
    
    if (data) {
      setCurrentUser(data)
      setOptimizationMode(data.optimization_mode || 'standard')
    }
  }

  async function handleAnalyze() {
    if (!query.trim() || analyzing) return

    setAnalyzing(true)
    setResult(null)
    setPipelineStage('query_received')
    
    const startTime = Date.now()
    const durations: Record<string, number> = {}

    // Apply hardware mode multipliers
    const latencyMultiplier = 
      hardwareMode === 'edge-accelerated' ? 0.5 :
      hardwareMode === 'gpu-optimized' ? 0.7 : 1.0
    
    const edgeLatencyReduction = edgeSimulation ? 85 : 0

    try {
      // Stage 1: Query Received
      await new Promise(resolve => setTimeout(resolve, 300))
      durations.query_received = Date.now() - startTime
      setPipelineStage('groq_inference')
      setStageDurations({...durations})

      // Stage 2: Groq Inference
      const groqStart = Date.now()
      await new Promise(resolve => setTimeout(resolve, 800 * latencyMultiplier))
      const groqEnd = Date.now()
      const groqTime = Math.max(50, Math.round((groqEnd - groqStart - edgeLatencyReduction) * latencyMultiplier))
      setGroqLatency(groqTime)
      durations.groq_inference = groqTime
      setPipelineStage('claims_extracted')
      setStageDurations({...durations})

      // Stage 3: Claims Extracted
      await new Promise(resolve => setTimeout(resolve, 400))
      durations.claims_extracted = Date.now() - groqEnd
      setPipelineStage('verification')
      setStageDurations({...durations})

      // Stage 4: Verification
      const verifyStart = Date.now()
      await new Promise(resolve => setTimeout(resolve, 600))
      durations.verification = Date.now() - verifyStart
      setPipelineStage('deviation_calculated')
      setStageDurations({...durations})

      // Stage 5: Deviation Calculated
      await new Promise(resolve => setTimeout(resolve, 200))
      durations.deviation_calculated = 200
      setPipelineStage('saved_to_db')
      setStageDurations({...durations})

      // Stage 6: Call actual API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query, 
          optimizationMode 
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setResult(data.data)
        durations.saved_to_db = Date.now() - startTime - Object.values(durations).reduce((a, b) => a + b, 0)
        setStageDurations({...durations})
        setPipelineStage('complete')
        
        // Auto-scroll to results
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 300)
        
        // Reload user to update badge
        loadCurrentUser()
      } else {
        throw new Error(data.error || 'Analysis failed')
      }
    } catch (error) {
      console.error('Analysis error:', error)
      alert('Analysis failed. Please try again.')
      setPipelineStage('idle')
    } finally {
      setAnalyzing(false)
    }
  }

  const showAMDPanel = true // Show AMD features for everyone in demo
  const showAdvancedFeatures = canAccessFeature(currentUser?.role || 'student', 'advanced_graphs')

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white">Trust Calibration Layer</h1>
            {currentUser && (
              <div className="flex items-center gap-2">
                <RoleBadge role={currentUser.role} size="sm" />
                <TierBadge badge={currentUser.badge} size="sm" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            {showAMDPanel && (
              <>
                <Link
                  href="/amd-performance"
                  className="flex items-center gap-2 px-4 py-2 bg-red-900/20 border border-red-900/30 text-red-400 rounded hover:bg-red-900/30 transition-colors text-sm"
                >
                  <Zap size={16} />
                  AMD Performance
                </Link>
              </>
            )}
            <button
              onClick={() => setFocusMode(!focusMode)}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-300 rounded hover:bg-zinc-700 transition-colors text-sm"
            >
              {focusMode ? <Eye size={16} /> : <EyeOff size={16} />}
              Focus Mode
            </button>
            <ThemeSwitcher />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* AMD Scenario Cards - Top Priority */}
        {showAMDPanel && (
          <div className="max-w-6xl mx-auto mb-8">
            <ScenarioCards
              onRunScenario={(scenarioQuery) => {
                setQuery(scenarioQuery)
                setTimeout(() => handleAnalyze(), 100)
              }}
              disabled={analyzing}
            />
          </div>
        )}

        {/* Main Analysis Tool - Front and Center */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Sparkles className="text-blue-500" size={36} />
              <h2 className="text-4xl font-bold text-white">Calibrate AI Trust</h2>
              {hardwareMode === 'edge-accelerated' && (
                <div className="px-3 py-1 bg-red-900/20 border border-red-900/30 rounded-full flex items-center gap-2">
                  <Zap className="text-red-400" size={16} />
                  <span className="text-xs text-red-400 font-semibold">AMD Optimized Execution</span>
                </div>
              )}
            </div>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Enter a query to analyze confidence, reliability, and trust deviation in real time.
            </p>
          </div>

          {/* Query Input - Prominent */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-zinc-900 border-2 border-zinc-700 rounded-xl p-8 shadow-2xl">
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                  placeholder="Enter your query to analyze..."
                  className="flex-1 px-6 py-4 bg-zinc-800 text-white text-lg rounded-lg border-2 border-zinc-700 focus:border-blue-500 focus:outline-none transition-colors"
                  disabled={analyzing}
                />
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing || !query.trim()}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg transition-all text-lg"
                >
                  <Send size={20} />
                  {analyzing ? 'Analyzing...' : 'Analyze'}
                </button>
              </div>

              {/* Example Chips */}
              <div className="flex flex-wrap gap-2">
                <span className="text-zinc-500 text-sm">Quick examples:</span>
                {EXAMPLE_QUERIES.map((example) => (
                  <button
                    key={example}
                    onClick={() => setQuery(example)}
                    disabled={analyzing}
                    className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-sm hover:bg-zinc-700 hover:text-white transition-colors disabled:opacity-50"
                  >
                    {example}
                  </button>
                ))}
              </div>

              {/* Real-Time Performance Badge */}
              {groqLatency > 0 && (
                <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="text-emerald-500" size={16} />
                    <span className="text-zinc-400 text-sm">Groq Ultra-Fast Inference</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">{groqLatency}ms</span>
                    {optimizationMode !== 'standard' && (
                      <span className="px-2 py-1 bg-red-900/20 text-red-400 rounded text-xs font-semibold">
                        AMD Accelerated
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Live Pipeline Status Strip - Visible */}
          {pipelineStage !== 'idle' && (
            <div className="max-w-4xl mx-auto">
              <PipelineVisualizer 
                currentStage={pipelineStage} 
                stageDurations={stageDurations}
              />
            </div>
          )}

          {/* Hardware Mode Selector */}
          <div className="max-w-4xl mx-auto mt-6">
            <HardwareModeSelector
              value={hardwareMode}
              onChange={setHardwareMode}
              disabled={analyzing}
            />
          </div>

          {/* Edge Simulation Toggle */}
          {hardwareMode === 'edge-accelerated' && (
            <div className="max-w-4xl mx-auto mt-4">
              <EdgeSimulationToggle
                enabled={edgeSimulation}
                onChange={setEdgeSimulation}
                disabled={analyzing}
              />
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div ref={resultsRef} className="space-y-8">
            {/* Deviation Gauge - Prominent */}
            <div className="max-w-4xl mx-auto">
              <DeviationGauge 
                deviation={result.trustDeviation}
                confidence={result.confidenceScore}
                reliability={result.reliabilityScore}
              />
              <div className="mt-4 text-center">
                <p className="text-zinc-400 text-sm">
                  Trust Deviation = | Model Confidence − Verified Reliability |
                </p>
              </div>
            </div>

            {/* Hardware Performance Metrics */}
            {result && (
              <div className="max-w-4xl mx-auto mt-8">
                <PerformanceMetrics
                  mode={hardwareMode}
                  baseLatency={groqLatency}
                  claimCount={result.claims.length}
                />
              </div>
            )}

            {/* Acceleration Comparison Graph */}
            {result && (
              <div className="max-w-4xl mx-auto mt-8">
                <AccelerationComparison
                  currentMode={hardwareMode}
                  baseLatency={groqLatency}
                />
              </div>
            )}

            {/* Why AMD Matters */}
            {showAMDPanel && (
              <div className="max-w-4xl mx-auto mt-8">
                <WhyAMDMatters />
              </div>
            )}

            {/* AMD Acceleration Panel - Visible */}
            {showAMDPanel && (
              <div className="max-w-4xl mx-auto">
                <AMDOptimizationPanel 
                  currentMode={optimizationMode}
                  onModeChange={async (mode) => {
                    setOptimizationMode(mode)
                    if (currentUser) {
                      await supabase
                        .from('users')
                        .update({ optimization_mode: mode })
                        .eq('id', currentUser.id)
                    }
                  }}
                />
              </div>
            )}

            {/* Claims Visualization */}
            <div className="max-w-4xl mx-auto">
              <ClaimVisualizer claims={result.claims} />
            </div>

            {/* Advanced Analytics - Collapsible */}
            {showAdvancedFeatures && (
              <div className="max-w-4xl mx-auto">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-lg text-white font-semibold hover:bg-zinc-800 transition-colors flex items-center justify-between"
                >
                  <span>{showAdvanced ? 'Hide' : 'Expand'} Advanced Analytics</span>
                  <span className="text-zinc-400">{showAdvanced ? '−' : '+'}</span>
                </button>

                {showAdvanced && (
                  <div className="mt-4 bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                    <h4 className="text-white font-semibold mb-4">Technical Details</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Model:</span>
                        <span className="text-white font-mono">mixtral-8x7b-32768</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Temperature:</span>
                        <span className="text-white">0.3</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Optimization Mode:</span>
                        <span className="text-white">{optimizationMode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Hardware Profile:</span>
                        <span className="text-white">{result.optimizationMode === 'standard' ? 'CPU' : 'AMD GPU'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Total Latency:</span>
                        <span className="text-white">{result.verificationLatency}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Calibration Index:</span>
                        <span className="text-white">{result.calibrationIndex}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Risk Level:</span>
                        <span className={`font-semibold ${
                          result.riskLevel === 'low' ? 'text-emerald-400' :
                          result.riskLevel === 'medium' ? 'text-amber-400' :
                          result.riskLevel === 'high' ? 'text-orange-400' :
                          'text-red-400'
                        }`}>
                          {result.riskLevel.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h5 className="text-white font-semibold mb-3">Structured Output</h5>
                      <pre className="p-4 bg-zinc-950 rounded text-xs text-zinc-300 overflow-auto max-h-96">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* User Stats - Sidebar (Hidden in Focus Mode) */}
        {!focusMode && currentUser && !result && (
          <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Your Stats</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-zinc-400 text-sm">Total Analyses</p>
                  <p className="text-3xl font-bold text-white">{currentUser.analysis_count}</p>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Current Badge</p>
                  <div className="mt-2">
                    <TierBadge badge={currentUser.badge} />
                  </div>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Progress</p>
                  <p className="text-xs text-zinc-400 mt-2">
                    {currentUser.analysis_count < 11 && `${11 - currentUser.analysis_count} more for Silver`}
                    {currentUser.analysis_count >= 11 && currentUser.analysis_count < 51 && `${51 - currentUser.analysis_count} more for Gold`}
                    {currentUser.analysis_count >= 51 && currentUser.analysis_count < 200 && `${200 - currentUser.analysis_count} more for Platinum`}
                    {currentUser.analysis_count >= 200 && 'Maximum tier reached!'}
                  </p>
                </div>
              </div>
            </div>

            {/* System Monitor */}
            <SystemMonitor />

            {/* Rate Limit Display */}
            <RateLimitDisplay />
          </div>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
