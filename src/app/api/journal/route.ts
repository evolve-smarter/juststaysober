import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const schema = z.object({
  content: z.string().min(1).max(2000),
  mood: z.enum(['grateful', 'hopeful', 'struggling', 'strong', 'peaceful']).nullable().optional(),
  isPrivate: z.boolean().default(true),
})

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const entries = await prisma.journalEntry.findMany({
    where: { userId: session.user!.id! },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return NextResponse.json(entries)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 })

  const entry = await prisma.journalEntry.create({
    data: {
      userId: session.user!.id!,
      content: parsed.data.content,
      mood: parsed.data.mood ?? null,
      isPrivate: parsed.data.isPrivate,
    },
  })

  return NextResponse.json(entry, { status: 201 })
}
