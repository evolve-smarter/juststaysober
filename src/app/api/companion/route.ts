import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { askCompanion } from '@/lib/companion'
import { CRISIS_RESOURCES_TEXT, isCrisisMessage } from '@/lib/crisis'

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1).max(2000),
      })
    )
    .min(1)
    .max(20),
})

// Simple per-instance rate limit (30 messages / hour / user). Replace with a shared store
// (e.g. the database) if the app runs on more than one instance.
const WINDOW_MS = 60 * 60 * 1000
const MAX_PER_WINDOW = 30
const hits = new Map<string, number[]>()

function rateLimited(userId: string): boolean {
  const now = Date.now()
  const recent = (hits.get(userId) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(userId, recent)
    return true
  }
  recent.push(now)
  hits.set(userId, recent)
  return false
}

export async function POST(req: Request) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const parsed = bodySchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const { messages } = parsed.data
  const last = messages[messages.length - 1]
  if (last.role !== 'user') return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const crisis = isCrisisMessage(last.content)

  if (rateLimited(userId)) {
    // Never rate-limit away crisis resources.
    return NextResponse.json(
      {
        error: 'Too many messages. Please try again later.',
        crisis,
        ...(crisis && { reply: CRISIS_RESOURCES_TEXT }),
      },
      { status: 429 }
    )
  }

  const result = await askCompanion(messages)

  if (result.ok) {
    return NextResponse.json({ reply: result.text, crisis })
  }

  // Model unavailable, declined, or errored. If this looks like a crisis, still return the
  // resources so the person is never left with nothing.
  if (crisis) {
    return NextResponse.json({ reply: CRISIS_RESOURCES_TEXT, crisis: true })
  }
  const status = result.reason === 'not_configured' ? 503 : 502
  return NextResponse.json(
    { error: "I can't respond right now. If you need help, call or text 988 anytime.", crisis: false },
    { status }
  )
}
