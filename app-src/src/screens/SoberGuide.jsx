import { useState, useRef, useEffect } from 'react'

// Cloudflare Worker proxy URL — keeps the Anthropic API key off the client
// After deploying the worker, update this URL to your actual worker subdomain
const PROXY_URL = 'https://juststaysober-proxy.beqprod.workers.dev'

const SYSTEM_PROMPT = `You are a compassionate recovery support companion. You provide emotional support, information about recovery pathways, and encouragement. You are not a replacement for professional treatment or a sponsor. You always encourage connection with human support. Keep responses warm, concise (2-4 sentences), and grounded. Never give medical advice. If someone is in crisis, always mention calling or texting 988.`

const STUB_RESPONSES = [
  "I hear you. That sounds really hard. You don't have to be alone with this. Can you tell me more about what's going on?",
  "That craving is real, and it makes sense. Remember — cravings pass. Usually within 15-30 minutes. What can we do together right now to get through it?",
  "You're not weak for feeling this. Recovery is one of the hardest things a person can do. I'm right here with you.",
  "Have you tried calling your sponsor, or reaching out to someone in your network? Sometimes just hearing a familiar voice helps.",
  "Let's take a breath together. Breathe in for 4 counts... hold for 4... out for 6. You're doing this.",
  "What you're feeling is temporary. The relief you're chasing is temporary too — but what you've built is real.",
  "I'm proud of you for reaching out instead of reaching for something else. That took courage.",
  "Tell me about a time you got through something hard before. What helped you then?",
]

const OPENER = {
  id: 'opener',
  role: 'ai',
  text: "I'm here. What's going on?",
  ts: new Date(),
}

