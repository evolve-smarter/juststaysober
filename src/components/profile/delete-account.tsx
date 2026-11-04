'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'

export function DeleteAccount() {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function remove() {
    setBusy(true)
    setError(null)
    const res = await fetch('/api/account', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirm: 'DELETE' }),
    })
    if (res.ok) {
      await signOut({ callbackUrl: '/' })
    } else {
      setBusy(false)
      setError('Could not delete your account. Please try again.')
    }
  }

  return (
    <section className="mt-10 rounded-xl border border-red-500/20 p-5">
      <h2 className="text-white font-semibold mb-1">Delete my account</h2>
      <p className="text-gray-400 text-sm mb-3">
        Permanently deletes your account and everything tied to it: your sobriety date, journal,
        check-ins, milestones, posts, comments and notifications. This cannot be undone.
      </p>
      {!open ? (
        <button onClick={() => setOpen(true)} className="text-sm text-red-300 hover:text-red-200 underline">
          I want to delete my account
        </button>
      ) : (
        <div className="space-y-3">
          <label className="block text-sm text-gray-300">
            Type <span className="font-mono font-bold">DELETE</span> to confirm
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mt-1 block w-full max-w-xs rounded-lg bg-gray-800 border border-white/10 px-3 py-2 text-white"
            />
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={remove}
              disabled={text !== 'DELETE' || busy}
              className="rounded-lg bg-red-700 hover:bg-red-600 disabled:opacity-40 px-4 py-2 text-sm font-medium text-white"
            >
              {busy ? 'Deleting…' : 'Permanently delete'}
            </button>
            <button onClick={() => { setOpen(false); setText('') }} className="text-sm text-gray-400 hover:text-white">Cancel</button>
          </div>
          {error && <p className="text-sm text-red-300">{error}</p>}
        </div>
      )}
    </section>
  )
}
