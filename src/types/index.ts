export interface Destination {
  id: string;
  name: string;
  description: string;
  image_url: string;
  distance_km: number;
  travel_duration_days: number;
  created_at: string;
}

export interface Trip {
  id: string;
  destination_id: string;
  departure_date: string;
  return_date: string;
  economy_price: number;
  business_price: number;
  first_class_price: number;
  total_seats: number;
  available_seats: number;
  status: 'available' | 'full' | 'cancelled';
  created_at: string;
  destination?: Destination;
  average_rating?: number;
  review_count?: number;
}

export interface Seat {
  id: string;
  trip_id: string;
  seat_number: string;
  class: 'economy' | 'business' | 'first_class';
  is_available: boolean;
  booked_by: string | null;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  trip_id: string;
  seat_id: string | null;
  class: 'economy' | 'business' | 'first_class';
  price: number;
  booking_date: string;
  travel_date: string;
  status: 'confirmed' | 'cancelled';
  qr_code: string;
  refund_amount: number | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  trip?: Trip;
  seat?: Seat;
}

export interface Review {
  id: string;
  user_id: string;
  trip_id: string;
  booking_id: string;
  rating: number;
  title: string;
  review_text: string;
  created_at: string;
  updated_at: string;
  helpful_count: number;
  user_email?: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  payment_method: string;
  status: string;
  transaction_id: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
}

export type SeatClass = 'economy' | 'business' | 'first_class';

export interface BookingFormData {
  tripId: string;
  seatId: string | null;
  seatNumber: string | null;
  class: SeatClass;
  price: number;
  travelDate: string;
}

export interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export interface ReviewFormData {
  rating: number;
  title: string;
  review_text: string;
}
