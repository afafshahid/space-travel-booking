import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookingsService } from '../services/bookings'
import { paymentsService } from '../services/payments'
import { useAuthStore } from '../store/authStore'
import { useBookingStore } from '../store/bookingStore'
import type { PaymentFormData, SeatClass } from '../types'
import toast from 'react-hot-toast'

export const useUserBookings = () => {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: () => bookingsService.getUserBookings(user!.id),
    enabled: !!user?.id,
  })
}

export const useBooking = (bookingId: string) => {
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingsService.getBookingById(bookingId),
    enabled: !!bookingId,
  })
}

export const useCreateBooking = () => {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const { setPendingBooking } = useBookingStore()

  return useMutation({
  mutationFn: async ({
    tripId,
    seatId,
    seatClass,
    totalPrice,
    travelDate,
  }: {
    tripId: string
    seatId: string
    seatClass: SeatClass
    totalPrice: number
    travelDate: string
  }) => {
    if (!user) throw new Error('Not authenticated')
    return bookingsService.createBooking({
      userId: user.id,
      tripId,
      seatId,
      seatClass,
      totalPrice,
      travelDate,
    })
  },
    onSuccess: (booking) => {
      setPendingBooking(booking)
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['seats'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create booking')
    },
  })
}

export const useProcessPayment = () => {
  const queryClient = useQueryClient()
  const { setConfirmedBooking, pendingBooking } = useBookingStore()

  return useMutation({
    mutationFn: async (formData: PaymentFormData) => {
      if (!pendingBooking) throw new Error('No pending booking')

      const payment = await paymentsService.processPayment({
        bookingId: pendingBooking.id,
        amount: pendingBooking.price,
        formData,
      })

      const confirmed = await bookingsService.confirmBooking(pendingBooking.id)
      return { payment, booking: confirmed }
    },
    onSuccess: ({ booking }) => {
      setConfirmedBooking(booking)
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Payment failed')
    },
  })
}

export const useCancelBooking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ bookingId, reason }: { bookingId: string; reason: string }) =>
      bookingsService.cancelBooking(bookingId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['seats'] })
      toast.success('Booking cancelled successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to cancel booking')
    },
  })
}
