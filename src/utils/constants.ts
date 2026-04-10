export const SEAT_CLASSES = [
  { value: 'economy', label: 'Economy', multiplier: 1.0 },
  { value: 'business', label: 'Business', multiplier: 2.5 },
  { value: 'first_class', label: 'First Class', multiplier: 5.0 },
] as const

export const BOOKING_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
} as const

export const TRIP_STATUSES = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const

export const CANCELLATION_POLICIES = [
  { daysUntilTravel: 30, refundPercentage: 100, label: '30+ days before travel: 100% refund' },
  { daysUntilTravel: 15, refundPercentage: 75, label: '15-30 days before travel: 75% refund' },
  { daysUntilTravel: 7, refundPercentage: 50, label: '7-15 days before travel: 50% refund' },
  { daysUntilTravel: 0, refundPercentage: 25, label: 'Less than 7 days: 25% refund' },
]

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'highest_rated', label: 'Highest Rated' },
] as const

export const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: 0 },
  { label: 'Under $100K', min: 0, max: 100000 },
  { label: '$100K - $500K', min: 100000, max: 500000 },
  { label: '$500K - $1M', min: 500000, max: 1000000 },
  { label: 'Over $1M', min: 1000000, max: 0 },
]

export const COLORS = {
  SEAT_AVAILABLE: '#10b981',
  SEAT_BOOKED: '#ef4444',
  SEAT_SELECTED: '#f59e0b',
  SEAT_HOVER: '#0ea5e9',
}

export const DESTINATIONS = {
  MOON: 'Moon',
  MARS: 'Mars',
  ISS: 'ISS',
}

export const APP_NAME = 'Orbit X'
export const APP_TAGLINE = 'Your Ultimate Space Journey'
