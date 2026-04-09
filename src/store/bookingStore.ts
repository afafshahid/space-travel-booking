import { create } from 'zustand'
import type { Trip, Seat, SeatClass, Booking } from '../types'

interface BookingState {
  selectedTrip: Trip | null
  selectedSeat: Seat | null
  selectedClass: SeatClass
  pendingBooking: Booking | null
  confirmedBooking: Booking | null

  setSelectedTrip: (trip: Trip | null) => void
  setSelectedSeat: (seat: Seat | null) => void
  setSelectedClass: (cls: SeatClass) => void
  setPendingBooking: (booking: Booking | null) => void
  setConfirmedBooking: (booking: Booking | null) => void
  resetBooking: () => void
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedTrip: null,
  selectedSeat: null,
  selectedClass: 'economy',
  pendingBooking: null,
  confirmedBooking: null,

  setSelectedTrip: (trip) => set({ selectedTrip: trip, selectedSeat: null }),
  setSelectedSeat: (seat) => set({ selectedSeat: seat }),
  setSelectedClass: (cls) => set({ selectedClass: cls, selectedSeat: null }),
  setPendingBooking: (booking) => set({ pendingBooking: booking }),
  setConfirmedBooking: (booking) => set({ confirmedBooking: booking }),
  resetBooking: () =>
    set({
      selectedSeat: null,
      selectedClass: 'economy',
      pendingBooking: null,
      confirmedBooking: null,
    }),
}))
