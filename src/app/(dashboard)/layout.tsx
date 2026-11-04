import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Sidebar } from '@/components/layout/sidebar'
import { isAdminEmail } from '@/lib/community'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-950 md:flex-row">
      <Sidebar user={session.user} isAdmin={isAdminEmail(session.user.email)} />
      <main className="min-h-0 flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
