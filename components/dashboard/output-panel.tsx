'use client';

interface OutputPanelProps {
  title: string;
  output: string;
  confidence: number;
  verified: boolean;
  timestamp: string;
}

export function OutputPanel({
  title,
  output,
  confidence,
  verified,
  timestamp,
}: OutputPanelProps) {
  return (
    <div
      className="p-6 rounded-xl border-2"
      style={{
        backgroundColor: 'var(--slate-bg)',
        borderColor: verified ? 'var(--green-verify)' : 'var(--slate-border)',
      }}
    >
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3
            className="text-lg font-semibold"
            style={{ color: 'var(--slate-text)' }}
          >
            {title}
          </h3>
          {verified && (
            <span
              className="text-xs font-medium px-3 py-1 rounded-full"
              style={{
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                color: 'var(--green-verify)',
              }}
            >
              Verified
            </span>
          )}
        </div>
        <p className="text-xs" style={{ color: 'var(--slate-muted)' }}>
          {timestamp}
        </p>
      </div>

      <div
        className="p-4 rounded-lg mb-4 border"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderColor: 'var(--slate-border)',
        }}
      >
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'var(--slate-text)' }}
        >
          {output}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: 'var(--slate-muted)' }}>
          Model confidence
        </span>
        <div className="flex items-baseline gap-1">
          <span
            className="text-lg font-bold"
            style={{ color: 'var(--blue-primary)' }}
          >
            {confidence}
          </span>
          <span className="text-xs" style={{ color: 'var(--slate-muted)' }}>
            %
          </span>
        </div>
      </div>
    </div>
  );
}
