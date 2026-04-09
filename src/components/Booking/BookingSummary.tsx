import React from 'react';
import type { Trip, Seat, SeatClass } from '../../types';
import { formatPrice, formatDate, getClassName } from '../../utils/formatters';
import { Rocket, Calendar, MapPin, Tag, User } from 'lucide-react';

interface BookingSummaryProps {
  trip: Trip;
  selectedSeat: Seat | null;
  selectedClass: SeatClass;
  price: number;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ trip, selectedSeat, selectedClass, price }) => {
  const taxes = price * 0.1;
  const total = price + taxes;

  return (
    <div className="cyber-card p-5 space-y-4">
      <h3 className="font-bold text-white flex items-center gap-2">
        <Rocket size={16} className="text-purple-400" />
        Booking Summary
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-2">
          <MapPin size={14} className="text-blue-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-slate-400 text-xs">Destination</p>
            <p className="text-white font-medium">{trip.destination?.name}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Calendar size={14} className="text-purple-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-slate-400 text-xs">Departure</p>
            <p className="text-white font-medium">{formatDate(trip.departure_date)}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Calendar size={14} className="text-green-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-slate-400 text-xs">Return</p>
            <p className="text-white font-medium">{formatDate(trip.return_date)}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Tag size={14} className="text-amber-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-slate-400 text-xs">Class</p>
            <p className="text-white font-medium">{getClassName(selectedClass)}</p>
          </div>
        </div>

        {selectedSeat && (
          <div className="flex items-start gap-2">
            <User size={14} className="text-pink-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-slate-400 text-xs">Seat</p>
              <p className="text-white font-medium">{selectedSeat.seat_number}</p>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-800 pt-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Base price</span>
          <span className="text-white">{formatPrice(price)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Taxes (10%)</span>
          <span className="text-white">{formatPrice(taxes)}</span>
        </div>
        <div className="flex justify-between font-bold text-base border-t border-slate-800 pt-2">
          <span className="text-white">Total</span>
          <span className="gradient-text">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
