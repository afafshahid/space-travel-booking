import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Rocket } from 'lucide-react'
import { useTrip, useSeats } from '../../hooks/useTrips'
import { useCreateBooking } from '../../hooks/useBooking'
import { useBookingStore } from '../../store/bookingStore'
import { SeatMap } from './SeatMap'
import { ClassSelection } from './ClassSelection'
import { BookingSummary } from './BookingSummary'
import { TimelineVisualization } from './TimelineVisualization'
import { LoadingSpinner, ErrorMessage } from '../Shared'
import type { Seat, SeatClass } from '../../types'
import { getPriceForClass } from '../../utils/calculations'

export const BookingFlow: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>()
  const navigate = useNavigate()

  const { data: trip, isLoading: tripLoading, error: tripError } = useTrip(tripId!)
  const { data: seats, isLoading: seatsLoading } = useSeats(tripId!)
  const { mutateAsync: createBooking, isPending } = useCreateBooking()

  const { selectedSeat, selectedClass, setSelectedSeat, setSelectedClass } = useBookingStore()

  const handleClassChange = (cls: SeatClass) => {
    setSelectedClass(cls)
  }

  const handleSeatSelect = (seat: Seat) => {
    setSelectedSeat(seat.id === selectedSeat?.id ? null : seat)
  }

  const handleContinue = async () => {
    if (!trip || !selectedSeat) return

    const price = getPriceForClass(trip, selectedClass)
    try {
      await createBooking({
        tripId: trip.id,
        seatId: selectedSeat.id,
        seatClass: selectedClass,
        totalPrice: price,
      })
      navigate('/payment')
    } catch {
      // Error handled in hook
    }
  }

  if (tripLoading || seatsLoading) {
    return (
      <div className="min-h-screen bg-[#050811] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading trip details..." />
      </div>
    )
  }

  if (tripError || !trip) {
    return (
      <div className="min-h-screen bg-[#050811] p-8">
        <ErrorMessage
          message={(tripError as Error)?.message || 'Trip not found'}
          onRetry={() => navigate('/explore')}
        />
      </div>
    )
  }

  const price = getPriceForClass(trip, selectedClass)

  return (
    <div className="min-h-screen bg-[#050811] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/explore')}
            className="p-2 rounded-lg text-[#a0a0a0] hover:text-white hover:bg-white/5 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Rocket className="w-6 h-6 text-[#7c3aed]" />
              Book Your Journey
            </h1>
            <p className="text-[#a0a0a0] text-sm">
              {trip.destination?.name} • Departing {new Date(trip.departure_date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline */}
            <TimelineVisualization trip={trip} />

            {/* Class Selection */}
            <div className="bg-[#0a0e27] border border-[#7c3aed]/20 rounded-2xl p-5">
              <h3 className="text-[#e0e0e0] font-semibold mb-4">Select Travel Class</h3>
              <ClassSelection
                trip={trip}
                selectedClass={selectedClass}
                onClassChange={handleClassChange}
                seats={seats || []}
              />
            </div>

            {/* Seat Map */}
            <div className="bg-[#0a0e27] border border-[#7c3aed]/20 rounded-2xl p-5">
              <h3 className="text-[#e0e0e0] font-semibold mb-4">
                Choose Your Seat
                {selectedSeat && (
                  <span className="ml-2 text-[#f59e0b] font-mono text-sm">
                    — Seat {selectedSeat.seat_number} selected
                  </span>
                )}
              </h3>
              <SeatMap
                seats={seats || []}
                selectedSeatId={selectedSeat?.id || null}
                selectedClass={selectedClass}
                onSeatSelect={handleSeatSelect}
              />
            </div>
          </div>

          {/* Right: Summary */}
          <div>
            <BookingSummary
              trip={trip}
              selectedSeat={selectedSeat}
              selectedClass={selectedClass}
              price={price}
              onContinue={handleContinue}
              isLoading={isPending}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
