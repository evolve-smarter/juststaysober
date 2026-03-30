const tabs = [
  {
    id: 'home',
    label: 'Home',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )
  },
  {
    id: 'meetings',
    label: 'Meetings',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    )
  },
  {
    id: 'guide',
    label: 'Sober Guide',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    )
  },
  {
    id: 'milestones',
    label: 'Milestones',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
    }}>
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
              gap: '0.25rem',
              padding: '0.75rem 0',
              background: 'none',
              border: 'none',
              color: isActive ? 'var(--mint)' : 'var(--text-muted)',
              transition: 'color 0.2s',
              fontSize: '0.65rem',
              fontWeight: isActive ? '600' : '400',
              letterSpacing: '0.02em',
            }}
          >
            <div style={{ transition: 'transform 0.2s', transform: isActive ? 'translateY(-1px)' : 'none' }}>
              {tab.icon}
            </div>
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
