import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createSchema = z.object({
  content: z.string().min(1).max(1000),
  category: z.enum(['general', 'milestone', 'struggle', 'gratitude', 'resource']).default('general'),
  isAnon: z.boolean().default(false),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = 20
  const category = searchParams.get('category') ?? undefined

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: category ? { category } : undefined,
      include: {
        user: { select: { id: true, name: true, image: true } },
        _count: { select: { comments: true, likes: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.post.count({ where: category ? { category } : undefined }),
  ])

  // Mask anon posts
  const masked = posts.map((post) =>
    post.isAnon ? { ...post, user: { id: '', name: 'Anonymous', image: null } } : post
  )

  return NextResponse.json({ posts: masked, total, page, pages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 })

  const post = await prisma.post.create({
    data: {
      userId: session.user!.id!,
      content: parsed.data.content,
      category: parsed.data.category,
      isAnon: parsed.data.isAnon,
    },
    include: {
      user: { select: { id: true, name: true, image: true } },
      _count: { select: { comments: true, likes: true } },
    },
  })

  return NextResponse.json(post, { status: 201 })
}
