export type UserRole = 'client' | 'partner' | 'admin' | 'super_admin'

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification'

export type VerificationStatus = 'pending' | 'under_review' | 'verified' | 'rejected' | 'suspended'

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'rescheduled'

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'disputed'

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet' | 'cash' | 'insurance'

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'dispatched' | 'delivered' | 'cancelled' | 'returned'

export type NotificationType =
  | 'appointment_booked'
  | 'appointment_confirmed'
  | 'appointment_cancelled'
  | 'appointment_reminder'
  | 'prescription_added'
  | 'report_ready'
  | 'order_update'
  | 'payment_success'
  | 'payment_failed'
  | 'verification_update'
  | 'system'

export type AppointmentMode = 'in_person' | 'video' | 'phone' | 'home_visit'

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say'

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
