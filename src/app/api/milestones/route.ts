import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = session.user!.id!

  const userMilestones = await prisma.userMilestone.findMany({
    where: { userId },
    include: { milestone: true },
    orderBy: { milestone: { days: 'asc' } },
  })

  return NextResponse.json(userMilestones)
}

// Mark milestone as celebrated
export async function PATCH() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = session.user!.id!

  await prisma.userMilestone.updateMany({
    where: { userId, celebrated: false },
    data: { celebrated: true },
  })

  return NextResponse.json({ ok: true })
}

// Check and award new milestones based on current sobriety
export async function POST() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = session.user!.id!
  const record = await prisma.sobrietyRecord.findUnique({ where: { userId } })

  if (!record) return NextResponse.json({ awarded: [] })

  const totalDays = Math.floor((Date.now() - record.soberDate.getTime()) / 86400000)

  const eligible = await prisma.milestone.findMany({
    where: { days: { lte: totalDays } },
  })

  const awarded: string[] = []
  for (const milestone of eligible) {
    const result = await prisma.userMilestone.upsert({
      where: { userId_milestoneId: { userId, milestoneId: milestone.id } },
      create: { userId, milestoneId: milestone.id },
      update: {},
    })
    // Only return truly new ones
    if (result.achievedAt > new Date(Date.now() - 60000)) {
      awarded.push(milestone.id)
    }
  }

  const newOnes = await prisma.userMilestone.findMany({
    where: { userId, celebrated: false },
    include: { milestone: true },
  })

  return NextResponse.json({ awarded, uncelebrated: newOnes })
}
