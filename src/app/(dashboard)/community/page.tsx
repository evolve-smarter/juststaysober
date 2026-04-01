import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { CommunityFeed } from '@/components/community/community-feed'

export const metadata = { title: 'Community' }

const categories = [
  { value: 'general', label: 'All', emoji: '💬' },
  { value: 'milestone', label: 'Milestones', emoji: '🏆' },
  { value: 'gratitude', label: 'Gratitude', emoji: '🙏' },
  { value: 'struggle', label: 'Struggles', emoji: '💙' },
  { value: 'resource', label: 'Resources', emoji: '📚' },
]

export default async function CommunityPage() {
  const session = await auth()

  const posts = await prisma.post.findMany({
    include: {
      user: { select: { id: true, name: true, image: true } },
      _count: { select: { comments: true, likes: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  const masked = posts.map((post) =>
    post.isAnon ? { ...post, user: { id: '', name: 'Anonymous', image: null } } : post
  )

  const likedPostIds = session?.user?.id
    ? (await prisma.postLike.findMany({
        where: { userId: session.user.id, postId: { in: posts.map((p) => p.id) } },
        select: { postId: true },
      })).map((l) => l.postId)
    : []

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Community</h1>
      <p className="text-gray-400 mb-6">
        Share your journey. Support others. You are not alone.
      </p>

      <CommunityFeed
        initialPosts={masked}
        categories={categories}
        currentUserId={session?.user?.id ?? null}
        likedPostIds={likedPostIds}
      />
    </div>
  )
}
