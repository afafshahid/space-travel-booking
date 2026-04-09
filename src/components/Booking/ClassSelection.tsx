import React from 'react'
import type { Trip, SeatClass } from '../../types'
import { formatPrice } from '../../utils/formatters'
import { getPriceForClass } from '../../utils/calculations'

interface ClassSelectionProps {
  trip: Trip
  selectedClass: SeatClass
  onClassChange: (cls: SeatClass) => void
  seats: { seat_class: SeatClass; is_available: boolean }[]
}

const CLASS_INFO: Record<SeatClass, { label: string; icon: string; perks: string[] }> = {
  economy: {
    label: 'Economy',
    icon: '🪑',
    perks: ['Standard seat', 'Basic meals', 'Cabin luggage'],
  },
  business: {
    label: 'Business',
    icon: '💺',
    perks: ['Reclining seat', 'Premium meals', 'Priority boarding', '2x luggage'],
  },
  first_class: {
    label: 'First Class',
    icon: '🛸',
    perks: ['Private pod', 'Gourmet dining', 'Lounge access', 'Space suit', 'EVA option'],
  },
}

export const ClassSelection: React.FC<ClassSelectionProps> = ({
  trip,
  selectedClass,
  onClassChange,
  seats,
}) => {
  const getAvailableCount = (cls: SeatClass) =>
    seats.filter((s) => s.seat_class === cls && s.is_available).length

  return (
    <div className="space-y-3">
      {(Object.keys(CLASS_INFO) as SeatClass[]).map((cls) => {
        const info = CLASS_INFO[cls]
        const price = getPriceForClass(trip, cls)
        const available = getAvailableCount(cls)
        const isSelected = selectedClass === cls
        const isDisabled = available === 0

        return (
          <button
            key={cls}
            onClick={() => !isDisabled && onClassChange(cls)}
            disabled={isDisabled}
            className={`w-full text-left p-4 rounded-xl border transition-all ${
              isDisabled
                ? 'border-[#374151] opacity-50 cursor-not-allowed'
                : isSelected
                ? 'border-[#7c3aed] bg-[#7c3aed]/10 shadow-lg shadow-[#7c3aed]/20'
                : 'border-[#7c3aed]/20 hover:border-[#7c3aed]/50 hover:bg-[#7c3aed]/5'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{info.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#e0e0e0] font-semibold">{info.label}</span>
                    {isSelected && (
                      <span className="text-xs px-2 py-0.5 bg-[#7c3aed] text-white rounded-full">
                        Selected
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {info.perks.map((perk) => (
                      <span key={perk} className="text-xs text-[#a0a0a0]">
                        • {perk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                <p className="text-white font-bold">{formatPrice(price)}</p>
                <p className={`text-xs ${isDisabled ? 'text-[#ef4444]' : 'text-[#10b981]'}`}>
                  {isDisabled ? 'Sold out' : `${available} left`}
                </p>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
