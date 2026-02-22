'use client';

import { useAuth } from '@/lib/auth-context';
import { MetricsOverview } from '@/components/dashboard/metrics-overview';
import { ModelCard } from '@/components/dashboard/model-card';
import { RefreshCw, Download } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  const sampleModels = [
    {
      name: 'Threat Detection v2.1',
      status: 'healthy' as const,
      accuracy: 94,
      confidence: 87,
      predictions: 15240,
    },
    {
      name: 'Anomaly Classifier',
      status: 'warning' as const,
      accuracy: 78,
      confidence: 68,
      predictions: 8930,
    },
    {
      name: 'Risk Scorer',
      status: 'critical' as const,
      accuracy: 62,
      confidence: 45,
      predictions: 3210,
    },
    {
      name: 'Intent Parser',
      status: 'healthy' as const,
      accuracy: 91,
      confidence: 85,
      predictions: 22100,
    },
  ];

  return (
    <div className="p-8" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="mt-2" style={{ color: 'var(--muted-foreground)' }}>
            Welcome back, {user?.name}. Here's your AI model reliability overview.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
            }}
          >
            <RefreshCw size={20} />
            <span>Refresh</span>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
            }}
          >
            <Download size={20} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Metrics Overview */}
      <MetricsOverview totalModels={4} healthyModels={2} avgAccuracy={81} riskyPredictions={3210} />

      {/* Models Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Your Models</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sampleModels.map((model) => (
            <ModelCard key={model.name} {...model} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div
        className="p-6 rounded-lg border"
        style={{
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)',
        }}
      >
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            {
              time: '2 hours ago',
              event: 'Risk Scorer flagged 45 high-confidence, low-accuracy predictions',
              severity: 'critical',
            },
            {
              time: '4 hours ago',
              event: 'Anomaly Classifier confidence dropped below 70% threshold',
              severity: 'warning',
            },
            {
              time: '6 hours ago',
              event: 'Threat Detection model performance improved to 94% accuracy',
              severity: 'healthy',
            },
            {
              time: '1 day ago',
              event: 'New model Intent Parser deployed to production',
              severity: 'healthy',
            },
          ].map((item, idx) => (
            <div key={idx} className="flex gap-4 pb-4 border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}>
              <div className="flex-1">
                <p className="font-medium">{item.event}</p>
                <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                  {item.time}
                </p>
              </div>
              <div
                className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                style={{
                  backgroundColor:
                    item.severity === 'critical'
                      ? 'var(--destructive)'
                      : item.severity === 'warning'
                        ? 'var(--amber-accent)'
                        : 'var(--emerald-accent)',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
