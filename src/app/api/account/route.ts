import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { currentMember } from '@/lib/community'

// Permanently deletes the signed-in user and everything tied to them (sobriety record,
// journal, check-ins, milestones, posts, comments, likes, reports, blocks, push
// subscriptions, sessions, linked sign-in accounts). The schema cascades from User.
// Required by the privacy policy draft and by app-store rules for in-app account deletion.
const schema = z.object({ confirm: z.literal('DELETE') })

export async function DELETE(req: NextRequest) {
  const member = await currentMember()
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Send {"confirm":"DELETE"} to confirm.' }, { status: 400 })
  }

  await prisma.user.delete({ where: { id: member.id } })
  return NextResponse.json({ deleted: true })
}
