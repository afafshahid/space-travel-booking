import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { createReview, updateReview } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import type { Review } from '../../types';

interface ReviewFormProps {
  tripId: string;
  bookingId: string;
  existingReview?: Review | null;
  onSuccess: (review: Review) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ tripId, bookingId, existingReview, onSuccess }) => {
  const { user } = useAuthStore();
  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState(existingReview?.title || '');
  const [reviewText, setReviewText] = useState(existingReview?.review_text || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError('');
    setLoading(true);

    try {
      let review: Review;
      if (existingReview) {
        review = await updateReview(existingReview.id, { rating, title, review_text: reviewText });
      } else {
        review = await createReview({
          userId: user.id,
          tripId,
          bookingId,
          rating,
          title,
          review_text: reviewText,
        });
      }
      onSuccess(review);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const displayRating = hoveredRating || rating;

  return (
    <form onSubmit={handleSubmit} className="cyber-card p-5 space-y-4">
      <h3 className="font-bold text-white">{existingReview ? 'Edit Review' : 'Write a Review'}</h3>

      {/* Star Rating */}
      <div>
        <label className="block text-sm text-slate-400 mb-2">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={28}
                className={star <= displayRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-slate-400 self-center">
            {displayRating === 1 ? 'Poor' : displayRating === 2 ? 'Fair' : displayRating === 3 ? 'Good' : displayRating === 4 ? 'Great' : 'Excellent'}
          </span>
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm text-slate-400 mb-1.5">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          maxLength={200}
          required
          className="input-cyber"
        />
      </div>

      {/* Review Text */}
      <div>
        <label className="block text-sm text-slate-400 mb-1.5">
          Review <span className="text-slate-600">({reviewText.length}/500)</span>
        </label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Share your experience..."
          maxLength={500}
          rows={4}
          required
          className="input-cyber resize-none"
        />
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary flex items-center gap-2 w-full justify-center"
      >
        {loading ? (
          <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        ) : (
          <>
            <Send size={14} />
            {existingReview ? 'Update Review' : 'Submit Review'}
          </>
        )}
      </button>
    </form>
  );
};

export default ReviewForm;
