import { useState } from 'react'

const SLIDES = [
  {
    icon: (
      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="var(--mint)" strokeWidth="1.2" strokeLinecap="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" fill="rgba(79,255,176,0.08)" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
        <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5"/>
        <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5"/>
      </svg>
    ),
    headline: "You're not alone.",
    body: "Just Stay Sober is a safe space for anyone in recovery — no judgment, no rules, just support.",
  },
  {
    icon: (
      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="var(--mint)" strokeWidth="1.2" strokeLinecap="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="rgba(79,255,176,0.08)"/>
        <circle cx="12" cy="10" r="3" fill="rgba(79,255,176,0.2)"/>
      </svg>
    ),
    headline: "Find your meeting.",
    body: "AA, NA, Al-Anon, SMART Recovery and more — all in one place. Real meetings near you, updated daily.",
  },
  {
    icon: (
      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="var(--mint)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" fill="none"/>
      </svg>
    ),
    headline: "Count every day.",
    body: "Track your sobriety, earn milestone badges, and let your progress remind you how far you've come.",
  },
  {
    icon: (
      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="1.2" strokeLinecap="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="rgba(123,97,255,0.08)"/>
      </svg>
    ),
    headline: "Talk it out.",
    body: "Sober Guide is an AI companion available 24/7. Not a replacement for your sponsor — just extra support when you need it.",
    final: true,
  },
]

export default function Onboarding({ onComplete }) {
  const [slide, setSlide] = useState(0)
  const [soberDate, setSoberDate] = useState('')
  const [showDateStep, setShowDateStep] = useState(false)

  const current = SLIDES[slide]
  const isLast = slide === SLIDES.length - 1

  const advance = () => {
    if (isLast) {
      setShowDateStep(true)
    } else {
      setSlide(s => s + 1)
    }
  }

  const finish = () => {
    if (soberDate) {
      localStorage.setItem('jss_sober_date', soberDate)
    }
    localStorage.setItem('jss_onboarded', '1')
    onComplete()
  }

  if (showDateStep) {
    return (
      <div style={{
        height: '100dvh', display: 'flex', flexDirection: 'column',
        background: 'var(--bg)', padding: '2rem 1.75rem',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'rgba(79,255,176,0.08)', border: '1px solid rgba(79,255,176,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '1.75rem',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--mint)" strokeWidth="1.5" strokeLinecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>

        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.75rem', color: 'var(--text)' }}>
          When did you get sober?
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '280px' }}>
          Set your sobriety date and we'll track your days, weeks, and milestones.
        </p>

        <input
          type="date"
          value={soberDate}
          onChange={e => setSoberDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          style={{
            width: '100%', maxWidth: '320px',
            background: 'var(--bg-2)', border: '1px solid var(--border)',
            color: soberDate ? 'var(--text)' : 'var(--text-dim)',
            padding: '0.9rem 1rem', borderRadius: '14px',
            fontSize: '1rem', marginBottom: '1rem', outline: 'none',
            textAlign: 'center',
          }}
        />

        <button
          onClick={finish}
          style={{
            width: '100%', maxWidth: '320px',
            background: 'var(--mint)', color: '#0d1117',
            fontWeight: 700, fontSize: '0.95rem',
            padding: '0.95rem', borderRadius: '100px', border: 'none',
            marginBottom: '0.75rem',
          }}
        >
          {soberDate ? "Let's go" : "Skip for now"}
        </button>

        {soberDate && (
          <button
            onClick={finish}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer' }}
          >
            Skip
          </button>
        )}
      </div>
    )
  }

  return (
    <div style={{
      height: '100dvh', display: 'flex', flexDirection: 'column',
      background: 'var(--bg)', padding: '2rem 1.75rem',
    }}>
      {/* Skip */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button
          onClick={finish}
          style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '0.85rem', cursor: 'pointer' }}
        >
          Skip
        </button>
      </div>

      {/* Slide content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '100px', height: '100px', borderRadius: '28px',
          background: 'var(--bg-2)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '2rem',
          boxShadow: '0 0 40px rgba(79,255,176,0.06)',
        }}>
          {current.icon}
        </div>

        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.75rem', fontWeight: 700,
          textAlign: 'center', marginBottom: '1rem',
          color: 'var(--text)', lineHeight: 1.25,
        }}>
          {current.headline}
        </h2>
        <p style={{
          fontSize: '0.95rem', color: 'var(--text-muted)',
          textAlign: 'center', lineHeight: 1.65,
          maxWidth: '300px',
        }}>
          {current.body}
        </p>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '2rem' }}>
        {SLIDES.map((_, i) => (
          <div key={i} style={{
            width: i === slide ? '20px' : '6px',
            height: '6px',
            borderRadius: '100px',
            background: i === slide ? 'var(--mint)' : 'var(--border)',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }} />
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={advance}
        style={{
          width: '100%',
          background: 'var(--mint)', color: '#0d1117',
          fontWeight: 700, fontSize: '0.95rem',
          padding: '1rem', borderRadius: '100px', border: 'none',
          marginBottom: '1rem',
        }}
      >
        {isLast ? 'Get Started' : 'Next'}
      </button>
    </div>
  )
}
