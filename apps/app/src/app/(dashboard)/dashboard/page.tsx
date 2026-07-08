import { getSupabaseServerClient } from '@nirogitanman/supabase/server'
import { redirect } from 'next/navigation'
import { Calendar, FileText, ShoppingBag, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile) redirect('/login')

  // Fetch summary stats
  const [{ count: apptCount }, { count: recordsCount }, { count: ordersCount }] = await Promise.all([
    supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', profile.id),
    supabase
      .from('medical_records')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', profile.id),
    supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', profile.id),
  ])

  // Fetch upcoming appointments
  const { data: upcoming } = await supabase
    .from('appointments')
    .select(`
      id, scheduled_at, mode, status,
      partners ( business_name, logo_url ),
      partner_services ( services ( name ) )
    `)
    .eq('client_id', profile.id)
    .in('status', ['pending', 'confirmed'])
    .gte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true })
    .limit(5)

  const firstName = profile.full_name.split(' ')[0]

  const stats = [
    { label: 'Total Appointments', value: apptCount ?? 0, icon: Calendar, href: '/appointments' },
    { label: 'Medical Records', value: recordsCount ?? 0, icon: FileText, href: '/records' },
    { label: 'Orders', value: ordersCount ?? 0, icon: ShoppingBag, href: '/orders' },
  ]

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold">Good day, {firstName} 👋</h1>
        <p className="text-muted-foreground mt-1">Here's an overview of your health activity.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href} className="group rounded-xl bg-card border p-5 flex items-center gap-4 hover:border-primary transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Book Appointment', href: '/find-providers', icon: '🩺' },
            { label: 'Upload Record', href: '/records/upload', icon: '📁' },
            { label: 'Order Medicine', href: '/find-providers?type=pharmacy', icon: '💊' },
            { label: 'Video Consult', href: '/find-providers?mode=video', icon: '💻' },
          ].map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="flex flex-col items-center gap-2 rounded-xl bg-card border p-4 text-center hover:border-primary hover:shadow-sm transition-all text-sm font-medium"
            >
              <span className="text-2xl">{a.icon}</span>
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Upcoming appointments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Upcoming Appointments</h2>
          <Link href="/appointments" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {upcoming && upcoming.length > 0 ? (
          <div className="space-y-3">
            {upcoming.map((appt) => (
              <div key={appt.id} className="flex items-center gap-4 rounded-xl bg-card border p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {(appt.partners as { business_name: string } | null)?.business_name ?? 'Provider'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(appt.scheduled_at).toLocaleDateString('en-IN', {
                      weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                    {' · '}
                    {appt.mode.replace('_', ' ')}
                  </div>
                </div>
                <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
                  appt.status === 'confirmed'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {appt.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No upcoming appointments.</p>
            <Link href="/find-providers" className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline">
              Book your first appointment <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
