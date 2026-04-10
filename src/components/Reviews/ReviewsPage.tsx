import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, PenLine } from 'lucide-react'
import { useReviews, useCreateReview, useUpdateReview, useDeleteReview, useUserReview } from '../../hooks/useReviews'
import { useAuthStore } from '../../store/authStore'
import { reviewsService } from '../../services/reviews'
import { bookingsService } from '../../services/bookings'
import { ReviewsList } from './ReviewsList'
import { ReviewForm } from './ReviewForm'
import { RatingDisplay } from './RatingDisplay'
import { LoadingSpinner } from '../Shared'
import type { Review, ReviewFormData } from '../../types'
import toast from 'react-hot-toast'

export const ReviewsPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  const [sortBy, setSortBy] = useState<'newest' | 'highest_rated'>('newest')
  const [showForm, setShowForm] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [hasBooking, setHasBooking] = useState<boolean | null>(null)
  const [bookingId, setBookingId] = useState<string | null>(null)

  const { data: reviews, isLoading } = useReviews(tripId!, sortBy)
  const { data: userReview } = useUserReview(tripId!)
  const { mutateAsync: createReview, isPending: isCreating } = useCreateReview(tripId!)
  const { mutateAsync: updateReview, isPending: isUpdating } = useUpdateReview(tripId!)
  const { mutateAsync: deleteReview } = useDeleteReview(tripId!)

  React.useEffect(() => {
    if (user && tripId) {
      bookingsService.getCompletedBookingForTrip(user.id, tripId).then((booking) => {
        setHasBooking(!!booking)
        setBookingId(booking?.id || null)
      })
    }
  }, [user, tripId])

  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

  const handleSubmitReview = async (formData: ReviewFormData) => {
    if (editingReview) {
      await updateReview({ reviewId: editingReview.id, formData })
      setEditingReview(null)
    } else {
      if (!bookingId) {
        toast.error('You need to have a confirmed booking to leave a review')
        return
      }
      await createReview({ formData, bookingId })
    }
    setShowForm(false)
  }

  const handleEdit = (review: Review) => {
    setEditingReview(review)
    setShowForm(true)
  }

  const handleHelpful = async (reviewId: string) => {
    await reviewsService.markHelpful(reviewId)
    toast.success('Marked as helpful!')
  }

  if (!tripId) {
    return <div className="p-8 text-[#a0a0a0]">No trip specified</div>
  }

  return (
    <div className="min-h-screen bg-[#050811] py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg text-[#a0a0a0] hover:text-white hover:bg-white/5 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#0ea5e9]">
              Reviews & Ratings
            </h1>
            <p className="text-[#a0a0a0] text-sm">See what other travelers are saying</p>
          </div>
        </div>

        {/* Average Rating */}
        {reviews && reviews.length > 0 && (
          <div className="bg-[#0a0e27] border border-[#7c3aed]/20 rounded-2xl p-6 mb-6 flex items-center gap-6">
            <div className="text-center">
              <p className="text-[#f59e0b] font-bold text-5xl">{avgRating.toFixed(1)}</p>
              <RatingDisplay rating={avgRating} size="md" />
              <p className="text-[#a0a0a0] text-sm mt-1">
                {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter((r) => r.rating === star).length
                const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                return (
                  <div key={star} className="flex items-center gap-2 mb-1">
                    <span className="text-[#a0a0a0] text-xs w-4">{star}</span>
                    <Star className="w-3 h-3 text-[#f59e0b] fill-[#f59e0b]" />
                    <div className="flex-1 h-1.5 bg-[#050811] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#f59e0b] rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[#a0a0a0] text-xs w-6">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Write Review Button */}
        {user && hasBooking && !userReview && !showForm && (
          <button
            onClick={() => {
              setEditingReview(null)
              setShowForm(true)
            }}
            className="w-full mb-6 py-3 border-2 border-dashed border-[#7c3aed]/30 rounded-xl text-[#7c3aed] hover:border-[#7c3aed] hover:bg-[#7c3aed]/5 transition-all flex items-center justify-center gap-2"
          >
            <PenLine className="w-5 h-5" />
            Write a Review
          </button>
        )}

        {/* Already reviewed notice */}
        {userReview && !showForm && !editingReview && (
          <div className="mb-6 p-3 bg-[#10b981]/10 border border-[#10b981]/20 rounded-xl text-[#10b981] text-sm text-center">
            ✓ You've already reviewed this trip. Find your review below to edit it.
          </div>
        )}

        {/* Review Form */}
        {showForm && (
          <div className="mb-6">
            <ReviewForm
              onSubmit={handleSubmitReview}
              onCancel={() => {
                setShowForm(false)
                setEditingReview(null)
              }}
              initialData={
                editingReview
                  ? {
                      rating: editingReview.rating,
                      title: editingReview.title,
                      content: editingReview.content,
                    }
                  : undefined
              }
              isLoading={isCreating || isUpdating}
              editingReview={editingReview}
            />
          </div>
        )}

        {/* Reviews List */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner text="Loading reviews..." />
          </div>
        ) : (
          <ReviewsList
            reviews={reviews || []}
            isLoading={false}
            currentUserId={user?.id}
            onEdit={handleEdit}
            onDelete={deleteReview}
            onHelpful={handleHelpful}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        )}
      </div>
    </div>
  )
}
