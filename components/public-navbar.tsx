'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export function PublicNavbar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <header className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-50">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(113,113,122,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(113,113,122,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="relative max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 z-10">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white bg-blue-600">
            TC
          </div>
          <span className="text-lg font-semibold text-zinc-100">TrustCalib</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-zinc-300 ${isActive('/') ? 'text-blue-500' : 'text-zinc-400'}`}
          >
            Home
          </Link>
          <Link
            href="/product"
            className={`text-sm font-medium transition-colors hover:text-zinc-300 ${isActive('/product') ? 'text-blue-500' : 'text-zinc-400'}`}
          >
            Product
          </Link>
          <Link
            href="/technology"
            className={`text-sm font-medium transition-colors hover:text-zinc-300 ${isActive('/technology') ? 'text-blue-500' : 'text-zinc-400'}`}
          >
            Technology
          </Link>
          <Link
            href="/security"
            className={`text-sm font-medium transition-colors hover:text-zinc-300 ${isActive('/security') ? 'text-blue-500' : 'text-zinc-400'}`}
          >
            Security
          </Link>
          <Link
            href="/docs"
            className={`text-sm font-medium transition-colors hover:text-zinc-300 ${isActive('/docs') ? 'text-blue-500' : 'text-zinc-400'}`}
          >
            Docs
          </Link>
          <Link
            href="/dashboard"
            className={`text-sm font-medium transition-colors hover:text-zinc-300 ${isActive('/dashboard') ? 'text-blue-500' : 'text-zinc-400'}`}
          >
            Dashboard
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4">
          <SignedOut>
            <Link
              href="/sign-in"
              className="text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all"
            >
              Get Started
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all"
            >
              Dashboard
            </Link>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8"
                }
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
