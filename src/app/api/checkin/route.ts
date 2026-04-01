import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const mood = parseInt(searchParams.get('mood') ?? '3')

  if (mood < 1 || mood > 5) {
    return NextResponse.json({ error: 'Mood must be 1-5' }, { status: 400 })
  }

  // Only one check-in per day
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const existing = await prisma.checkIn.findFirst({
    where: {
      userId: session.user!.id!,
      createdAt: { gte: today, lt: tomorrow },
    },
  })

  if (existing) {
    return NextResponse.redirect(new URL('/dashboard?checkin=already', req.url))
  }

  await prisma.checkIn.create({
    data: {
      userId: session.user!.id!,
      mood,
    },
  })

  return NextResponse.redirect(new URL('/dashboard?checkin=done', req.url))
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { mood, note } = body

  if (!mood || mood < 1 || mood > 5) {
    return NextResponse.json({ error: 'Mood must be 1-5' }, { status: 400 })
  }

  const checkIn = await prisma.checkIn.create({
    data: {
      userId: session.user!.id!,
      mood: parseInt(mood),
      note: note ?? null,
    },
  })

  return NextResponse.json(checkIn)
}
