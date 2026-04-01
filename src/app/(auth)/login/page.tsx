import Link from 'next/link'
import { SignInForm } from '@/components/auth/sign-in-form'

export const metadata = { title: 'Sign In' }

export default function LoginPage({
  searchParams,
}: {
  searchParams: { verify?: string; error?: string }
}) {
  if (searchParams.verify) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
        <div className="w-full max-w-md text-center">
          <div className="text-5xl mb-4">📬</div>
          <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
          <p className="text-gray-400">
            We sent you a magic link. Click it to sign in — no password needed.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 via-purple-950/10 to-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-2xl">🕊️</span>
            <span className="text-xl font-bold text-white">JustStaySober</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-gray-400 mt-2 text-sm">Sign in to continue your journey</p>
        </div>

        <div className="bg-gray-900/60 border border-white/10 rounded-2xl p-6">
          {searchParams.error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 text-red-400 text-sm text-center">
              Something went wrong. Please try again.
            </div>
          )}
          <SignInForm />
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          New here?{' '}
          <Link href="/signup" className="text-purple-400 hover:text-purple-300 transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
