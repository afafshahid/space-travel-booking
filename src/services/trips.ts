import { supabase } from './supabase'
import type { Trip, TripFilters } from '../types'

export const tripsService = {
  async getTrips(filters?: Partial<TripFilters>): Promise<Trip[]> {
    let query = supabase
      .from('trips')
      .select(`
        *,
        destination:destinations(*),
        seats(id, is_available)
      `)
      .eq('status', 'upcoming')
      .order('departure_date', { ascending: true })

    const { data, error } = await query
    if (error) throw error

    const trips = (data || []).map((trip: Trip & { seats?: { is_available: boolean }[] }) => ({
      ...trip,
      available_seats: trip.seats ? trip.seats.filter((s) => s.is_available).length : 0,
    }))

    let filtered = trips

    if (filters?.search) {
      const q = filters.search.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.destination?.name.toLowerCase().includes(q) ||
          t.destination?.description.toLowerCase().includes(q)
      )
    }

    if (filters?.minPrice !== undefined) {
      filtered = filtered.filter((t) => t.economy_price >= (filters.minPrice ?? 0))
    }

    if (filters?.maxPrice !== undefined && filters.maxPrice > 0) {
      filtered = filtered.filter((t) => t.economy_price <= filters.maxPrice!)
    }

    if (filters?.minDuration !== undefined) {
      filtered = filtered.filter(
        (t) => (t.destination?.duration_days ?? 0) >= (filters.minDuration ?? 0)
      )
    }

    if (filters?.maxDuration !== undefined && filters.maxDuration > 0) {
      filtered = filtered.filter(
        (t) => (t.destination?.duration_days ?? 0) <= filters.maxDuration!
      )
    }

    return filtered
  },

  async getTripById(tripId: string): Promise<Trip> {
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        destination:destinations(*),
        seats(*)
      `)
      .eq('id', tripId)
      .single()
    if (error) throw error
    return data
  },

  async getTripWithRatings(tripId: string): Promise<Trip & { average_rating: number; total_reviews: number }> {
    const [tripRes, reviewsRes] = await Promise.all([
      supabase
        .from('trips')
        .select('*, destination:destinations(*), seats(*)')
        .eq('id', tripId)
        .single(),
      supabase
        .from('reviews')
        .select('rating')
        .eq('trip_id', tripId),
    ])

    if (tripRes.error) throw tripRes.error

    const reviews = reviewsRes.data || []
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length
        : 0

    return {
      ...tripRes.data,
      average_rating: avgRating,
      total_reviews: reviews.length,
    }
  },

  async getTripsWithRatings(filters?: Partial<TripFilters>): Promise<Trip[]> {
    const trips = await this.getTrips(filters)

    const tripsWithRatings = await Promise.all(
      trips.map(async (trip) => {
        const { data: reviews } = await supabase
          .from('reviews')
          .select('rating')
          .eq('trip_id', trip.id)

        const avgRating =
          reviews && reviews.length > 0
            ? reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length
            : 0

        return {
          ...trip,
          average_rating: avgRating,
          total_reviews: reviews?.length ?? 0,
        }
      })
    )

    return tripsWithRatings
  },
}
