'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ProfileFormProps {
  user: { id: string; name: string; bio: string; email: string }
  sobrietyRecord: {
    soberDate: string
    substance: string
    isPublic: boolean
  } | null
}

export function ProfileForm({ user, sobrietyRecord }: ProfileFormProps) {
  const [name, setName] = useState(user.name)
  const [bio, setBio] = useState(user.bio)
  const [soberDate, setSoberDate] = useState(sobrietyRecord?.soberDate ?? '')
  const [substance, setSubstance] = useState(sobrietyRecord?.substance ?? 'alcohol')
  const [isPublic, setIsPublic] = useState(sobrietyRecord?.isPublic ?? true)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSaved(false)

    try {
      // Update profile
      await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio }),
      })

      // Update sobriety record if date is set
      if (soberDate) {
        await fetch('/api/sobriety', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ soberDate, substance, isPublic }),
        })
      }

      setSaved(true)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile info */}
      <div className="bg-gray-900/60 border border-white/10 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Personal Info</h2>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Display Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="How should we call you?"
            className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="A few words about your journey (optional)"
            className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-1">Email</label>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
      </div>

      {/* Sobriety record */}
      <div className="bg-gray-900/60 border border-white/10 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Sobriety Record</h2>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Sobriety Date</label>
          <input
            type="date"
            value={soberDate}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => setSoberDate(e.target.value)}
            className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Recovering from</label>
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

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="rounded"
          />
          <div>
            <span className="text-gray-300 text-sm font-medium">Show sobriety days publicly</span>
            <p className="text-gray-500 text-xs mt-0.5">
              Let others see your sobriety counter on your profile.
            </p>
          </div>
        </label>
      </div>

      {saved && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-green-400 text-sm text-center">
          ✓ Profile saved
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium transition-colors"
      >
        {loading ? 'Saving...' : 'Save changes'}
      </button>
    </form>
  )
}
