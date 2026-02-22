'use client';

interface DeviationGaugeProps {
  value: number;
  threshold?: number;
  label?: string;
}

export function DeviationGauge({
  value,
  threshold = 15,
  label = 'Deviation',
}: DeviationGaugeProps) {
  const isWarning = value > threshold;
  const gaugeColor = isWarning ? 'var(--amber-risk)' : 'var(--green-verify)';

  // Clamp value for visual representation (0-30)
  const maxDisplay = 30;
  const displayValue = Math.min(value, maxDisplay);
  const percentage = (displayValue / maxDisplay) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <span
          className="text-sm font-medium"
          style={{ color: 'var(--slate-text)' }}
        >
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span
            className="text-sm font-semibold"
            style={{ color: gaugeColor }}
          >
            {value.toFixed(1)}%
          </span>
          {isWarning && (
            <span
              className="text-xs font-medium px-2 py-0.5 rounded"
              style={{
                backgroundColor: 'rgba(217, 119, 6, 0.15)',
                color: 'var(--amber-risk)',
              }}
            >
              High
            </span>
          )}
        </div>
      </div>

      {/* Semi-circular gauge */}
      <div className="relative h-16 w-full">
        <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
          {/* Background arc */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="var(--slate-border)"
            strokeWidth="3"
          />
          {/* Progress arc */}
          <path
            d={`M 10 50 A 40 40 0 0 1 ${10 + (percentage / 100) * 80} 50`}
            fill="none"
            stroke={gaugeColor}
            strokeWidth="3"
            strokeLinecap="round"
            style={{ transition: 'stroke 200ms ease' }}
          />
        </svg>
      </div>

      <div className="flex justify-between text-xs mt-2" style={{ color: 'var(--slate-muted)' }}>
        <span>0%</span>
        <span>{threshold}% (threshold)</span>
        <span>30%</span>
      </div>
    </div>
  );
}
