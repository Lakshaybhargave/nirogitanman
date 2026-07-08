export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: import('@nirogitanman/types').Profile
        Insert: Omit<import('@nirogitanman/types').Profile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<import('@nirogitanman/types').Profile, 'id' | 'created_at'>>
      }
      partners: {
        Row: import('@nirogitanman/types').Partner
        Insert: Omit<import('@nirogitanman/types').Partner, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<import('@nirogitanman/types').Partner, 'id' | 'created_at'>>
      }
      partner_types: {
        Row: import('@nirogitanman/types').PartnerType
        Insert: Omit<import('@nirogitanman/types').PartnerType, 'id' | 'created_at'>
        Update: Partial<Omit<import('@nirogitanman/types').PartnerType, 'id' | 'created_at'>>
      }
      appointments: {
        Row: import('@nirogitanman/types').Appointment
        Insert: Omit<import('@nirogitanman/types').Appointment, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<import('@nirogitanman/types').Appointment, 'id' | 'created_at'>>
      }
      services: {
        Row: import('@nirogitanman/types').Service
        Insert: Omit<import('@nirogitanman/types').Service, 'id' | 'created_at'>
        Update: Partial<Omit<import('@nirogitanman/types').Service, 'id' | 'created_at'>>
      }
      partner_services: {
        Row: import('@nirogitanman/types').PartnerService
        Insert: Omit<import('@nirogitanman/types').PartnerService, 'id' | 'created_at'>
        Update: Partial<Omit<import('@nirogitanman/types').PartnerService, 'id' | 'created_at'>>
      }
      payments: {
        Row: import('@nirogitanman/types').Payment
        Insert: Omit<import('@nirogitanman/types').Payment, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<import('@nirogitanman/types').Payment, 'id' | 'created_at'>>
      }
      notifications: {
        Row: import('@nirogitanman/types').Notification
        Insert: Omit<import('@nirogitanman/types').Notification, 'id' | 'created_at'>
        Update: Partial<Omit<import('@nirogitanman/types').Notification, 'id' | 'created_at'>>
      }
      reviews: {
        Row: import('@nirogitanman/types').Review
        Insert: Omit<import('@nirogitanman/types').Review, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<import('@nirogitanman/types').Review, 'id' | 'created_at'>>
      }
      blog_posts: {
        Row: import('@nirogitanman/types').BlogPost
        Insert: Omit<import('@nirogitanman/types').BlogPost, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<import('@nirogitanman/types').BlogPost, 'id' | 'created_at'>>
      }
      audit_logs: {
        Row: import('@nirogitanman/types').AuditLog
        Insert: Omit<import('@nirogitanman/types').AuditLog, 'id' | 'created_at'>
        Update: never
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
