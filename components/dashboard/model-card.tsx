interface ModelCardProps {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  accuracy: number;
  confidence: number;
  predictions: number;
}

export function ModelCard({ name, status, accuracy, confidence, predictions }: ModelCardProps) {
  const statusColors = {
    healthy: 'var(--emerald-accent)',
    warning: 'var(--amber-accent)',
    critical: 'var(--destructive)',
  };

  const statusLabels = {
    healthy: 'Healthy',
    warning: 'Warning',
    critical: 'Critical',
  };

  return (
    <div
      className="p-6 rounded-lg border"
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            {predictions} predictions
          </p>
        </div>
        <span
          className="px-3 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: statusColors[status], color: 'white' }}
        >
          {statusLabels[status]}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Accuracy</span>
            <span className="text-sm font-semibold">{accuracy}%</span>
          </div>
          <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${accuracy}%`,
                backgroundColor: accuracy > 85 ? 'var(--emerald-accent)' : 'var(--amber-accent)',
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Confidence</span>
            <span className="text-sm font-semibold">{confidence}%</span>
          </div>
          <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${confidence}%`,
                backgroundColor: 'var(--blue-accent)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
