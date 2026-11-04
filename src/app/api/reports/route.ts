import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { currentMember } from '@/lib/community'
import { rateLimited } from '@/lib/rate-limit'

const REPORT_REASONS = [
  'spam',
  'harassment',
  'self_harm_risk',
  'medical_advice',
  'solicitation',
  'other',
] as const

const schema = z
  .object({
    postId: z.string().optional(),
    commentId: z.string().optional(),
    reason: z.enum(REPORT_REASONS),
    details: z.string().trim().max(500).optional(),
  })
  .refine((v) => !!v.postId !== !!v.commentId, { message: 'Provide exactly one of postId or commentId' })

// Distinct reporters needed to hide content automatically while it waits for review.
const AUTO_HIDE_THRESHOLD = 3

export async function POST(req: NextRequest) {
  const member = await currentMember()
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (rateLimited(`report:${member.id}`, 20, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many reports. Please try again later.' }, { status: 429 })
  }

  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  const { postId, commentId, reason, details } = parsed.data

  const target = postId
    ? await prisma.post.findFirst({ where: { id: postId, hiddenAt: null }, select: { id: true, userId: true } })
    : await prisma.comment.findFirst({ where: { id: commentId, hiddenAt: null }, select: { id: true, userId: true } })
  if (!target) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (target.userId === member.id) {
    return NextResponse.json({ error: "You can't report your own content." }, { status: 400 })
  }

  const already = await prisma.report.findFirst({
    where: { reporterId: member.id, ...(postId ? { postId } : { commentId }) },
    select: { id: true },
  })
  if (!already) {
    await prisma.report.create({
      data: { reporterId: member.id, postId, commentId, reason, details: details || null },
    })
  }

  // Auto-hide pending review once enough different people report the same item. Reports that
  // flag someone at risk of self-harm are NOT auto-hidden (hiding could cut off a person who
  // is reaching out); they go to the top of the admin queue instead.
  if (reason !== 'self_harm_risk') {
    const distinct = await prisma.report.count({
      where: {
        status: 'open',
        reason: { not: 'self_harm_risk' },
        ...(postId ? { postId } : { commentId }),
      },
    })
    if (distinct >= AUTO_HIDE_THRESHOLD) {
      if (postId) {
        await prisma.post.update({
          where: { id: postId },
          data: { hiddenAt: new Date(), hiddenReason: `auto-hidden after ${distinct} reports` },
        })
      } else {
        await prisma.comment.update({ where: { id: commentId }, data: { hiddenAt: new Date() } })
      }
    }
  }

  return NextResponse.json({
    reported: true,
    message:
      reason === 'self_harm_risk'
        ? 'Thank you for looking out for them. If someone may be in immediate danger, call 911. For a crisis, call or text 988.'
        : 'Thank you. We will review this.',
  })
}
