import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') ?? undefined
  const q = searchParams.get('q') ?? undefined

  const resources = await prisma.resource.findMany({
    where: {
      ...(type ? { type } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
              { city: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: [{ isVerified: 'desc' }, { name: 'asc' }],
  })

  return NextResponse.json(resources)
}
