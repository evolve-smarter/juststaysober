import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ProfileForm } from '@/components/profile/profile-form'
import { getSobrietyStats, formatSobrietyMessage } from '@/lib/sobriety'

export const metadata = { title: 'Profile' }

export default async function ProfilePage() {
  const session = await auth()
  const userId = session!.user!.id!

  const [user, sobrietyRecord, milestonesEarned, totalPosts] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.sobrietyRecord.findUnique({ where: { userId } }),
    prisma.userMilestone.count({ where: { userId } }),
    prisma.post.count({ where: { userId } }),
  ])

  const stats = sobrietyRecord ? getSobrietyStats(sobrietyRecord.soberDate) : null

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Profile</h1>

      {/* Stats banner */}
      {stats && (
        <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/20 border border-purple-500/20 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-white">{stats.days}</div>
              <div className="text-gray-400 text-sm mt-1">Days sober</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">{milestonesEarned}</div>
              <div className="text-gray-400 text-sm mt-1">Milestones</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">{totalPosts}</div>
              <div className="text-gray-400 text-sm mt-1">Posts shared</div>
            </div>
          </div>
          <p className="text-center text-purple-300 mt-4 font-medium">
            {formatSobrietyMessage(stats.days)}
          </p>
        </div>
      )}

      <ProfileForm
        user={{
          id: user?.id ?? userId,
          name: user?.name ?? '',
          bio: user?.bio ?? '',
          email: user?.email ?? '',
        }}
        sobrietyRecord={sobrietyRecord ? {
          soberDate: sobrietyRecord.soberDate.toISOString().split('T')[0],
          substance: sobrietyRecord.substance,
          isPublic: sobrietyRecord.isPublic,
        } : null}
      />
    </div>
  )
}
