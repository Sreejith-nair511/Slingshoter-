'use client';

import { AlertCircle, X } from 'lucide-react';

export default function AlertsPage() {
  const alerts = [
    {
      id: 1,
      title: 'Critical: Risk Scorer Performance Drop',
      description: 'Accuracy dropped to 62%, confidence at 45%',
      severity: 'critical',
      time: '2 hours ago',
      model: 'Risk Scorer',
    },
    {
      id: 2,
      title: 'Warning: Anomaly Classifier Below Threshold',
      description: 'Confidence score dropped to 68% (threshold: 75%)',
      severity: 'warning',
      time: '4 hours ago',
      model: 'Anomaly Classifier',
    },
    {
      id: 3,
      title: 'Info: Routine Backup Completed',
      description: 'System backup completed successfully',
      severity: 'info',
      time: '6 hours ago',
      model: 'System',
    },
  ];

  const severityColors: Record<string, string> = {
    critical: 'var(--destructive)',
    warning: 'var(--amber-accent)',
    info: 'var(--blue-accent)',
  };

  return (
    <div className="p-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Alerts</h1>
        <p className="mt-2" style={{ color: 'var(--muted-foreground)' }}>
          Monitor system and model alerts
        </p>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="p-6 rounded-lg border flex items-start justify-between"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: severityColors[alert.severity] + '40',
            }}
          >
            <div className="flex items-start gap-4 flex-1">
              <div
                className="p-2 rounded-lg flex-shrink-0"
                style={{ backgroundColor: severityColors[alert.severity] + '20', color: severityColors[alert.severity] }}
              >
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{alert.title}</h3>
                <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                  {alert.description}
                </p>
                <div className="flex gap-4 mt-3">
                  <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                    {alert.model}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    {alert.time}
                  </span>
                </div>
              </div>
            </div>
            <button className="p-2 hover:opacity-70 transition-opacity">
              <X size={20} style={{ color: 'var(--muted-foreground)' }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
