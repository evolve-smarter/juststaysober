import type { Prisma } from '@prisma/client'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

const ANON_USER = { id: '', name: 'Anonymous', image: null as string | null }

export const postInclude = {
  user: { select: { id: true, name: true, image: true } },
  _count: { select: { comments: true, likes: true } },
} satisfies Prisma.PostInclude

export const commentInclude = {
  user: { select: { id: true, name: true, image: true } },
} satisfies Prisma.CommentInclude

type PostRow = Prisma.PostGetPayload<{ include: typeof postInclude }>
type CommentRow = Prisma.CommentGetPayload<{ include: typeof commentInclude }>

/** Admins are listed by email in the ADMIN_EMAILS env var (comma separated). */
export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false
  const list = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  return list.includes(email.toLowerCase())
}

/**
 * Anonymous content must not reveal who wrote it: strip the real user id and name from the
 * payload. `mine` tells the author's own client that it is theirs (to offer "delete").
 */
export function toPublicPost(post: PostRow, viewerId: string) {
  const mine = post.userId === viewerId
  if (post.isAnon) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId, ...rest } = post
    return { ...rest, user: ANON_USER, mine }
  }
  return { ...post, mine }
}

export function toPublicComment(comment: CommentRow, viewerId: string) {
  const mine = comment.userId === viewerId
  if (comment.isAnon) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId, ...rest } = comment
    return { ...rest, user: ANON_USER, mine }
  }
  return { ...comment, mine }
}

/** Users the viewer has blocked, plus users who have blocked the viewer. */
export async function blockedUserIds(viewerId: string): Promise<string[]> {
  const rows = await prisma.block.findMany({
    where: { OR: [{ blockerId: viewerId }, { blockedId: viewerId }] },
    select: { blockerId: true, blockedId: true },
  })
  return rows.map((r) => (r.blockerId === viewerId ? r.blockedId : r.blockerId))
}

export async function listFeed(opts: {
  viewerId: string
  category?: string
  page?: number
  limit?: number
}) {
  const { viewerId, category, page = 1, limit = 20 } = opts
  const excluded = await blockedUserIds(viewerId)
  const where: Prisma.PostWhereInput = {
    hiddenAt: null,
    ...(category ? { category } : {}),
    ...(excluded.length ? { userId: { notIn: excluded } } : {}),
  }
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: postInclude,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (Math.max(page, 1) - 1) * limit,
    }),
    prisma.post.count({ where }),
  ])
  return {
    posts: posts.map((p) => toPublicPost(p, viewerId)),
    total,
    page,
    pages: Math.ceil(total / limit),
  }
}

/** Resolves the signed-in user, or null. Also returns whether they are suspended. */
export async function currentMember() {
  const session = await auth()
  const id = session?.user?.id
  if (!id) return null
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, suspendedAt: true },
  })
  if (!user) return null
  return { id: user.id, email: user.email, suspended: !!user.suspendedAt }
}
