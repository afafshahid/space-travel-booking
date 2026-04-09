import React, { useState } from 'react';
import { Pencil, Trash2, ThumbsUp } from 'lucide-react';
import type { Review } from '../../types';
import RatingDisplay from './RatingDisplay';
import { formatDateTime } from '../../utils/formatters';
import { deleteReview } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

interface ReviewCardProps {
  review: Review;
  onEdit: (review: Review) => void;
  onDelete: (id: string) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onEdit, onDelete }) => {
  const { user } = useAuthStore();
  const [deleting, setDeleting] = useState(false);
  const isOwner = user?.id === review.user_id;

  const handleDelete = async () => {
    if (!window.confirm('Delete this review?')) return;
    setDeleting(true);
    try {
      await deleteReview(review.id);
      onDelete(review.id);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const getInitials = (email: string) => {
    return email.slice(0, 2).toUpperCase();
  };

  const displayEmail = review.user_email || `user_${review.user_id.slice(0, 4)}@space.com`;

  return (
    <div className="cyber-card p-4 animate-fade-up">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-purple-600/30 flex items-center justify-center text-sm font-bold text-purple-300">
            {getInitials(displayEmail)}
          </div>
          <div>
            <p className="text-sm text-white font-medium">
              {displayEmail.split('@')[0]}
            </p>
            <p className="text-xs text-slate-600">{formatDateTime(review.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <RatingDisplay rating={review.rating} size={14} />
          {isOwner && (
            <div className="flex gap-1">
              <button
                onClick={() => onEdit(review)}
                className="p-1 text-slate-500 hover:text-blue-400 transition-colors"
                title="Edit"
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                title="Delete"
              >
                <Trash2 size={13} />
              </button>
            </div>
          )}
        </div>
      </div>

      <h4 className="font-semibold text-white mb-1">{review.title}</h4>
      <p className="text-sm text-slate-400 leading-relaxed">{review.review_text}</p>

      {review.helpful_count > 0 && (
        <div className="mt-3 flex items-center gap-1 text-xs text-slate-600">
          <ThumbsUp size={12} />
          <span>{review.helpful_count} found helpful</span>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
