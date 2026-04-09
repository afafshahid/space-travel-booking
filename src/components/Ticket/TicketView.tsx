import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Rocket, Calendar, MapPin, Tag, User, Download, ArrowLeft } from 'lucide-react';
import type { Booking } from '../../types';
import { getBookingById } from '../../services/api';
import { formatDate, formatPrice, getClassName } from '../../utils/formatters';
import LoadingSpinner from '../Shared/LoadingSpinner';
import { DESTINATION_IMAGES } from '../../utils/constants';

const TicketView: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!bookingId) return;
    loadBooking();
  }, [bookingId]);

  const loadBooking = async () => {
    try {
      const data = await getBookingById(bookingId!);
      setBooking(data);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to load ticket');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading your ticket..." />;

  if (error || !booking) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="cyber-card p-8">
          <p className="text-red-400 mb-4">{error || 'Ticket not found'}</p>
          <button onClick={() => navigate('/my-bookings')} className="btn-primary">
            My Bookings
          </button>
        </div>
      </div>
    );
  }

  const destName = booking.trip?.destination?.name || '';
  const imageUrl = DESTINATION_IMAGES[destName] || '';
  const qrData = JSON.stringify({
    id: booking.id,
    qrCode: booking.qr_code,
    destination: destName,
    departure: booking.trip?.departure_date,
    class: booking.class,
    seat: booking.seat?.seat_number || 'Auto',
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-white">Your <span className="gradient-text">Boarding Pass</span></h1>
      </div>

      {/* Ticket Card */}
      <div className={`ticket-card overflow-hidden animate-fade-up ${booking.status === 'cancelled' ? 'opacity-70' : ''}`}>
        {/* Destination image banner */}
        {imageUrl && (
          <div className="relative h-40 overflow-hidden">
            <img src={imageUrl} alt={destName} className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-space-card to-transparent" />
            <div className="absolute bottom-3 left-5">
              <h2 className="text-2xl font-bold text-white">{destName}</h2>
            </div>
            {booking.status === 'cancelled' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-red-500/80 text-white px-6 py-2 rounded-lg font-bold text-xl transform -rotate-12">
                  CANCELLED
                </div>
              </div>
            )}
          </div>
        )}

        <div className="p-6">
          {/* Booking reference */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Booking Reference</p>
              <p className="text-2xl font-mono font-bold text-white tracking-widest">{booking.qr_code}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
              booking.status === 'confirmed'
                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                : 'bg-red-500/20 text-red-400 border-red-500/30'
            }`}>
              {booking.status.toUpperCase()}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-start gap-2">
              <Calendar size={14} className="text-purple-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500">Departure</p>
                <p className="text-sm text-white font-medium">{formatDate(booking.trip?.departure_date || '')}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar size={14} className="text-green-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500">Return</p>
                <p className="text-sm text-white font-medium">{formatDate(booking.trip?.return_date || '')}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Tag size={14} className="text-amber-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500">Class</p>
                <p className="text-sm text-white font-medium">{getClassName(booking.class)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <User size={14} className="text-pink-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500">Seat</p>
                <p className="text-sm text-white font-medium">{booking.seat?.seat_number || 'Auto-assigned'}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Rocket size={14} className="text-blue-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500">Price Paid</p>
                <p className="text-sm text-white font-medium">{formatPrice(booking.price)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-red-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500">Distance</p>
                <p className="text-sm text-white font-medium">
                  {(booking.trip?.destination?.distance_km || 0).toLocaleString()} km
                </p>
              </div>
            </div>
          </div>

          {/* Dashed separator */}
          <div className="relative border-t border-dashed border-slate-700 my-5">
            <div className="absolute -left-6 -top-3 w-6 h-6 rounded-full bg-space-darkest border-r border-slate-700" />
            <div className="absolute -right-6 -top-3 w-6 h-6 rounded-full bg-space-darkest border-l border-slate-700" />
          </div>

          {/* QR Code */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="p-3 bg-white rounded-xl">
              <QRCodeSVG value={qrData} size={140} />
            </div>
            <div className="text-sm text-slate-400 text-center sm:text-left">
              <p className="text-white font-medium mb-1">Scan to verify</p>
              <p>Show this QR code at the boarding gate for identity verification.</p>
              <p className="mt-2 text-xs text-slate-600">Ticket ID: {booking.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => navigate('/my-bookings')}
              className="btn-secondary flex items-center gap-2 flex-1 justify-center"
            >
              My Bookings
            </button>
            <button
              onClick={() => window.print()}
              className="btn-primary flex items-center gap-2 flex-1 justify-center"
            >
              <Download size={14} />
              Save Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketView;
