'use client';

import { ModelCard } from '@/components/dashboard/model-card';
import { Plus, Search } from 'lucide-react';

export default function ModelsPage() {
  const models = [
    { name: 'Threat Detection v2.1', status: 'healthy' as const, accuracy: 94, confidence: 87, predictions: 15240 },
    { name: 'Anomaly Classifier', status: 'warning' as const, accuracy: 78, confidence: 68, predictions: 8930 },
    { name: 'Risk Scorer', status: 'critical' as const, accuracy: 62, confidence: 45, predictions: 3210 },
    { name: 'Intent Parser', status: 'healthy' as const, accuracy: 91, confidence: 85, predictions: 22100 },
    { name: 'Sentiment Analyzer', status: 'healthy' as const, accuracy: 88, confidence: 82, predictions: 11500 },
    { name: 'Entity Extractor', status: 'warning' as const, accuracy: 76, confidence: 71, predictions: 6800 },
  ];

  return (
    <div className="p-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Models</h1>
          <p className="mt-2" style={{ color: 'var(--muted-foreground)' }}>
            Manage and monitor all your AI models
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold"
          style={{
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
          }}
        >
          <Plus size={20} />
          <span>Add Model</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3" size={20} style={{ color: 'var(--muted-foreground)' }} />
          <input
            type="text"
            placeholder="Search models..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border"
            style={{
              backgroundColor: 'var(--input)',
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
            }}
          />
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {models.map((model) => (
          <ModelCard key={model.name} {...model} />
        ))}
      </div>
    </div>
  );
}
