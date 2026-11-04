import { notFound } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { prisma } from '@/lib/db'
import { currentMember, isAdminEmail } from '@/lib/community'
import { ModerationActions } from '@/components/admin/moderation-actions'

export const metadata = { title: 'Moderation' }
export const dynamic = 'force-dynamic'

const REASON_LABEL: Record<string, string> = {
  self_harm_risk: 'Possible self-harm risk',
  harassment: 'Harassment or hate',
  solicitation: 'Selling / recruiting',
  medical_advice: 'Medical advice',
  spam: 'Spam',
  other: 'Other',
}

export default async function AdminReportsPage() {
  const member = await currentMember()
  if (!member || !isAdminEmail(member.email)) notFound()

  const reports = await prisma.report.findMany({
    where: { status: 'open' },
    orderBy: { createdAt: 'asc' },
    include: {
      post: { include: { user: { select: { email: true, suspendedAt: true } } } },
      comment: { include: { user: { select: { email: true, suspendedAt: true } } } },
    },
  })

  // Group reports by the post/comment they point at.
  const groups = new Map<
    string,
    { key: string; type: 'post' | 'comment'; id: string; content: string; hidden: boolean; authorEmail: string; suspended: boolean; isAnon: boolean; reasons: string[]; details: string[]; first: Date }
  >()
  for (const r of reports) {
    const type = r.post ? 'post' : 'comment'
    const item = r.post ?? r.comment
    if (!item) continue
    const key = `${type}:${item.id}`
    const g = groups.get(key) ?? {
      key, type, id: item.id, content: item.content, hidden: !!item.hiddenAt,
      authorEmail: item.user.email, suspended: !!item.user.suspendedAt, isAnon: item.isAnon,
      reasons: [] as string[], details: [] as string[], first: r.createdAt,
    }
    g.reasons.push(r.reason)
    if (r.details) g.details.push(r.details)
    groups.set(key, g)
  }
  // Possible self-harm risk first, then most-reported, then oldest.
  const sorted = [...groups.values()].sort((a, b) => {
    const ar = a.reasons.includes('self_harm_risk') ? 0 : 1
    const br = b.reasons.includes('self_harm_risk') ? 0 : 1
    return ar - br || b.reasons.length - a.reasons.length || a.first.getTime() - b.first.getTime()
  })

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Moderation queue</h1>
      <p className="text-gray-400 mb-2">
        {sorted.length} item{sorted.length === 1 ? '' : 's'} with open reports. Possible self-harm
        risk is listed first.
      </p>
      <p className="text-gray-500 text-sm mb-8">
        Author emails are shown to admins so action can be taken, including for anonymous posts.
        Do not share them.
      </p>

      {sorted.length === 0 && <p className="text-gray-500">Nothing to review.</p>}

      <div className="space-y-4">
        {sorted.map((g) => (
          <div key={g.key} className="rounded-xl border border-white/10 bg-gray-900/60 p-5">
            <div className="flex flex-wrap gap-2 mb-3 text-xs">
              <span className="rounded-full bg-gray-800 px-2 py-0.5 text-gray-300">{g.type}</span>
              {g.hidden && <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-amber-300">hidden</span>}
              {g.suspended && <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-red-300">author suspended</span>}
              {[...new Set(g.reasons)].map((reason) => (
                <span
                  key={reason}
                  className={`rounded-full px-2 py-0.5 ${reason === 'self_harm_risk' ? 'bg-red-500/30 text-red-200' : 'bg-gray-800 text-gray-300'}`}
                >
                  {REASON_LABEL[reason] ?? reason} ×{g.reasons.filter((x) => x === reason).length}
                </span>
              ))}
              <span className="text-gray-600 ml-auto">first reported {formatDistanceToNow(g.first, { addSuffix: true })}</span>
            </div>
            <p className="text-gray-200 whitespace-pre-wrap mb-3">{g.content}</p>
            {g.details.length > 0 && (
              <ul className="mb-3 list-disc pl-5 text-sm text-gray-400">
                {g.details.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            )}
            <p className="text-xs text-gray-500 mb-3">
              Author: {g.authorEmail}{g.isAnon ? ' (posted anonymously)' : ''}
            </p>
            <ModerationActions type={g.type} id={g.id} hidden={g.hidden} />
          </div>
        ))}
      </div>
    </div>
  )
}
