import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, Shield } from 'lucide-react'
import { useBookingStore } from '../../store/bookingStore'
import { useProcessPayment } from '../../hooks/useBooking'
import { PaymentForm } from './PaymentForm'
import { PaymentSuccess } from './PaymentSuccess'
import { formatPrice, formatDate, formatSeatClass } from '../../utils/formatters'
import type { PaymentFormData } from '../../types'
import toast from 'react-hot-toast'

export const PaymentModal: React.FC = () => {
  const navigate = useNavigate()
  const { pendingBooking, confirmedBooking } = useBookingStore()
  const { mutateAsync: processPayment, isPending } = useProcessPayment()
  const [paymentError, setPaymentError] = useState<string | null>(null)

  if (!pendingBooking && !confirmedBooking) {
    navigate('/explore')
    return null
  }

  const booking = confirmedBooking || pendingBooking

  if (confirmedBooking) {
    return (
      <div className="min-h-screen bg-[#050811] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0a0e27] border border-[#7c3aed]/30 rounded-2xl p-8">
          <PaymentSuccess booking={confirmedBooking} />
        </div>
      </div>
    )
  }

  const handlePayment = async (formData: PaymentFormData) => {
    setPaymentError(null)
    try {
      await processPayment(formData)
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Payment failed'
      setPaymentError(msg)
      toast.error(msg)
    }
  }

  return (
    <div className="min-h-screen bg-[#050811] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg text-[#a0a0a0] hover:text-white hover:bg-white/5 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-[#7c3aed]" />
              Secure Payment
            </h1>
            <p className="text-[#a0a0a0] text-sm">Complete your booking</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Summary */}
          <div className="bg-[#0a0e27] border border-[#7c3aed]/30 rounded-2xl p-6">
            <h3 className="text-[#e0e0e0] font-bold text-lg mb-4">Order Summary</h3>

            {booking && (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#a0a0a0]">Destination</span>
                  <span className="text-[#e0e0e0]">{booking.trip?.destination?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a0a0a0]">Departure</span>
                  <span className="text-[#e0e0e0]">
                    {booking.trip?.departure_date
                      ? formatDate(booking.trip.departure_date)
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a0a0a0]">Seat</span>
                  <span className="text-[#e0e0e0]">
                    {booking.seat?.seat_number} · {formatSeatClass(booking.seat_class)}
                  </span>
                </div>
                <div className="pt-3 border-t border-[#7c3aed]/20 flex justify-between font-bold">
                  <span className="text-[#e0e0e0]">Total</span>
                  <span className="text-[#f59e0b] text-xl">
                    {formatPrice(booking.price)}
                  </span>
                </div>
              </div>
            )}

            {/* Security badges */}
            <div className="mt-6 pt-4 border-t border-[#7c3aed]/20">
              <div className="flex items-center gap-2 text-[#10b981] text-sm">
                <Shield className="w-4 h-4" />
                <span>256-bit SSL encryption</span>
              </div>
              <div className="flex items-center gap-2 text-[#10b981] text-sm mt-2">
                <Shield className="w-4 h-4" />
                <span>Secure payment processing</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-[#0a0e27] border border-[#7c3aed]/30 rounded-2xl p-6">
            <h3 className="text-[#e0e0e0] font-bold text-lg mb-4">Payment Details</h3>

            {paymentError && (
              <div className="mb-4 p-3 bg-[#ec4899]/10 border border-[#ec4899]/30 rounded-lg">
                <p className="text-[#ec4899] text-sm">{paymentError}</p>
              </div>
            )}

            <PaymentForm
              amount={booking?.price || 0}
              onSubmit={handlePayment}
              isLoading={isPending}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
