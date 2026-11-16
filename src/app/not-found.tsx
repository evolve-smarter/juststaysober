import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6 text-center">
      <div className="max-w-md">
        <div className="text-5xl mb-4">🌅</div>
        <h1 className="text-2xl font-bold text-white mb-2">We couldn&apos;t find that page</h1>
        <p className="text-gray-400 mb-6">It may have moved. Let&apos;s get you back on track.</p>
        <Link href="/dashboard" className="inline-block rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-500">
          Go to your dashboard
        </Link>
        <p className="mt-8 text-xs text-gray-400">
          If you need help right now, call or text <a href="tel:988" className="underline text-purple-400">988</a>.
        </p>
      </div>
    </div>
  )
}
