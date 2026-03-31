import { useState, useEffect, useCallback } from 'react'

const FELLOWSHIPS = ['All', 'AA', 'NA', 'CA', 'MA', 'Al-Anon', 'SMART']

const FELLOWSHIP_COLORS = {
  AA: { bg: 'rgba(79,255,176,0.1)', text: '#4FFFB0', border: 'rgba(79,255,176,0.2)' },
  NA: { bg: 'rgba(123,97,255,0.1)', text: '#7B61FF', border: 'rgba(123,97,255,0.25)' },
  CA: { bg: 'rgba(255,199,79,0.1)', text: '#FFC74F', border: 'rgba(255,199,79,0.2)' },
  MA: { bg: 'rgba(79,200,255,0.1)', text: '#4FC8FF', border: 'rgba(79,200,255,0.2)' },
  'Al-Anon': { bg: 'rgba(255,120,160,0.1)', text: '#FF78A0', border: 'rgba(255,120,160,0.2)' },
  SMART: { bg: 'rgba(255,150,79,0.1)', text: '#FF964F', border: 'rgba(255,150,79,0.2)' },
}

// Map Meeting Guide type codes to fellowship labels
function inferFellowship(meeting) {
  const types = (meeting.types || []).map(t => t.toLowerCase())
  const name = (meeting.name || '').toLowerCase()
  const group = (meeting.group || '').toLowerCase()
  if (types.includes('na') || name.includes('narcotics') || group.includes('narcotics')) return 'NA'
  if (name.includes('cocaine') || types.includes('ca')) return 'CA'
  if (name.includes('marijuana') || types.includes('ma')) return 'MA'
  if (name.includes('al-anon') || name.includes('alanon') || name.includes('alateen')) return 'Al-Anon'
  if (name.includes('smart') || types.includes('smart')) return 'SMART'
  return 'AA' // default
}

function formatMeetingDay(meeting) {
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const today = new Date().getDay()
  const meetingDay = parseInt(meeting.day, 10)
  if (isNaN(meetingDay)) return meeting.day || '—'
  if (meetingDay === today) return 'Today'
  if (meetingDay === (today + 1) % 7) return 'Tomorrow'
  return days[meetingDay] || '—'
}

function formatTime(timeStr) {
  if (!timeStr) return ''
  // HH:MM 24hr → 12hr
  const [h, m] = timeStr.split(':').map(Number)
  if (isNaN(h)) return timeStr
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8 // miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const FALLBACK_MEETINGS = [
  { id: 1, name: 'Serenity Group', fellowship: 'AA', day: 'Today', time: '7:30 PM', address: '142 Oak Street', format: 'Open Speaker', dist: 0.4 },
  { id: 2, name: 'Tuesday Night SMART', fellowship: 'SMART', day: 'Today', time: '6:00 PM', address: '88 Elm Ave, Ste 3', format: 'Discussion', dist: 1.1 },
  { id: 3, name: 'Al-Anon Family Group', fellowship: 'Al-Anon', day: 'Today', time: '7:00 PM', address: 'First Methodist Church', format: 'Closed', dist: 0.8 },
  { id: 4, name: 'Living Free — NA', fellowship: 'NA', day: 'Tomorrow', time: '8:00 PM', address: '910 Recovery Blvd', format: 'Open Discussion', dist: 1.4 },
  { id: 5, name: 'Cocaine Anonymous West', fellowship: 'CA', day: 'Tomorrow', time: '7:00 PM', address: '33 Hope Lane', format: 'Speaker', dist: 2.2 },
  { id: 6, name: 'Marijuana Anonymous', fellowship: 'MA', day: 'Wed', time: '6:30 PM', address: '7 Pine Road', format: 'Discussion', dist: 1.8 },
  { id: 7, name: 'Step Into Freedom', fellowship: 'AA', day: 'Wed', time: '7:00 AM', address: '200 Sunrise Dr', format: 'Big Book', dist: 0.6 },
  { id: 8, name: 'SMART Recovery Thursday', fellowship: 'SMART', day: 'Thu', time: '5:30 PM', address: 'Community Center Rm 4', format: 'Tools Meeting', dist: 0.9 },
]

