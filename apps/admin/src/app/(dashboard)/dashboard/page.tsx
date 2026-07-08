import { getSupabaseServerClient } from '@nirogitanman/supabase/server'
import { redirect } from 'next/navigation'
import { Users, Stethoscope, Calendar, DollarSign, ShieldAlert, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Admin Dashboard' }

export default async function AdminDashboardPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Platform-wide stats
  const [
    { count: totalUsers },
    { count: totalPartners },
    { count: pendingVerifications },
    { count: totalAppointments },
    { count: todayAppointments },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client'),
    supabase.from('partners').select('*', { count: 'exact', head: true }),
    supabase.from('partners').select('*', { count: 'exact', head: true }).eq('verification_status', 'pending'),
    supabase.from('appointments').select('*', { count: 'exact', head: true }),
    supabase.from('appointments').select('*', { count: 'exact', head: true })
      .gte('scheduled_at', new Date(new Date().setHours(0,0,0,0)).toISOString()),
  ])

  // Recent partner verification requests
  const { data: pendingPartners } = await supabase
    .from('partners')
    .select(`
      id, business_name, created_at,
      partner_types ( name ),
      profiles!partners_profile_id_fkey ( full_name, email )
    `)
    .eq('verification_status', 'pending')
    .order('created_at', { ascending: false })
    .limit(5)

  // Recent users
  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    { label: 'Total Clients', value: totalUsers ?? 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', href: '/users' },
    { label: 'Total Partners', value: totalPartners ?? 0, icon: Stethoscope, color: 'text-purple-600', bg: 'bg-purple-100', href: '/partners' },
    { label: 'Pending Verifications', value: pendingVerifications ?? 0, icon: ShieldAlert, color: 'text-amber-600', bg: 'bg-amber-100', href: '/partners?status=pending' },
    { label: 'Total Appointments', value: totalAppointments ?? 0, icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-100', href: '/analytics' },
    { label: "Today's Appointments", value: todayAppointments ?? 0, icon: TrendingUp, color: 'text-red-600', bg: 'bg-red-100', href: '/analytics' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Platform Overview</h1>
        <p className="text-muted-foreground mt-1">Real-time NirogiTanman platform statistics.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, href }) => (
          <Link key={label} href={href} className="rounded-xl bg-card border p-5 hover:border-primary transition-colors">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg} ${color} mb-3`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold">{value.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending verifications */}
        <div className="rounded-xl bg-card border">
          <div className="flex items-center justify-between p-5 border-b">
            <h2 className="font-semibold">Pending Verifications</h2>
            <Link href="/partners?status=pending" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y">
            {pendingPartners && pendingPartners.length > 0 ? (
              pendingPartners.map((p) => {
                const pf = p.profiles as { full_name: string; email: string } | null
                const pt = p.partner_types as { name: string } | null
                return (
                  <div key={p.id} className="flex items-center gap-3 p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700 font-semibold text-sm shrink-0">
                      {p.business_name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{p.business_name}</div>
                      <div className="text-xs text-muted-foreground">{pt?.name} · {pf?.email}</div>
                    </div>
                    <Link
                      href={`/partners/${p.id}`}
                      className="shrink-0 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Review
                    </Link>
                  </div>
                )
              })
            ) : (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No pending verifications.
              </div>
            )}
          </div>
        </div>

        {/* Recent users */}
        <div className="rounded-xl bg-card border">
          <div className="flex items-center justify-between p-5 border-b">
            <h2 className="font-semibold">Recent Users</h2>
            <Link href="/users" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="divide-y">
            {recentUsers && recentUsers.length > 0 ? (
              recentUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-3 p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                    {u.full_name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{u.full_name}</div>
                    <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                  </div>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full capitalize font-medium ${
                    u.role === 'client' ? 'bg-blue-100 text-blue-700' :
                    u.role === 'partner' ? 'bg-purple-100 text-purple-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {u.role}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-sm text-muted-foreground">No users found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
