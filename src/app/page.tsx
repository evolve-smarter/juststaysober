import Link from 'next/link'

const milestones = [
  { emoji: '🌟', days: 1, label: '24 Hours' },
  { emoji: '🔥', days: 7, label: '1 Week' },
  { emoji: '🏅', days: 30, label: '30 Days' },
  { emoji: '🎯', days: 90, label: '90 Days' },
  { emoji: '🌈', days: 180, label: '6 Months' },
  { emoji: '🏆', days: 365, label: '1 Year' },
]

const features = [
  {
    icon: '⏱️',
    title: 'Live Sobriety Counter',
    desc: 'Track every day, hour, and minute of your journey in real time.',
  },
  {
    icon: '🏆',
    title: 'Milestone Badges',
    desc: 'Earn badges for 24hrs, 7 days, 30 days, 90 days, 1 year and beyond.',
  },
  {
    icon: '📓',
    title: 'Daily Journal',
    desc: 'Private gratitude entries to process your thoughts and feelings.',
  },
  {
    icon: '🤝',
    title: 'Community Support',
    desc: 'Share anonymously, celebrate each other, and lift one another up.',
  },
  {
    icon: '📚',
    title: 'Resources',
    desc: 'Hotlines, meetings, treatment centers — everything in one place.',
  },
  {
    icon: '🎁',
    title: 'Milestone Gifts',
    desc: 'Celebrate with recovery-themed gifts from Grateful Gestures.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🕊️</span>
          <span className="text-xl font-bold text-white">JustStaySober</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-gray-300 hover:text-white transition-colors text-sm"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Start your journey
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 pt-20 pb-16 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-8">
          <span className="text-purple-400 text-sm font-medium">✨ Track every day. Celebrate every milestone.</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          One Day
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            at a Time.
          </span>
        </h1>

        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Your sobriety is worth tracking, celebrating, and sharing. Join a community
          that understands — because they&apos;ve been there too.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105"
          >
            Start tracking free
          </Link>
          <Link
            href="/community"
            className="border border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all"
          >
            See the community
          </Link>
        </div>
      </section>

      {/* Counter preview */}
      <section className="px-6 py-12 max-w-xl mx-auto">
        <div className="bg-gray-900/60 border border-white/10 rounded-2xl p-8 text-center">
          <p className="text-gray-400 text-sm mb-2 uppercase tracking-widest">Your sobriety counter</p>
          <div className="flex justify-center gap-6 my-6">
            {[
              { value: '247', label: 'Days' },
              { value: '14', label: 'Hours' },
              { value: '32', label: 'Minutes' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white font-mono">{item.value}</div>
                <div className="text-gray-500 text-xs mt-1 uppercase tracking-wider">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="text-purple-400 font-medium">247 days of freedom 🌈</div>
          <p className="text-gray-500 text-xs mt-2">This is a preview. Sign up to track your real time.</p>
        </div>
      </section>

      {/* Milestones */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-3">
          Every milestone matters
        </h2>
        <p className="text-gray-400 text-center mb-10">
          From 24 hours to 10 years — each one is worth celebrating.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {milestones.map((m) => (
            <div
              key={m.days}
              className="bg-gray-900/60 border border-white/10 rounded-xl p-4 text-center hover:border-purple-500/40 transition-colors"
            >
              <div className="text-3xl mb-2">{m.emoji}</div>
              <div className="text-white font-semibold text-sm">{m.label}</div>
              <div className="text-gray-500 text-xs mt-1">{m.days} {m.days === 1 ? 'day' : 'days'}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-3">
          Everything you need on this journey
        </h2>
        <p className="text-gray-400 text-center mb-12">
          Built by people who understand recovery. Designed for you.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-gray-900/40 border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-colors"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto bg-gradient-to-r from-purple-900/40 to-pink-900/20 border border-purple-500/20 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Your journey starts with one step.
          </h2>
          <p className="text-gray-400 mb-8">
            Free to join. No judgment. Just support.
          </p>
          <Link
            href="/signup"
            className="bg-purple-600 hover:bg-purple-500 text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105 inline-block"
          >
            I&apos;m ready to stay sober
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 text-center text-gray-500 text-sm">
        <p>
          If you&apos;re in crisis, call{' '}
          <a href="tel:18006624357" className="text-purple-400 hover:underline">
            SAMHSA: 1-800-662-4357
          </a>{' '}
          or text HOME to 741741.
        </p>
        <p className="mt-2">© 2026 JustStaySober. Made with 💜 for the recovery community.</p>
      </footer>
    </div>
  )
}
