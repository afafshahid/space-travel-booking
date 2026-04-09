import React from 'react'
import { MapPin, Clock, Zap } from 'lucide-react'
import type { Trip } from '../../types'
import { formatDate, formatDateTime, formatDuration } from '../../utils/formatters'

interface TimelineVisualizationProps {
  trip: Trip
}

export const TimelineVisualization: React.FC<TimelineVisualizationProps> = ({ trip }) => {
  const stages = [
    {
      icon: '🚀',
      label: 'Launch',
      time: formatDateTime(trip.departure_date),
      description: 'Lift-off from Earth',
      color: '#7c3aed',
    },
    {
      icon: '🛸',
      label: 'In Transit',
      time: `${formatDuration(trip.destination?.duration_days || 0)} journey`,
      description: 'Traveling through space',
      color: '#0ea5e9',
    },
    {
      icon: '🌙',
      label: 'Arrival',
      time: formatDateTime(trip.arrival_date),
      description: `Landing at ${trip.destination?.name}`,
      color: '#10b981',
    },
  ]

  return (
    <div className="bg-[#050811] rounded-xl p-4 border border-[#7c3aed]/20">
      <h4 className="text-[#e0e0e0] font-semibold mb-4 flex items-center gap-2">
        <Zap className="w-4 h-4 text-[#f59e0b]" />
        Journey Timeline
      </h4>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-gradient-to-b from-[#7c3aed] via-[#0ea5e9] to-[#10b981]" />

        <div className="space-y-6">
          {stages.map((stage, index) => (
            <div key={index} className="flex items-start gap-4">
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-lg"
                style={{ backgroundColor: `${stage.color}20`, border: `2px solid ${stage.color}` }}
              >
                {stage.icon}
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-[#e0e0e0] font-semibold text-sm">{stage.label}</p>
                  <p className="text-xs font-mono" style={{ color: stage.color }}>
                    {stage.time}
                  </p>
                </div>
                <p className="text-[#a0a0a0] text-xs mt-1">{stage.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Distance info */}
      <div className="mt-4 pt-4 border-t border-[#7c3aed]/20 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-[#a0a0a0]">
          <MapPin className="w-4 h-4 text-[#7c3aed]" />
          <span>
            Distance:{' '}
            <span className="text-[#e0e0e0]">
              {(trip.destination?.distance_km || 0).toLocaleString()} km
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-[#a0a0a0]">
          <Clock className="w-4 h-4 text-[#0ea5e9]" />
          <span>
            Duration:{' '}
            <span className="text-[#e0e0e0]">
              {formatDuration(trip.destination?.duration_days || 0)}
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
