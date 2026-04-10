import { useQuery } from '@tanstack/react-query'
import { tripsService } from '../services/trips'
import { bookingsService } from '../services/bookings'
import type { TripFilters } from '../types'

export const useTrips = (filters?: Partial<TripFilters>) => {
  return useQuery({
    queryKey: ['trips', filters],
    queryFn: () => tripsService.getTripsWithRatings(filters),
    staleTime: 30000,
  })
}

export const useTrip = (tripId: string) => {
  return useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => tripsService.getTripWithRatings(tripId),
    enabled: !!tripId,
    staleTime: 15000,
  })
}

export const useSeats = (tripId: string) => {
  return useQuery({
    queryKey: ['seats', tripId],
    queryFn: () => bookingsService.getSeatsForTrip(tripId),
    enabled: !!tripId,
    staleTime: 10000,
    refetchInterval: 30000,
  })
}
