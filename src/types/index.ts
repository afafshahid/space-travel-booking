export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
}

export interface Destination {
  id: string
  name: string
  description: string
  image_url: string
  distance_km: number
  duration_days: number
  base_price: number
  created_at: string
}

export interface Trip {
  id: string
  destination_id: string
  destination?: Destination
  departure_date: string
  return_date: string
  capacity: number
  economy_price: number
  business_price: number
  first_class_price: number
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  total_seats: number
  created_at: string
  average_rating?: number
  available_seats?: number
  total_reviews?: number
}

export interface Seat {
  id: string
  trip_id: string
  seat_number: string
  class: SeatClass
  is_available: boolean
  booked_by?: string | null
}

export type SeatClass = 'economy' | 'business' | 'first_class'

export interface Booking {
  id: string
  user_id: string
  trip_id: string
  trip?: Trip
  seat_id: string
  seat?: Seat
  class: SeatClass
  price: number
  status: 'confirmed' | 'cancelled' | 'pending'
  booking_date: string
  cancellation_reason?: string
  refund_amount?: number
  created_at: string
}

export interface Review {
  id: string
  user_id: string
  trip_id: string
  booking_id: string
  rating: number
  title: string
  content: string
  helpful_count: number
  created_at: string
  user?: User
  user_name?: string
}

export interface Payment {
  id: string
  booked_by?: string | null
  amount: number
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  card_last_four?: string
  created_at: string
}

export interface BookingFormData {
  tripId: string
  seatId: string
  seatClass: SeatClass
  totalPrice: number
}

export interface PaymentFormData {
  cardNumber: string
  expiryDate: string
  cvc: string
  cardholderName: string
}

export interface ReviewFormData {
  rating: number
  title: string
  content: string
}

export interface TripFilters {
  search: string
  minPrice: number
  maxPrice: number
  minDuration: number
  maxDuration: number
}

export interface CancellationPolicy {
  daysUntilTravel: number
  refundPercentage: number
  label: string
}
