import React, { useState } from 'react'
import { ThumbsUp, Pencil, Trash2 } from 'lucide-react'
import type { Review } from '../../types'
import { RatingDisplay } from './RatingDisplay'
import { formatRelativeTime, getInitials } from '../../utils/formatters'

interface ReviewCardProps {
  review: Review
  currentUserId?: string
  onEdit?: (review: Review) => void
  onDelete?: (reviewId: string) => void
  onHelpful?: (reviewId: string) => void
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  currentUserId,
  onEdit,
  onDelete,
  onHelpful,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const isOwner = currentUserId === review.user_id
  const displayName = review.user_name || 'Anonymous Traveler'
  const initials = getInitials(displayName)

  return (
    <div className="bg-[#0a0e27] border border-[#7c3aed]/20 rounded-xl p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#0ea5e9] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">{initials}</span>
          </div>
          <div>
            <p className="text-[#e0e0e0] font-semibold text-sm">{displayName}</p>
            <p className="text-[#a0a0a0] text-xs">{formatRelativeTime(review.created_at)}</p>
          </div>
        </div>

        {/* Rating */}
        <RatingDisplay rating={review.rating} size="sm" />
      </div>

      {/* Title */}
      <h4 className="text-[#e0e0e0] font-semibold mb-2">{review.title}</h4>

      {/* Content */}
      <p className="text-[#a0a0a0] text-sm leading-relaxed mb-4">{review.content}</p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onHelpful?.(review.id)}
          className="flex items-center gap-1.5 text-[#a0a0a0] hover:text-[#0ea5e9] transition-colors text-xs"
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          Helpful ({review.helpful_count || 0})
        </button>

        {isOwner && (
          <div className="flex items-center gap-2">
            {!showDeleteConfirm ? (
              <>
                <button
                  onClick={() => onEdit?.(review)}
                  className="flex items-center gap-1 text-[#a0a0a0] hover:text-[#0ea5e9] transition-colors text-xs"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1 text-[#a0a0a0] hover:text-[#ec4899] transition-colors text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[#a0a0a0] text-xs">Are you sure?</span>
                <button
                  onClick={() => onDelete?.(review.id)}
                  className="text-[#ec4899] hover:text-white text-xs font-medium px-2 py-0.5 rounded bg-[#ec4899]/10 hover:bg-[#ec4899]/20 transition-all"
                >
                  Yes, delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-[#a0a0a0] hover:text-white text-xs"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
