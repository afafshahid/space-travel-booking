import React, { useState } from 'react'
import { CreditCard, Lock, AlertCircle } from 'lucide-react'
import type { PaymentFormData } from '../../types'
import { formatCardNumber, formatExpiryDate } from '../../utils/formatters'
import {
  validateCardNumber,
  validateExpiryDate,
  validateCVC,
  validateCardholderName,
} from '../../utils/validators'

interface PaymentFormProps {
  amount: number
  onSubmit: (data: PaymentFormData) => void
  isLoading: boolean
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ amount, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: '',
  })
  const [errors, setErrors] = useState<Partial<PaymentFormData>>({})

  const validate = () => {
    const newErrors: Partial<PaymentFormData> = {}
    if (!validateCardNumber(formData.cardNumber)) newErrors.cardNumber = 'Invalid card number'
    if (!validateExpiryDate(formData.expiryDate)) newErrors.expiryDate = 'Invalid or expired date'
    if (!validateCVC(formData.cvc)) newErrors.cvc = 'Invalid CVC'
    if (!validateCardholderName(formData.cardholderName))
      newErrors.cardholderName = 'Name is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) onSubmit(formData)
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    if (formatted.length <= 19) {
      setFormData((prev) => ({ ...prev, cardNumber: formatted }))
      if (errors.cardNumber) setErrors((prev) => ({ ...prev, cardNumber: undefined }))
    }
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value)
    if (formatted.length <= 5) {
      setFormData((prev) => ({ ...prev, expiryDate: formatted }))
      if (errors.expiryDate) setErrors((prev) => ({ ...prev, expiryDate: undefined }))
    }
  }

  const inputClass = (error?: string) =>
    `w-full bg-[#050811] border rounded-lg px-4 py-3 text-[#e0e0e0] placeholder-[#a0a0a0]/50 focus:outline-none focus:ring-1 transition-all font-mono text-sm ${
      error
        ? 'border-[#ec4899] focus:ring-[#ec4899]'
        : 'border-[#7c3aed]/30 focus:border-[#0ea5e9] focus:ring-[#0ea5e9]'
    }`

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Test Card Info */}
      <div className="flex items-start gap-2 p-3 bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 rounded-lg">
        <AlertCircle className="w-4 h-4 text-[#0ea5e9] mt-0.5 flex-shrink-0" />
        <p className="text-[#0ea5e9] text-xs">
          Test mode: Use card <strong>4242 4242 4242 4242</strong>, any future expiry, any CVC
        </p>
      </div>

      {/* Card Number */}
      <div>
        <label className="block text-[#e0e0e0] text-sm font-medium mb-1.5">Card Number</label>
        <div className="relative">
          <input
            type="text"
            value={formData.cardNumber}
            onChange={handleCardNumberChange}
            placeholder="4242 4242 4242 4242"
            maxLength={19}
            className={inputClass(errors.cardNumber)}
            aria-label="Card number"
          />
          <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a0a0a0]" />
        </div>
        {errors.cardNumber && (
          <p className="text-[#ec4899] text-xs mt-1">{errors.cardNumber}</p>
        )}
      </div>

      {/* Expiry + CVC */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[#e0e0e0] text-sm font-medium mb-1.5">Expiry Date</label>
          <input
            type="text"
            value={formData.expiryDate}
            onChange={handleExpiryChange}
            placeholder="MM/YY"
            maxLength={5}
            className={inputClass(errors.expiryDate)}
            aria-label="Expiry date"
          />
          {errors.expiryDate && (
            <p className="text-[#ec4899] text-xs mt-1">{errors.expiryDate}</p>
          )}
        </div>
        <div>
          <label className="block text-[#e0e0e0] text-sm font-medium mb-1.5">CVC</label>
          <input
            type="text"
            value={formData.cvc}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 4)
              setFormData((prev) => ({ ...prev, cvc: val }))
              if (errors.cvc) setErrors((prev) => ({ ...prev, cvc: undefined }))
            }}
            placeholder="123"
            maxLength={4}
            className={inputClass(errors.cvc)}
            aria-label="CVC"
          />
          {errors.cvc && <p className="text-[#ec4899] text-xs mt-1">{errors.cvc}</p>}
        </div>
      </div>

      {/* Cardholder Name */}
      <div>
        <label className="block text-[#e0e0e0] text-sm font-medium mb-1.5">Cardholder Name</label>
        <input
          type="text"
          value={formData.cardholderName}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, cardholderName: e.target.value }))
            if (errors.cardholderName)
              setErrors((prev) => ({ ...prev, cardholderName: undefined }))
          }}
          placeholder="COMMANDER SHEPARD"
          className={`${inputClass(errors.cardholderName)} uppercase`}
          aria-label="Cardholder name"
        />
        {errors.cardholderName && (
          <p className="text-[#ec4899] text-xs mt-1">{errors.cardholderName}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 bg-gradient-to-r from-[#7c3aed] to-[#0ea5e9] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#7c3aed]/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            Pay Now
          </>
        )}
      </button>

      <p className="text-center text-[#a0a0a0] text-xs flex items-center justify-center gap-1">
        <Lock className="w-3 h-3" />
        Secured by SpaceTravel Payments
      </p>
    </form>
  )
}
