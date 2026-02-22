'use client';

import { PublicNavbar } from '@/components/public-navbar';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ProductPage() {
  return (
    <div style={{ backgroundColor: 'var(--background)' }}>
      <PublicNavbar />

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h1 className="text-5xl font-bold mb-4">Product Overview</h1>
            <p className="text-xl" style={{ color: 'var(--muted-foreground)' }}>
              Deep-dive into the TrustCalib platform and how it works.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-4">AI Reliability at Scale</h2>
              <p className="mb-4" style={{ color: 'var(--muted-foreground)' }}>
                TrustCalib provides real-time visibility into your AI models' reliability and confidence calibration.
              </p>
              <p className="mb-6" style={{ color: 'var(--muted-foreground)' }}>
                We help you identify when models are confident but wrong, catching issues before they impact production.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                }}
              >
                Try It Free
                <ArrowRight size={20} />
              </Link>
            </div>
            <div
              className="p-8 rounded-lg border"
              style={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
              }}
            >
              <h3 className="text-2xl font-bold mb-6">Platform Features</h3>
              <ul className="space-y-4">
                {[
                  'Real-time model monitoring',
                  'Confidence calibration analysis',
                  'Risk detection and alerting',
                  'Audit logging and compliance',
                  'Team collaboration tools',
                  'API access and integrations',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: 'var(--primary)' }}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-zinc-100 dark:bg-zinc-900 p-12 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {['Deploy', 'Monitor', 'Analyze', 'Optimize'].map((step, idx) => (
                <div key={step} className="text-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-white"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    {idx + 1}
                  </div>
                  <p className="font-semibold">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
