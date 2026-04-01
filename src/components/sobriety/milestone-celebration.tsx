'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Milestone {
  emoji: string
  label: string
  description: string
  days: number
}

export function MilestoneCelebration({ milestone }: { milestone: Milestone }) {
  const [show, setShow] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Auto-dismiss after 10 seconds
    const timer = setTimeout(() => setShow(false), 10000)
    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Confetti effect via CSS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ['#a855f7', '#ec4899', '#f59e0b', '#10b981'][Math.floor(Math.random() * 4)],
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="bg-gray-900 border border-purple-500/30 rounded-2xl p-8 max-w-md w-full text-center relative z-10 shadow-2xl">
        <div className="text-7xl mb-4 animate-bounce">{milestone.emoji}</div>
        <h2 className="text-3xl font-bold text-white mb-2">
          {milestone.label}!
        </h2>
        <p className="text-purple-300 text-lg font-medium mb-3">
          {milestone.days} days sober
        </p>
        <p className="text-gray-400 mb-6">{milestone.description}</p>

        <div className="space-y-3">
          <button
            onClick={() => {
              router.push('/community')
              setShow(false)
            }}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Share with the community 🤝
          </button>
          <a
            href="https://www.etsy.com/shop/GratefulGestures"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-pink-600/20 hover:bg-pink-600/30 text-pink-300 border border-pink-500/20 px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Celebrate with a gift 🎁
          </a>
          <button
            onClick={() => setShow(false)}
            className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
