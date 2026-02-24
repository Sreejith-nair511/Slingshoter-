'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'
import { Zap, TrendingUp, Clock, Cpu, HardDrive, Activity, Play, ArrowLeft, Download, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { AMDBadge } from '@/components/badges/amd-badge'
import type { Benchmark } from '@/lib/supabase'
import { Line } from 'recharts'
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface BenchmarkResult {
  mode: string
  iterations: number
  avgLatency: number
  p95Latency: number
  throughput: number
  avgDeviation: number
  stabilityIndex: number
  memoryUsage: number
  timestamp: string
}

export default function AMDPerformancePage() {
  const { user: clerkUser } = useUser()
  const [standardResult, setStandardResult] = useState<BenchmarkResult | null>(null)
  const [amdResult, setAmdResult] = useState<BenchmarkResult | null>(null)
  const [runningStandard, setRunningStandard] = useState(false)
  const [runningAMD, setRunningAMD] = useState(false)
  const [currentIteration, setCurrentIteration] = useState(0)
  const [totalIterations, setTotalIterations] = useState(5)
  const [highLoad, setHighLoad] = useState(false)
  const [historicalData, setHistoricalData] = useState<any[]>([])
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    if (clerkUser) {
      loadHistoricalData()
    }
  }, [clerkUser])

  async function loadHistoricalData() {
    if (!clerkUser) return

    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', clerkUser.id)
      .single()

    if (!user) return

    const { data } = await supabase
      .from('benchmarks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(20)

    if (data) {
      // Group by mode and format for chart
      const chartData: any = {}
      data.forEach((benchmark: Benchmark) => {
        const date = new Date(benchmark.created_at).toLocaleDateString()
        if (!chartData[date]) {
          chartData[date] = { date }
        }
        if (benchmark.mode === 'standard') {
          chartData[date].standard = benchmark.avg_verification_time
        } else if (benchmark.mode === 'amd' || benchmark.mode === 'edge-optimized') {
          chartData[date].amd = benchmark.avg_verification_time
        }
      })
      setHistoricalData(Object.values(chartData))
    }
  }

  async function runBenchmark(mode: 'standard' | 'amd') {
    const setRunning = mode === 'standard' ? setRunningStandard : setRunningAMD
    const setResult = mode === 'standard' ? setStandardResult : setAmdResult

    setRunning(true)
    setCurrentIteration(0)
    setTotalIterations(highLoad ? 20 : 5)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setCurrentIteration(prev => {
          if (prev < (highLoad ? 20 : 5)) {
            return prev + 1
          }
          return prev
        })
      }, highLoad ? 500 : 1000)

      const response = await fetch('/api/benchmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, iterations: 5, highLoad }),
      })

      clearInterval(progressInterval)

      const data = await response.json()

      if (data.success) {
        setResult(data.data)
        await loadHistoricalData()
      } else {
        throw new Error(data.error || 'Benchmark failed')
      }
    } catch (error) {
      console.error('Benchmark error:', error)
      alert('Benchmark failed. Please try again.')
    } finally {
      setRunning(false)
      setCurrentIteration(0)
    }
  }

  async function exportReport() {
    if (!standardResult && !amdResult) {
      alert('Please run at least one benchmark before exporting.')
      return
    }

    setExporting(true)

    try {
      const response = await fetch('/api/export-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'benchmark',
          data: {
            standard: standardResult,
            amd: amdResult,
            userName: clerkUser?.fullName || clerkUser?.emailAddresses[0]?.emailAddress || 'User',
          },
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `benchmark-report-${new Date().toISOString().split('T')[0]}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        throw new Error('Export failed')
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export report. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  const accelerationFactor = standardResult && amdResult
    ? (standardResult.avgLatency / amdResult.avgLatency).toFixed(2)
    : null

  const latencyReduction = standardResult && amdResult
    ? (((standardResult.avgLatency - amdResult.avgLatency) / standardResult.avgLatency) * 100).toFixed(1)
    : null

  const throughputIncrease = standardResult && amdResult
    ? (((amdResult.throughput - standardResult.throughput) / standardResult.throughput) * 100).toFixed(1)
    : null

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Zap className="text-red-500" size={32} />
              AMD Performance Benchmark
            </h1>
            <p className="text-zinc-400">
              Real-time performance measurement and comparison
            </p>
          </div>
          <div className="flex items-center gap-4">
            <AMDBadge size="lg" />
            {(standardResult || amdResult) && (
              <button
                onClick={exportReport}
                disabled={exporting}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {exporting ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                Export Report
              </button>
            )}
          </div>
        </div>

        {/* High Load Toggle */}
        <div className="mb-6 bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={highLoad}
              onChange={(e) => setHighLoad(e.target.checked)}
              disabled={runningStandard || runningAMD}
              className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-red-600 focus:ring-red-500"
            />
            <div>
              <span className="text-white font-semibold">Simulate High Load</span>
              <p className="text-zinc-400 text-sm">Run 20 iterations to test throughput under stress</p>
            </div>
          </label>
        </div>

        {/* Benchmark Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Standard Mode</h3>
                <p className="text-zinc-400 text-sm">CPU-based inference</p>
              </div>
              <Cpu className="text-blue-500" size={32} />
            </div>
            <button
              onClick={() => runBenchmark('standard')}
              disabled={runningStandard || runningAMD}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {runningStandard ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Running {currentIteration}/{totalIterations}
                </>
              ) : (
                <>
                  <Play size={18} />
                  Run Standard Benchmark
                </>
              )}
            </button>
          </div>

          <div className="bg-gradient-to-br from-red-950/20 to-zinc-900 border-2 border-red-900/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">AMD Accelerated</h3>
                <p className="text-red-400 text-sm">GPU-optimized inference</p>
              </div>
              <Zap className="text-red-500" size={32} />
            </div>
            <button
              onClick={() => runBenchmark('amd')}
              disabled={runningStandard || runningAMD}
              className="w-full px-4 py-3 bg-red-600 text-white rounded font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {runningAMD ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Running {currentIteration}/{totalIterations}
                </>
              ) : (
                <>
                  <Zap size={18} />
                  Run AMD Benchmark
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Comparison */}
        {(standardResult || amdResult) && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-6">Benchmark Results</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {standardResult && (
                <>
                  <div className="bg-blue-900/20 border border-blue-900/30 rounded-lg p-4">
                    <p className="text-blue-400 text-xs mb-1">Standard Avg Latency</p>
                    <p className="text-2xl font-bold text-white">{standardResult.avgLatency}ms</p>
                  </div>
                  <div className="bg-blue-900/20 border border-blue-900/30 rounded-lg p-4">
                    <p className="text-blue-400 text-xs mb-1">Standard Throughput</p>
                    <p className="text-2xl font-bold text-white">{standardResult.throughput}</p>
                    <p className="text-zinc-400 text-xs">req/sec</p>
                  </div>
                </>
              )}
              {amdResult && (
                <>
                  <div className="bg-red-900/20 border border-red-900/30 rounded-lg p-4">
                    <p className="text-red-400 text-xs mb-1">AMD Avg Latency</p>
                    <p className="text-2xl font-bold text-white">{amdResult.avgLatency}ms</p>
                  </div>
                  <div className="bg-red-900/20 border border-red-900/30 rounded-lg p-4">
                    <p className="text-red-400 text-xs mb-1">AMD Throughput</p>
                    <p className="text-2xl font-bold text-white">{amdResult.throughput}</p>
                    <p className="text-zinc-400 text-xs">req/sec</p>
                  </div>
                </>
              )}
            </div>

            {accelerationFactor && (
              <div className="bg-emerald-900/20 border border-emerald-900/30 rounded-lg p-6 mb-6">
                <div className="text-center">
                  <p className="text-emerald-400 text-sm mb-2">Acceleration Factor</p>
                  <p className="text-5xl font-bold text-emerald-400 mb-2">{accelerationFactor}x</p>
                  <div className="flex items-center justify-center gap-6 text-sm">
                    <div>
                      <span className="text-zinc-400">Latency Reduction: </span>
                      <span className="text-emerald-400 font-semibold">{latencyReduction}%</span>
                    </div>
                    <div>
                      <span className="text-zinc-400">Throughput Increase: </span>
                      <span className="text-emerald-400 font-semibold">+{throughputIncrease}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {standardResult && (
                <div>
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Cpu className="text-blue-500" size={18} />
                    Standard Mode Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Iterations:</span>
                      <span className="text-white">{standardResult.iterations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">P95 Latency:</span>
                      <span className="text-white">{standardResult.p95Latency}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Avg Deviation:</span>
                      <span className="text-white">{standardResult.avgDeviation}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Stability Index:</span>
                      <span className="text-white">{standardResult.stabilityIndex}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Memory Usage:</span>
                      <span className="text-white">{standardResult.memoryUsage}GB</span>
                    </div>
                  </div>
                </div>
              )}
              {amdResult && (
                <div>
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Zap className="text-red-500" size={18} />
                    AMD Mode Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Iterations:</span>
                      <span className="text-white">{amdResult.iterations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">P95 Latency:</span>
                      <span className="text-white">{amdResult.p95Latency}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Avg Deviation:</span>
                      <span className="text-white">{amdResult.avgDeviation}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Stability Index:</span>
                      <span className="text-white">{amdResult.stabilityIndex}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Memory Usage:</span>
                      <span className="text-white">{amdResult.memoryUsage}GB</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Historical Chart */}
        {historicalData.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-6">Historical Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" stroke="#71717a" />
                <YAxis stroke="#71717a" label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft', fill: '#71717a' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                  labelStyle={{ color: '#a1a1aa' }}
                />
                <Legend />
                <Line type="monotone" dataKey="standard" stroke="#3b82f6" name="Standard" strokeWidth={2} />
                <Line type="monotone" dataKey="amd" stroke="#ef4444" name="AMD" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
