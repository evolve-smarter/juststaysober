interface Milestone {
  id: string
  days: number
  label: string
  emoji: string
  description: string
  badgeColor: string
}

export function MilestoneCard({
  milestone,
  earned = false,
  locked = false,
}: {
  milestone: Milestone
  earned?: boolean
  locked?: boolean
}) {
  return (
    <div
      className={`relative rounded-xl p-5 border transition-all ${
        locked
          ? 'bg-gray-900/30 border-white/5 opacity-50'
          : earned
          ? 'bg-gray-900/60 border-white/20 hover:border-purple-500/40'
          : 'bg-gray-900/40 border-white/10'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`text-3xl flex-shrink-0 ${locked ? 'grayscale' : ''}`}
        >
          {locked ? '🔒' : milestone.emoji}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-white font-semibold text-sm">{milestone.label}</h3>
            {earned && (
              <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                Earned ✓
              </span>
            )}
          </div>
          <p className="text-gray-400 text-xs mt-1">{milestone.description}</p>
          <p className="text-gray-600 text-xs mt-1">{milestone.days} days</p>
        </div>
      </div>
    </div>
  )
}
