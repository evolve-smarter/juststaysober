import { useState } from 'react'

const FELLOWSHIPS = ['All', 'AA', 'NA', 'CA', 'MA', 'Al-Anon', 'SMART']

const MOCK_MEETINGS = [
  { id: 1, name: 'Serenity Group', fellowship: 'AA', day: 'Today', time: '7:30 PM', address: '142 Oak Street', format: 'Open Speaker', dist: 0.4 },
  { id: 2, name: 'Tuesday Night SMART', fellowship: 'SMART', day: 'Today', time: '6:00 PM', address: '88 Elm Ave, Ste 3', format: 'Discussion', dist: 1.1 },
  { id: 3, name: 'Al-Anon Family Group', fellowship: 'Al-Anon', day: 'Today', time: '7:00 PM', address: 'First Methodist Church', format: 'Closed', dist: 0.8 },
  { id: 4, name: 'Living Free — NA', fellowship: 'NA', day: 'Tomorrow', time: '8:00 PM', address: '910 Recovery Blvd', format: 'Open Discussion', dist: 1.4 },
  { id: 5, name: 'Cocaine Anonymous West', fellowship: 'CA', day: 'Tomorrow', time: '7:00 PM', address: '33 Hope Lane', format: 'Speaker', dist: 2.2 },
  { id: 6, name: 'Marijuana Anonymous', fellowship: 'MA', day: 'Wed', time: '6:30 PM', address: '7 Pine Road', format: 'Discussion', dist: 1.8 },
  { id: 7, name: 'Step Into Freedom', fellowship: 'AA', day: 'Wed', time: '7:00 AM', address: '200 Sunrise Dr', format: 'Big Book', dist: 0.6 },
  { id: 8, name: 'SMART Recovery Thursday', fellowship: 'SMART', day: 'Thu', time: '5:30 PM', address: 'Community Center Rm 4', format: 'Tools Meeting', dist: 0.9 },
]

const FELLOWSHIP_COLORS = {
  AA: { bg: 'rgba(79,255,176,0.1)', text: '#4FFFB0', border: 'rgba(79,255,176,0.2)' },
  NA: { bg: 'rgba(123,97,255,0.1)', text: '#7B61FF', border: 'rgba(123,97,255,0.25)' },
  CA: { bg: 'rgba(255,199,79,0.1)', text: '#FFC74F', border: 'rgba(255,199,79,0.2)' },
  MA: { bg: 'rgba(79,200,255,0.1)', text: '#4FC8FF', border: 'rgba(79,200,255,0.2)' },
  'Al-Anon': { bg: 'rgba(255,120,160,0.1)', text: '#FF78A0', border: 'rgba(255,120,160,0.2)' },
  SMART: { bg: 'rgba(255,150,79,0.1)', text: '#FF964F', border: 'rgba(255,150,79,0.2)' },
}

export default function FindMeetings() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = MOCK_MEETINGS.filter(m => {
    const matchFellowship = filter === 'All' || m.fellowship === filter
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.fellowship.toLowerCase().includes(search.toLowerCase())
    return matchFellowship && matchSearch
  })

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        padding: '1.25rem 1.25rem 0.75rem',
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', fontFamily: "'Playfair Display', serif" }}>
          Find a Meeting
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
          <svg style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search meetings..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', background: 'var(--bg-2)', border: '1px solid var(--border)',
              color: 'var(--text)', padding: '0.75rem 1rem 0.75rem 2.5rem',
              borderRadius: '12px', fontSize: '0.9rem', outline: 'none',
            }}
          />
        </div>

        {/* Location row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--mint)" strokeWidth="2" strokeLinecap="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          Using your location &middot; <span style={{ color: 'var(--mint)', fontSize: '0.8rem' }}>Change</span>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {FELLOWSHIPS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? 'var(--mint)' : 'var(--bg-2)',
                color: filter === f ? '#0d1117' : 'var(--text-muted)',
                border: `1px solid ${filter === f ? 'var(--mint)' : 'var(--border)'}`,
                borderRadius: '100px',
                padding: '0.4rem 0.9rem',
                fontSize: '0.8rem',
                fontWeight: filter === f ? 700 : 400,
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.2s',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Map placeholder */}
      <div style={{
        height: '140px', flexShrink: 0,
        background: 'var(--bg-3)', position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(79,255,176,0.015) 20px, rgba(79,255,176,0.015) 21px)',
        }} />
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--mint)" strokeWidth="1.5" strokeLinecap="round" style={{ opacity: 0.5 }}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.4rem' }}>Map view coming soon</div>
        </div>
      </div>

      {/* Meeting list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 1.25rem 1.25rem' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            No meetings found. Try a different filter.
          </div>
        ) : (
          filtered.map((m, i) => {
            const colors = FELLOWSHIP_COLORS[m.fellowship] || FELLOWSHIP_COLORS.AA
            return (
              <div key={m.id} style={{
                padding: '1rem 0',
                borderBottom: '1px solid var(--border)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                gap: '1rem',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem', color: 'var(--text)' }}>
                    {m.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    {m.day} &middot; {m.time} &middot; {m.format}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    {m.address} &middot; {m.dist} mi
                  </div>
                </div>
                <span style={{
                  background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`,
                  fontSize: '0.65rem', fontWeight: 700, padding: '0.25rem 0.6rem',
                  borderRadius: '100px', letterSpacing: '0.04em', flexShrink: 0,
                }}>
                  {m.fellowship}
                </span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
