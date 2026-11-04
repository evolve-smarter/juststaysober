import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { currentMember, isAdminEmail } from '@/lib/community'

const schema = z
  .object({
    postId: z.string().optional(),
    commentId: z.string().optional(),
    action: z.enum(['hide', 'dismiss', 'restore', 'suspend_author']),
  })
  .refine((v) => !!v.postId !== !!v.commentId, { message: 'Provide exactly one of postId or commentId' })

export async function POST(req: NextRequest) {
  const member = await currentMember()
  if (!member || !isAdminEmail(member.email)) {
    // Same response for "not signed in" and "not an admin": don't reveal the route exists.
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  const { postId, commentId, action } = parsed.data

  const target = postId
    ? await prisma.post.findUnique({ where: { id: postId }, select: { userId: true } })
    : await prisma.comment.findUnique({ where: { id: commentId }, select: { userId: true } })
  if (!target) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const targetWhere = postId ? { postId } : { commentId }
  const now = new Date()

  const hide = () =>
    postId
      ? prisma.post.update({ where: { id: postId }, data: { hiddenAt: now, hiddenReason: 'removed by moderator' } })
      : prisma.comment.update({ where: { id: commentId }, data: { hiddenAt: now } })
  const restore = () =>
    postId
      ? prisma.post.update({ where: { id: postId }, data: { hiddenAt: null, hiddenReason: null } })
      : prisma.comment.update({ where: { id: commentId }, data: { hiddenAt: null } })
  const resolveReports = (status: 'actioned' | 'dismissed', resolution: string) =>
    prisma.report.updateMany({
      where: { ...targetWhere, status: 'open' },
      data: { status, resolution, resolvedAt: now },
    })

  if (action === 'hide') {
    await hide()
    await resolveReports('actioned', 'content hidden')
  } else if (action === 'dismiss') {
    await resolveReports('dismissed', 'no violation found')
  } else if (action === 'restore') {
    await restore()
    await resolveReports('dismissed', 'content restored')
  } else if (action === 'suspend_author') {
    await hide()
    await prisma.user.update({ where: { id: target.userId }, data: { suspendedAt: now } })
    await resolveReports('actioned', 'content hidden, author suspended from posting')
  }

  return NextResponse.json({ ok: true })
}
