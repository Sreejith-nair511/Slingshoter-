'use client';

interface ConfidenceBarProps {
  value: number;
  label?: string;
  showPercentage?: boolean;
}

export function ConfidenceBar({
  value,
  label = 'Confidence',
  showPercentage = true,
}: ConfidenceBarProps) {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span
            className="text-sm font-medium"
            style={{ color: 'var(--slate-text)' }}
          >
            {label}
          </span>
          {showPercentage && (
            <span
              className="text-sm font-semibold"
              style={{ color: 'var(--blue-primary)' }}
            >
              {clampedValue}%
            </span>
          )}
        </div>
      )}
      <div
        className="w-full h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--slate-border)' }}
      >
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${clampedValue}%`,
            backgroundColor: 'var(--blue-primary)',
          }}
        />
      </div>
    </div>
  );
}
