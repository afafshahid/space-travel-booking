import React, { useState } from 'react'
import { Send, X } from 'lucide-react'
import type { ReviewFormData, Review } from '../../types'
import { RatingDisplay } from './RatingDisplay'

interface ReviewFormProps {
  onSubmit: (data: ReviewFormData) => Promise<void>
  onCancel: () => void
  initialData?: ReviewFormData
  isLoading?: boolean
  editingReview?: Review | null
}

interface ReviewFormErrors {
  rating?: string
  title?: string
  content?: string
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading,
  editingReview,
}) => {
  const [formData, setFormData] = useState<ReviewFormData>(
    initialData || { rating: 0, title: '', content: '' }
  )
  const [errors, setErrors] = useState<ReviewFormErrors>({})

  const validate = () => {
    const newErrors: ReviewFormErrors = {}
    if (formData.rating === 0) newErrors.rating = 'Please select a rating'
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    else if (formData.title.length > 200) newErrors.title = 'Title must be less than 200 characters'
    if (!formData.content.trim()) newErrors.content = 'Review content is required'
    else if (formData.content.trim().length < 10)
      newErrors.content = 'Review must be at least 10 characters'
    else if (formData.content.length > 500)
      newErrors.content = 'Review must be less than 500 characters'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    await onSubmit(formData)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0a0e27] border border-[#7c3aed]/30 rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[#e0e0e0] font-semibold">
          {editingReview ? 'Edit Review' : 'Write a Review'}
        </h4>
        <button
          type="button"
          onClick={onCancel}
          className="text-[#a0a0a0] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Star Rating */}
      <div className="mb-4">
        <label className="block text-[#a0a0a0] text-sm mb-2">Your Rating *</label>
        <RatingDisplay
          rating={formData.rating}
          size="lg"
          interactive
          onRate={(r) => {
            setFormData((prev) => ({ ...prev, rating: r }))
            if (errors.rating) setErrors((prev) => ({ ...prev, rating: undefined }))
          }}
        />
        {errors.rating && (
          <p className="text-[#ec4899] text-xs mt-1">{errors.rating}</p>
        )}
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-[#a0a0a0] text-sm mb-2">Review Title * (max 200)</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, title: e.target.value }))
            if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }))
          }}
          placeholder="Summarize your experience..."
          maxLength={200}
          className={`w-full bg-[#050811] border rounded-lg px-4 py-2.5 text-[#e0e0e0] placeholder-[#a0a0a0]/50 focus:outline-none focus:ring-1 transition-all text-sm ${
            errors.title
              ? 'border-[#ec4899] focus:ring-[#ec4899]'
              : 'border-[#7c3aed]/30 focus:border-[#0ea5e9] focus:ring-[#0ea5e9]'
          }`}
        />
        <div className="flex justify-between mt-1">
          {errors.title ? (
            <p className="text-[#ec4899] text-xs">{errors.title}</p>
          ) : (
            <span />
          )}
          <span className="text-[#a0a0a0] text-xs">{formData.title.length}/200</span>
        </div>
      </div>

      {/* Content */}
      <div className="mb-5">
        <label className="block text-[#a0a0a0] text-sm mb-2">Review * (max 500)</label>
        <textarea
          value={formData.content}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, content: e.target.value }))
            if (errors.content) setErrors((prev) => ({ ...prev, content: undefined }))
          }}
          placeholder="Share your experience in detail..."
          rows={4}
          maxLength={500}
          className={`w-full bg-[#050811] border rounded-lg px-4 py-2.5 text-[#e0e0e0] placeholder-[#a0a0a0]/50 focus:outline-none focus:ring-1 transition-all text-sm resize-none ${
            errors.content
              ? 'border-[#ec4899] focus:ring-[#ec4899]'
              : 'border-[#7c3aed]/30 focus:border-[#0ea5e9] focus:ring-[#0ea5e9]'
          }`}
        />
        <div className="flex justify-between mt-1">
          {errors.content ? (
            <p className="text-[#ec4899] text-xs">{errors.content}</p>
          ) : (
            <span />
          )}
          <span className="text-[#a0a0a0] text-xs">{formData.content.length}/500</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-xl border border-[#7c3aed]/30 text-[#a0a0a0] hover:text-white hover:border-[#7c3aed] transition-all text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#0ea5e9] text-white font-semibold hover:shadow-lg hover:shadow-[#7c3aed]/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              {editingReview ? 'Update' : 'Submit'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
