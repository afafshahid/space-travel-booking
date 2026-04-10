import { format, formatDistance, differenceInDays } from 'date-fns'

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export const formatDate = (date: string): string => {
  return format(new Date(date), 'MMM dd, yyyy')
}

export const formatDateTime = (date: string): string => {
  return format(new Date(date), 'MMM dd, yyyy HH:mm')
}

export const formatDateShort = (date: string): string => {
  return format(new Date(date), 'MM/dd/yyyy')
}

export const formatTimeOnly = (date: string): string => {
  return format(new Date(date), 'HH:mm')
}

export const formatRelativeTime = (date: string): string => {
  return formatDistance(new Date(date), new Date(), { addSuffix: true })
}

export const getDaysUntil = (date: string): number => {
  return differenceInDays(new Date(date), new Date())
}

export const formatDuration = (days: number): string => {
  if (days < 1) return 'Less than a day'
  if (days === 1) return '1 day'
  if (days < 30) return `${days} days`
  const months = Math.floor(days / 30)
  const remaining = days % 30
  if (remaining === 0) return `${months} month${months > 1 ? 's' : ''}`
  return `${months}m ${remaining}d`
}

export const formatDistance2 = (km: number): string => {
  if (km >= 1000000) return `${(km / 1000000).toFixed(1)}M km`
  if (km >= 1000) return `${(km / 1000).toFixed(0)}K km`
  return `${km} km`
}

export const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '')
  const groups = cleaned.match(/.{1,4}/g)
  return groups ? groups.join(' ') : cleaned
}

export const formatExpiryDate = (value: string): string => {
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length >= 2) {
    return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4)
  }
  return cleaned
}

export const formatSeatClass = (seatClass: string): string => {
  const map: Record<string, string> = {
    economy: 'Economy',
    business: 'Business',
    first_class: 'First Class',
  }
  return map[seatClass] || seatClass
}

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
