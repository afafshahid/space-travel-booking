import { supabase } from './supabase'
import type { Payment, PaymentFormData } from '../types'

export const paymentsService = {
  async processPayment(params: {
    bookingId: string
    amount: number
    formData: PaymentFormData
  }): Promise<Payment> {
    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate payment validation
    const cleanCardNumber = params.formData.cardNumber.replace(/\s/g, '')
    if (cleanCardNumber.length < 16) {
      throw new Error('Invalid card number')
    }

    // Simulate occasional failure for testing
    const shouldFail = false // Set to true to test failure scenario

    if (shouldFail) {
      throw new Error('Payment declined. Please check your card details.')
    }

    const { data, error } = await supabase
      .from('payments')
      .insert({
        booking_id: params.bookingId,
        amount: params.amount,
        status: 'completed',
        transaction_id: `TXN-${Date.now()}`,
      })
      .select('*')
      .single()

    if (error) throw error
    return data
  },

  async getPaymentByBookingId(bookingId: string): Promise<Payment | null> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('booking_id', bookingId)
      .maybeSingle()
    if (error) return null
    return data
  },

  async processRefund(bookingId: string, amount: number): Promise<void> {
    const { error } = await supabase
      .from('payments')
      .update({ status: 'refunded' })
      .eq('booking_id', bookingId)
    if (error) throw error
  },
}
