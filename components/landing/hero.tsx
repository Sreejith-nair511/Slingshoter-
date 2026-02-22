'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell, ComposedChart } from 'recharts';

// Mini chart data
const confidenceData = [
  { x: 0, confidence: 85, reliability: 78 },
  { x: 1, confidence: 88, reliability: 81 },
  { x: 2, confidence: 86, reliability: 83 },
  { x: 3, confidence: 90, reliability: 87 },
  { x: 4, confidence: 92, reliability: 89 },
];

const deviationData = [
  { name: 'Low', value: 45 },
  { name: 'Med', value: 30 },
  { name: 'High', value: 25 },
];

const calibrationData = [
  { range: '0-20%', count: 8 },
  { range: '20-40%', count: 12 },
  { range: '40-60%', count: 28 },
  { range: '60-80%', count: 35 },
  { range: '80-100%', count: 17 },
];

const latencyData = [
  { ms: 3.1 },
  { ms: 3.4 },
  { ms: 3.0 },
  { ms: 3.2 },
  { ms: 4.1 },
  { ms: 3.8 },
];

const evidenceData = [
  { name: 'Verified', value: 98.1 },
  { name: 'Pending', value: 1.9 },
];

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <section className="relative bg-zinc-950 pt-20 pb-16 overflow-hidden border-b border-zinc-800">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(113,113,122,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(113,113,122,0.08)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-8 lg:gap-12">
          {/* Left Column */}
          <div className="flex flex-col justify-center">
            <div className="space-y-6">
              {/* Headline */}
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-zinc-100 leading-tight">
                  AI Trust,<br />Quantified.
                </h1>
              </div>

              {/* Subheadline */}
              <p className="text-lg text-zinc-400 leading-relaxed max-w-md">
                Monitor confidence mismatches. Verify claims. Enforce calibrated decision boundaries.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm">
                  Request Demo
                </button>
                <button className="px-6 py-3 border border-zinc-700 hover:border-zinc-600 text-zinc-300 hover:text-zinc-100 font-medium rounded-lg transition-all duration-200 text-sm">
                  View Technical Docs
                </button>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-zinc-800">
                <div className="space-y-1">
                  <div className="text-xs font-mono text-blue-400">4.2ms</div>
                  <div className="text-xs text-zinc-500">Verification Latency</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-mono text-emerald-400">98.1%</div>
                  <div className="text-xs text-zinc-500">Claim Extraction</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-mono text-amber-400">12.7%</div>
                  <div className="text-xs text-zinc-500">Avg Trust Deviation</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-mono text-cyan-400">Edge</div>
                  <div className="text-xs text-zinc-500">Optimized Verification</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Analytics Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Confidence vs Reliability */}
            <div className="col-span-2 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <div className="text-xs font-mono text-zinc-400 mb-3">Confidence vs Reliability</div>
              <ResponsiveContainer width="100%" height={120}>
                <ComposedChart data={confidenceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(113, 113, 122, 0.2)" vertical={false} />
                  <XAxis dataKey="x" hide />
                  <YAxis hide domain={[75, 95]} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46' }} />
                  <Area type="monotone" dataKey="confidence" fill="rgba(59, 130, 246, 0.1)" stroke="none" />
                  <Line type="monotone" dataKey="confidence" stroke="#3b82f6" dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="reliability" stroke="#10b981" dot={false} strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Trust Deviation Gauge */}
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <div className="text-xs font-mono text-zinc-400 mb-3">Trust Deviation</div>
              <div className="flex items-center justify-center h-28">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(113, 113, 122, 0.3)" strokeWidth="8" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#f59e0b" strokeWidth="8" strokeDasharray="70 283" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-zinc-100">12.7%</div>
                      <div className="text-xs text-zinc-500">deviation</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Evidence Coverage */}
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <div className="text-xs font-mono text-zinc-400 mb-3">Evidence Coverage</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="text-xs text-zinc-400">Verified</div>
                  <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '98.1%' }} />
                  </div>
                  <div className="text-xs font-mono text-zinc-400">98.1%</div>
                </div>
              </div>
            </div>

            {/* Deviation Distribution */}
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <div className="text-xs font-mono text-zinc-400 mb-3">Calibration Index</div>
              <div className="flex items-center justify-between h-20">
                <div className="text-center">
                  <div className="text-sm font-mono text-blue-400">Underconf</div>
                  <div className="text-xs text-zinc-500">23%</div>
                </div>
                <div className="w-px h-12 bg-zinc-700" />
                <div className="text-center">
                  <div className="text-sm font-mono text-emerald-400">Balanced</div>
                  <div className="text-xs text-zinc-500">62%</div>
                </div>
                <div className="w-px h-12 bg-zinc-700" />
                <div className="text-center">
                  <div className="text-sm font-mono text-amber-400">Overconf</div>
                  <div className="text-xs text-zinc-500">15%</div>
                </div>
              </div>
            </div>

            {/* System Latency Sparkline */}
            <div className="col-span-2 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <div className="text-xs font-mono text-zinc-400 mb-3">System Latency Trend</div>
              <ResponsiveContainer width="100%" height={60}>
                <LineChart data={latencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(113, 113, 122, 0.2)" vertical={false} />
                  <XAxis dataKey="ms" hide />
                  <YAxis hide domain={[2.5, 4.5]} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46' }} />
                  <Line type="monotone" dataKey="ms" stroke="#06b6d4" dot={false} strokeWidth={2} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
