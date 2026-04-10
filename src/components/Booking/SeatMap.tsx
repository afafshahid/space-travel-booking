import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Seat, SeatClass } from '../../types'

interface SeatMapProps {
  seats: Seat[]
  selectedSeatId: string | null
  selectedClass: SeatClass
  onSeatSelect: (seat: Seat) => void
}

const CLASS_COLORS: Record<SeatClass, { available: string; selected: string; label: string }> = {
  economy: {
    available: 'bg-[#10b981] hover:bg-[#059669]',
    selected: 'bg-[#f59e0b] ring-2 ring-[#f59e0b] ring-offset-1 ring-offset-[#050811]',
    label: 'Economy',
  },
  business: {
    available: 'bg-[#0ea5e9] hover:bg-[#0284c7]',
    selected: 'bg-[#f59e0b] ring-2 ring-[#f59e0b] ring-offset-1 ring-offset-[#050811]',
    label: 'Business',
  },
  first_class: {
    available: 'bg-[#7c3aed] hover:bg-[#6d28d9]',
    selected: 'bg-[#f59e0b] ring-2 ring-[#f59e0b] ring-offset-1 ring-offset-[#050811]',
    label: 'First Class',
  },
}

export const SeatMap: React.FC<SeatMapProps> = ({
  seats,
  selectedSeatId,
  selectedClass,
  onSeatSelect,
}) => {
  const filteredSeats = useMemo(
    () => seats.filter((s) => s.seat_class === selectedClass),
    [seats, selectedClass]
  )

  const availableCount = filteredSeats.filter((s) => s.is_available).length
  const totalCount = filteredSeats.length
  const colors = CLASS_COLORS[selectedClass]

  const rows = useMemo(() => {
    const rowMap = new Map<string, Seat[]>()
    filteredSeats.forEach((seat) => {
      const rowLetter = seat.seat_number.replace(/\d/g, '').slice(0, 1) || 'A'
      if (!rowMap.has(rowLetter)) rowMap.set(rowLetter, [])
      rowMap.get(rowLetter)!.push(seat)
    })
    return Array.from(rowMap.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [filteredSeats])

  return (
    <div>
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className={`w-4 h-4 rounded-sm ${colors.available.split(' ')[0]}`} />
          <span className="text-[#a0a0a0]">Available ({availableCount})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-sm bg-[#ef4444]" />
          <span className="text-[#a0a0a0]">Booked ({totalCount - availableCount})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-sm bg-[#f59e0b]" />
          <span className="text-[#a0a0a0]">Selected</span>
        </div>
      </div>

      {/* Seat count */}
      <p className="text-[#a0a0a0] text-sm mb-4">
        <span className="text-[#10b981] font-semibold">{availableCount}</span> of{' '}
        <span className="font-semibold">{totalCount}</span> seats available
      </p>

      {/* Cockpit indicator */}
      <div className="flex justify-center mb-4">
        <div className="px-6 py-1.5 bg-[#7c3aed]/20 border border-[#7c3aed]/30 rounded-full text-[#7c3aed] text-xs font-medium">
          🚀 COCKPIT
        </div>
      </div>

      {/* Seat Grid */}
      <div className="bg-[#050811] rounded-xl p-4 border border-[#7c3aed]/20 overflow-x-auto">
        {rows.length === 0 ? (
          <div className="text-center py-8 text-[#a0a0a0]">
            No seats available for this class
          </div>
        ) : (
          <div className="space-y-2 min-w-[300px]">
            {rows.map(([rowLetter, rowSeats]) => (
              <div key={rowLetter} className="flex items-center gap-2">
                <span className="text-[#a0a0a0] text-xs w-4 flex-shrink-0">{rowLetter}</span>
                <div className="flex gap-1.5 flex-wrap">
                  {rowSeats
                    .sort((a, b) => {
                      const numA = parseInt(a.seat_number.replace(/\D/g, '')) || 0
                      const numB = parseInt(b.seat_number.replace(/\D/g, '')) || 0
                      return numA - numB
                    })
                    .map((seat) => {
                      const isSelected = seat.id === selectedSeatId
                      const isBooked = !seat.is_available

                      return (
                        <motion.button
                          key={seat.id}
                          layout
                          whileHover={!isBooked ? { scale: 1.15 } : {}}
                          whileTap={!isBooked ? { scale: 0.9 } : {}}
                          animate={
                            isSelected
                              ? { scale: [1, 1.2, 1.1], boxShadow: ['0 0 0px #f59e0b', '0 0 12px #f59e0b', '0 0 8px #f59e0b'] }
                              : { scale: 1, boxShadow: '0 0 0px transparent' }
                          }
                          transition={{ duration: 0.25 }}
                          onClick={() => !isBooked && onSeatSelect(seat)}
                          disabled={isBooked}
                          title={
                            isBooked
                              ? `${seat.seat_number} - Booked`
                              : `${seat.seat_number} - Click to select`
                          }
                          className={`w-8 h-8 rounded-sm text-xs font-medium transition-colors flex items-center justify-center ${
                            isBooked
                              ? 'bg-[#ef4444]/70 text-[#ef4444]/50 cursor-not-allowed'
                              : isSelected
                              ? `${colors.selected} text-[#050811]`
                              : `${colors.available} text-white cursor-pointer`
                          }`}
                          aria-label={`Seat ${seat.seat_number} ${isBooked ? 'booked' : isSelected ? 'selected' : 'available'}`}
                        >
                          {seat.seat_number.replace(/[A-Z]/gi, '').slice(0, 2) ||
                            seat.seat_number.slice(0, 2)}
                        </motion.button>
                      )
                    })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
