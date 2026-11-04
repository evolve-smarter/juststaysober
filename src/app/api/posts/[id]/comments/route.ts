import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { blockedUserIds, commentInclude, currentMember, toPublicComment } from '@/lib/community'
import { rateLimited } from '@/lib/rate-limit'

const schema = z.object({
  content: z.string().trim().min(1).max(500),
  isAnon: z.boolean().default(false),
})

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const member = await currentMember()
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: postId } = await params
  const excluded = await blockedUserIds(member.id)
  const comments = await prisma.comment.findMany({
    where: {
      postId,
      hiddenAt: null,
      post: { hiddenAt: null },
      ...(excluded.length ? { userId: { notIn: excluded } } : {}),
    },
    include: commentInclude,
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json(comments.map((c) => toPublicComment(c, member.id)))
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const member = await currentMember()
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (member.suspended) {
    return NextResponse.json({ error: 'Your posting access is suspended.' }, { status: 403 })
  }
  if (rateLimited(`comment:${member.id}`, 30, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many comments. Please try again later.' }, { status: 429 })
  }

  const { id: postId } = await params
  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const post = await prisma.post.findFirst({ where: { id: postId, hiddenAt: null }, select: { id: true } })
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const comment = await prisma.comment.create({
    data: { postId, userId: member.id, ...parsed.data },
    include: commentInclude,
  })

  return NextResponse.json(toPublicComment(comment, member.id), { status: 201 })
}
