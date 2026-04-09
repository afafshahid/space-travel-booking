import { supabase } from './supabase';
import type { Trip, Destination, Booking, Seat, Review, Payment, SeatClass } from '../types';
import { calculateRefund } from '../utils/calculations';
import { v4 as uuidv4 } from 'uuid';

// Destinations
export const getDestinations = async (): Promise<Destination[]> => {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .order('name');
  if (error) throw error;
  return data || [];
};

// Trips
export const getTrips = async (): Promise<Trip[]> => {
  const { data, error } = await supabase
    .from('trips')
    .select(`*, destination:destinations(*), reviews(rating)`)
    .order('departure_date');
  if (error) throw error;

  return (data || []).map((trip: Trip & { reviews?: { rating: number }[] }) => {
    const reviews = trip.reviews || [];
    const avg = reviews.length > 0
      ? reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length
      : 0;
    return { ...trip, average_rating: avg, review_count: reviews.length };
  });
};

export const getTripById = async (id: string): Promise<Trip | null> => {
  const { data, error } = await supabase
    .from('trips')
    .select(`*, destination:destinations(*), reviews(rating)`)
    .eq('id', id)
    .single();
  if (error) throw error;
  if (!data) return null;

  const reviews = (data as Trip & { reviews?: { rating: number }[] }).reviews || [];
  const avg = reviews.length > 0
    ? reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length
    : 0;
  return { ...data, average_rating: avg, review_count: reviews.length };
};

// Seats
export const getSeatsByTrip = async (tripId: string): Promise<Seat[]> => {
  const { data, error } = await supabase
    .from('seats')
    .select('*')
    .eq('trip_id', tripId)
    .order('seat_number');
  if (error) throw error;
  return data || [];
};

export const generateSeatsForTrip = async (tripId: string, totalSeats: number): Promise<Seat[]> => {
  // Check if seats already exist
  const existing = await getSeatsByTrip(tripId);
  if (existing.length > 0) return existing;

  // Generate seats: first 20% first_class, next 30% business, rest economy
  const seats = [];
  const firstClassCount = Math.floor(totalSeats * 0.2);
  const businessCount = Math.floor(totalSeats * 0.3);

  for (let i = 1; i <= totalSeats; i++) {
    let seatClass: SeatClass = 'economy';
    if (i <= firstClassCount) seatClass = 'first_class';
    else if (i <= firstClassCount + businessCount) seatClass = 'business';

    const row = Math.ceil(i / 6);
    const col = String.fromCharCode(65 + ((i - 1) % 6));
    seats.push({
      trip_id: tripId,
      seat_number: `${row}${col}`,
      class: seatClass,
      is_available: true,
      booked_by: null,
    });
  }

  const { data, error } = await supabase.from('seats').insert(seats).select();
  if (error) throw error;
  return data || [];
};

// Bookings
export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`*, trip:trips(*, destination:destinations(*)), seat:seats(*)`)
    .eq('user_id', userId)
    .order('booking_date', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const getBookingById = async (id: string): Promise<Booking | null> => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`*, trip:trips(*, destination:destinations(*)), seat:seats(*)`)
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

export const createBooking = async (params: {
  userId: string;
  tripId: string;
  seatId: string | null;
  seatNumber: string | null;
  seatClass: SeatClass;
  price: number;
  travelDate: string;
}): Promise<Booking> => {
  const qrCode = `STB-${uuidv4().slice(0, 8).toUpperCase()}`;

  // Create booking
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      user_id: params.userId,
      trip_id: params.tripId,
      seat_id: params.seatId,
      class: params.seatClass,
      price: params.price,
      travel_date: params.travelDate,
      status: 'confirmed',
      qr_code: qrCode,
    })
    .select()
    .single();

  if (bookingError) throw bookingError;

  // Mark seat as booked if seat was selected
  if (params.seatId) {
    await supabase
      .from('seats')
      .update({ is_available: false, booked_by: params.userId })
      .eq('id', params.seatId);
  }

  // Decrement available seats
  await supabase.rpc('decrement_available_seats', { trip_id: params.tripId });

  return booking;
};

export const cancelBooking = async (bookingId: string, reason: string, travelDate: string): Promise<Booking> => {
  const refundAmount = calculateRefund(travelDate);

  const { data, error } = await supabase
    .from('bookings')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      cancellation_reason: reason,
      refund_amount: refundAmount,
    })
    .eq('id', bookingId)
    .select()
    .single();

  if (error) throw error;

  // Free up the seat
  const booking = data as Booking;
  if (booking.seat_id) {
    await supabase
      .from('seats')
      .update({ is_available: true, booked_by: null })
      .eq('id', booking.seat_id);
  }

  // Increment available seats back
  await supabase.rpc('increment_available_seats', { trip_id: booking.trip_id });

  return data;
};

// Reviews
export const getReviewsByTrip = async (tripId: string): Promise<Review[]> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('trip_id', tripId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const getUserReviewForBooking = async (bookingId: string): Promise<Review | null> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('booking_id', bookingId)
    .maybeSingle();
  if (error) throw error;
  return data;
};

export const createReview = async (params: {
  userId: string;
  tripId: string;
  bookingId: string;
  rating: number;
  title: string;
  review_text: string;
}): Promise<Review> => {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      user_id: params.userId,
      trip_id: params.tripId,
      booking_id: params.bookingId,
      rating: params.rating,
      title: params.title,
      review_text: params.review_text,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateReview = async (reviewId: string, params: {
  rating: number;
  title: string;
  review_text: string;
}): Promise<Review> => {
  const { data, error } = await supabase
    .from('reviews')
    .update({ ...params, updated_at: new Date().toISOString() })
    .eq('id', reviewId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
  if (error) throw error;
};

// Payments
export const createPayment = async (params: {
  bookingId: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
}): Promise<Payment> => {
  const { data, error } = await supabase
    .from('payments')
    .insert({
      booking_id: params.bookingId,
      amount: params.amount,
      payment_method: params.paymentMethod,
      status: 'completed',
      transaction_id: params.transactionId,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};
