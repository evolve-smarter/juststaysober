'use client'

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6 text-center">
      <div className="max-w-md">
        <div className="text-5xl mb-4">🌧️</div>
        <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
        <p className="text-gray-400 mb-6">It&apos;s on us, not you. Please try again.</p>
        <button onClick={reset} className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-500">
          Try again
        </button>
        <p className="mt-8 text-sm text-gray-400">
          If you need help right now, call or text <a href="tel:988" className="underline text-purple-400">988</a>, or call{' '}
          <a href="tel:911" className="underline text-purple-400">911</a> in an emergency.
        </p>
      </div>
    </div>
  )
}
