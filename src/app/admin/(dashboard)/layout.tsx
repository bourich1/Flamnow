import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { signOutAdmin } from '@/app/actions/auth'
import AdminLayoutClient from '@/components/admin/AdminLayoutClient'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  // Authenticate user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Server Action to trigger logout
  const handleLogout = async () => {
    'use server'
    await signOutAdmin()
    redirect('/admin/login')
  }

  return (
    <AdminLayoutClient userEmail={user.email || ''} handleLogout={handleLogout}>
      {children}
    </AdminLayoutClient>
  )
}
