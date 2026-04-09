import { create } from 'zustand'
import type { Review } from '../types'

interface ReviewState {
  reviews: Review[]
  isSubmitting: boolean
  setReviews: (reviews: Review[]) => void
  addReview: (review: Review) => void
  updateReview: (review: Review) => void
  removeReview: (reviewId: string) => void
  setSubmitting: (submitting: boolean) => void
}

export const useReviewStore = create<ReviewState>((set) => ({
  reviews: [],
  isSubmitting: false,

  setReviews: (reviews) => set({ reviews }),
  addReview: (review) => set((state) => ({ reviews: [review, ...state.reviews] })),
  updateReview: (review) =>
    set((state) => ({
      reviews: state.reviews.map((r) => (r.id === review.id ? review : r)),
    })),
  removeReview: (reviewId) =>
    set((state) => ({
      reviews: state.reviews.filter((r) => r.id !== reviewId),
    })),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
}))
