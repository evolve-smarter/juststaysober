'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { signOut } from 'next-auth/react'

const navItems = [
  { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { href: '/milestones', icon: '🏆', label: 'Milestones' },
  { href: '/journal', icon: '📓', label: 'Journal' },
  { href: '/companion', icon: '💬', label: 'Sober Guide' },
  { href: '/community', icon: '🤝', label: 'Community' },
  { href: '/resources', icon: '📚', label: 'Resources' },
  { href: '/profile', icon: '👤', label: 'Profile' },
]

interface User {
  id?: string | null
  name?: string | null
  email?: string | null
  image?: string | null
}

function SidebarBody({ user, isAdmin, onNavigate }: { user: User; isAdmin: boolean; onNavigate?: () => void }) {
  const pathname = usePathname()
  const items = isAdmin ? [...navItems, { href: '/admin/reports', icon: '🛡️', label: 'Moderation' }] : navItems

  return (
    <>
      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Crisis banner */}
      <div className="mx-3 mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl space-y-1">
        <p className="text-red-300 text-xs font-medium">Need help right now?</p>
        <a href="tel:988" className="block text-red-400 text-xs hover:text-red-300 transition-colors">
          Call or text 988 (Crisis Lifeline)
        </a>
        <a href="tel:18006624357" className="block text-red-400 text-xs hover:text-red-300 transition-colors">
          SAMHSA: 1-800-662-4357
        </a>
        <a href="tel:911" className="block text-red-400 text-xs hover:text-red-300 transition-colors">
          Emergency: 911
        </a>
      </div>

      {/* User */}
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 px-2 py-2">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name ?? 'User'}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-medium">
              {user.name?.[0] ?? user.email?.[0] ?? '?'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {user.name ?? 'Anonymous'}
            </p>
            <p className="text-gray-400 text-xs truncate">{user.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-gray-400 hover:text-white transition-colors text-xs"
            title="Sign out"
          >
            ↩
          </button>
        </div>
      </div>
    </>
  )
}

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xl">🕊️</span>
      <span className="font-bold text-white">JustStaySober</span>
    </div>
  )
}

export function Sidebar({ user, isAdmin = false }: { user: User; isAdmin?: boolean }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close the drawer on navigation and lock page scroll while it is open.
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-white/10 bg-gray-950/80 backdrop-blur-sm">
        <div className="px-6 py-5 border-b border-white/10">
          <Logo />
        </div>
        <SidebarBody user={user} isAdmin={isAdmin} />
      </aside>

      {/* Mobile top bar. The 988 link stays visible without opening the menu. */}
      <header className="md:hidden flex items-center justify-between gap-3 border-b border-white/10 bg-gray-950 px-4 py-3">
        <Logo />
        <div className="flex items-center gap-2">
          <a
            href="tel:988"
            className="rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300"
          >
            Help: 988
          </a>
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-gray-300 hover:bg-white/5"
          >
            ☰
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="flex w-72 max-w-[85%] flex-col border-r border-white/10 bg-gray-950">
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
              <Logo />
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-2xl text-gray-400 hover:text-white">
                ×
              </button>
            </div>
            <SidebarBody user={user} isAdmin={isAdmin} onNavigate={() => setOpen(false)} />
          </div>
          <button className="flex-1 bg-black/60" aria-label="Close menu" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  )
}
