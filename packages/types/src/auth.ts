import type { UserRole } from './enums'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  profile_id: string
  full_name: string
  avatar_url: string | null
}

export interface SessionContext {
  user: AuthUser | null
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignUpCredentials {
  email: string
  password: string
  full_name: string
  phone?: string
  role: Extract<UserRole, 'client' | 'partner'>
}

export interface ResetPasswordPayload {
  email: string
}

export interface UpdatePasswordPayload {
  password: string
}
