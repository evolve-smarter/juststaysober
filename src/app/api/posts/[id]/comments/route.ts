import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const schema = z.object({
  content: z.string().min(1).max(500),
  isAnon: z.boolean().default(false),
})

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: postId } = await params
  const comments = await prisma.comment.findMany({
    where: { postId },
    include: { user: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: 'asc' },
  })
  const masked = comments.map((c) =>
    c.isAnon ? { ...c, user: { id: '', name: 'Anonymous', image: null } } : c
  )
  return NextResponse.json(masked)
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: postId } = await params
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 })

  const comment = await prisma.comment.create({
    data: {
      postId,
      userId: session.user!.id!,
      content: parsed.data.content,
      isAnon: parsed.data.isAnon,
    },
    include: { user: { select: { id: true, name: true, image: true } } },
  })

  return NextResponse.json(comment, { status: 201 })
}
