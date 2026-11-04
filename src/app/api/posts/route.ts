import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { currentMember, listFeed, postInclude, toPublicPost } from '@/lib/community'
import { rateLimited } from '@/lib/rate-limit'

const createSchema = z.object({
  content: z.string().trim().min(1).max(1000),
  category: z.enum(['general', 'milestone', 'struggle', 'gratitude', 'resource']).default('general'),
  isAnon: z.boolean().default(false),
})

export async function GET(req: NextRequest) {
  const member = await currentMember()
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const page = Math.max(parseInt(searchParams.get('page') ?? '1') || 1, 1)
  const category = searchParams.get('category') ?? undefined

  return NextResponse.json(await listFeed({ viewerId: member.id, category, page }))
}

export async function POST(req: NextRequest) {
  const member = await currentMember()
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (member.suspended) {
    return NextResponse.json({ error: 'Your posting access is suspended.' }, { status: 403 })
  }
  if (rateLimited(`post:${member.id}`, 10, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many posts. Please try again later.' }, { status: 429 })
  }

  const parsed = createSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const post = await prisma.post.create({
    data: { userId: member.id, ...parsed.data },
    include: postInclude,
  })

  return NextResponse.json(toPublicPost(post, member.id), { status: 201 })
}
