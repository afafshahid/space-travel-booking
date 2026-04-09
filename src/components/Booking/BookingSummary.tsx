import React from 'react'
import { Tag, CreditCard, Info } from 'lucide-react'
import type { Trip, Seat, SeatClass } from '../../types'
import { formatPrice, formatDate, formatSeatClass } from '../../utils/formatters'
import { calculateTaxAmount } from '../../utils/calculations'

interface BookingSummaryProps {
  trip: Trip
  selectedSeat: Seat | null
  selectedClass: SeatClass
  price: number
  onContinue: () => void
  isLoading?: boolean
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  trip,
  selectedSeat,
  selectedClass,
  price,
  onContinue,
  isLoading,
}) => {
  const tax = calculateTaxAmount(price)
  const total = price + tax

  return (
    <div className="bg-[#0a0e27] border border-[#7c3aed]/30 rounded-2xl p-5 sticky top-24">
      <h3 className="text-[#e0e0e0] font-bold text-lg mb-4 flex items-center gap-2">
        <Tag className="w-5 h-5 text-[#7c3aed]" />
        Booking Summary
      </h3>

      {/* Trip Info */}
      <div className="space-y-2 mb-4 pb-4 border-b border-[#7c3aed]/20">
        <div className="flex justify-between text-sm">
          <span className="text-[#a0a0a0]">Destination</span>
          <span className="text-[#e0e0e0] font-medium">{trip.destination?.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#a0a0a0]">Departure</span>
          <span className="text-[#e0e0e0]">{formatDate(trip.departure_date)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#a0a0a0]">Return</span>
          <span className="text-[#e0e0e0]">{formatDate(trip.arrival_date)}</span>
        </div>
      </div>

      {/* Seat Info */}
      <div className="space-y-2 mb-4 pb-4 border-b border-[#7c3aed]/20">
        <div className="flex justify-between text-sm">
          <span className="text-[#a0a0a0]">Class</span>
          <span className="text-[#e0e0e0]">{formatSeatClass(selectedClass)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#a0a0a0]">Seat</span>
          <span className={selectedSeat ? 'text-[#10b981] font-mono font-bold' : 'text-[#f59e0b] text-xs'}>
            {selectedSeat ? selectedSeat.seat_number : 'Not selected yet'}
          </span>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-2 mb-4 pb-4 border-b border-[#7c3aed]/20">
        <div className="flex justify-between text-sm">
          <span className="text-[#a0a0a0]">Base price</span>
          <span className="text-[#e0e0e0]">{formatPrice(price)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#a0a0a0]">Space tax (10%)</span>
          <span className="text-[#e0e0e0]">{formatPrice(tax)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center mb-5">
        <span className="text-[#e0e0e0] font-bold">Total</span>
        <span className="text-[#f59e0b] font-bold text-xl">{formatPrice(total)}</span>
      </div>

      {/* Info */}
      {!selectedSeat && (
        <div className="flex items-start gap-2 mb-4 p-3 bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded-lg">
          <Info className="w-4 h-4 text-[#f59e0b] mt-0.5 flex-shrink-0" />
          <p className="text-[#f59e0b] text-xs">Please select a seat to continue</p>
        </div>
      )}

      {/* Continue Button */}
      <button
        onClick={onContinue}
        disabled={!selectedSeat || isLoading}
        className="w-full py-3 bg-gradient-to-r from-[#7c3aed] to-[#0ea5e9] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#7c3aed]/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Continue to Payment
          </>
        )}
      </button>
    </div>
  )
}
