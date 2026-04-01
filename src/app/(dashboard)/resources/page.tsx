import { prisma } from '@/lib/db'

export const metadata = { title: 'Resources' }

const typeLabels: Record<string, { label: string; emoji: string }> = {
  hotline: { label: 'Hotlines', emoji: '📞' },
  treatment_center: { label: 'Treatment Centers', emoji: '🏥' },
  meeting: { label: 'Meetings', emoji: '🤝' },
  app: { label: 'Apps', emoji: '📱' },
  book: { label: 'Books', emoji: '📖' },
  podcast: { label: 'Podcasts', emoji: '🎙️' },
}

export default async function ResourcesPage() {
  const resources = await prisma.resource.findMany({
    orderBy: [{ type: 'asc' }, { name: 'asc' }],
  })

  const grouped = resources.reduce<Record<string, typeof resources>>((acc, r) => {
    if (!acc[r.type]) acc[r.type] = []
    acc[r.type].push(r)
    return acc
  }, {})

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Resources</h1>
      <p className="text-gray-400 mb-8">
        Vetted support resources for your recovery journey.
      </p>

      {/* Crisis banner */}
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 mb-8">
        <h2 className="text-red-300 font-semibold mb-2">🆘 In crisis right now?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a href="tel:18006624357" className="flex items-center gap-3 bg-red-500/10 rounded-lg p-3 hover:bg-red-500/20 transition-colors">
            <span className="text-2xl">📞</span>
            <div>
              <div className="text-white font-medium text-sm">SAMHSA Helpline</div>
              <div className="text-red-300 text-sm">1-800-662-4357 (24/7, free)</div>
            </div>
          </a>
          <div className="flex items-center gap-3 bg-red-500/10 rounded-lg p-3">
            <span className="text-2xl">💬</span>
            <div>
              <div className="text-white font-medium text-sm">Crisis Text Line</div>
              <div className="text-red-300 text-sm">Text HOME to 741741</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grouped resources */}
      {Object.entries(grouped).map(([type, items]) => (
        <div key={type} className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span>{typeLabels[type]?.emoji ?? '📌'}</span>
            {typeLabels[type]?.label ?? type}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((r) => (
              <div
                key={r.id}
                className="bg-gray-900/60 border border-white/10 rounded-xl p-5 hover:border-purple-500/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-white font-medium">{r.name}</h3>
                  {r.isVerified && (
                    <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full flex-shrink-0">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-3">{r.description}</p>
                {r.city && (
                  <p className="text-gray-500 text-xs mb-3">
                    📍 {r.city}, {r.state}
                  </p>
                )}
                <div className="flex gap-2">
                  {r.phone && (
                    <a
                      href={`tel:${r.phone.replace(/\D/g, '')}`}
                      className="text-xs bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      📞 {r.phone}
                    </a>
                  )}
                  {r.url && (
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      🔗 Visit site
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