export default function FindMeetings() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [usingFallback, setUsingFallback] = useState(false)
  const [location, setLocation] = useState(null)
  const [locationLabel, setLocationLabel] = useState('Detecting location…')

  const fetchMeetings = useCallback(async (lat, lon) => {
    setLoading(true)
    setError(null)
    setUsingFallback(false)
    try {
      const res = await fetch(
        `https://api.meeting.guide/meetings?latitude=${lat}&longitude=${lon}&distance=10`,
        { headers: { Accept: 'application/json' } }
      )
      if (!res.ok) throw new Error(`API returned ${res.status}`)
      const data = await res.json()
      if (!Array.isArray(data) || data.length === 0) throw new Error('No meetings returned')

      const mapped = data.slice(0, 60).map((m, i) => {
        const fellowship = inferFellowship(m)
        const dist = (m.latitude && m.longitude)
          ? parseFloat(haversineDistance(lat, lon, parseFloat(m.latitude), parseFloat(m.longitude)).toFixed(1))
          : null
        return {
          id: m.slug || i,
          name: m.name || 'Unnamed Meeting',
          fellowship,
          day: formatMeetingDay(m),
          time: formatTime(m.time),
          address: [m.address, m.city].filter(Boolean).join(', ') || m.location || 'Location TBD',
          format: (m.types || []).filter(t => !['O','C'].includes(t)).slice(0, 2).join(', ') || 'Meeting',
          dist,
          isOnline: (m.types || []).includes('ONL') || (m.types || []).includes('TC'),
        }
      })
      // Sort by distance, then day, keeping online meetings separate
      mapped.sort((a, b) => {
        if (a.isOnline !== b.isOnline) return a.isOnline ? 1 : -1
        if (a.dist !== null && b.dist !== null) return a.dist - b.dist
        return 0
      })
      setMeetings(mapped)
    } catch (err) {
      console.warn('Meeting Guide API failed:', err.message)
      setUsingFallback(true)
      setMeetings(FALLBACK_MEETINGS)
      setError('Could not load live meetings. Showing sample data.')
    } finally {
      setLoading(false)
    }
  }, [])

  const requestLocation = useCallback(() => {
    setLocationLabel('Detecting location…')
    if (!navigator.geolocation) {
      setLocationLabel('Location unavailable')
      setMeetings(FALLBACK_MEETINGS)
      setUsingFallback(true)
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords
        setLocation({ lat: latitude, lon: longitude })
        // Rough city label (could be improved with reverse geocode)
        setLocationLabel(`${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`)
        fetchMeetings(latitude, longitude)
      },
      () => {
        setLocationLabel('Location denied — using sample data')
        setMeetings(FALLBACK_MEETINGS)
        setUsingFallback(true)
      },
      { timeout: 8000, maximumAge: 300000 }
    )
  }, [fetchMeetings])

  useEffect(() => {
    requestLocation()
  }, [requestLocation])

  const filtered = meetings.filter(m => {
    const matchFellowship = filter === 'All' || m.fellowship === filter
    const matchSearch = !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.fellowship.toLowerCase().includes(search.toLowerCase()) ||
      (m.address || '').toLowerCase().includes(search.toLowerCase())
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
            placeholder="Search meetings, locations..."
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
          cursor: 'pointer',
        }} onClick={requestLocation}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--mint)" strokeWidth="2" strokeLinecap="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {locationLabel}
          </span>
          <span style={{ color: 'var(--mint)', fontSize: '0.75rem', flexShrink: 0 }}>Refresh</span>
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

      {/* Status bar */}
      {usingFallback && (
        <div style={{
          padding: '0.5rem 1.25rem',
          background: 'rgba(255,150,79,0.06)',
          borderBottom: '1px solid rgba(255,150,79,0.1)',
          fontSize: '0.72rem', color: 'rgba(255,150,79,0.8)',
          flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: '0.4rem',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error || 'Showing sample meeting data'}
        </div>
      )}

      {!usingFallback && !loading && meetings.length > 0 && (
        <div style={{
          padding: '0.5rem 1.25rem',
          background: 'rgba(79,255,176,0.04)',
          borderBottom: '1px solid rgba(79,255,176,0.08)',
          fontSize: '0.72rem', color: 'var(--mint)',
          flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: '0.4rem',
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--mint)', flexShrink: 0 }} />
          {meetings.length} live meetings nearby via Meeting Guide
        </div>
      )}

      {/* Meeting list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 1.25rem 1.25rem' }}>
        {loading ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '0.75rem' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: 'var(--mint)', opacity: 0.6,
                  animation: 'pulse-dot 1.2s ease-in-out infinite',
                  animationDelay: `${i * 0.2}s`,
                }} />
              ))}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Finding meetings near you…
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: '0.75rem' }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <div>No meetings found.</div>
            <div style={{ fontSize: '0.8rem', marginTop: '0.35rem' }}>Try a different filter or search.</div>
          </div>
        ) : (
          filtered.map((m) => {
            const colors = FELLOWSHIP_COLORS[m.fellowship] || FELLOWSHIP_COLORS.AA
            return (
              <div key={m.id} style={{
                padding: '1rem 0',
                borderBottom: '1px solid var(--border)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                gap: '1rem',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.name}
                    </div>
                    {m.isOnline && (
                      <span style={{ fontSize: '0.6rem', background: 'rgba(79,200,255,0.1)', color: '#4FC8FF', border: '1px solid rgba(79,200,255,0.2)', padding: '1px 5px', borderRadius: '100px', flexShrink: 0 }}>
                        ONLINE
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    {m.day} &middot; {m.time}{m.format ? ` · ${m.format}` : ''}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem', overflow: 'hidden' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.address}{m.dist !== null ? ` · ${m.dist} mi` : ''}
                    </span>
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

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { transform: scale(0.7); opacity: 0.4; }
          50% { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
