import { getSupabaseServerClient } from '@nirogitanman/supabase/server'
import { redirect } from 'next/navigation'
import { Calendar, Users, DollarSign, Star, ArrowRight, Clock } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Partner Dashboard' }

export default async function PartnerDashboardPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('auth_user_id', user.id)
    .single()
  if (!profile) redirect('/login')

  const { data: partner } = await supabase
    .from('partners')
    .select('id, business_name, rating, total_reviews, is_available, verification_status')
    .eq('profile_id', profile.id)
    .single()

  if (!partner) redirect('/register/complete')

  // Summary stats
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const [
    { count: todayAppts },
    { count: totalPatients },
    { count: pendingAppts },
  ] = await Promise.all([
    supabase.from('appointments').select('*', { count: 'exact', head: true })
      .eq('partner_id', partner.id)
      .gte('scheduled_at', today.toISOString())
      .lt('scheduled_at', tomorrow.toISOString()),
    supabase.from('appointments').select('client_id', { count: 'exact', head: true })
      .eq('partner_id', partner.id)
      .eq('status', 'completed'),
    supabase.from('appointments').select('*', { count: 'exact', head: true })
      .eq('partner_id', partner.id)
      .eq('status', 'pending'),
  ])

  // Upcoming today
  const { data: todaySchedule } = await supabase
    .from('appointments')
    .select(`
      id, scheduled_at, status, mode,
      profiles!appointments_client_id_fkey ( full_name )
    `)
    .eq('partner_id', partner.id)
    .gte('scheduled_at', today.toISOString())
    .lt('scheduled_at', tomorrow.toISOString())
    .in('status', ['confirmed', 'pending'])
    .order('scheduled_at', { ascending: true })
    .limit(8)

  const stats = [
    { label: "Today's Appointments", value: todayAppts ?? 0, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Pending Requests', value: pendingAppts ?? 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Total Patients', value: totalPatients ?? 0, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Your Rating', value: partner.rating ? `${partner.rating} ★` : 'N/A', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {profile.full_name.split(' ')[0]} 👋</h1>
          <p className="text-muted-foreground mt-1">{partner.business_name}</p>
        </div>
        {partner.verification_status !== 'verified' && (
          <Link
            href="/verification"
            className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100 transition-colors"
          >
            ⚠️ Complete Verification
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-xl bg-card border p-5">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg} ${color} mb-3`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm text-muted-foreground mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Today's schedule */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Today's Schedule</h2>
          <Link href="/appointments" className="text-sm text-primary hover:underline flex items-center gap-1">
            All appointments <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {todaySchedule && todaySchedule.length > 0 ? (
          <div className="space-y-3">
            {todaySchedule.map((appt) => {
              const client = appt.profiles as { full_name: string } | null
              return (
                <div key={appt.id} className="flex items-center gap-4 rounded-xl bg-card border p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                    {client?.full_name?.charAt(0) ?? '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{client?.full_name ?? 'Patient'}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(appt.scheduled_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      {' · '}{appt.mode.replace('_', ' ')}
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {appt.status}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No appointments scheduled for today.</p>
          </div>
        )}
      </div>
    </div>
  )
}
