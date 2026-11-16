import Link from 'next/link'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { listFeed } from '@/lib/community'
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
  const userId = session?.user?.id
  if (!userId) redirect('/login')

  const { posts } = await listFeed({ viewerId: userId })

  const likedPostIds = (
    await prisma.postLike.findMany({
      where: { userId, postId: { in: posts.map((p) => p.id) } },
      select: { postId: true },
    })
  ).map((l) => l.postId)

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Community</h1>
      <p className="text-gray-400 mb-4">
        Share your journey. Support others. You are not alone.
      </p>

      <details className="mb-6 rounded-xl border border-white/10 bg-gray-900/60 p-4 text-sm text-gray-300">
        <summary className="cursor-pointer font-medium text-gray-200">Community guidelines</summary>
        <ul className="mt-3 list-disc pl-5 space-y-1 text-gray-400">
          <li>Be kind. No harassment, shaming or hate.</li>
          <li>No selling, advertising or recruiting for treatment programs, products or services.</li>
          <li>No medical advice. Talk to a doctor about withdrawal and medications.</li>
          <li>Don&apos;t share where to get substances, or anyone else&apos;s private information.</li>
          <li>Use Report if something is wrong. Use Block to stop seeing someone.</li>
        </ul>
        <p className="mt-3 text-gray-400">
          <Link href="/guidelines" className="underline">Read the full guidelines</Link>. If you or
          someone else is in danger, call 911. For a crisis, call or text 988.
        </p>
      </details>

      <CommunityFeed
        initialPosts={posts}
        categories={categories}
        currentUserId={userId}
        likedPostIds={likedPostIds}
      />
    </div>
  )
}
