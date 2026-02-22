'use client';

export function Pipeline() {
  const steps = [
    'User Query',
    'Model Output',
    'Claim Extraction',
    'Verification Engine',
    'Trust Deviation Metric',
    'Intervention Layer',
  ];

  return (
    <section className="relative bg-zinc-950 py-16 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <h2 className="text-3xl font-bold text-zinc-100 mb-12">
          Trust Calibration Pipeline
        </h2>

        {/* Flow Diagram */}
        <div className="overflow-x-auto pb-4">
          <div className="flex items-center gap-3 min-w-max">
            {steps.map((step, idx) => (
              <div key={step} className="flex items-center gap-3">
                {/* Block */}
                <div className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-lg whitespace-nowrap text-sm font-medium text-zinc-200">
                  {step}
                </div>

                {/* Arrow */}
                {idx < steps.length - 1 && (
                  <div className="text-zinc-600 text-xl leading-none">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mt-12 p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <h3 className="text-sm font-mono text-zinc-400 mb-3">Pipeline Architecture</h3>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
            The Trust Calibration Layer ingests model outputs, extracts semantic claims, verifies them against evidence sources, and computes deviation metrics. High-deviation cases trigger human intervention workflows while low-deviation outputs are automatically approved with confidence scores.
          </p>
        </div>
      </div>
    </section>
  );
}
