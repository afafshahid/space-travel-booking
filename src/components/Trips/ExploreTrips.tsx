import React, { useState } from 'react'
import { Rocket } from 'lucide-react'
import { useTrips } from '../../hooks/useTrips'
import { TripCard } from './TripCard'
import { TripFiltersComponent } from './TripFilters'
import { LoadingSpinner, ErrorMessage } from '../Shared'
import type { TripFilters } from '../../types'

export const ExploreTrips: React.FC = () => {
  const [filters, setFilters] = useState<TripFilters>({
    search: '',
    minPrice: 0,
    maxPrice: 0,
    minDuration: 0,
    maxDuration: 0,
  })

  const { data: trips, isLoading, error, refetch } = useTrips(filters)

  return (
    <div className="min-h-screen bg-[#050811] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Rocket className="w-7 h-7 text-[#7c3aed]" />
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#0ea5e9]">
              Explore Trips
            </h1>
          </div>
          <p className="text-[#a0a0a0]">
            Discover extraordinary journeys to the Moon, Mars, and the ISS
          </p>
        </div>

        {/* Filters */}
        <TripFiltersComponent filters={filters} onFiltersChange={setFilters} />

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" text="Loading destinations..." />
          </div>
        ) : error ? (
          <ErrorMessage
            message={(error as Error).message || 'Failed to load trips'}
            onRetry={() => refetch()}
          />
        ) : !trips || trips.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🌌</div>
            <h3 className="text-xl font-semibold text-[#e0e0e0] mb-2">No Trips Found</h3>
            <p className="text-[#a0a0a0] mb-6">
              Try adjusting your filters or search term
            </p>
            <button
              onClick={() =>
                setFilters({ search: '', minPrice: 0, maxPrice: 0, minDuration: 0, maxDuration: 0 })
              }
              className="px-6 py-2 bg-gradient-to-r from-[#7c3aed] to-[#0ea5e9] text-white rounded-lg hover:shadow-lg transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-[#a0a0a0] text-sm mb-4">
              {trips.length} trip{trips.length !== 1 ? 's' : ''} available
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
