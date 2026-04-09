import React from 'react'
import type { Review } from '../../types'
import { ReviewCard } from './ReviewCard'
import { LoadingSpinner } from '../Shared'

interface ReviewsListProps {
  reviews: Review[]
  isLoading: boolean
  currentUserId?: string
  onEdit: (review: Review) => void
  onDelete: (reviewId: string) => void
  onHelpful: (reviewId: string) => void
  sortBy: 'newest' | 'highest_rated'
  onSortChange: (sort: 'newest' | 'highest_rated') => void
}

export const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  isLoading,
  currentUserId,
  onEdit,
  onDelete,
  onHelpful,
  sortBy,
  onSortChange,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <LoadingSpinner text="Loading reviews..." />
      </div>
    )
  }

  return (
    <div>
      {/* Sort Controls */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[#a0a0a0] text-sm">
          {reviews.length} review{reviews.length !== 1 ? 's' : ''}
        </p>
        <div className="flex gap-2">
          {(['newest', 'highest_rated'] as const).map((sort) => (
            <button
              key={sort}
              onClick={() => onSortChange(sort)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sortBy === sort
                  ? 'bg-[#7c3aed] text-white'
                  : 'text-[#a0a0a0] border border-[#7c3aed]/20 hover:border-[#7c3aed] hover:text-[#e0e0e0]'
              }`}
            >
              {sort === 'newest' ? 'Newest' : 'Highest Rated'}
            </button>
          ))}
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-3">⭐</div>
          <p className="text-[#e0e0e0] font-semibold mb-1">No Reviews Yet</p>
          <p className="text-[#a0a0a0] text-sm">Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              currentUserId={currentUserId}
              onEdit={onEdit}
              onDelete={onDelete}
              onHelpful={onHelpful}
            />
          ))}
        </div>
      )}
    </div>
  )
}
