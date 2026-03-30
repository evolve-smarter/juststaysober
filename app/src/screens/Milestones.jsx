import { useState } from 'react'

const MILESTONES = [
  { id: '24h', label: '24 Hours', days: 1, icon: '◎', desc: 'The hardest step is the first one.' },
  { id: '30d', label: '30 Days', days: 30, icon: '◈', desc: 'A full month of choosing yourself.' },
  { id: '60d', label: '60 Days', days: 60, icon: '◆', desc: 'Two months. You are doing this.' },
  { id: '90d', label: '90 Days', days: 90, icon: '✦', desc: 'The foundation is forming.' },
  { id: '6m', label: '6 Months', days: 182, icon: '❋', desc: 'Half a year of freedom.' },
  { id: '1y', label: '1 Year', days: 365, icon: '★', desc: 'One full trip around the sun, sober.' },
  { id: '5y', label: '5 Years', days: 1825, icon: '♦', desc: 'Five years. An entire life rebuilt.' },
]

function getDaysSober(startDate) {
  if (!startDate) return 0
  const now = new Date()
  const start = new Date(startDate)
  const diff = now - start
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
}

function formatDuration(days) {
  if (days < 0) return '—'
  const years = Math.floor(days / 365)
  const months = Math.floor((days % 365) / 30)
  const d = days % 30
  const parts = []
  if (years > 0) parts.push(`${years}y`)
  if (months > 0) parts.push(`${months}mo`)
  if (d > 0 || parts.length === 0) parts.push(`${d}d`)
  return parts.join(' ')
}

export default function Milestones() {
  const [soberDate, setSoberDate] = useState(() => localStorage.getItem('jss_sober_date') || '')
  const [shared, setShared] = useState(null)
  const days = getDaysSober(soberDate)

  const handleShare = (m) => {
    setShared(m.id)
    setTimeout(() => setShared(null), 2500)
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '0 1.25rem 2rem' }}>
      {/* Header */}
      <div style={{ padding: '1.25rem 0 1.25rem' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Milestones
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Every day counts.</div>
      </div>

      {/* Counter card */}
      <div style={{
        background: 'var(--bg-2)', border: '1px solid var(--border)',
        borderRadius: '20px', padding: '1.75rem',
        marginBottom: '1.5rem',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 50% 0%, rgba(79,255,176,0.07), transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '3.5rem', fontWeight: 700, color: 'var(--mint)', lineHeight: 1 }}>
            {days}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.4rem' }}>
            Days Sober
          </div>
          {days > 0 && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.4rem' }}>
              {formatDuration(days)} total
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 500 }}>
              Sobriety Date
            </div>
            <input
              type="date"
              value={soberDate}
              onChange={e => {
                setSoberDate(e.target.value)
                localStorage.setItem('jss_sober_date', e.target.value)
              }}
              max={new Date().toISOString().split('T')[0]}
              style={{
                width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)',
                color: soberDate ? 'var(--text)' : 'var(--text-dim)',
                padding: '0.65rem 0.85rem', borderRadius: '10px',
                fontSize: '0.85rem', outline: 'none',
              }}
            />
          </div>
          <div style={{ textAlign: 'center', minWidth: '60px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 500 }}>
              Progress
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--mint)' }}>
              {Math.min(100, Math.round((days / 365) * 100))}%
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>to 1yr</div>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.85rem' }}>
        Milestone Badges
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {MILESTONES.map(m => {
          const earned = days >= m.days
          const isNext = !earned && MILESTONES.find(ms => days < ms.days) === m
          const remaining = m.days - days

          return (
            <div key={m.id} style={{
              background: 'var(--bg-2)',
              border: `1px solid ${earned ? 'var(--mint-border)' : isNext ? 'var(--border)' : 'var(--border)'}`,
              borderRadius: '16px',
              padding: '1rem 1.25rem',
              display: 'flex', alignItems: 'center', gap: '1rem',
              opacity: earned ? 1 : 0.5,
              position: 'relative', overflow: 'hidden',
              transition: 'opacity 0.2s, border-color 0.2s',
            }}>
              {earned && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, rgba(79,255,176,0.04), transparent)',
                  pointerEvents: 'none',
                }} />
              )}

              <div style={{
                width: '3rem', height: '3rem', borderRadius: '14px', flexShrink: 0,
                background: earned ? 'rgba(79,255,176,0.12)' : 'var(--bg-3)',
                border: `1px solid ${earned ? 'var(--mint-border)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.25rem',
                color: earned ? 'var(--mint)' : 'var(--text-dim)',
              }}>
                {m.icon}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontWeight: 600, fontSize: '0.95rem',
                  color: earned ? 'var(--text)' : 'var(--text-muted)',
                  marginBottom: '0.2rem',
                }}>
                  {m.label}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {earned ? m.desc : `${remaining} day${remaining !== 1 ? 's' : ''} away`}
                </div>
              </div>

              {earned && (
                <button
                  onClick={() => handleShare(m)}
                  style={{
                    background: shared === m.id ? 'var(--mint)' : 'var(--mint-dim)',
                    border: '1px solid var(--mint-border)',
                    color: shared === m.id ? '#0d1117' : 'var(--mint)',
                    fontSize: '0.72rem', fontWeight: 600,
                    padding: '0.35rem 0.8rem', borderRadius: '100px',
                    flexShrink: 0, transition: 'all 0.2s',
                  }}
                >
                  {shared === m.id ? 'Shared!' : 'Share'}
                </button>
              )}

              {!earned && isNext && (
                <span style={{
                  background: 'rgba(255,150,79,0.1)', border: '1px solid rgba(255,150,79,0.2)',
                  color: '#FF964F', fontSize: '0.65rem', fontWeight: 600,
                  padding: '0.25rem 0.6rem', borderRadius: '100px', flexShrink: 0,
                  letterSpacing: '0.04em',
                }}>
                  NEXT
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Encouragement */}
      {days > 0 && (
        <div style={{
          marginTop: '1.5rem', padding: '1.25rem',
          background: 'var(--mint-dim)', border: '1px solid var(--mint-border)',
          borderRadius: '16px', textAlign: 'center',
        }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '0.95rem', color: 'var(--text)', lineHeight: 1.6 }}>
            {days === 1 ? "Day one. The most important day of them all." :
             days < 30 ? `${days} days. You're building something real.` :
             days < 365 ? `${days} days. Every single one was a choice. Keep going.` :
             `${days} days sober. You are living proof that recovery works.`}
          </p>
        </div>
      )}
    </div>
  )
}
