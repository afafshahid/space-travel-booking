import React, { useState } from 'react'
import { X } from 'lucide-react'
import type { Booking } from '../../types'
import { formatPrice, formatDate } from '../../utils/formatters'
import { getRefundPolicy } from '../../utils/calculations'

interface CancellationModalProps {
  booking: Booking
  onConfirm: (reason: string) => Promise<void>
  onClose: () => void
  isLoading?: boolean
}

export const CancellationModal: React.FC<CancellationModalProps> = ({
  booking,
  onConfirm,
  onClose,
  isLoading,
}) => {
  const [reason, setReason] = useState('')
  const departureDate = booking.trip?.departure_date || ''
  const refundPolicy = departureDate ? getRefundPolicy(departureDate) : null
  const refundAmount = refundPolicy
    ? booking.total_price * (refundPolicy.percentage / 100)
    : 0

  const handleConfirm = async () => {
    await onConfirm(reason || 'Customer requested cancellation')
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#0a0e27] border border-[#ec4899]/30 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-lg">Cancel Booking</h3>
          <button
            onClick={onClose}
            className="text-[#a0a0a0] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trip Info */}
        <div className="bg-[#050811] rounded-xl p-4 mb-4">
          <p className="text-[#e0e0e0] font-semibold">{booking.trip?.destination?.name}</p>
          <p className="text-[#a0a0a0] text-sm">
            Seat {booking.seat?.seat_number} • Departing {departureDate ? formatDate(departureDate) : 'N/A'}
          </p>
        </div>

        {/* Refund Policy */}
        {refundPolicy && (
          <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded-xl p-4 mb-4">
            <h4 className="text-[#f59e0b] font-semibold text-sm mb-2">Refund Policy</h4>
            <div className="space-y-1.5 text-xs">
              {[
                { days: '30+ days', pct: '100%', color: '#10b981' },
                { days: '15-30 days', pct: '75%', color: '#f59e0b' },
                { days: '7-15 days', pct: '50%', color: '#f59e0b' },
                { days: '<7 days', pct: '25%', color: '#ef4444' },
              ].map((row) => (
                <div key={row.days} className="flex justify-between">
                  <span className="text-[#a0a0a0]">{row.days} before travel</span>
                  <span style={{ color: row.color }} className="font-medium">
                    {row.pct} refund
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-[#f59e0b]/20">
              <div className="flex justify-between items-center">
                <span className="text-[#e0e0e0] font-semibold text-sm">Your refund</span>
                <div className="text-right">
                  <p className="text-[#10b981] font-bold">{formatPrice(refundAmount)}</p>
                  <p className="text-[#a0a0a0] text-xs">
                    ({refundPolicy.percentage}% of {formatPrice(booking.total_price)}) ·{' '}
                    {refundPolicy.label}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reason */}
        <div className="mb-5">
          <label className="block text-[#e0e0e0] text-sm font-medium mb-2">
            Reason (optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Let us know why you're cancelling..."
            rows={3}
            className="w-full bg-[#050811] border border-[#7c3aed]/30 rounded-lg px-4 py-3 text-[#e0e0e0] placeholder-[#a0a0a0]/50 focus:outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9] transition-all text-sm resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl border border-[#7c3aed]/30 text-[#a0a0a0] hover:text-white hover:border-[#7c3aed] transition-all disabled:opacity-50"
          >
            Keep Booking
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#ec4899] to-[#ef4444] text-white font-semibold hover:shadow-lg hover:shadow-[#ec4899]/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Cancelling...
              </>
            ) : (
              'Cancel Booking'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
