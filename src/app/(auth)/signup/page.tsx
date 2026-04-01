import Link from 'next/link'
import { SignInForm } from '@/components/auth/sign-in-form'

export const metadata = { title: 'Create Account' }

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 via-purple-950/10 to-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-2xl">🕊️</span>
            <span className="text-xl font-bold text-white">JustStaySober</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Start your journey</h1>
          <p className="text-gray-400 mt-2 text-sm">
            No judgment. No pressure. Just support.
          </p>
        </div>

        <div className="bg-gray-900/60 border border-white/10 rounded-2xl p-6">
          <SignInForm isSignup />
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
            Sign in
          </Link>
        </p>

        <p className="text-center text-gray-600 text-xs mt-4">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="underline">Terms</Link> and{' '}
          <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}
