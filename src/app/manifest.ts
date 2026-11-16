import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'JustStaySober',
    short_name: 'JustStaySober',
    description: 'Track your sobriety, celebrate milestones, and find support. One day at a time.',
    start_url: '/dashboard',
    scope: '/',
    display: 'standalone',
    background_color: '#030712',
    theme_color: '#1e1b4b',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
