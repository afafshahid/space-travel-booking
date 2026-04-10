import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import type { Review } from '../../types';
import { getReviewsByTrip } from '../../services/api';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import RatingDisplay from './RatingDisplay';
import LoadingSpinner from '../Shared/LoadingSpinner';
import { useAuthStore } from '../../store/authStore';

interface ReviewsListProps {
  tripId: string;
  bookingId?: string;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ tripId, bookingId }) => {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [sort, setSort] = useState<'newest' | 'highest' | 'lowest'>('newest');

  useEffect(() => {
    loadReviews();
  }, [tripId]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await getReviewsByTrip(tripId);
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSuccess = (review: Review) => {
    if (editingReview) {
      setReviews((prev) => prev.map((r) => (r.id === review.id ? review : r)));
    } else {
      setReviews((prev) => [review, ...prev]);
    }
    setShowForm(false);
    setEditingReview(null);
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sort === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sort === 'highest') return b.rating - a.rating;
    return a.rating - b.rating;
  });

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const userReview = reviews.find((r) => r.user_id === user?.id);
  const canReview = user && bookingId && !userReview;

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="cyber-card p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="font-bold text-white mb-1">Reviews & Ratings</h3>
            {reviews.length > 0 ? (
              <div className="flex items-center gap-3">
                <RatingDisplay rating={Math.round(avgRating)} size={18} showNumber count={reviews.length} />
                <span className="text-2xl font-bold gradient-text">{avgRating.toFixed(1)}</span>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No reviews yet</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {canReview && (
              <button
                onClick={() => { setShowForm(true); setEditingReview(null); }}
                className="btn-primary flex items-center gap-1.5 text-sm"
              >
                <Star size={14} />
                Write Review
              </button>
            )}
            {reviews.length > 0 && (
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="input-cyber text-sm py-1.5 px-3 cursor-pointer appearance-none"
              >
                <option value="newest">Newest</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Review Form */}
      {showForm && bookingId && (
        <ReviewForm
          tripId={tripId}
          bookingId={bookingId}
          existingReview={editingReview}
          onSuccess={handleReviewSuccess}
        />
      )}

      {/* Reviews List */}
      {loading ? (
        <LoadingSpinner message="Loading reviews..." size="sm" />
      ) : sortedReviews.length === 0 ? (
        <div className="cyber-card p-8 text-center">
          <Star size={32} className="text-slate-600 mx-auto mb-2" />
          <p className="text-slate-500">No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
