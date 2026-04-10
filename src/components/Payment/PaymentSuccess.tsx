import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Ticket, ArrowRight } from 'lucide-react';
import { useBookingStore } from '../../store/bookingStore';
import { formatPrice } from '../../utils/formatters';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { completedBookingId, bookingData, selectedTrip, resetBooking } = useBookingStore();

  const handleViewTicket = () => {
    if (completedBookingId) {
      resetBooking();
      navigate(`/ticket/${completedBookingId}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full cyber-card p-8 text-center animate-fade-up">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-5 animate-pulse-glow">
          <CheckCircle size={40} className="text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
        <p className="text-slate-400 mb-6">
          Your booking to{' '}
          <span className="text-purple-400">{selectedTrip?.destination?.name}</span>{' '}
          is confirmed!
          {bookingData && (
            <span className="block mt-1 text-white font-semibold">
              {formatPrice(bookingData.price)} charged
            </span>
          )}
        </p>

        <div className="space-y-3">
          <button
            onClick={handleViewTicket}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Ticket size={16} />
            View Your Ticket
            <ArrowRight size={16} />
          </button>
          <button
            onClick={() => { resetBooking(); navigate('/my-bookings'); }}
            className="btn-secondary w-full"
          >
            My Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
