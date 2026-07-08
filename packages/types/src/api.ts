export interface ApiResponse<T> {
  data: T | null
  error: string | null
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  limit: number
  total_pages: number
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface SearchParams extends PaginationParams {
  query?: string
  city?: string
  state?: string
  country?: string
  partner_type?: string
  service?: string
  min_rating?: number
  available_now?: boolean
}

export interface FilterParams extends PaginationParams {
  status?: string
  from_date?: string
  to_date?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}
