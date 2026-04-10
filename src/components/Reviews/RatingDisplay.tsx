import React from 'react';
import { Star } from 'lucide-react';

interface RatingDisplayProps {
  rating: number;
  size?: number;
  showNumber?: boolean;
  count?: number;
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({ rating, size = 16, showNumber = false, count }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}
        />
      ))}
      {showNumber && (
        <span className="text-sm text-slate-400 ml-1">
          {rating.toFixed(1)}
          {count !== undefined && <span className="text-slate-600"> ({count})</span>}
        </span>
      )}
    </div>
  );
};

export default RatingDisplay;
