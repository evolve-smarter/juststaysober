'use client'

import { useRef, useState } from 'react'

type Msg = { role: 'user' | 'assistant'; content: string }

export function CompanionChat() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: "I'm here. What's going on?" },
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [crisis, setCrisis] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  async function send() {
    const text = input.trim()
    if (!text || sending) return
    const next: Msg[] = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    setSending(true)
    setError(null)
    try {
      const res = await fetch('/api/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // The opening greeting is UI-only; the API requires the history to start with the user.
        body: JSON.stringify({ messages: next.slice(1).slice(-20) }),
      })
      const data = await res.json().catch(() => ({}))
      if (data.crisis) setCrisis(true)
      if (data.reply) {
        setMessages((m) => [...m, { role: 'assistant', content: data.reply }])
      } else {
        setError(data.error ?? 'Something went wrong. If you need help, call or text 988.')
      }
    } catch {
      setError('Connection problem. If you need help right now, call or text 988.')
    } finally {
      setSending(false)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] min-h-[24rem]">
      {crisis && (
        <div role="alert" className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-200">
          <p className="font-semibold mb-1">If you are in danger or thinking about hurting yourself:</p>
          <p>
            Call or text{' '}
            <a href="tel:988" className="underline font-semibold">988</a>, text HOME to 741741, or call{' '}
            <a href="tel:911" className="underline font-semibold">911</a>.
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${
                m.role === 'user' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-200 border border-white/10'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {sending && <p className="text-gray-500 text-sm">Typing…</p>}
        {error && <p className="text-red-300 text-sm">{error}</p>}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          send()
        }}
        className="mt-4 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={2000}
          placeholder="Type here…"
          className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  )
}
