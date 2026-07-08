'use server'

import { getSupabaseServerClient } from '@nirogitanman/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type { VerificationStatus } from '@nirogitanman/types'

const updateStatusSchema = z.object({
  partnerId: z.string().uuid(),
  status: z.enum(['pending', 'under_review', 'verified', 'rejected', 'suspended']),
  reason: z.string().optional(),
})

export async function updatePartnerVerificationStatus(formData: FormData) {
  const supabase = await getSupabaseServerClient()

  // Verify admin access
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    return { error: 'Unauthorized' }
  }

  const parsed = updateStatusSchema.safeParse({
    partnerId: formData.get('partnerId'),
    status: formData.get('status'),
    reason: formData.get('reason') ?? undefined,
  })

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Invalid input' }
  }

  const { partnerId, status } = parsed.data

  const { error } = await supabase
    .from('partners')
    .update({ verification_status: status as VerificationStatus })
    .eq('id', partnerId)

  if (error) return { error: error.message }

  // Notify the partner
  const { data: partner } = await supabase
    .from('partners')
    .select('profile_id')
    .eq('id', partnerId)
    .single()

  if (partner) {
    await supabase.from('notifications').insert({
      user_id: partner.profile_id,
      type: 'verification_update',
      title: status === 'verified' ? '🎉 Account Verified!' : 'Verification Status Update',
      message:
        status === 'verified'
          ? 'Your partner account has been verified. You can now accept appointments.'
          : `Your verification status has been updated to: ${status.replace('_', ' ')}.`,
    })
  }

  revalidatePath('/partners')
  return { success: true }
}
