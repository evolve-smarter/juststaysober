import Link from 'next/link'

export function LegalPage({
  title,
  children,
  draft = true,
}: {
  title: string
  children: React.ReactNode
  draft?: boolean
}) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-300">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link href="/" className="text-purple-400 text-sm hover:underline">← JustStaySober</Link>
        <h1 className="mt-4 text-3xl font-bold text-white">{title}</h1>
        {draft && (
          <div role="note" className="mt-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
            <strong>DRAFT — not yet reviewed by a lawyer.</strong> This text was prepared from how the app
            works today. Items in [brackets] are unknown or need a decision. Do not rely on it as legal advice.
          </div>
        )}
        <div className="mt-8 space-y-4 leading-relaxed [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_a]:text-purple-400 [&_a]:underline">
          {children}
        </div>
        <p className="mt-12 text-sm text-gray-500">
          If you are in danger, call 911. For a crisis, call or text{' '}
          <a href="tel:988" className="text-purple-400 underline">988</a>.
        </p>
      </div>
    </div>
  )
}
