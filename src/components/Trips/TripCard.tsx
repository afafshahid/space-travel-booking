import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, MapPin, Star, Users, Rocket } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Trip } from '../../types'
import { formatPrice, formatDate, formatDuration, formatDistance2 } from '../../utils/formatters'

interface TripCardProps {
  trip: Trip
}

const DEFAULT_IMAGES: Record<string, string> = {
  Moon: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&q=80',
  Mars: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=600&q=80',
  ISS: 'https://images.unsplash.com/photo-1451186859696-371d9477be93?w=600&q=80',
}

const getDestinationImage = (trip: Trip): string => {
  if (trip.destination?.image_url) return trip.destination.image_url
  const name = trip.destination?.name || ''
  for (const [key, url] of Object.entries(DEFAULT_IMAGES)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return url
  }
  return DEFAULT_IMAGES.ISS
}

const StarRating: React.FC<{ rating: number; total?: number }> = ({ rating, total }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-3.5 h-3.5 ${
          star <= Math.round(rating) ? 'text-[#f59e0b] fill-[#f59e0b]' : 'text-[#374151]'
        }`}
      />
    ))}
    {total !== undefined && (
      <span className="text-[#a0a0a0] text-xs ml-1">
        {rating.toFixed(1)} ({total})
      </span>
    )}
  </div>
)

export const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const navigate = useNavigate()
  const imageUrl = getDestinationImage(trip)
  const availableSeats = trip.available_seats ?? 0
  const isAlmostFull = availableSeats > 0 && availableSeats <= 5
  const isSoldOut = availableSeats === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(124,58,237,0.2)' }}
      transition={{ duration: 0.3 }}
      className="group bg-[#0a0e27] border border-[#7c3aed]/20 rounded-2xl overflow-hidden hover:border-[#7c3aed]/50 transition-colors duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={trip.destination?.name || 'Destination'}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            ;(e.target as HTMLImageElement).src = DEFAULT_IMAGES.ISS
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e27] via-transparent to-transparent" />

        {/* Status badge */}
        {isSoldOut ? (
          <div className="absolute top-3 right-3 px-2 py-1 bg-[#ef4444]/90 text-white text-xs rounded-full font-medium">
            Sold Out
          </div>
        ) : isAlmostFull ? (
          <div className="absolute top-3 right-3 px-2 py-1 bg-[#f59e0b]/90 text-black text-xs rounded-full font-medium">
            {availableSeats} left!
          </div>
        ) : null}

        {/* Destination name */}
        <div className="absolute bottom-3 left-3">
          <h3 className="text-white font-bold text-xl drop-shadow-lg">
            {trip.destination?.name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Rating */}
        {trip.average_rating !== undefined && trip.average_rating > 0 && (
          <div className="mb-3">
            <StarRating rating={trip.average_rating} total={trip.total_reviews} />
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-2 text-[#a0a0a0]">
            <MapPin className="w-4 h-4 text-[#7c3aed] flex-shrink-0" />
            <span className="text-xs">{formatDistance2(trip.destination?.distance_km || 0)}</span>
          </div>
          <div className="flex items-center gap-2 text-[#a0a0a0]">
            <Clock className="w-4 h-4 text-[#0ea5e9] flex-shrink-0" />
            <span className="text-xs">{formatDuration(trip.destination?.duration_days || 0)}</span>
          </div>
          <div className="flex items-center gap-2 text-[#a0a0a0]">
            <Rocket className="w-4 h-4 text-[#ec4899] flex-shrink-0" />
            <span className="text-xs">Departs {formatDate(trip.departure_date)}</span>
          </div>
          <div className="flex items-center gap-2 text-[#a0a0a0]">
            <Users className="w-4 h-4 text-[#10b981] flex-shrink-0" />
            <span className="text-xs">{availableSeats} seats available</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-[#a0a0a0] text-sm mb-4 line-clamp-2 flex-1">
          {trip.destination?.description}
        </p>

        {/* Price + Button */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#7c3aed]/10">
          <div>
            <p className="text-[#a0a0a0] text-xs">From</p>
            <p className="text-white font-bold text-lg">
              {formatPrice(trip.economy_price)}
            </p>
          </div>
          <motion.button
            whileHover={isSoldOut ? {} : { scale: 1.07 }}
            whileTap={isSoldOut ? {} : { scale: 0.95 }}
            onClick={() => navigate(`/booking/${trip.id}`)}
            disabled={isSoldOut}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-shadow ${
              isSoldOut
                ? 'bg-[#374151] text-[#6b7280] cursor-not-allowed'
                : 'bg-gradient-to-r from-[#7c3aed] to-[#0ea5e9] text-white hover:shadow-lg hover:shadow-[#7c3aed]/30'
            }`}
          >
            {isSoldOut ? 'Sold Out' : 'Book Now'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
