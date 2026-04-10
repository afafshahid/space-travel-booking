import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, Share2, BookOpen, Rocket, Calendar, User } from 'lucide-react'
import type { Booking } from '../../types'
import { formatDate, formatDateTime, formatSeatClass, formatPrice } from '../../utils/formatters'
import { QRCodeDisplay } from './QRCodeDisplay'

interface TicketViewProps {
  booking: Booking
}

const STATUS_COLORS = {
  confirmed: { bg: '#10b981', text: 'Confirmed ✓' },
  pending: { bg: '#f59e0b', text: 'Pending' },
  cancelled: { bg: '#ef4444', text: 'Cancelled' },
}

export const TicketView: React.FC<TicketViewProps> = ({ booking }) => {
  const navigate = useNavigate()
  const ticketRef = useRef<HTMLDivElement>(null)

  const status = STATUS_COLORS[booking.status] || STATUS_COLORS.pending
  const qrValue = JSON.stringify({
    id: booking.id,
    seat: booking.seat?.seat_number,
    class: booking.seat_class,
    destination: booking.trip?.destination?.name,
    departure: booking.trip?.departure_date,
  })

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Space Travel Ticket',
          text: `Booking ${booking.id.slice(0, 8).toUpperCase()} - ${booking.trip?.destination?.name}`,
        })
      } catch {
        // Ignore share errors
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-[#050811] py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/bookings')}
            className="flex items-center gap-2 text-[#a0a0a0] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            My Bookings
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#7c3aed]/30 text-[#a0a0a0] hover:text-white hover:border-[#7c3aed] transition-all text-sm"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#7c3aed]/30 text-[#a0a0a0] hover:text-white hover:border-[#7c3aed] transition-all text-sm"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>

        {/* Ticket */}
        <div ref={ticketRef} className="relative">
          {/* Main ticket */}
          <div className="bg-gradient-to-br from-[#0a0e27] via-[#0d1130] to-[#0a0e27] border border-[#7c3aed]/40 rounded-3xl overflow-hidden shadow-2xl shadow-[#7c3aed]/20">
            {/* Top decorative bar */}
            <div className="h-1.5 bg-gradient-to-r from-[#7c3aed] via-[#0ea5e9] to-[#10b981]" />

            {/* Header section */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#7c3aed] to-[#0ea5e9] rounded-xl flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[#a0a0a0] text-xs">SpaceTravel Booking</p>
                    <p className="text-white font-bold">BOARDING PASS</p>
                  </div>
                </div>
                <div
                  className="px-3 py-1.5 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: status.bg }}
                >
                  {status.text}
                </div>
              </div>

              {/* Booking ID */}
              <div className="text-center py-4 bg-[#050811]/50 rounded-2xl mb-4">
                <p className="text-[#a0a0a0] text-xs mb-1">Booking Reference</p>
                <p className="text-[#f59e0b] font-bold text-3xl font-mono tracking-widest">
                  {booking.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>

            {/* Divider with circles */}
            <div className="relative flex items-center px-4 py-2">
              <div className="absolute -left-3 w-6 h-6 bg-[#050811] rounded-full border-r border-[#7c3aed]/20" />
              <div className="flex-1 border-t-2 border-dashed border-[#7c3aed]/20" />
              <div className="absolute -right-3 w-6 h-6 bg-[#050811] rounded-full border-l border-[#7c3aed]/20" />
            </div>

            {/* Main Info */}
            <div className="px-6 py-4">
              {/* Route */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[#a0a0a0] text-xs mb-1">FROM</p>
                  <p className="text-white font-bold text-lg">Earth 🌍</p>
                  <p className="text-[#a0a0a0] text-xs">
                    {booking.trip?.departure_date ? formatDateTime(booking.trip.departure_date) : 'N/A'}
                  </p>
                </div>
                <div className="flex-1 flex items-center justify-center px-4">
                  <div className="flex items-center gap-2">
                    <div className="h-px bg-gradient-to-r from-[#7c3aed] to-[#0ea5e9] flex-1 w-16" />
                    <Rocket className="w-6 h-6 text-[#7c3aed] rotate-90" />
                    <div className="h-px bg-gradient-to-r from-[#0ea5e9] to-[#10b981] flex-1 w-16" />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#a0a0a0] text-xs mb-1">TO</p>
                  <p className="text-white font-bold text-lg">{booking.trip?.destination?.name} 🚀</p>
                  <p className="text-[#a0a0a0] text-xs">
                    {booking.trip?.arrival_date ? formatDateTime(booking.trip.arrival_date) : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Grid info */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#050811]/50 rounded-xl p-3">
                  <p className="text-[#a0a0a0] text-xs mb-1 flex items-center gap-1">
                    <User className="w-3 h-3" /> Passenger
                  </p>
                  <p className="text-[#e0e0e0] font-semibold text-sm">Traveler</p>
                </div>
                <div className="bg-[#050811]/50 rounded-xl p-3">
                  <p className="text-[#a0a0a0] text-xs mb-1">Seat</p>
                  <p className="text-[#f59e0b] font-bold font-mono">
                    {booking.seat?.seat_number}
                  </p>
                </div>
                <div className="bg-[#050811]/50 rounded-xl p-3">
                  <p className="text-[#a0a0a0] text-xs mb-1">Class</p>
                  <p className="text-[#e0e0e0] font-semibold text-sm">
                    {formatSeatClass(booking.seat_class)}
                  </p>
                </div>
                <div className="bg-[#050811]/50 rounded-xl p-3">
                  <p className="text-[#a0a0a0] text-xs mb-1">Price Paid</p>
                  <p className="text-[#10b981] font-bold text-sm">
                    {formatPrice(booking.total_price)}
                  </p>
                </div>
                <div className="bg-[#050811]/50 rounded-xl p-3">
                  <p className="text-[#a0a0a0] text-xs mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Booked On
                  </p>
                  <p className="text-[#e0e0e0] text-sm">
                    {formatDate(booking.booking_date || booking.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="relative flex items-center px-4 py-2">
              <div className="absolute -left-3 w-6 h-6 bg-[#050811] rounded-full border-r border-[#7c3aed]/20" />
              <div className="flex-1 border-t-2 border-dashed border-[#7c3aed]/20" />
              <div className="absolute -right-3 w-6 h-6 bg-[#050811] rounded-full border-l border-[#7c3aed]/20" />
            </div>

            {/* QR Code */}
            <div className="px-6 py-6 flex flex-col items-center gap-3">
              <QRCodeDisplay value={qrValue} size={160} />
              <p className="text-[#a0a0a0] text-xs text-center">
                Scan this QR code at the launch pad
              </p>
            </div>

            {/* Bottom bar */}
            <div className="h-1.5 bg-gradient-to-r from-[#10b981] via-[#0ea5e9] to-[#7c3aed]" />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6">
          <button
            onClick={() => navigate('/bookings')}
            className="w-full py-3 flex items-center justify-center gap-2 border border-[#7c3aed]/30 text-[#a0a0a0] hover:text-white hover:border-[#7c3aed] rounded-xl transition-all"
          >
            <BookOpen className="w-5 h-5" />
            View All Bookings
          </button>
        </div>
      </div>
    </div>
  )
}
