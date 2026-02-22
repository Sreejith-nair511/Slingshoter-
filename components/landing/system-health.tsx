'use client';

import { Activity } from 'lucide-react';

const healthMetrics = [
  {
    label: 'GPU Utilization',
    value: '67%',
    status: 'healthy',
    bar: 67,
  },
  {
    label: 'Verification Throughput',
    value: '8.2K/s',
    status: 'healthy',
    bar: 82,
  },
  {
    label: 'Avg Processing Time',
    value: '3.1ms',
    status: 'healthy',
    bar: 31,
  },
  {
    label: 'Evidence Retrieval Speed',
    value: '142ms',
    status: 'healthy',
    bar: 71,
  },
  {
    label: 'Active Sessions',
    value: '2,847',
    status: 'healthy',
    bar: 57,
  },
];

export function SystemHealth() {
  return (
    <section className="relative bg-zinc-950 py-16 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Activity className="w-6 h-6 text-green-500" />
          <h2 className="text-xl font-semibold text-zinc-100">
            System Health Status
          </h2>
        </div>

        {/* Metrics Strip */}
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {healthMetrics.map((metric) => (
              <div key={metric.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono text-zinc-500">
                    {metric.label}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <div className="text-xs text-zinc-400">OK</div>
                  </div>
                </div>
                <div className="text-lg font-semibold text-zinc-100">
                  {metric.value}
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                    style={{ width: `${metric.bar}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status note */}
        <div className="mt-6 p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
          <div className="text-xs text-zinc-500">
            Last updated: 23 seconds ago • All systems operational • 99.99% uptime (30-day)
          </div>
        </div>
      </div>
    </section>
  );
}
