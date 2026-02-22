'use client';

import { PublicNavbar } from '@/components/public-navbar';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function SolutionsPage() {
  const solutions = [
    {
      title: 'Financial Services',
      description: 'Ensure compliance and reduce risk in credit scoring and fraud detection models.',
      use_cases: ['Credit Risk Assessment', 'Fraud Detection', 'Investment Scoring'],
    },
    {
      title: 'Healthcare',
      description: 'Maintain diagnostic accuracy and build trust in clinical AI systems.',
      use_cases: ['Diagnosis Support', 'Risk Prediction', 'Treatment Planning'],
    },
    {
      title: 'Cybersecurity',
      description: 'Detect threats reliably with confidence calibration for security models.',
      use_cases: ['Threat Detection', 'Anomaly Detection', 'Risk Classification'],
    },
    {
      title: 'E-Commerce',
      description: 'Optimize recommendations and prevent poor customer experiences.',
      use_cases: ['Product Recommendations', 'Search Ranking', 'Pricing Optimization'],
    },
  ];

  return (
    <div style={{ backgroundColor: 'var(--background)' }}>
      <PublicNavbar />

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h1 className="text-5xl font-bold mb-4">Industry Solutions</h1>
            <p className="text-xl" style={{ color: 'var(--muted-foreground)' }}>
              Tailored solutions for your industry's unique AI challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {solutions.map((solution) => (
              <div
                key={solution.title}
                className="p-8 rounded-lg border"
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                }}
              >
                <h3 className="text-2xl font-bold mb-2">{solution.title}</h3>
                <p className="mb-6" style={{ color: 'var(--muted-foreground)' }}>
                  {solution.description}
                </p>
                <div>
                  <p className="text-sm font-semibold mb-3">Use Cases:</p>
                  <ul className="space-y-2">
                    {solution.use_cases.map((use_case) => (
                      <li key={use_case} className="text-sm flex items-center gap-2">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: 'var(--primary)' }}
                        />
                        {use_case}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready for Your Industry?</h2>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
              }}
            >
              Get Started
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
