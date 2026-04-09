import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Users, Star, Rocket, ArrowRight } from 'lucide-react';
import type { Trip } from '../../types';
import { formatPrice, formatDate, formatDistance, formatDuration } from '../../utils/formatters';
import { DESTINATION_IMAGES } from '../../utils/constants';

interface TripCardProps {
  trip: Trip;
}

const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const navigate = useNavigate();
  const destName = trip.destination?.name || '';
  const imageUrl = DESTINATION_IMAGES[destName] || trip.destination?.image_url || '';

  const handleBook = () => {
    navigate(`/booking/${trip.id}`);
  };

  return (
    <div className="cyber-card overflow-hidden group cursor-pointer" onClick={handleBook}>
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={destName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${trip.id}/800/400`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-space-dark/90 via-transparent to-transparent" />

        {/* Status badge */}
        <div className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-medium ${
          trip.status === 'available'
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : trip.status === 'full'
            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
            : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
        }`}>
          {trip.status === 'available' ? 'Available' : trip.status === 'full' ? 'Sold Out' : 'Cancelled'}
        </div>

        {/* Rating */}
        {(trip.review_count || 0) > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-xs text-white font-medium">
              {trip.average_rating?.toFixed(1)} ({trip.review_count})
            </span>
          </div>
        )}

        {/* Destination name overlay */}
        <div className="absolute bottom-3 right-3">
          <h3 className="text-white font-bold text-lg">{destName}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <MapPin size={14} className="text-blue-400" />
            <span>{formatDistance(trip.destination?.distance_km || 0)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Clock size={14} className="text-purple-400" />
            <span>{formatDuration(trip.destination?.travel_duration_days || 0)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Rocket size={14} className="text-gold" />
            <span>Departs {formatDate(trip.departure_date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Users size={14} className="text-pink-400" />
            <span>{trip.available_seats} seats left</span>
          </div>
        </div>

        {/* Pricing tiers */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <span className="badge-economy">Economy {formatPrice(trip.economy_price)}</span>
          <span className="badge-business">Biz {formatPrice(trip.business_price)}</span>
          <span className="badge-first">1st {formatPrice(trip.first_class_price)}</span>
        </div>

        <button
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
            trip.status === 'available'
              ? 'btn-primary'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
          disabled={trip.status !== 'available'}
          onClick={(e) => { e.stopPropagation(); if (trip.status === 'available') handleBook(); }}
        >
          {trip.status === 'available' ? (
            <>Book Now <ArrowRight size={14} /></>
          ) : (
            trip.status === 'full' ? 'Sold Out' : 'Cancelled'
          )}
        </button>
      </div>
    </div>
  );
};

export default TripCard;
