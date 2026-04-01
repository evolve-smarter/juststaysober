import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { JournalForm } from '@/components/journal/journal-form'
import { format } from 'date-fns'

export const metadata = { title: 'Journal' }

const moodEmojis: Record<string, string> = {
  grateful: '🙏',
  hopeful: '✨',
  struggling: '😔',
  strong: '💪',
  peaceful: '😌',
}

export default async function JournalPage() {
  const session = await auth()
  const userId = session!.user!.id!

  const entries = await prisma.journalEntry.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 30,
  })

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Journal</h1>
      <p className="text-gray-400 mb-8">
        Private reflections on your journey. Only you can see these.
      </p>

      <JournalForm />

      {entries.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-3">📓</div>
          <p>No entries yet. Write your first reflection above.</p>
        </div>
      )}

      <div className="space-y-4 mt-8">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bg-gray-900/60 border border-white/10 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">
                {format(entry.createdAt, 'MMMM d, yyyy')}
              </span>
              {entry.mood && (
                <span className="flex items-center gap-1 text-sm text-gray-300">
                  {moodEmojis[entry.mood] ?? '💭'} {entry.mood}
                </span>
              )}
            </div>
            <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">{entry.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
