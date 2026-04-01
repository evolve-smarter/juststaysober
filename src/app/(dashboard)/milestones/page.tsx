import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { MilestoneCard } from '@/components/sobriety/milestone-card'

export const metadata = { title: 'Milestones' }

export default async function MilestonesPage() {
  const session = await auth()
  const userId = session!.user!.id!

  const [sobrietyRecord, allMilestones, userMilestones] = await Promise.all([
    prisma.sobrietyRecord.findUnique({ where: { userId } }),
    prisma.milestone.findMany({ orderBy: { days: 'asc' } }),
    prisma.userMilestone.findMany({
      where: { userId },
      select: { milestoneId: true, achievedAt: true },
    }),
  ])

  const earnedIds = new Set(userMilestones.map((um) => um.milestoneId))
  const totalDays = sobrietyRecord
    ? Math.floor((Date.now() - sobrietyRecord.soberDate.getTime()) / 86400000)
    : 0

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Milestones</h1>
      <p className="text-gray-400 mb-8">
        {earnedIds.size} of {allMilestones.length} milestones earned
      </p>

      {!sobrietyRecord && (
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6 mb-8 text-center">
          <p className="text-purple-300">
            Set your sobriety date on the{' '}
            <a href="/dashboard" className="underline">Dashboard</a>{' '}
            to start earning milestones.
          </p>
        </div>
      )}

      {/* Progress bar */}
      {sobrietyRecord && (
        <div className="bg-gray-900/60 border border-white/10 rounded-xl p-6 mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Day {totalDays}</span>
            <span>{earnedIds.size} badges earned</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
              style={{ width: `${Math.min((earnedIds.size / allMilestones.length) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allMilestones.map((milestone) => {
          const earned = earnedIds.has(milestone.id)
          const locked = !earned && totalDays < milestone.days
          return (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              earned={earned}
              locked={locked}
            />
          )
        })}
      </div>

      {/* GG shop link */}
      <div className="mt-10 bg-gradient-to-r from-pink-900/30 to-purple-900/30 border border-pink-500/20 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">🎁</div>
        <h2 className="text-xl font-bold text-white mb-2">Celebrate your milestones</h2>
        <p className="text-gray-400 mb-6 text-sm">
          Recovery milestone gifts from Grateful Gestures — meaningful items to mark every step of your journey.
        </p>
        <a
          href="https://www.etsy.com/shop/GratefulGestures"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-pink-600 hover:bg-pink-500 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          Shop Grateful Gestures
        </a>
      </div>
    </div>
  )
}
