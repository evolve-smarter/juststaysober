import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'JustStaySober — Recovery Tracking & Community',
    template: '%s | JustStaySober',
  },
  description:
    'Track your sobriety journey, celebrate milestones, and connect with a community that understands. One day at a time.',
  keywords: ['sobriety', 'recovery', 'addiction', 'sober', 'AA', 'NA', 'support'],
  appleWebApp: { capable: true, title: 'JustStaySober', statusBarStyle: 'black-translucent' },
  openGraph: {
    title: 'JustStaySober',
    description: 'Your sobriety journey, tracked and celebrated.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#1e1b4b',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
