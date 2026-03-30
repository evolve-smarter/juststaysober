import { useState, useEffect } from 'react'

const QUOTES = [
  { text: "One day at a time.", source: "AA Big Book" },
  { text: "Recovery is not a race. You don't have to feel guilty if it takes you longer than you thought.", source: "Anonymous" },
  { text: "The first step towards getting somewhere is to decide you're not going to stay where you are.", source: "J.P. Morgan" },
  { text: "No matter how far down the scale we have gone, we will see how our experience can benefit others.", source: "AA Big Book" },
  { text: "Progress, not perfection.", source: "AA Slogan" },
  { text: "You are not a drop in the ocean. You are the entire ocean in a drop.", source: "Rumi" },
  { text: "Surrender to win.", source: "NA Slogan" },
]

function getDaysSober(startDate) {
  if (!startDate) return null
  const now = new Date()
  const start = new Date(startDate)
  const diff = now - start
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
}

export default function HomeScreen({ onNavigate }) {
  const [soberDate, setSoberDate] = useState(() => localStorage.getItem('jss_sober_date') || '')
  const [editing, setEditing] = useState(false)
  const [tempDate, setTempDate] = useState(soberDate)
  const quote = QUOTES[new Date().getDate() % QUOTES.length]
  const days = getDaysSober(soberDate)

  const saveDate = () => {
    localStorage.setItem('jss_sober_date', tempDate)
    setSoberDate(tempDate)
    setEditing(false)
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '0 1.25rem 2rem' }}>
      {/* Header */}
      <div style={{ padding: '1.25rem 0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700 }}>
            Just<span style={{ color: 'var(--mint)' }}>Stay</span>Sober
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <div style={{
          width: '2.25rem', height: '2.25rem', borderRadius: '50%',
          background: 'var(--mint-dim)', border: '1px solid var(--mint-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--mint)" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="8" r="4"/>
            <path d="M20 21a8 8 0 1 0-16 0"/>
          </svg>
        </div>
      </div>

      {/* Sobriety Counter */}
      <div
        onClick={() => { setEditing(true); setTempDate(soberDate); }}
        style={{
          background: 'var(--bg-2)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '2rem',
          textAlign: 'center',
          marginBottom: '1rem',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 50% 0%, rgba(79,255,176,0.06), transparent 70%)',
          pointerEvents: 'none',
        }} />

        {days !== null ? (
          <>
            <div style={{ fontSize: '4.5rem', fontWeight: 700, color: 'var(--mint)', lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>
              {days.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem' }}>
              Days Sober
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.75rem' }}>
              Tap to update your date
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.5rem' }}>
              Set your sobriety date
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Tap to start your counter
            </div>
          </>
        )}
      </div>

      {/* Edit Date Modal */}
      {editing && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          zIndex: 200, display: 'flex', alignItems: 'flex-end',
          backdropFilter: 'blur(4px)',
        }} onClick={() => setEditing(false)}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', background: 'var(--bg-2)',
              borderRadius: '20px 20px 0 0',
              border: '1px solid var(--border)',
              padding: '2rem 1.5rem',
            }}
          >
            <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Your Sobriety Date</div>
            <input
              type="date"
              value={tempDate}
              onChange={e => setTempDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              style={{
                width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)',
                color: 'var(--text)', padding: '0.85rem 1rem', borderRadius: '12px',
                fontSize: '1rem', marginBottom: '1rem', outline: 'none',
              }}
            />
            <button
              onClick={saveDate}
              style={{
                width: '100%', background: 'var(--mint)', color: '#0d1117',
                fontWeight: 600, fontSize: '0.95rem', padding: '0.9rem',
                borderRadius: '100px', border: 'none',
              }}
            >
              Save Date
            </button>
          </div>
        </div>
      )}

      {/* Daily Quote */}
      <div style={{
        background: 'var(--bg-2)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '1.25rem',
        marginBottom: '1rem',
        borderLeft: '2px solid var(--mint)',
      }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--mint)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
          Daily Reflection
        </div>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.6, marginBottom: '0.5rem' }}>
          "{quote.text}"
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>— {quote.source}</p>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <button
          onClick={() => onNavigate('meetings')}
          style={{
            background: 'var(--bg-2)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '1.25rem 1rem',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
            gap: '0.6rem', transition: 'border-color 0.2s',
          }}
        >
          <div style={{
            width: '2.25rem', height: '2.25rem', borderRadius: '10px',
            background: 'var(--mint-dim)', border: '1px solid var(--mint-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--mint)" strokeWidth="1.5" strokeLinecap="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.2rem' }}>Find a Meeting</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>All fellowships near you</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('guide')}
          style={{
            background: 'var(--bg-2)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '1.25rem 1rem',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
            gap: '0.6rem', transition: 'border-color 0.2s',
          }}
        >
          <div style={{
            width: '2.25rem', height: '2.25rem', borderRadius: '10px',
            background: 'var(--purple-dim)', border: '1px solid rgba(123,97,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="1.5" strokeLinecap="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.2rem' }}>Sober Guide</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI companion, 24/7</div>
          </div>
        </button>
      </div>

      {/* Upcoming meetings teaser */}
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
          Meetings Today
        </div>
        {[
          { name: 'Serenity Group', type: 'AA', time: '7:30 PM', dist: '0.4 mi' },
          { name: 'Tuesday Night SMART', type: 'SMART', time: '6:00 PM', dist: '1.1 mi' },
        ].map((m, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.9rem 0', borderBottom: '1px solid var(--border)',
          }}>
            <div>
              <div style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{m.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.time} &middot; {m.dist}</div>
            </div>
            <span style={{
              background: 'var(--mint-dim)', color: 'var(--mint)',
              fontSize: '0.65rem', fontWeight: 700, padding: '0.25rem 0.6rem',
              borderRadius: '100px', letterSpacing: '0.04em',
            }}>{m.type}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
