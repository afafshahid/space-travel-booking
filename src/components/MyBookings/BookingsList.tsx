import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, AlertCircle, Star, Eye } from 'lucide-react';
import type { Booking } from '../../types';
import { getUserBookings } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { formatDate, formatPrice, getClassName } from '../../utils/formatters';
import LoadingSpinner from '../Shared/LoadingSpinner';
import CancellationModal from './CancellationModal';
import { DESTINATION_IMAGES } from '../../utils/constants';

const BookingsList: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (user) loadBookings();
  }, [user]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await getUserBookings(user!.id);
      setBookings(data);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSuccess = () => {
    setCancellingBooking(null);
    loadBookings();
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="cyber-card p-8">
          <p className="text-slate-400 mb-4">Please login to view your bookings</p>
          <button onClick={() => navigate('/login')} className="btn-primary">Login</button>
        </div>
      </div>
    );
  }

  if (loading) return <LoadingSpinner message="Loading your bookings..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          My <span className="gradient-text">Bookings</span>
        </h1>
        <p className="text-slate-400 mt-1">{bookings.length} booking{bookings.length !== 1 ? 's' : ''} found</p>
      </div>

      {error && (
        <div className="cyber-card p-4 mb-4 flex items-center gap-2 text-red-400">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="cyber-card p-12 text-center">
          <Rocket size={48} className="text-slate-600 mx-auto mb-4 animate-float" />
          <p className="text-lg text-slate-400 mb-2">No bookings yet</p>
          <p className="text-slate-600 text-sm mb-6">Start your cosmic journey today!</p>
          <button onClick={() => navigate('/explore')} className="btn-primary">
            Explore Trips
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const destName = booking.trip?.destination?.name || '';
            const imageUrl = DESTINATION_IMAGES[destName] || '';

            return (
              <div key={booking.id} className={`cyber-card overflow-hidden ${booking.status === 'cancelled' ? 'opacity-70' : ''}`}>
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  {imageUrl && (
                    <div className="sm:w-36 h-32 sm:h-auto relative overflow-hidden">
                      <img src={imageUrl} alt={destName} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-space-card/50" />
                    </div>
                  )}

                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-white">{destName}</h3>
                        <p className="text-sm text-slate-400 font-mono">{booking.qr_code}</p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium border ${
                        booking.status === 'confirmed'
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>
                        {booking.status.toUpperCase()}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm mb-4">
                      <div>
                        <p className="text-xs text-slate-500">Departure</p>
                        <p className="text-white">{formatDate(booking.trip?.departure_date || '')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Class</p>
                        <p className="text-white">{getClassName(booking.class)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Seat</p>
                        <p className="text-white">{booking.seat?.seat_number || 'Auto'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Price</p>
                        <p className="text-white">{formatPrice(booking.price)}</p>
                      </div>
                    </div>

                    {booking.status === 'cancelled' && booking.refund_amount !== null && (
                      <div className="mb-3 text-xs text-amber-400">
                        Refunded: {formatPrice(booking.refund_amount)} ({booking.cancellation_reason})
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => navigate(`/ticket/${booking.id}`)}
                        className="btn-secondary flex items-center gap-1.5 text-sm py-1.5 px-3"
                      >
                        <Eye size={14} />
                        View Ticket
                      </button>
                      {booking.status === 'confirmed' && (
                        <>
                          <button
                            onClick={() => setCancellingBooking(booking)}
                            className="flex items-center gap-1.5 text-sm py-1.5 px-3 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
                          >
                            Cancel Trip
                          </button>
                          <button
                            onClick={() => navigate(`/review/${booking.trip_id}?bookingId=${booking.id}`)}
                            className="flex items-center gap-1.5 text-sm py-1.5 px-3 rounded-lg border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-all"
                          >
                            <Star size={14} />
                            Review
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {cancellingBooking && (
        <CancellationModal
          booking={cancellingBooking}
          onClose={() => setCancellingBooking(null)}
          onSuccess={handleCancelSuccess}
        />
      )}
    </div>
  );
};

export default BookingsList;
