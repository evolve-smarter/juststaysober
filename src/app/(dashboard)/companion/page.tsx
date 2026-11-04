import { CompanionChat } from '@/components/companion/companion-chat'

export const metadata = { title: 'Sober Guide' }

export default function CompanionPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Sober Guide</h1>
      <p className="text-gray-400 mb-2">
        An AI companion for support and information, available any time.
      </p>
      <p className="text-gray-500 text-sm mb-6">
        It is not a therapist or a medical professional, and it can make mistakes. Your
        conversations are not saved. In an emergency call 911; for a crisis call or text 988.
      </p>
      <CompanionChat />
    </div>
  )
}
