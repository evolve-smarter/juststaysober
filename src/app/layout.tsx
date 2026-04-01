import type { Metadata } from 'next'
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
  openGraph: {
    title: 'JustStaySober',
    description: 'Your sobriety journey, tracked and celebrated.',
    type: 'website',
  },
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
