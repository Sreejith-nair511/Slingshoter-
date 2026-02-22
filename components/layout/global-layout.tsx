'use client';

import { ReactNode } from 'react';
import { PublicNavbar } from '../public-navbar';
import { Footer } from './footer';

export function GlobalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950">
      <PublicNavbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
