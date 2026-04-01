import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { SobrietyCounter } from '@/components/sobriety/sobriety-counter'
import { MilestoneCard } from '@/components/sobriety/milestone-card'
import { MilestoneChecker } from '@/components/sobriety/milestone-checker'
import { SetSobrietyDate } from '@/components/sobriety/set-sobriety-date'
import { getEarnedMilestoneDays, getNextMilestone, getDaysUntilNextMilestone } from '@/lib/sobriety'

function calculateStreak(checkIns: { createdAt: Date }[]): number {
  if (checkIns.length === 0) return 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const checkInDays = new Set(
    checkIns.map((c) => {
      const d = new Date(c.createdAt)
      d.setHours(0, 0, 0, 0)
      return d.getTime()
    })
  )
  let streak = 0
  const cursor = new Date(today)
  while (checkInDays.has(cursor.getTime())) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const session = await auth()
  const userId = session!.user!.id!

  const [sobrietyRecord, recentCheckins] = await Promise.all([
    prisma.sobrietyRecord.findUnique({ where: { userId } }),
    prisma.checkIn.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 60,
    }),
  ])

  const checkinStreak = calculateStreak(recentCheckins)

  const milestones = sobrietyRecord
    ? await prisma.milestone.findMany({
        where: { days: { in: getEarnedMilestoneDays(
          Math.floor((Date.now() - sobrietyRecord.soberDate.getTime()) / 86400000)
        )}},
        orderBy: { days: 'desc' },
        take: 3,
      })
    : []

  if (!sobrietyRecord) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">🕊️</div>
          <h1 className="text-3xl font-bold text-white mb-3">
            When did your journey begin?
          </h1>
          <p className="text-gray-400 mb-8">
            Enter your sobriety date to start tracking. You can always update it.
          </p>
          <SetSobrietyDate />
        </div>
      </div>
    )
  }

  const totalDays = Math.floor(
    (Date.now() - sobrietyRecord.soberDate.getTime()) / 86400000
  )
  const nextMilestone = getNextMilestone(totalDays)
  const daysUntilNext = getDaysUntilNextMilestone(totalDays)

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <MilestoneChecker />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {session!.user!.name?.split(' ')[0] ?? 'friend'} 👋
        </h1>
        <p className="text-gray-400 mt-1">Keep going. You&apos;re doing something incredible.</p>
      </div>

      {/* Main counter */}
      <SobrietyCounter soberDate={sobrietyRecord.soberDate} />

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-gray-900/60 border border-white/10 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Sobriety Date</p>
          <p className="text-white font-semibold mt-1 text-sm">
            {sobrietyRecord.soberDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>

        <div className="bg-gray-900/60 border border-white/10 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Milestones Earned</p>
          <p className="text-white font-semibold mt-1">
            {milestones.length} badge{milestones.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className={`rounded-xl p-5 ${checkinStreak > 0 ? 'bg-green-500/10 border border-green-500/20' : 'bg-gray-900/60 border border-white/10'}`}>
          <p className={`text-sm ${checkinStreak > 0 ? 'text-green-300' : 'text-gray-400'}`}>Check-in Streak</p>
          <p className="text-white font-semibold mt-1">
            {checkinStreak > 0 ? `🔥 ${checkinStreak} day${checkinStreak !== 1 ? 's' : ''}` : 'Check in today'}
          </p>
        </div>

        {nextMilestone && daysUntilNext !== null && (
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-5">
            <p className="text-purple-300 text-sm">Next Milestone</p>
            <p className="text-white font-semibold mt-1">
              {daysUntilNext} {daysUntilNext === 1 ? 'day' : 'days'} to go
            </p>
            <p className="text-purple-400 text-xs mt-0.5">{nextMilestone} days total</p>
          </div>
        )}
      </div>

      {/* Recent milestones */}
      {milestones.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Milestones</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {milestones.map((m) => (
              <MilestoneCard key={m.id} milestone={m} earned />
            ))}
          </div>
        </div>
      )}

      {/* Mood check-in */}
      <div className="mt-8 bg-gray-900/60 border border-white/10 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-1">How are you feeling today?</h2>
        <p className="text-gray-400 text-sm mb-4">Check in to track your emotional journey.</p>
        <div className="flex gap-3">
          {[
            { mood: 5, emoji: '😄', label: 'Great' },
            { mood: 4, emoji: '🙂', label: 'Good' },
            { mood: 3, emoji: '😐', label: 'OK' },
            { mood: 2, emoji: '😔', label: 'Hard' },
            { mood: 1, emoji: '😢', label: 'Struggling' },
          ].map(({ mood, emoji, label }) => (
            <a
              key={mood}
              href={`/api/checkin?mood=${mood}`}
              className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border border-white/10 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all cursor-pointer"
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-gray-400 text-xs">{label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { href: '/journal', icon: '📓', label: 'Write in journal' },
          { href: '/community', icon: '🤝', label: 'Visit community' },
          { href: '/resources', icon: '📚', label: 'Find resources' },
          { href: '/milestones', icon: '🏆', label: 'View milestones' },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="bg-gray-900/40 border border-white/10 rounded-xl p-4 text-center hover:border-purple-500/30 transition-colors"
          >
            <div className="text-2xl mb-2">{link.icon}</div>
            <div className="text-gray-300 text-sm">{link.label}</div>
          </a>
        ))}
      </div>
    </div>
  )
}
