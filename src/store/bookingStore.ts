import { create } from 'zustand';
import type { BookingFormData, Trip } from '../types';

interface BookingState {
  selectedTrip: Trip | null;
  bookingData: BookingFormData | null;
  completedBookingId: string | null;
  setSelectedTrip: (trip: Trip | null) => void;
  setBookingData: (data: BookingFormData | null) => void;
  setCompletedBookingId: (id: string | null) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedTrip: null,
  bookingData: null,
  completedBookingId: null,
  setSelectedTrip: (trip) => set({ selectedTrip: trip }),
  setBookingData: (data) => set({ bookingData: data }),
  setCompletedBookingId: (id) => set({ completedBookingId: id }),
  resetBooking: () => set({ selectedTrip: null, bookingData: null, completedBookingId: null }),
}));
