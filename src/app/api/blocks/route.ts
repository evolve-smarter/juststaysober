import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { currentMember } from '@/lib/community'

// Block the author of a post or comment. The client sends the post/comment id, never a user
// id, so blocking works on anonymous content without revealing who wrote it.
const schema = z
  .object({ postId: z.string().optional(), commentId: z.string().optional() })
  .refine((v) => !!v.postId !== !!v.commentId, { message: 'Provide exactly one of postId or commentId' })

export async function POST(req: NextRequest) {
  const member = await currentMember()
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  const { postId, commentId } = parsed.data

  const target = postId
    ? await prisma.post.findUnique({ where: { id: postId }, select: { userId: true } })
    : await prisma.comment.findUnique({ where: { id: commentId }, select: { userId: true } })
  if (!target) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (target.userId === member.id) {
    return NextResponse.json({ error: "You can't block yourself." }, { status: 400 })
  }

  await prisma.block.upsert({
    where: { blockerId_blockedId: { blockerId: member.id, blockedId: target.userId } },
    create: { blockerId: member.id, blockedId: target.userId },
    update: {},
  })
  return NextResponse.json({ blocked: true })
}
