import type {
  UserRole,
  UserStatus,
  VerificationStatus,
  AppointmentStatus,
  PaymentStatus,
  PaymentMethod,
  OrderStatus,
  NotificationType,
  AppointmentMode,
  Gender,
  BloodGroup,
  DayOfWeek,
} from './enums'

// ─── Core Tables ────────────────────────────────────────────────────────────

export interface Profile {
  id: string
  auth_user_id: string
  email: string
  full_name: string
  phone: string | null
  avatar_url: string | null
  role: UserRole
  status: UserStatus
  date_of_birth: string | null
  gender: Gender | null
  blood_group: BloodGroup | null
  address: string | null
  city: string | null
  state: string | null
  country: string
  created_at: string
  updated_at: string
}

export interface PartnerType {
  id: string
  name: string
  slug: string
  icon: string | null
  description: string | null
  active: boolean
  created_at: string
}

export interface Partner {
  id: string
  profile_id: string
  partner_type_id: string
  business_name: string
  license_number: string | null
  verification_status: VerificationStatus
  specialization: string[] | null
  experience_years: number | null
  bio: string | null
  phone: string | null
  email: string | null
  website: string | null
  address: string | null
  city: string | null
  state: string | null
  country: string
  latitude: number | null
  longitude: number | null
  logo_url: string | null
  cover_url: string | null
  rating: number
  total_reviews: number
  is_available: boolean
  created_at: string
  updated_at: string
}

export interface ServiceCategory {
  id: string
  name: string
  slug: string
  icon: string | null
  description: string | null
  active: boolean
  created_at: string
}

export interface Service {
  id: string
  category_id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  active: boolean
  created_at: string
}

export interface PartnerService {
  id: string
  partner_id: string
  service_id: string
  price: number | null
  duration_minutes: number | null
  description: string | null
  is_active: boolean
  created_at: string
}

export interface PartnerAvailability {
  id: string
  partner_id: string
  day_of_week: DayOfWeek
  start_time: string
  end_time: string
  is_available: boolean
  created_at: string
}

export interface PartnerUnavailability {
  id: string
  partner_id: string
  date: string
  reason: string | null
  created_at: string
}

// ─── Appointment Tables ──────────────────────────────────────────────────────

export interface Appointment {
  id: string
  client_id: string
  partner_id: string
  partner_service_id: string | null
  status: AppointmentStatus
  mode: AppointmentMode
  scheduled_at: string
  duration_minutes: number
  notes: string | null
  symptoms: string | null
  cancellation_reason: string | null
  video_call_url: string | null
  created_at: string
  updated_at: string
}

// ─── Medical Records ─────────────────────────────────────────────────────────

export interface MedicalRecord {
  id: string
  client_id: string
  partner_id: string | null
  appointment_id: string | null
  title: string
  description: string | null
  file_url: string | null
  record_type: 'prescription' | 'lab_report' | 'imaging' | 'discharge_summary' | 'vaccination' | 'other'
  record_date: string
  created_at: string
}

export interface Prescription {
  id: string
  appointment_id: string
  client_id: string
  partner_id: string
  diagnosis: string | null
  instructions: string | null
  follow_up_date: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PrescriptionMedicine {
  id: string
  prescription_id: string
  medicine_name: string
  dosage: string
  frequency: string
  duration: string
  instructions: string | null
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export interface Order {
  id: string
  client_id: string
  partner_id: string | null
  status: OrderStatus
  order_type: 'medicine' | 'lab_test' | 'equipment' | 'other'
  total_amount: number
  delivery_address: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  item_name: string
  quantity: number
  unit_price: number
  total_price: number
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export interface Payment {
  id: string
  client_id: string
  partner_id: string | null
  appointment_id: string | null
  order_id: string | null
  amount: number
  currency: string
  status: PaymentStatus
  payment_method: PaymentMethod | null
  gateway_transaction_id: string | null
  gateway_response: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

export interface Review {
  id: string
  client_id: string
  partner_id: string
  appointment_id: string | null
  rating: number
  comment: string | null
  reply: string | null
  is_visible: boolean
  created_at: string
  updated_at: string
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  data: Record<string, unknown> | null
  is_read: boolean
  created_at: string
}

// ─── Audit Logs ──────────────────────────────────────────────────────────────

export interface AuditLog {
  id: string
  user_id: string | null
  action: string
  entity_type: string
  entity_id: string | null
  old_values: Record<string, unknown> | null
  new_values: Record<string, unknown> | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

// ─── CMS / Blog ───────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string
  author_id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image_url: string | null
  tags: string[]
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

// ─── Join / Extended Types ────────────────────────────────────────────────────

export interface PartnerWithType extends Partner {
  partner_types: PartnerType
  profiles: Pick<Profile, 'full_name' | 'avatar_url' | 'email'>
}

export interface AppointmentWithRelations extends Appointment {
  partners: Pick<Partner, 'business_name' | 'logo_url'>
  profiles: Pick<Profile, 'full_name' | 'avatar_url'>
  partner_services: Pick<PartnerService, 'price' | 'duration_minutes'> & {
    services: Pick<Service, 'name'>
  }
}
