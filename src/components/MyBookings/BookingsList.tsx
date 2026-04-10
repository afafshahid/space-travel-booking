import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Rocket } from 'lucide-react'
import { useUserBookings } from '../../hooks/useBooking'
import { BookingCard } from './BookingCard'
import { LoadingSpinner, ErrorMessage } from '../Shared'

export const BookingsList: React.FC = () => {
  const navigate = useNavigate()
  const { data: bookings, isLoading, error, refetch } = useUserBookings()

  return (
    <div className="min-h-screen bg-[#050811] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-7 h-7 text-[#7c3aed]" />
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#0ea5e9]">
              My Bookings
            </h1>
          </div>
          <p className="text-[#a0a0a0]">Manage your space travel adventures</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" text="Loading your bookings..." />
          </div>
        ) : error ? (
          <ErrorMessage
            message={(error as Error).message || 'Failed to load bookings'}
            onRetry={() => refetch()}
          />
        ) : !bookings || bookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🌌</div>
            <h3 className="text-xl font-semibold text-[#e0e0e0] mb-2">No Bookings Yet</h3>
            <p className="text-[#a0a0a0] mb-6">
              Start exploring and book your first space adventure!
            </p>
            <button
              onClick={() => navigate('/explore')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7c3aed] to-[#0ea5e9] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#7c3aed]/30 transition-all"
            >
              <Rocket className="w-5 h-5" />
              Explore Trips
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[#a0a0a0] text-sm">
              {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
            </p>
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
