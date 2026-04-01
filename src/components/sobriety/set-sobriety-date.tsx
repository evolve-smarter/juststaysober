'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function SetSobrietyDate() {
  const [date, setDate] = useState('')
  const [substance, setSubstance] = useState('alcohol')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!date) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/sobriety', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ soberDate: date, substance }),
      })

      if (!res.ok) throw new Error('Failed to save')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">
          My sobriety date
        </label>
        <input
          type="date"
          required
          max={new Date().toISOString().split('T')[0]}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">
          What am I recovering from?
        </label>
        <select
          value={substance}
          onChange={(e) => setSubstance(e.target.value)}
          className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
        >
          <option value="alcohol">Alcohol</option>
          <option value="drugs">Drugs</option>
          <option value="opioids">Opioids</option>
          <option value="multiple">Multiple substances</option>
          <option value="other">Other</option>
          <option value="prefer_not_to_say">Prefer not to say</option>
        </select>
      </div>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !date}
        className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-colors"
      >
        {loading ? 'Saving...' : 'Start my journey'}
      </button>

      <p className="text-gray-500 text-xs text-center">
        You can change this later in your profile.
      </p>
    </form>
  )
}
