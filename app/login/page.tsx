'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-12 justify-center">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white bg-blue-600">
            TC
          </div>
          <span className="text-lg font-semibold text-zinc-100">TrustCalib</span>
        </Link>

        {/* Form */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">Sign In</h1>
          <p className="text-zinc-400 text-sm">Enter your credentials to access the platform</p>
        </div>

        <form className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Sign In Button */}
          <button className="w-full mt-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-all">
            Sign In
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-zinc-400 mt-6">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-500 hover:text-blue-400 font-medium transition">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
