'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function ModerationActions({ type, id, hidden }: { type: 'post' | 'comment'; id: string; hidden: boolean }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function act(action: 'hide' | 'dismiss' | 'restore' | 'suspend_author') {
    if (action === 'suspend_author' && !window.confirm('Hide this and suspend the author from posting?')) return
    setBusy(true)
    setError(null)
    const res = await fetch('/api/admin/moderate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [type === 'post' ? 'postId' : 'commentId']: id, action }),
    })
    setBusy(false)
    if (res.ok) router.refresh()
    else setError('Action failed. Please try again.')
  }

  const btn = 'px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-50'
  return (
    <div className="flex flex-wrap items-center gap-2">
      {!hidden && <button disabled={busy} onClick={() => act('hide')} className={`${btn} bg-amber-600 hover:bg-amber-500 text-white`}>Hide</button>}
      {hidden && <button disabled={busy} onClick={() => act('restore')} className={`${btn} bg-gray-700 hover:bg-gray-600 text-white`}>Restore</button>}
      <button disabled={busy} onClick={() => act('dismiss')} className={`${btn} bg-gray-800 hover:bg-gray-700 text-gray-200`}>Dismiss reports</button>
      <button disabled={busy} onClick={() => act('suspend_author')} className={`${btn} bg-red-700 hover:bg-red-600 text-white`}>Hide + suspend author</button>
      {error && <span className="text-sm text-red-300">{error}</span>}
    </div>
  )
}
