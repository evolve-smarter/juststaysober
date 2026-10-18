import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedPaths = ['/dashboard', '/milestones', '/journal', '/community', '/resources', '/profile']

// Middleware runs on the Edge runtime, which cannot use the Prisma adapter that backs
// database sessions. It only checks that a session cookie exists; the real session
// validation happens in the (dashboard) layout and in each API route via auth().
const SESSION_COOKIES = ['authjs.session-token', '__Secure-authjs.session-token']

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
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
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
