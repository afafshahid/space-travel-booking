import { differenceInDays } from 'date-fns'
import type { SeatClass } from '../types'

export const calculateRefundAmount = (totalPrice: number, departureDate: string): number => {
  const daysUntilTravel = differenceInDays(new Date(departureDate), new Date())

  if (daysUntilTravel >= 30) return totalPrice * 1.0
  if (daysUntilTravel >= 15) return totalPrice * 0.75
  if (daysUntilTravel >= 7) return totalPrice * 0.5
  return totalPrice * 0.25
}

export const getRefundPercentage = (departureDate: string): number => {
  const daysUntilTravel = differenceInDays(new Date(departureDate), new Date())
  if (daysUntilTravel >= 30) return 100
  if (daysUntilTravel >= 15) return 75
  if (daysUntilTravel >= 7) return 50
  return 25
}

export const getRefundPolicy = (
  departureDate: string
): { percentage: number; label: string; description: string } => {
  const daysUntilTravel = differenceInDays(new Date(departureDate), new Date())

  if (daysUntilTravel >= 30)
    return { percentage: 100, label: 'Full Refund', description: '30+ days before departure' }
  if (daysUntilTravel >= 15)
    return { percentage: 75, label: '75% Refund', description: '15-30 days before departure' }
  if (daysUntilTravel >= 7)
    return { percentage: 50, label: '50% Refund', description: '7-15 days before departure' }
  return { percentage: 25, label: '25% Refund', description: 'Less than 7 days before departure' }
}

export const getPriceForClass = (
  trip: { economy_price: number; business_price: number; first_class_price: number },
  seatClass: SeatClass
): number => {
  const priceMap = {
    economy: trip.economy_price,
    business: trip.business_price,
    first_class: trip.first_class_price,
  }
  return priceMap[seatClass]
}

export const calculateTaxAmount = (price: number): number => {
  return price * 0.1
}

export const calculateTotalWithTax = (price: number): number => {
  return price * 1.1
}
