import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: postId } = await params
  const userId = session.user!.id!

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
