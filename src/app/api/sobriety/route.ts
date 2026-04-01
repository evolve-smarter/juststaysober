import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const schema = z.object({
  soberDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  substance: z.string().optional().default('alcohol'),
})

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const record = await prisma.sobrietyRecord.findUnique({
    where: { userId: session.user!.id! },
  })
  return NextResponse.json(record)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 })

  const { soberDate, substance } = parsed.data
  const record = await prisma.sobrietyRecord.upsert({
    where: { userId: session.user!.id! },
    create: {
      userId: session.user!.id!,
      soberDate: new Date(soberDate),
      substance,
    },
    update: {
      soberDate: new Date(soberDate),
      substance,
    },
  })

  // Check and award milestones
  const totalDays = Math.floor((Date.now() - record.soberDate.getTime()) / 86400000)
  const milestones = await prisma.milestone.findMany({
    where: { days: { lte: totalDays } },
  })

  for (const milestone of milestones) {
    await prisma.userMilestone.upsert({
      where: { userId_milestoneId: { userId: session.user!.id!, milestoneId: milestone.id } },
      create: {
        userId: session.user!.id!,
        milestoneId: milestone.id,
        achievedAt: new Date(),
      },
      update: {},
    })
  }

  return NextResponse.json(record)
}
