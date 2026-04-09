import { useMutation } from '@tanstack/react-query'
import { paymentsService } from '../services/payments'
import type { PaymentFormData } from '../types'

export const usePayment = () => {
  return useMutation({
    mutationFn: ({
      bookingId,
      amount,
      formData,
    }: {
      bookingId: string
      amount: number
      formData: PaymentFormData
    }) => paymentsService.processPayment({ bookingId, amount, formData }),
  })
}
