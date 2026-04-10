import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import type { Booking } from '../../types';
import { cancelBooking } from '../../services/api';
import { formatPrice, formatDate } from '../../utils/formatters';
import { getRefundAmount, getRefundMessage } from '../../utils/calculations';

interface CancellationModalProps {
  booking: Booking;
  onClose: () => void;
  onSuccess: () => void;
}

const CancellationModal: React.FC<CancellationModalProps> = ({ booking, onClose, onSuccess }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const travelDate = booking.trip?.departure_date || booking.travel_date;
  const refundAmount = getRefundAmount(booking.price, travelDate);
  const refundMessage = getRefundMessage(travelDate);

  const handleCancel = async () => {
    setLoading(true);
    setError('');
    try {
      await cancelBooking(booking.id, reason || 'Cancelled by user', travelDate);
      onSuccess();
    } catch (err: unknown) {
      setError((err as Error).message || 'Cancellation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="cyber-card p-6 max-w-md w-full animate-fade-up">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">Cancel Booking</h3>
              <p className="text-sm text-slate-400">{booking.trip?.destination?.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Refund info */}
        <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 mb-4">
          <p className="text-sm font-medium text-amber-400 mb-2">Refund Policy</p>
          <p className="text-sm text-slate-300 mb-1">Travel date: {formatDate(travelDate)}</p>
          <p className="text-sm text-amber-300">{refundMessage}</p>
          <p className="text-lg font-bold text-white mt-2">
            Refund: {formatPrice(refundAmount)} <span className="text-sm text-slate-400">of {formatPrice(booking.price)}</span>
          </p>
        </div>

        {/* Reason */}
        <div className="mb-4">
          <label className="block text-sm text-slate-400 mb-1.5">
            Cancellation reason (optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why are you cancelling?"
            rows={2}
            className="input-cyber resize-none"
          />
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">
            Keep Booking
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 py-2 px-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all font-medium text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3 h-3 rounded-full border-2 border-red-400/30 border-t-red-400 animate-spin" />
                Cancelling...
              </span>
            ) : (
              'Confirm Cancellation'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancellationModal;
