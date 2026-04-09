import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useBooking } from '../hooks/useBooking'
import { useBookingStore } from '../store/bookingStore'
import { TicketView } from '../components/Ticket/TicketView'
import { LoadingSpinner, ErrorMessage } from '../components/Shared'

export const TicketPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()
  const { confirmedBooking } = useBookingStore()

  // Try from store first, then fetch
  const { data: fetchedBooking, isLoading, error } = useBooking(
    confirmedBooking?.id === bookingId ? '' : (bookingId || '')
  )

  const booking = confirmedBooking?.id === bookingId ? confirmedBooking : fetchedBooking

  if (isLoading && !booking) {
    return (
      <div className="min-h-screen bg-[#050811] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading ticket..." />
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[#050811] p-8">
        <ErrorMessage
          message={(error as Error)?.message || 'Ticket not found'}
          onRetry={() => navigate('/bookings')}
        />
      </div>
    )
  }

  return <TicketView booking={booking} />
}
