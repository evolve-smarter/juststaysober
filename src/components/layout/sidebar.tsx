'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { signOut } from 'next-auth/react'

const navItems = [
  { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { href: '/milestones', icon: '🏆', label: 'Milestones' },
  { href: '/journal', icon: '📓', label: 'Journal' },
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

export function Sidebar({ user }: { user: User }) {
  const pathname = usePathname()

  return (
    <aside className="w-64 flex flex-col border-r border-white/10 bg-gray-950/80 backdrop-blur-sm">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
        <span className="text-xl">🕊️</span>
        <span className="font-bold text-white">JustStaySober</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
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
      <div className="mx-3 mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
        <p className="text-red-300 text-xs font-medium">Need help right now?</p>
        <a
          href="tel:18006624357"
          className="text-red-400 text-xs hover:text-red-300 transition-colors"
        >
          SAMHSA: 1-800-662-4357
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
            <p className="text-gray-500 text-xs truncate">{user.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-gray-500 hover:text-white transition-colors text-xs"
            title="Sign out"
          >
            ↩
          </button>
        </div>
      </div>
    </aside>
  )
}
