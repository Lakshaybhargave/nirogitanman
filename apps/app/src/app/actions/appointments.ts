'use server'

import { getSupabaseServerClient } from '@nirogitanman/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { redirect } from 'next/navigation'

const bookAppointmentSchema = z.object({
  partner_id: z.string().uuid(),
  partner_service_id: z.string().uuid().optional(),
  scheduled_at: z.string().datetime(),
  mode: z.enum(['in_person', 'video', 'phone', 'home_visit']),
  notes: z.string().max(500).optional(),
  symptoms: z.string().max(1000).optional(),
  duration_minutes: z.coerce.number().min(15).max(480).default(30),
})

export async function bookAppointment(formData: FormData) {
  const supabase = await getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile || profile.role !== 'client') {
    return { error: 'Only clients can book appointments.' }
  }

  const parsed = bookAppointmentSchema.safeParse({
    partner_id: formData.get('partner_id'),
    partner_service_id: formData.get('partner_service_id') || undefined,
    scheduled_at: formData.get('scheduled_at'),
    mode: formData.get('mode'),
    notes: formData.get('notes') || undefined,
    symptoms: formData.get('symptoms') || undefined,
    duration_minutes: formData.get('duration_minutes'),
  })

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Invalid input' }
  }

  const { data: appointment, error } = await supabase
    .from('appointments')
    .insert({
      client_id: profile.id,
      ...parsed.data,
      status: 'pending',
    })
    .select()
    .single()

  if (error) return { error: error.message }

  // Notify the partner
  const { data: partner } = await supabase
    .from('partners')
    .select('profile_id')
    .eq('id', parsed.data.partner_id)
    .single()

  if (partner) {
    await supabase.from('notifications').insert({
      user_id: partner.profile_id,
      type: 'appointment_booked',
      title: 'New Appointment Request',
      message: `You have a new appointment request for ${new Date(parsed.data.scheduled_at).toLocaleString('en-IN')}.`,
      data: { appointment_id: appointment.id },
    })
  }

  revalidatePath('/appointments')
  return { success: true, appointment_id: appointment.id }
}

export async function cancelAppointment(appointmentId: string, reason?: string) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()
  if (!profile) return { error: 'Profile not found' }

  const { error } = await supabase
    .from('appointments')
    .update({ status: 'cancelled', cancellation_reason: reason ?? null })
    .eq('id', appointmentId)
    .eq('client_id', profile.id)

  if (error) return { error: error.message }

  revalidatePath('/appointments')
  return { success: true }
}
