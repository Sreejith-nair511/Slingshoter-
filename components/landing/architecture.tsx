'use client';

export function Architecture() {
  const layers = [
    {
      name: 'Interface Layer',
      description: 'User-facing dashboards, APIs, webhooks',
      color: 'border-blue-500/30 bg-blue-500/5',
    },
    {
      name: 'Extraction Layer',
      description: 'NLP claim parsing, semantic decomposition',
      color: 'border-emerald-500/30 bg-emerald-500/5',
    },
    {
      name: 'Verification Layer',
      description: 'Evidence retrieval, fact-checking, scoring',
      color: 'border-amber-500/30 bg-amber-500/5',
    },
    {
      name: 'Calibration Engine',
      description: 'Trust deviation computation, metrics aggregation',
      color: 'border-cyan-500/30 bg-cyan-500/5',
    },
    {
      name: 'Governance Layer',
      description: 'Audit logging, intervention workflows, policy enforcement',
      color: 'border-zinc-500/30 bg-zinc-500/5',
    },
  ];

  return (
    <section className="relative bg-zinc-950 py-16 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <h2 className="text-3xl font-bold text-zinc-100 mb-12">
          System Architecture
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-12">
          {/* Left - Text */}
          <div className="space-y-4">
            <p className="text-sm text-zinc-400 leading-relaxed">
              The Trust Calibration Layer operates across five integrated architectural layers, each optimized for specific aspects of AI trust verification and governance.
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Data flows from user queries through extraction and verification, where confidence scores are computed and compared against observed model reliability. Deviations trigger intervention workflows.
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              The governance layer maintains complete audit trails and enforces organizational policies on model decision boundaries.
            </p>
          </div>

          {/* Right - Diagram */}
          <div className="space-y-3">
            {layers.map((layer, idx) => (
              <div key={layer.name} className="relative">
                {/* Connection line */}
                {idx < layers.length - 1 && (
                  <div className="absolute left-8 top-full w-0.5 h-2 bg-gradient-to-b from-zinc-700 to-transparent" />
                )}

                {/* Layer block */}
                <div className={`p-4 rounded-lg border ${layer.color}`}>
                  <div className="font-mono text-sm font-semibold text-zinc-100">
                    {layer.name}
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    {layer.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
            <div className="text-xs font-mono text-blue-400 mb-2">Performance</div>
            <div className="text-sm text-zinc-300">Sub-5ms end-to-end latency for typical claims with distributed verification.</div>
          </div>
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
            <div className="text-xs font-mono text-emerald-400 mb-2">Scalability</div>
            <div className="text-sm text-zinc-300">Handles 10K+ concurrent verification requests with horizontal scaling.</div>
          </div>
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
            <div className="text-xs font-mono text-amber-400 mb-2">Reliability</div>
            <div className="text-sm text-zinc-300">99.99% uptime SLA with multi-region failover and consistency guarantees.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
