// User types
export interface User {
  id: string
  email: string
  phone?: string
  name: string
  role: 'user' | 'therapist' | 'admin'
  avatar_url?: string
  created_at: string
}

// Therapist types
export interface Therapist {
  id: string
  user_id: string
  str_number: string
  specializations: string[]
  experience_years: number
  bio?: string
  hourly_rate: number
  service_areas: string[]
  is_verified: boolean
  rating_avg: number
  total_sessions: number
  created_at: string
  user?: User
}

// Service types
export type ServiceCategory = 
  | 'home_recovery'
  | 'injury_support'
  | 'pain_relief'
  | 'performance_recovery'

export interface Service {
  id: string
  name: string
  category: ServiceCategory
  description: string
  duration_minutes: number
  base_price: number
  is_active: boolean
  icon?: string
}

// Booking types
export type BookingStatus = 
  | 'pending'
  | 'accepted'
  | 'on_the_way'
  | 'arrived'
  | 'in_session'
  | 'completed'
  | 'cancelled'

export interface Address {
  id: string
  user_id: string
  label: string
  full_address: string
  notes?: string
  latitude?: number
  longitude?: number
  is_default: boolean
}

export interface Booking {
  id: string
  user_id: string
  therapist_id: string
  service_id: string
  address_id: string
  scheduled_at: string
  complaint_notes?: string
  status: BookingStatus
  total_price: number
  created_at: string
  // Relations
  user?: User
  therapist?: Therapist
  service?: Service
  address?: Address
}

// Payment types
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type PaymentMethod = 'va_bca' | 'va_bni' | 'va_mandiri' | 'gopay' | 'ovo' | 'qris'

export interface Payment {
  id: string
  booking_id: string
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  paid_at?: string
  gateway_ref?: string
  created_at: string
}

// Treatment Report types
export interface TreatmentReport {
  id: string
  booking_id: string
  complaint: string
  findings: string
  treatment_given: string
  recommendations?: string
  follow_up_needed: boolean
  created_at: string
}

// Review types
export interface Review {
  id: string
  booking_id: string
  user_id: string
  therapist_id: string
  rating: number
  comment?: string
  created_at: string
}
