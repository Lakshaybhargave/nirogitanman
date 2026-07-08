import { AdminSidebar } from '@/components/layout/sidebar'
import { AdminHeader } from '@/components/layout/header'
import { getSupabaseServerClient } from '@nirogitanman/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, email, role')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) redirect('/login')

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar user={profile} />
      <div className="flex flex-1 flex-col min-w-0">
        <AdminHeader user={profile} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
