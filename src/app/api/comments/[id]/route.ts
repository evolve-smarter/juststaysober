import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { currentMember } from '@/lib/community'

// Authors can delete their own comments.
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const member = await currentMember()
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const result = await prisma.comment.deleteMany({ where: { id, userId: member.id } })
  if (result.count === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ deleted: true })
}
