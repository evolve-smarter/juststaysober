'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const moods = [
  { value: 'grateful', emoji: '🙏', label: 'Grateful' },
  { value: 'hopeful', emoji: '✨', label: 'Hopeful' },
  { value: 'strong', emoji: '💪', label: 'Strong' },
  { value: 'peaceful', emoji: '😌', label: 'Peaceful' },
  { value: 'struggling', emoji: '😔', label: 'Struggling' },
]

export function JournalForm() {
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim(), mood: mood || null }),
      })

      if (!res.ok) throw new Error('Failed to save')

      setContent('')
      setMood('')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900/60 border border-white/10 rounded-xl p-6 space-y-4">
      <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">
          How are you feeling? (optional)
        </label>
        <div className="flex gap-2 flex-wrap">
          {moods.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMood(mood === m.value ? '' : m.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                mood === m.value
                  ? 'bg-purple-500/30 border-purple-500/50 text-purple-200 border'
                  : 'bg-gray-800 border border-white/10 text-gray-400 hover:border-white/20'
              }`}
            >
              <span>{m.emoji}</span>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">
          What&apos;s on your mind?
        </label>
        <textarea
          required
          rows={5}
          placeholder="Write freely. This is private — only you can see your journal."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
        />
        <div className="text-gray-600 text-xs mt-1 text-right">{content.length}/2000</div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-colors"
      >
        {loading ? 'Saving...' : 'Save entry'}
      </button>
    </form>
  )
}
