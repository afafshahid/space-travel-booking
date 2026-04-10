import React from 'react'
import { CheckCircle, Ticket, BookOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Booking } from '../../types'
import { formatPrice, formatDate, formatSeatClass } from '../../utils/formatters'

interface PaymentSuccessProps {
  booking: Booking
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ booking }) => {
  const navigate = useNavigate()

  return (
    <div className="text-center space-y-6">
      {/* Success animation */}
      <div className="relative">
        <div className="w-24 h-24 mx-auto">
          <div className="absolute inset-0 bg-[#10b981]/20 rounded-full animate-ping" />
          <div className="relative w-24 h-24 bg-gradient-to-br from-[#10b981] to-[#0ea5e9] rounded-full flex items-center justify-center shadow-lg shadow-[#10b981]/30">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Payment Successful! 🚀</h2>
        <p className="text-[#a0a0a0]">Your space journey is confirmed!</p>
      </div>

      {/* Booking details */}
      <div className="bg-[#050811] border border-[#10b981]/30 rounded-xl p-5 text-left space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-[#a0a0a0]">Booking ID</span>
          <span className="text-[#10b981] font-mono font-bold">{booking.id.slice(0, 8).toUpperCase()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#a0a0a0]">Destination</span>
          <span className="text-[#e0e0e0]">{booking.trip?.destination?.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#a0a0a0]">Departure</span>
          <span className="text-[#e0e0e0]">
            {booking.trip?.departure_date ? formatDate(booking.trip.departure_date) : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#a0a0a0]">Seat</span>
          <span className="text-[#e0e0e0]">
            {booking.seat?.seat_number} ({formatSeatClass(booking.seat_class)})
          </span>
        </div>
        <div className="flex justify-between text-sm font-bold pt-2 border-t border-[#10b981]/20">
          <span className="text-[#e0e0e0]">Total Paid</span>
          <span className="text-[#f59e0b]">{formatPrice(booking.price)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => navigate(`/ticket/${booking.id}`)}
          className="w-full py-3 bg-gradient-to-r from-[#7c3aed] to-[#0ea5e9] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#7c3aed]/30 transition-all flex items-center justify-center gap-2"
        >
          <Ticket className="w-5 h-5" />
          View My Ticket
        </button>
        <button
          onClick={() => navigate('/bookings')}
          className="w-full py-3 border border-[#7c3aed]/30 text-[#a0a0a0] hover:text-white hover:border-[#7c3aed] rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <BookOpen className="w-5 h-5" />
          My Bookings
        </button>
      </div>
    </div>
  )
}
