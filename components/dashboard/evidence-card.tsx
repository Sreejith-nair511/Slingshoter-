'use client';

import { CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface EvidenceCardProps {
  title: string;
  evidence: string;
  confidence: number;
  type?: 'verified' | 'uncertain' | 'warning';
  timestamp?: string;
}

const typeConfig = {
  verified: {
    icon: CheckCircle2,
    color: 'var(--green-verify)',
    bgColor: 'rgba(34, 197, 94, 0.1)',
  },
  uncertain: {
    icon: HelpCircle,
    color: 'var(--slate-muted)',
    bgColor: 'rgba(107, 114, 128, 0.1)',
  },
  warning: {
    icon: AlertCircle,
    color: 'var(--amber-risk)',
    bgColor: 'rgba(217, 119, 6, 0.1)',
  },
};

export function EvidenceCard({
  title,
  evidence,
  confidence,
  type = 'uncertain',
  timestamp,
}: EvidenceCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className="p-4 rounded-lg border"
      style={{
        backgroundColor: config.bgColor,
        borderColor: 'var(--slate-border)',
      }}
    >
      <div className="flex gap-3 mb-3">
        <Icon size={18} style={{ color: config.color, flexShrink: 0 }} />
        <div className="flex-1 min-w-0">
          <h4
            className="text-sm font-semibold truncate"
            style={{ color: 'var(--slate-text)' }}
          >
            {title}
          </h4>
          {timestamp && (
            <p className="text-xs mt-0.5" style={{ color: 'var(--slate-muted)' }}>
              {timestamp}
            </p>
          )}
        </div>
      </div>

      <p
        className="text-sm leading-relaxed mb-3"
        style={{ color: 'var(--slate-text)' }}
      >
        {evidence}
      </p>

      <div
        className="flex items-center justify-between pt-2 border-t"
        style={{ borderColor: 'var(--slate-border)' }}
      >
        <span className="text-xs" style={{ color: 'var(--slate-muted)' }}>
          Evidence confidence
        </span>
        <span
          className="text-xs font-semibold"
          style={{ color: config.color }}
        >
          {confidence}%
        </span>
      </div>
    </div>
  );
}
