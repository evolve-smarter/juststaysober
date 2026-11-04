import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { currentMember } from '@/lib/community'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const member = await currentMember()
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: postId } = await params
  const userId = member.id

  const post = await prisma.post.findFirst({ where: { id: postId, hiddenAt: null }, select: { id: true } })
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const existing = await prisma.postLike.findUnique({
    where: { postId_userId: { postId, userId } },
  })

  if (existing) {
    await prisma.postLike.delete({ where: { id: existing.id } })
    return NextResponse.json({ liked: false })
  }

  await prisma.postLike.create({ data: { postId, userId } })
  return NextResponse.json({ liked: true })
}
