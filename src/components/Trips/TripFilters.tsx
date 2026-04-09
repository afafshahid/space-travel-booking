import React, { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import type { TripFilters } from '../../types'

interface TripFiltersProps {
  filters: TripFilters
  onFiltersChange: (filters: TripFilters) => void
}

export const TripFiltersComponent: React.FC<TripFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleChange = (key: keyof TripFilters, value: string | number) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const handleReset = () => {
    onFiltersChange({
      search: '',
      minPrice: 0,
      maxPrice: 0,
      minDuration: 0,
      maxDuration: 0,
    })
  }

  const hasActiveFilters =
    filters.search ||
    filters.minPrice > 0 ||
    filters.maxPrice > 0 ||
    filters.minDuration > 0 ||
    filters.maxDuration > 0

  return (
    <div className="bg-[#0a0e27] border border-[#7c3aed]/20 rounded-2xl p-4 mb-6">
      {/* Search Row */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a0a0a0]" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Search destinations..."
            className="w-full bg-[#050811] border border-[#7c3aed]/30 rounded-lg pl-10 pr-4 py-2.5 text-[#e0e0e0] placeholder-[#a0a0a0]/50 focus:outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9] transition-all text-sm"
          />
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all text-sm font-medium ${
            isExpanded || hasActiveFilters
              ? 'border-[#7c3aed] text-[#7c3aed] bg-[#7c3aed]/10'
              : 'border-[#7c3aed]/30 text-[#a0a0a0] hover:border-[#7c3aed] hover:text-[#7c3aed]'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-[#7c3aed] rounded-full" />
          )}
        </button>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-2.5 rounded-lg text-[#ec4899] hover:bg-[#ec4899]/10 transition-all text-sm"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-[#7c3aed]/20 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#a0a0a0] text-xs font-medium mb-2">
              Min Price (USD)
            </label>
            <input
              type="number"
              value={filters.minPrice || ''}
              onChange={(e) => handleChange('minPrice', Number(e.target.value))}
              placeholder="0"
              min={0}
              className="w-full bg-[#050811] border border-[#7c3aed]/30 rounded-lg px-3 py-2 text-[#e0e0e0] placeholder-[#a0a0a0]/50 focus:outline-none focus:border-[#0ea5e9] transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-[#a0a0a0] text-xs font-medium mb-2">
              Max Price (USD)
            </label>
            <input
              type="number"
              value={filters.maxPrice || ''}
              onChange={(e) => handleChange('maxPrice', Number(e.target.value))}
              placeholder="No limit"
              min={0}
              className="w-full bg-[#050811] border border-[#7c3aed]/30 rounded-lg px-3 py-2 text-[#e0e0e0] placeholder-[#a0a0a0]/50 focus:outline-none focus:border-[#0ea5e9] transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-[#a0a0a0] text-xs font-medium mb-2">
              Min Duration (days)
            </label>
            <input
              type="number"
              value={filters.minDuration || ''}
              onChange={(e) => handleChange('minDuration', Number(e.target.value))}
              placeholder="0"
              min={0}
              className="w-full bg-[#050811] border border-[#7c3aed]/30 rounded-lg px-3 py-2 text-[#e0e0e0] placeholder-[#a0a0a0]/50 focus:outline-none focus:border-[#0ea5e9] transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-[#a0a0a0] text-xs font-medium mb-2">
              Max Duration (days)
            </label>
            <input
              type="number"
              value={filters.maxDuration || ''}
              onChange={(e) => handleChange('maxDuration', Number(e.target.value))}
              placeholder="No limit"
              min={0}
              className="w-full bg-[#050811] border border-[#7c3aed]/30 rounded-lg px-3 py-2 text-[#e0e0e0] placeholder-[#a0a0a0]/50 focus:outline-none focus:border-[#0ea5e9] transition-all text-sm"
            />
          </div>
        </div>
      )}
    </div>
  )
}
