'use client';

import { ConfidenceBar } from './confidence-bar';

interface MetricsPanelProps {
  systemConfidence: number;
  calibrationScore: number;
  reliabilityIndex: number;
}

export function MetricsPanel({
  systemConfidence,
  calibrationScore,
  reliabilityIndex,
}: MetricsPanelProps) {
  return (
    <div
      className="p-6 rounded-xl border-2"
      style={{
        backgroundColor: 'var(--slate-bg)',
        borderColor: 'var(--slate-border)',
      }}
    >
      <h3
        className="text-lg font-semibold mb-6"
        style={{ color: 'var(--slate-text)' }}
      >
        System Metrics
      </h3>

      <div className="space-y-6">
        <ConfidenceBar
          value={systemConfidence}
          label="System Confidence"
          showPercentage={true}
        />

        <div>
          <div className="flex justify-between items-center mb-2">
            <span
              className="text-sm font-medium"
              style={{ color: 'var(--slate-text)' }}
            >
              Calibration Score
            </span>
            <span
              className="text-sm font-semibold"
              style={{ color: 'var(--green-verify)' }}
            >
              {calibrationScore}%
            </span>
          </div>
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--slate-border)' }}
          >
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${calibrationScore}%`,
                backgroundColor: 'var(--green-verify)',
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span
              className="text-sm font-medium"
              style={{ color: 'var(--slate-text)' }}
            >
              Reliability Index
            </span>
            <span
              className="text-sm font-semibold"
              style={{ color: 'var(--blue-primary)' }}
            >
              {reliabilityIndex.toFixed(2)}x
            </span>
          </div>
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--slate-border)' }}
          >
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${Math.min((reliabilityIndex / 1.5) * 100, 100)}%`,
                backgroundColor: 'var(--blue-primary)',
              }}
            />
          </div>
        </div>

        <div
          className="p-3 rounded-lg border mt-6"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderColor: 'var(--slate-border)',
          }}
        >
          <p className="text-xs" style={{ color: 'var(--slate-muted)' }}>
            <span className="font-semibold" style={{ color: 'var(--slate-text)' }}>
              Status:{' '}
            </span>
            All systems operating within acceptable parameters.
          </p>
        </div>
      </div>
    </div>
  );
}
