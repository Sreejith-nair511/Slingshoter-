'use client';

import { LineChart, Line, BarChart, Bar, ComposedChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const deviationData = [
  { time: '00:00', deviation: 8.2, threshold: 15 },
  { time: '04:00', deviation: 7.5, threshold: 15 },
  { time: '08:00', deviation: 9.1, threshold: 15 },
  { time: '12:00', deviation: 11.2, threshold: 15 },
  { time: '16:00', deviation: 10.5, threshold: 15 },
  { time: '20:00', deviation: 12.7, threshold: 15 },
  { time: '24:00', deviation: 9.8, threshold: 15 },
];

const reliabilityData = [
  { domain: 'NLP', reliability: 92 },
  { domain: 'Vision', reliability: 88 },
  { domain: 'Reasoning', reliability: 85 },
  { domain: 'Classification', reliability: 94 },
  { domain: 'Retrieval', reliability: 89 },
];

const heatmapData = [
  { x: 'M', y: 'H1', value: 85 },
  { x: 'M', y: 'H2', value: 78 },
  { x: 'T', y: 'H1', value: 91 },
  { x: 'T', y: 'H2', value: 84 },
  { x: 'W', y: 'H1', value: 88 },
  { x: 'W', y: 'H2', value: 79 },
];

const severityData = [
  { severity: 'Critical', value: 5, fill: '#ef4444' },
  { severity: 'High', value: 18, fill: '#f59e0b' },
  { severity: 'Medium', value: 42, fill: '#eab308' },
  { severity: 'Low', value: 35, fill: '#10b981' },
];

export function DeepAnalytics() {
  return (
    <section className="relative bg-zinc-950 py-16 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <h2 className="text-3xl font-bold text-zinc-100 mb-12">
          Deep Analytics Preview
        </h2>

        {/* Full-width Board */}
        <div className="space-y-4">
          {/* Trust Deviation Over Time */}
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <div className="text-sm font-mono text-zinc-400 mb-4">Trust Deviation Over Time</div>
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={deviationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(113, 113, 122, 0.2)" />
                <XAxis dataKey="time" stroke="rgba(113, 113, 122, 0.5)" />
                <YAxis stroke="rgba(113, 113, 122, 0.5)" />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46' }} />
                <Area type="monotone" dataKey="threshold" fill="rgba(249, 158, 11, 0.05)" stroke="none" />
                <Line type="monotone" dataKey="deviation" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="threshold" stroke="rgba(249, 158, 11, 0.5)" strokeWidth={1} strokeDasharray="5 5" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Two-column row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Reliability vs Domain */}
            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <div className="text-sm font-mono text-zinc-400 mb-4">Reliability by Domain</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={reliabilityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(113, 113, 122, 0.2)" vertical={false} />
                  <XAxis dataKey="domain" stroke="rgba(113, 113, 122, 0.5)" />
                  <YAxis stroke="rgba(113, 113, 122, 0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46' }} />
                  <Bar dataKey="reliability" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Risk Severity Breakdown */}
            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <div className="text-sm font-mono text-zinc-400 mb-4">Risk Severity Distribution</div>
              <div className="space-y-3">
                {severityData.map((item) => (
                  <div key={item.severity} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-sm text-zinc-400">{item.severity}</span>
                      <div className="flex-1 mx-3 h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            backgroundColor: item.fill,
                            width: `${(item.value / 100) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-mono text-zinc-500 w-12 text-right">{item.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Claim Verification Heatmap */}
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <div className="text-sm font-mono text-zinc-400 mb-4">Claim Verification Heatmap</div>
            <div className="grid grid-cols-6 gap-2">
              {heatmapData.map((item, idx) => {
                const hue = item.value;
                const color = hue > 85 ? 'bg-emerald-900' : hue > 75 ? 'bg-amber-900' : 'bg-red-900';
                return (
                  <div
                    key={idx}
                    className={`aspect-square rounded-lg ${color} flex items-center justify-center text-xs font-mono text-zinc-200 cursor-pointer hover:opacity-80 transition-opacity`}
                    title={`${item.x}-${item.y}: ${item.value}%`}
                  >
                    {item.value}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
