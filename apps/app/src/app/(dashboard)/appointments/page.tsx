import { getSupabaseServerClient } from '@nirogitanman/supabase/server'
import { redirect } from 'next/navigation'
import { Calendar, Clock, Video, Phone, Home, MapPin } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Appointments' }

const modeIcons = {
  in_person: MapPin,
  video: Video,
  phone: Phone,
  home_visit: Home,
}

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
  in_progress: 'bg-purple-100 text-purple-700',
  no_show: 'bg-gray-100 text-gray-600',
  rescheduled: 'bg-orange-100 text-orange-700',
}

export default async function AppointmentsPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()
  if (!profile) redirect('/login')

  const { data: appointments } = await supabase
    .from('appointments')
    .select(`
      id, scheduled_at, mode, status, notes, duration_minutes,
      partners ( business_name, logo_url, city ),
      partner_services ( price, services ( name ) )
    `)
    .eq('client_id', profile.id)
    .order('scheduled_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Appointments</h1>
          <p className="text-muted-foreground mt-1">Manage all your healthcare appointments.</p>
        </div>
        <Link
          href="/find-providers"
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Calendar className="h-4 w-4" />
          Book New
        </Link>
      </div>

      {appointments && appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appt) => {
            const ModeIcon = modeIcons[appt.mode as keyof typeof modeIcons] ?? MapPin
            const partner = appt.partners as { business_name: string; city: string | null } | null
            const service = (appt.partner_services as { services: { name: string } | null } | null)?.services

            return (
              <div key={appt.id} className="rounded-xl bg-card border p-5 flex flex-col sm:flex-row gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                  <Clock className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <div className="font-semibold">{partner?.business_name ?? 'Provider'}</div>
                      {service && <div className="text-sm text-muted-foreground">{service.name}</div>}
                      {partner?.city && <div className="text-xs text-muted-foreground">{partner.city}</div>}
                    </div>
                    <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[appt.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {appt.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(appt.scheduled_at).toLocaleDateString('en-IN', {
                        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(appt.scheduled_at).toLocaleTimeString('en-IN', {
                        hour: '2-digit', minute: '2-digit',
                      })}
                      {' · '}{appt.duration_minutes} min
                    </span>
                    <span className="flex items-center gap-1">
                      <ModeIcon className="h-3 w-3" />
                      {appt.mode.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-xl border bg-card p-12 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
          <h2 className="font-semibold mb-2">No appointments yet</h2>
          <p className="text-sm text-muted-foreground mb-4">Find a healthcare provider and book your first appointment.</p>
          <Link
            href="/find-providers"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Find Providers
          </Link>
        </div>
      )}
    </div>
  )
}
