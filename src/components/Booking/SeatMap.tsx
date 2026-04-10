import React from 'react';
import type { Seat, SeatClass } from '../../types';
import { getClassName } from '../../utils/formatters';

interface SeatMapProps {
  seats: Seat[];
  selectedSeat: Seat | null;
  selectedClass: SeatClass;
  onSeatSelect: (seat: Seat) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({ seats, selectedSeat, selectedClass, onSeatSelect }) => {
  const filteredSeats = seats.filter((s) => s.class === selectedClass);
  const seatsPerRow = 6;
  const rows: Seat[][] = [];

  for (let i = 0; i < filteredSeats.length; i += seatsPerRow) {
    rows.push(filteredSeats.slice(i, i + seatsPerRow));
  }

  const getSeatClass = (seat: Seat) => {
    if (!seat.is_available) return 'seat-occupied';
    if (selectedSeat?.id === seat.id) return 'seat-selected';
    return 'seat-available';
  };

  return (
    <div className="w-full">
      {/* Legend */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded seat-available" />
          <span className="text-sm text-slate-400">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded seat-selected" />
          <span className="text-sm text-slate-400">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded seat-occupied" />
          <span className="text-sm text-slate-400">Occupied</span>
        </div>
      </div>

      {/* Cabin header */}
      <div className="text-center mb-4">
        <div className="inline-block px-6 py-2 rounded-full bg-purple-600/20 border border-purple-600/40 text-sm text-purple-300">
          {getClassName(selectedClass)} Cabin
        </div>
      </div>

      {/* Aircraft nose indicator */}
      <div className="text-center mb-4">
        <div className="inline-block w-16 h-6 rounded-t-full bg-slate-800 border border-slate-700 text-xs text-slate-600 flex items-center justify-center">
          ▲ Front
        </div>
      </div>

      {/* Seat grid */}
      {filteredSeats.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          No seats available for this class
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex items-center gap-1 justify-center">
              <span className="text-xs text-slate-600 w-6 text-right">{rowIdx + 1}</span>
              <div className="flex gap-1">
                {row.slice(0, 3).map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => seat.is_available && onSeatSelect(seat)}
                    className={`w-8 h-8 rounded text-xs font-medium transition-all ${getSeatClass(seat)}`}
                    title={`Seat ${seat.seat_number} - ${seat.is_available ? 'Available' : 'Occupied'}`}
                    disabled={!seat.is_available}
                  >
                    {seat.seat_number.slice(-1)}
                  </button>
                ))}
              </div>
              <div className="w-6" /> {/* Aisle */}
              <div className="flex gap-1">
                {row.slice(3).map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => seat.is_available && onSeatSelect(seat)}
                    className={`w-8 h-8 rounded text-xs font-medium transition-all ${getSeatClass(seat)}`}
                    title={`Seat ${seat.seat_number} - ${seat.is_available ? 'Available' : 'Occupied'}`}
                    disabled={!seat.is_available}
                  >
                    {seat.seat_number.slice(-1)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedSeat && (
        <div className="mt-4 p-3 rounded-lg bg-purple-600/10 border border-purple-600/30 text-center">
          <span className="text-sm text-purple-300">
            Selected: Seat <strong>{selectedSeat.seat_number}</strong>
          </span>
        </div>
      )}
    </div>
  );
};

export default SeatMap;
