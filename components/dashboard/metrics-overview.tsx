import { BarChart3, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface MetricsOverviewProps {
  totalModels: number;
  healthyModels: number;
  avgAccuracy: number;
  riskyPredictions: number;
}

export function MetricsOverview({ totalModels, healthyModels, avgAccuracy, riskyPredictions }: MetricsOverviewProps) {
  const metrics = [
    {
      label: 'Total Models',
      value: totalModels,
      icon: BarChart3,
      color: 'var(--blue-accent)',
    },
    {
      label: 'Healthy',
      value: healthyModels,
      icon: CheckCircle,
      color: 'var(--emerald-accent)',
    },
    {
      label: 'Avg Accuracy',
      value: `${avgAccuracy}%`,
      icon: TrendingUp,
      color: 'var(--blue-accent)',
    },
    {
      label: 'At Risk',
      value: riskyPredictions,
      icon: AlertCircle,
      color: 'var(--amber-accent)',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.label}
            className="p-6 rounded-lg border"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: metric.color + '20', color: metric.color }}
              >
                <Icon size={24} />
              </div>
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
              {metric.label}
            </p>
            <p className="text-3xl font-bold mt-1" style={{ color: 'var(--foreground)' }}>
              {metric.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
