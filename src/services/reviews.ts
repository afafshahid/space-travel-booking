import { supabase } from './supabase'
import type { Review, ReviewFormData } from '../types'

export const reviewsService = {
  async getReviewsForTrip(tripId: string, sortBy: 'newest' | 'highest_rated' = 'newest'): Promise<Review[]> {
    let query = supabase
      .from('reviews')
      .select('*, user:profiles(id, full_name, avatar_url)')
      .eq('trip_id', tripId)

    if (sortBy === 'newest') {
      query = query.order('created_at', { ascending: false })
    } else {
      query = query.order('rating', { ascending: false })
    }

    const { data, error } = await query
    if (error) throw error

    return (data || []).map((r) => ({
      ...r,
      user_name: r.user?.full_name || 'Anonymous Traveler',
    }))
  },

  async createReview(params: {
    userId: string
    tripId: string
    bookingId: string
    formData: ReviewFormData
  }): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        user_id: params.userId,
        trip_id: params.tripId,
        booking_id: params.bookingId,
        rating: params.formData.rating,
        title: params.formData.title,
        content: params.formData.content,
        helpful_count: 0,
      })
      .select('*, user:profiles(id, full_name, avatar_url)')
      .single()
    if (error) throw error
    return { ...data, user_name: data.user?.full_name || 'Anonymous Traveler' }
  },

  async updateReview(reviewId: string, formData: ReviewFormData): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .update({
        rating: formData.rating,
        title: formData.title,
        content: formData.content,
      })
      .eq('id', reviewId)
      .select('*, user:profiles(id, full_name, avatar_url)')
      .single()
    if (error) throw error
    return { ...data, user_name: data.user?.full_name || 'Anonymous Traveler' }
  },

  async deleteReview(reviewId: string): Promise<void> {
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId)
    if (error) throw error
  },

  async markHelpful(reviewId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_helpful_count', { review_id: reviewId })
    if (error) {
      // Fallback: manually increment
      const { data } = await supabase.from('reviews').select('helpful_count').eq('id', reviewId).single()
      if (data) {
        await supabase
          .from('reviews')
          .update({ helpful_count: (data.helpful_count || 0) + 1 })
          .eq('id', reviewId)
      }
    }
  },

  async getAverageRating(tripId: string): Promise<{ average: number; total: number }> {
    const { data, error } = await supabase.from('reviews').select('rating').eq('trip_id', tripId)
    if (error) return { average: 0, total: 0 }
    const reviews = data || []
    const avg =
      reviews.length > 0
        ? reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length
        : 0
    return { average: avg, total: reviews.length }
  },

  async getUserReviewForTrip(userId: string, tripId: string): Promise<Review | null> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId)
      .eq('trip_id', tripId)
      .maybeSingle()
    if (error) return null
    return data
  },
}
