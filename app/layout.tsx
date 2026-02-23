import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ClerkProvider } from '@clerk/nextjs'
import { QueryProvider } from '@/lib/query-provider'
import './globals.css'

const geist = Geist({ 
  subsets: ["latin"],
  variable: '--font-geist',
});

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export const metadata: Metadata = {
  title: {
    default: 'Trust Calibration Layer',
    template: '%s | Trust Calibration Layer',
  },
  description: 'Verification-first AI trust intelligence platform for monitoring and calibrating model reliability.',
  metadataBase: new URL('https://trustcalib.ai'),
  keywords: ['AI trust', 'model calibration', 'AI verification', 'trust intelligence', 'model reliability'],
  authors: [{ name: 'Trust Calibration Layer' }],
  creator: 'Trust Calibration Layer',
  publisher: 'Trust Calibration Layer',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://trustcalib.ai',
    title: 'Trust Calibration Layer',
    description: 'Verification-first AI trust intelligence platform for monitoring and calibrating model reliability.',
    siteName: 'Trust Calibration Layer',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trust Calibration Layer',
    description: 'Verification-first AI trust intelligence platform for monitoring and calibrating model reliability.',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
          <QueryProvider>
            {children}
          </QueryProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
