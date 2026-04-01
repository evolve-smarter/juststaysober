import { PrismaAdapter } from '@auth/prisma-adapter'
import { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import Resend from 'next-auth/providers/resend'
import { prisma } from '@/lib/db'

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Resend({
      from: process.env.EMAIL_FROM ?? 'noreply@juststaysober.com',
    }),
  ],
  pages: {
    signIn: '/login',
    verifyRequest: '/login?verify=1',
  },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      return session
    },
  },
}
