import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { rateLimited } from '@/lib/rate-limit'

const protectedPaths = ['/dashboard', '/milestones', '/journal', '/companion', '/community', '/resources', '/profile', '/admin']

// Middleware runs on the Edge runtime, which cannot use the Prisma adapter that backs
// database sessions. It only checks that a session cookie exists; the real session
// validation happens in the (dashboard) layout and in each API route via auth().
const SESSION_COOKIES = ['authjs.session-token', '__Secure-authjs.session-token']

// Sign-in attempts per client address per hour. Stops the email sign-in form being used to
// flood other people with emails (cost + sender reputation). Generous because many people can
// share one address (treatment-center or public wifi). Per server instance only.
const SIGNIN_MAX_PER_HOUR = 20

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (req.method === 'POST' && pathname.startsWith('/api/auth/signin')) {
    // Behind Caddy/Railway the real address arrives in x-forwarded-for. If it is missing, skip
    // limiting rather than lump everyone into one bucket.
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    if (ip && rateLimited(`signin:${ip}`, SIGNIN_MAX_PER_HOUR, 60 * 60 * 1000)) {
      return NextResponse.json({ error: 'Too many sign-in attempts. Please try again later.' }, { status: 429 })
    }
    return NextResponse.next()
  }

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))
  const hasSession = SESSION_COOKIES.some((name) => req.cookies.has(name))

  if (isProtected && !hasSession) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)', '/api/auth/signin/:path*'],
}
