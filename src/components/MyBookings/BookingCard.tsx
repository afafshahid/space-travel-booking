import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Ticket, XCircle, Star, MapPin, Calendar } from 'lucide-react'
import type { Booking } from '../../types'
import { formatPrice, formatDate, formatSeatClass } from '../../utils/formatters'
import { CountdownTimer } from './CountdownTimer'
import { CancellationModal } from './CancellationModal'
import { useCancelBooking } from '../../hooks/useBooking'

interface BookingCardProps {
  booking: Booking
}

const DEFAULT_IMAGES: Record<string, string> = {
  Moon: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&q=80',
  Mars: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&q=80',
  ISS: 'https://images.unsplash.com/photo-1451186859696-371d9477be93?w=400&q=80',
}

const STATUS_STYLES = {
  confirmed: 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30',
  pending: 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30',
  cancelled: 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30',
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const navigate = useNavigate()
  const [showCancellationModal, setShowCancellationModal] = useState(false)
  const { mutateAsync: cancelBooking, isPending: isCancelling } = useCancelBooking()

  const destination = booking.trip?.destination
  const imageUrl =
    destination?.image_url ||
    Object.entries(DEFAULT_IMAGES).find(([key]) =>
      destination?.name?.toLowerCase().includes(key.toLowerCase())
    )?.[1] ||
    DEFAULT_IMAGES.ISS

  const isCancelled = booking.status === 'cancelled'
  const isUpcoming =
    booking.trip?.departure_date && new Date(booking.trip.departure_date) > new Date()
  const canCancel = !isCancelled && isUpcoming
  const canLeaveReview = booking.status === 'confirmed' && !isUpcoming

  const handleCancel = async (reason: string) => {
    await cancelBooking({ bookingId: booking.id, reason })
    setShowCancellationModal(false)
  }

  return (
    <>
      <div
        className={`bg-[#0a0e27] border rounded-2xl overflow-hidden transition-all duration-200 ${
          isCancelled
            ? 'border-[#374151] opacity-70'
            : 'border-[#7c3aed]/20 hover:border-[#7c3aed]/40 hover:shadow-lg hover:shadow-[#7c3aed]/10'
        }`}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative sm:w-36 h-32 sm:h-auto flex-shrink-0">
            <img
              src={imageUrl}
              alt={destination?.name || 'Destination'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0e27] hidden sm:block" />
            {isCancelled && (
              <div className="absolute inset-0 bg-[#050811]/60 flex items-center justify-center">
                <span className="text-[#ef4444] font-bold text-xs rotate-[-30deg] border-2 border-[#ef4444] px-2 py-0.5 rounded">
                  CANCELLED
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h3 className="text-white font-bold text-lg">{destination?.name}</h3>
                <div className="flex items-center gap-1.5 text-[#a0a0a0] text-xs mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {destination?.distance_km?.toLocaleString()} km from Earth
                </div>
              </div>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${
                  STATUS_STYLES[booking.status]
                }`}
              >
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>

            {/* Details */}
            <div className="flex flex-wrap gap-3 text-xs text-[#a0a0a0] mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#7c3aed]" />
                {booking.trip?.departure_date ? formatDate(booking.trip.departure_date) : 'N/A'}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[#0ea5e9]">Seat</span>
                <span className="font-mono text-[#e0e0e0]">{booking.seat?.seat_number}</span>
              </div>
              <div className="text-[#e0e0e0]">{formatSeatClass(booking.seat_class)}</div>
              <div className="text-[#f59e0b] font-semibold">{formatPrice(booking.price)}</div>
            </div>

            {/* Countdown */}
            {!isCancelled && booking.trip?.departure_date && (
              <div className="mb-3">
                <CountdownTimer targetDate={booking.trip.departure_date} />
              </div>
            )}

            {/* Refund info */}
            {isCancelled && booking.refund_amount !== undefined && (
              <p className="text-[#10b981] text-xs mb-3">
                Refund: {formatPrice(booking.refund_amount)}
              </p>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {booking.status !== 'pending' && (
                <button
                  onClick={() => navigate(`/ticket/${booking.id}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-[#7c3aed] to-[#0ea5e9] text-white rounded-lg hover:shadow-md hover:shadow-[#7c3aed]/30 transition-all"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  View Ticket
                </button>
              )}

              {canLeaveReview && (
                <button
                  onClick={() => navigate(`/reviews/${booking.trip_id}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30 rounded-lg hover:bg-[#f59e0b]/30 transition-all"
                >
                  <Star className="w-3.5 h-3.5" />
                  Leave Review
                </button>
              )}

              {canCancel && (
                <button
                  onClick={() => setShowCancellationModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#ec4899] border border-[#ec4899]/30 rounded-lg hover:bg-[#ec4899]/10 transition-all"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showCancellationModal && (
        <CancellationModal
          booking={booking}
          onConfirm={handleCancel}
          onClose={() => setShowCancellationModal(false)}
          isLoading={isCancelling}
        />
      )}
    </>
  )
}
