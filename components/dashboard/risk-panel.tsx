'use client';

import { AlertTriangle, TrendingUp } from 'lucide-react';
import { DeviationGauge } from './deviation-gauge';

interface RiskItem {
  id: string;
  category: string;
  riskLevel: 'low' | 'medium' | 'high';
  description: string;
}

interface RiskPanelProps {
  deviationScore: number;
  riskItems: RiskItem[];
}

const getRiskColor = (level: 'low' | 'medium' | 'high') => {
  switch (level) {
    case 'high':
      return 'var(--amber-risk)';
    case 'medium':
      return 'oklch(0.641 0.195 59)';
    case 'low':
      return 'var(--green-verify)';
  }
};

const getRiskBackground = (level: 'low' | 'medium' | 'high') => {
  switch (level) {
    case 'high':
      return 'rgba(217, 119, 6, 0.1)';
    case 'medium':
      return 'rgba(217, 119, 6, 0.08)';
    case 'low':
      return 'rgba(34, 197, 94, 0.1)';
  }
};

export function RiskPanel({ deviationScore, riskItems }: RiskPanelProps) {
  const highRiskCount = riskItems.filter((r) => r.riskLevel === 'high').length;

  return (
    <div
      className="p-6 rounded-xl border-2"
      style={{
        backgroundColor: 'var(--slate-bg)',
        borderColor: highRiskCount > 0 ? 'var(--amber-risk)' : 'var(--slate-border)',
      }}
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-lg font-semibold"
            style={{ color: 'var(--slate-text)' }}
          >
            Risk Assessment
          </h3>
          {highRiskCount > 0 && (
            <div className="flex items-center gap-1.5" style={{ color: 'var(--amber-risk)' }}>
              <AlertTriangle size={16} />
              <span className="text-xs font-semibold">{highRiskCount} Alert{highRiskCount !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
        <DeviationGauge value={deviationScore} threshold={15} label="Output Deviation" />
      </div>

      <div
        className="border-t pt-4"
        style={{ borderColor: 'var(--slate-border)' }}
      >
        <h4
          className="text-sm font-semibold mb-3"
          style={{ color: 'var(--slate-text)' }}
        >
          Risk Factors
        </h4>

        <div className="space-y-2">
          {riskItems.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-lg border flex items-start gap-3"
              style={{
                backgroundColor: getRiskBackground(item.riskLevel),
                borderColor: 'var(--slate-border)',
              }}
            >
              <TrendingUp
                size={14}
                style={{
                  color: getRiskColor(item.riskLevel),
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: 'var(--slate-text)' }}
                  >
                    {item.category}
                  </span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: getRiskColor(item.riskLevel),
                      color: item.riskLevel === 'low' ? 'var(--slate-bg)' : 'white',
                      fontWeight: 600,
                    }}
                  >
                    {item.riskLevel.charAt(0).toUpperCase() + item.riskLevel.slice(1)}
                  </span>
                </div>
                <p
                  className="text-xs mt-1"
                  style={{ color: 'var(--slate-muted)' }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
