'use client'

import { useEffect, useState } from 'react'
import { getSobrietyStats, formatSobrietyMessage } from '@/lib/sobriety'

export function SobrietyCounter({ soberDate }: { soberDate: Date }) {
  const [stats, setStats] = useState(getSobrietyStats(new Date(soberDate)))

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getSobrietyStats(new Date(soberDate)))
    }, 1000)
    return () => clearInterval(interval)
  }, [soberDate])

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 border border-purple-500/20 rounded-2xl p-8 text-center">
      <p className="text-purple-300 text-sm uppercase tracking-widest mb-6">
        Your sobriety counter
      </p>

      <div className="flex justify-center items-end gap-6 mb-6">
        <CountUnit value={stats.days} label="Days" large />
        <CountUnit value={stats.hours} label="Hours" />
        <CountUnit value={stats.minutes} label="Min" />
        <CountUnit value={stats.seconds} label="Sec" />
      </div>

      <p className="text-purple-200 text-lg font-medium">
        {formatSobrietyMessage(stats.days)}
      </p>
    </div>
  )
}

function CountUnit({
  value,
  label,
  large = false,
}: {
  value: number
  label: string
  large?: boolean
}) {
  return (
    <div className="text-center">
      <div
        className={`font-bold text-white font-mono tabular-nums transition-all ${
          large ? 'text-6xl md:text-8xl' : 'text-3xl md:text-4xl'
        }`}
      >
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-gray-400 text-xs mt-1 uppercase tracking-widest">{label}</div>
    </div>
  )
}
