import { supabase } from './supabase'
import type { Booking, Seat, SeatClass } from '../types'
import { calculateRefundAmount } from '../utils/calculations'

export const bookingsService = {
  async getSeatsForTrip(tripId: string): Promise<Seat[]> {
    const { data, error } = await supabase
      .from('seats')
      .select('*')
      .eq('trip_id', tripId)
      .order('seat_number', { ascending: true })
    if (error) throw error
    return data || []
  },

  async createBooking(params: {
  userId: string
  tripId: string
  seatId: string
  seatClass: SeatClass
  totalPrice: number
  travelDate?: string
}): Promise<Booking> {
    // Check seat availability
    const { data: seat, error: seatError } = await supabase
      .from('seats')
      .select('*')
      .eq('id', params.seatId)
      .single()

    if (seatError || !seat) throw new Error('Seat not found')
    if (!seat.is_available) throw new Error('Seat is no longer available')

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: params.userId,
        trip_id: params.tripId,
        seat_id: params.seatId,
        class: params.seatClass,
        price: params.totalPrice,
        status: 'pending',
        booking_date: new Date().toISOString(),
        travel_date: params.travelDate || new Date().toISOString().split('T')[0],
      })
      .select('*')
      .single()

    if (bookingError) throw bookingError

        // Mark seat as unavailable
    const { error: updateError } = await supabase
      .from('seats')
      .update({ is_available: false, booked_by: booking.user_id })
      .eq('id', params.seatId)

    if (updateError) {
      console.error('Seat update error:', updateError)
      await supabase.from('bookings').delete().eq('id', booking.id)
      throw new Error(`Failed to update seat: ${updateError.message}`)
    }

    // Verify seat was updated
    const { data: verifySeats } = await supabase
      .from('seats')
      .select('is_available, booked_by')
      .eq('id', params.seatId)
      .single()
    
    console.log('Seat after update:', verifySeats)

    await new Promise(resolve => setTimeout(resolve, 100))

    // Fetch updated booking with relations
    const { data: updatedBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('*, trip:trips(*, destination:destinations(*)), seat:seats(*)')
      .eq('id', booking.id)
      .single()

    if (fetchError) throw fetchError
    return updatedBooking
  },

  async confirmBooking(bookingId: string): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'confirmed' })
      .eq('id', bookingId)
      .select('*, trip:trips(*, destination:destinations(*)), seat:seats(*)')
      .single()
    if (error) throw error
    return data
  },

  async getUserBookings(userId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, trip:trips(*, destination:destinations(*)), seat:seats(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async getBookingById(bookingId: string): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, trip:trips(*, destination:destinations(*)), seat:seats(*)')
      .eq('id', bookingId)
      .single()
    if (error) throw error
    return data
  },

  async cancelBooking(bookingId: string, reason: string): Promise<Booking> {
    const booking = await this.getBookingById(bookingId)
    const departureDate = booking.trip?.departure_date
    const refundAmount = departureDate
      ? calculateRefundAmount(booking.price, departureDate)
      : 0

    const { data, error } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        cancellation_reason: reason,
        refund_amount: refundAmount,
      })
      .eq('id', bookingId)
      .select('*, trip:trips(*, destination:destinations(*)), seat:seats(*)')
      .single()

    if (error) throw error

    // Mark seat as available again
    if (booking.seat_id) {
      await supabase
        .from('seats')
        .update({ is_available: true, booked_by: null })
        .eq('id', booking.seat_id)
    }

    return data
  },

  async hasUserBookedTrip(userId: string, tripId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('user_id', userId)
      .eq('trip_id', tripId)
      .eq('status', 'confirmed')
      .maybeSingle()
    if (error) return false
    return !!data
  },

  async getCompletedBookingForTrip(userId: string, tripId: string): Promise<Booking | null> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .eq('trip_id', tripId)
      .in('status', ['confirmed'])
      .maybeSingle()
    if (error) return null
    return data
  },
}