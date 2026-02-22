'use client';

import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const sparklineData = [
  { v: 82 },
  { v: 85 },
  { v: 83 },
  { v: 88 },
  { v: 86 },
  { v: 90 },
];

const metrics = [
  {
    label: 'Avg Confidence Score',
    value: '87.4%',
    trend: 'up',
    change: '+2.3%',
    chart: sparklineData,
  },
  {
    label: 'Avg Verified Reliability',
    value: '91.2%',
    trend: 'up',
    change: '+1.8%',
    chart: sparklineData,
  },
  {
    label: 'System Calibration Index',
    value: '94.1',
    trend: 'up',
    change: '+3.2%',
    chart: sparklineData,
  },
  {
    label: 'Risk Event Rate',
    value: '2.3%',
    trend: 'down',
    change: '-0.8%',
    chart: sparklineData,
  },
];

export function MetricsGrid() {
  return (
    <section className="relative bg-zinc-950 py-16 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <h2 className="text-3xl font-bold text-zinc-100 mb-12">
          Core System Metrics
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors duration-200"
            >
              {/* Label */}
              <div className="text-xs font-mono text-zinc-500 mb-4">
                {metric.label}
              </div>

              {/* Value */}
              <div className="flex items-baseline gap-2 mb-4">
                <div className="text-3xl font-bold text-zinc-100">
                  {metric.value}
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${metric.trend === 'up' ? 'text-emerald-400' : 'text-emerald-400'}`}>
                  {metric.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {metric.change}
                </div>
              </div>

              {/* Sparkline */}
              <div className="h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metric.chart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(113, 113, 122, 0.2)" vertical={false} />
                    <XAxis dataKey="v" hide />
                    <YAxis hide domain={[75, 95]} />
                    <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46' }} />
                    <Line type="monotone" dataKey="v" stroke="#3b82f6" dot={false} strokeWidth={2} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
