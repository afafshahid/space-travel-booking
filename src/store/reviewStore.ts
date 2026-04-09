import { create } from 'zustand';
import type { Review } from '../types';

interface ReviewState {
  reviews: Review[];
  setReviews: (reviews: Review[]) => void;
  addReview: (review: Review) => void;
  updateReview: (review: Review) => void;
  removeReview: (id: string) => void;
}

export const useReviewStore = create<ReviewState>((set) => ({
  reviews: [],
  setReviews: (reviews) => set({ reviews }),
  addReview: (review) => set((state) => ({ reviews: [review, ...state.reviews] })),
  updateReview: (updated) =>
    set((state) => ({
      reviews: state.reviews.map((r) => (r.id === updated.id ? updated : r)),
    })),
  removeReview: (id) =>
    set((state) => ({ reviews: state.reviews.filter((r) => r.id !== id) })),
}));
