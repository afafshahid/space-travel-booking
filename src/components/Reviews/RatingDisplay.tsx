import React from 'react'
import { Star } from 'lucide-react'

interface RatingDisplayProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  total?: number
  interactive?: boolean
  onRate?: (rating: number) => void
}

const sizeClasses = {
  sm: 'w-3.5 h-3.5',
  md: 'w-5 h-5',
  lg: 'w-7 h-7',
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating,
  size = 'md',
  showValue = false,
  total,
  interactive = false,
  onRate,
}) => {
  const [hovered, setHovered] = React.useState(0)

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} transition-all ${
            interactive ? 'cursor-pointer hover:scale-110' : ''
          } ${
            star <= (interactive ? hovered || rating : Math.round(rating))
              ? 'text-[#f59e0b] fill-[#f59e0b]'
              : 'text-[#374151]'
          }`}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
        />
      ))}
      {showValue && (
        <span className="text-[#a0a0a0] text-sm ml-1">
          {rating.toFixed(1)}
          {total !== undefined && ` (${total})`}
        </span>
      )}
    </div>
  )
}