function formatTime(d) {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

async function callAnthropic(messages) {
  const apiMessages = messages
    .filter(m => m.id !== 'opener' || m.role === 'ai')
    .map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }))

  // Call our Cloudflare Worker proxy — no API key needed on the client
  const res = await fetch(PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: apiMessages,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Proxy error ${res.status}: ${err.slice(0, 100)}`)
  }

  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data.content?.[0]?.text || "I'm here with you."
}

export default function SoberGuide() {
  const [messages, setMessages] = useState([OPENER])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [apiEnabled, setApiEnabled] = useState(true) // Always enabled — key lives in Cloudflare Worker proxy
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const responseIndex = useRef(0)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || typing) return
    setInput('')

    const userMsg = { id: Date.now(), role: 'user', text, ts: new Date() }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setTyping(true)

    try {
      let response
      if (apiEnabled) {
        response = await callAnthropic(nextMessages)
      } else {
        // Stub fallback
        await new Promise(r => setTimeout(r, 1200 + Math.random() * 800))
        response = STUB_RESPONSES[responseIndex.current % STUB_RESPONSES.length]
        responseIndex.current++
      }
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: response, ts: new Date() }])
    } catch (err) {
      console.warn('Sober Guide AI error:', err.message)
      // Graceful fallback
      const fallback = STUB_RESPONSES[responseIndex.current % STUB_RESPONSES.length]
      responseIndex.current++
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: fallback, ts: new Date() }])
    } finally {
      setTyping(false)
    }
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        padding: '1.25rem 1.25rem 1rem',
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: '0.85rem',
      }}>
        <div style={{
          width: '2.5rem', height: '2.5rem', borderRadius: '50%',
          background: 'var(--purple-dim)',
          border: '1px solid rgba(123,97,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          position: 'relative',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="1.5" strokeLinecap="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <div style={{
            position: 'absolute', bottom: 1, right: 1,
            width: '8px', height: '8px', background: 'var(--mint)',
            borderRadius: '50%', border: '1.5px solid var(--bg)',
          }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Sober Guide</div>
          <div style={{ fontSize: '0.72rem', color: apiEnabled ? 'var(--mint)' : 'var(--text-muted)', fontWeight: 500 }}>
            {apiEnabled ? 'AI · Available 24/7' : 'Companion mode · 24/7'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {!apiEnabled && (
            <button
              onClick={() => setApiEnabled(true)}
              title="Enable AI responses"
              style={{
                background: 'var(--purple-dim)', border: '1px solid rgba(123,97,255,0.2)',
                color: 'var(--purple)', fontSize: '0.7rem', fontWeight: 600,
                padding: '0.25rem 0.65rem', borderRadius: '100px', letterSpacing: '0.04em',
              }}
            >AI OFF</button>
          )}
          {apiEnabled && (
            <div style={{
              background: 'var(--purple-dim)', border: '1px solid rgba(123,97,255,0.2)',
              color: 'var(--purple)', fontSize: '0.7rem', fontWeight: 600,
              padding: '0.25rem 0.65rem', borderRadius: '100px', letterSpacing: '0.04em',
            }}>AI</div>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{
        padding: '0.6rem 1.25rem',
        background: 'rgba(255,150,79,0.06)',
        borderBottom: '1px solid rgba(255,150,79,0.1)',
        fontSize: '0.72rem', color: 'rgba(255,150,79,0.8)',
        flexShrink: 0,
      }}>
        AI companion, not a therapist. Crisis? Call or text{' '}
        <a href="tel:988" style={{ color: 'rgba(255,150,79,0.9)', fontWeight: 700, textDecoration: 'none' }}>988</a>
        {' '}anytime.
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: '0.85rem',
          }}>
            <div style={{ maxWidth: '80%' }}>
              <div style={{
                background: msg.role === 'user' ? 'var(--mint)' : 'var(--bg-2)',
                color: msg.role === 'user' ? '#0d1117' : 'var(--text)',
                border: `1px solid ${msg.role === 'user' ? 'transparent' : 'var(--border)'}`,
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                padding: '0.75rem 1rem',
                fontSize: '0.9rem',
                lineHeight: 1.55,
              }}>
                {msg.text}
              </div>
              <div style={{
                fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '0.25rem',
                textAlign: msg.role === 'user' ? 'right' : 'left',
                paddingLeft: msg.role === 'ai' ? '0.25rem' : 0,
                paddingRight: msg.role === 'user' ? '0.25rem' : 0,
              }}>
                {formatTime(msg.ts)}
              </div>
            </div>
          </div>
        ))}

        {typing && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.85rem' }}>
            <div style={{
              background: 'var(--bg-2)', border: '1px solid var(--border)',
              borderRadius: '18px 18px 18px 4px', padding: '0.75rem 1.1rem',
              display: 'flex', gap: '4px', alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: 'var(--text-muted)',
                  animation: 'typing-dot 1.4s ease-in-out infinite',
                  animationDelay: `${i * 0.2}s`,
                }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div style={{
        padding: '0.5rem 1.25rem',
        display: 'flex', gap: '0.5rem', overflowX: 'auto',
        borderTop: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        {["I'm craving", "I need support", "I relapsed", "I'm doing okay", "Tell me about AA", "How do I find a sponsor?"].map(q => (
          <button
            key={q}
            onClick={() => { setInput(q); inputRef.current?.focus(); }}
            style={{
              background: 'var(--bg-2)', border: '1px solid var(--border)',
              color: 'var(--text-muted)', fontSize: '0.75rem', padding: '0.4rem 0.8rem',
              borderRadius: '100px', whiteSpace: 'nowrap', flexShrink: 0,
              transition: 'border-color 0.2s, color 0.2s',
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{
        padding: '0.75rem 1.25rem',
        paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0))',
        borderTop: '1px solid var(--border)',
        display: 'flex', gap: '0.6rem', alignItems: 'flex-end',
        flexShrink: 0,
      }}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder="What's going on..."
          style={{
            flex: 1, background: 'var(--bg-2)', border: '1px solid var(--border)',
            color: 'var(--text)', padding: '0.75rem 1rem', borderRadius: '12px',
            fontSize: '0.9rem', outline: 'none', resize: 'none',
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || typing}
          style={{
            width: '2.5rem', height: '2.5rem', borderRadius: '50%',
            background: (input.trim() && !typing) ? 'var(--mint)' : 'var(--bg-2)',
            border: `1px solid ${(input.trim() && !typing) ? 'transparent' : 'var(--border)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s', flexShrink: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke={(input.trim() && !typing) ? '#0d1117' : 'var(--text-muted)'}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes typing-dot {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-3px); }
        }
      `}</style>
    </div>
  )
}
