import { PartnerSidebar } from '@/components/layout/sidebar'
import { PartnerHeader } from '@/components/layout/header'
import { getSupabaseServerClient } from '@nirogitanman/supabase/server'
import { redirect } from 'next/navigation'

export default async function PartnerDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, email, role')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile || profile.role !== 'partner') redirect('/login')

  const { data: partner } = await supabase
    .from('partners')
    .select('id, business_name, verification_status, logo_url, partner_types(name)')
    .eq('profile_id', profile.id)
    .single()

  return (
    <div className="flex min-h-screen bg-muted/30">
      <PartnerSidebar user={profile} partner={partner} />
      <div className="flex flex-1 flex-col min-w-0">
        <PartnerHeader user={profile} partner={partner} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
