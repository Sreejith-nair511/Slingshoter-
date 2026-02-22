'use client';

import { PublicNavbar } from '@/components/public-navbar';
import { BookOpen, Code, FileText } from 'lucide-react';

export default function DocsPage() {
  const docs = [
    {
      icon: FileText,
      title: 'Getting Started',
      description: 'Learn the basics and set up your first model monitoring dashboard.',
    },
    {
      icon: Code,
      title: 'API Reference',
      description: 'Complete API documentation for integrating TrustCalib with your systems.',
    },
    {
      icon: BookOpen,
      title: 'Best Practices',
      description: 'Industry best practices for ensuring reliable AI in production.',
    },
  ];

  return (
    <div style={{ backgroundColor: 'var(--background)' }}>
      <PublicNavbar />

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h1 className="text-5xl font-bold mb-4">Documentation</h1>
            <p className="text-xl" style={{ color: 'var(--muted-foreground)' }}>
              Everything you need to get started with TrustCalib.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {docs.map((doc) => {
              const Icon = doc.icon;
              return (
                <div
                  key={doc.title}
                  className="p-8 rounded-lg border cursor-pointer transition-all hover:border-primary"
                  style={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{doc.title}</h3>
                  <p style={{ color: 'var(--muted-foreground)' }}>{doc.description}</p>
                </div>
              );
            })}
          </div>

          <div
            className="p-12 rounded-lg border"
            style={{
              backgroundColor: 'var(--secondary)',
              borderColor: 'var(--border)',
            }}
          >
            <h2 className="text-3xl font-bold mb-6">Quick Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                'Installation Guide',
                'Authentication',
                'Model Integration',
                'Webhook Setup',
                'Error Handling',
                'Rate Limits',
              ].map((link) => (
                <div key={link} className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity">
                  <span className="text-primary font-bold">→</span>
                  <span>{link}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
