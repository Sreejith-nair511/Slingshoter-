'use client';

import { BarChart3, LineChart, TrendingUp } from 'lucide-react';

export default function MetricsPage() {
  return (
    <div className="p-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Metrics</h1>
        <p className="mt-2" style={{ color: 'var(--muted-foreground)' }}>
          Detailed performance metrics and trends
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {['Accuracy Trends', 'Confidence Distribution', 'Error Rate'].map((title) => (
          <div
            key={title}
            className="p-6 rounded-lg border flex items-center justify-center min-h-[300px]"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
            }}
          >
            <div className="text-center">
              <BarChart3 size={48} style={{ color: 'var(--muted-foreground)', margin: '0 auto' }} />
              <p className="mt-4 font-semibold">{title}</p>
              <p className="text-sm mt-2" style={{ color: 'var(--muted-foreground)' }}>
                Chart coming soon
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
