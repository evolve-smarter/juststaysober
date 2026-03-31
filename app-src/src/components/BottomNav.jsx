const tabs = [
  {
    id: 'home',
    label: 'Home',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'var(--mint)' : 'none'}
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: active ? 1 : 0.5 }}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill={active ? 'rgba(79,255,176,0.15)' : 'none'}/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )
  },
  {
    id: 'meetings',
    label: 'Meetings',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: active ? 1 : 0.5 }}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill={active ? 'rgba(79,255,176,0.15)' : 'none'}/>
        <circle cx="12" cy="10" r="3" fill={active ? 'rgba(79,255,176,0.3)' : 'none'}/>
      </svg>
    )
  },
  {
    id: 'guide',
    label: 'Guide',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: active ? 1 : 0.5 }}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill={active ? 'rgba(79,255,176,0.15)' : 'none'}/>
      </svg>
    )
  },
  {
    id: 'milestones',
    label: 'Milestones',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: active ? 1 : 0.5 }}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    )
  }
]

export default function BottomNav({ active, onNavigate }) {
  return (
    <nav style={{
      display: 'flex',
      background: 'var(--bg-2)',
      borderTop: '1px solid var(--border)',
      paddingBottom: 'env(safe-area-inset-bottom, 0)',
      position: 'relative',
    }}>
      {/* Active slide indicator */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: `${tabs.findIndex(t => t.id === active) * 25}%`,
        width: '25%',
        height: '2px',
        background: 'var(--mint)',
        borderRadius: '0 0 2px 2px',
        transition: 'left 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }} />

      {tabs.map(tab => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.2rem',
              padding: '0.7rem 0 0.6rem',
              background: 'none',
              border: 'none',
              color: isActive ? 'var(--mint)' : 'var(--text-dim)',
              transition: 'color 0.2s, transform 0.15s',
              fontSize: '0.62rem',
              fontWeight: isActive ? '600' : '400',
              letterSpacing: '0.02em',
              transform: isActive ? 'scale(1)' : 'scale(0.95)',
              cursor: 'pointer',
            }}
          >
            <div style={{
              transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: isActive ? 'translateY(-1px) scale(1.05)' : 'translateY(0) scale(1)',
            }}>
              {tab.icon(isActive)}
            </div>
            <span>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
