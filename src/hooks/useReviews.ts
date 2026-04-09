import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewsService } from '../services/reviews'
import { useAuthStore } from '../store/authStore'
import type { ReviewFormData } from '../types'
import toast from 'react-hot-toast'

export const useReviews = (tripId: string, sortBy: 'newest' | 'highest_rated' = 'newest') => {
  return useQuery({
    queryKey: ['reviews', tripId, sortBy],
    queryFn: () => reviewsService.getReviewsForTrip(tripId, sortBy),
    enabled: !!tripId,
    staleTime: 30000,
  })
}

export const useAverageRating = (tripId: string) => {
  return useQuery({
    queryKey: ['rating', tripId],
    queryFn: () => reviewsService.getAverageRating(tripId),
    enabled: !!tripId,
  })
}

export const useUserReview = (tripId: string) => {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: ['userReview', user?.id, tripId],
    queryFn: () => reviewsService.getUserReviewForTrip(user!.id, tripId),
    enabled: !!user?.id && !!tripId,
  })
}

export const useCreateReview = (tripId: string) => {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: async ({
      formData,
      bookingId,
    }: {
      formData: ReviewFormData
      bookingId: string
    }) => {
      if (!user) throw new Error('Not authenticated')
      return reviewsService.createReview({
        userId: user.id,
        tripId,
        bookingId,
        formData,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', tripId] })
      queryClient.invalidateQueries({ queryKey: ['rating', tripId] })
      queryClient.invalidateQueries({ queryKey: ['userReview'] })
      toast.success('Review submitted successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to submit review')
    },
  })
}

export const useUpdateReview = (tripId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ reviewId, formData }: { reviewId: string; formData: ReviewFormData }) =>
      reviewsService.updateReview(reviewId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', tripId] })
      queryClient.invalidateQueries({ queryKey: ['rating', tripId] })
      toast.success('Review updated!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update review')
    },
  })
}

export const useDeleteReview = (tripId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (reviewId: string) => reviewsService.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', tripId] })
      queryClient.invalidateQueries({ queryKey: ['rating', tripId] })
      queryClient.invalidateQueries({ queryKey: ['userReview'] })
      toast.success('Review deleted')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete review')
    },
  })
}
