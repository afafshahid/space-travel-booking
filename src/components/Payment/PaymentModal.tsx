import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useBookingStore } from '../../store/bookingStore';
import { useAuthStore } from '../../store/authStore';
import { createBooking, createPayment } from '../../services/api';
import { formatPrice } from '../../utils/formatters';
import { formatCardNumber, formatExpiry, validateCardNumber, validateExpiry, validateCVV } from '../../utils/validators';
import { TEST_CARD } from '../../utils/constants';
import { v4 as uuidv4 } from 'uuid';

const PaymentModal: React.FC = () => {
  const navigate = useNavigate();
  const { bookingData, selectedTrip, setCompletedBookingId } = useBookingStore();
  const { user } = useAuthStore();

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiry(formatExpiry(e.target.value));
  };

  const isTestCard = cardNumber.replace(/\s/g, '') === TEST_CARD.replace(/\s/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate
    if (!validateCardNumber(cardNumber)) {
      setError('Invalid card number. Use test card: ' + TEST_CARD);
      return;
    }
    if (!validateExpiry(expiry)) {
      setError('Invalid expiry date (MM/YY format)');
      return;
    }
    if (!validateCVV(cvv)) {
      setError('Invalid CVV (3-4 digits)');
      return;
    }
    if (!cardholderName.trim()) {
      setError('Please enter cardholder name');
      return;
    }

    if (!bookingData || !user || !selectedTrip) {
      setError('Booking session expired. Please start again.');
      return;
    }

    setLoading(true);
    try {
      // Create booking
      const booking = await createBooking({
        userId: user.id,
        tripId: bookingData.tripId,
        seatId: bookingData.seatId,
        seatNumber: bookingData.seatNumber,
        seatClass: bookingData.class,
        price: bookingData.price,
        travelDate: bookingData.travelDate,
      });

      // Create payment record
      await createPayment({
        bookingId: booking.id,
        amount: bookingData.price,
        paymentMethod: 'credit_card',
        transactionId: uuidv4().toUpperCase().replace(/-/g, '').slice(0, 16),
      });

      setCompletedBookingId(booking.id);
      navigate('/ticket/' + booking.id);
    } catch (err: unknown) {
      setError((err as Error).message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData || !selectedTrip) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="cyber-card p-8">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <p className="text-slate-400 mb-4">No booking data found. Please start a new booking.</p>
          <button onClick={() => navigate('/explore')} className="btn-primary">
            Browse Trips
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="cyber-card p-6 animate-fade-up">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center mx-auto mb-3">
            <Lock size={24} className="text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold gradient-text">Secure Payment</h2>
          <p className="text-slate-400 text-sm mt-1">
            Total: <span className="text-white font-bold">{formatPrice(bookingData.price)}</span>
          </p>
        </div>

        {/* Test card hint */}
        <div className="mb-5 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
          <p className="text-xs text-blue-400">
            🧪 <strong>Test Mode:</strong> Use card{' '}
            <button
              type="button"
              onClick={() => setCardNumber(TEST_CARD)}
              className="font-mono underline hover:text-blue-300"
            >
              {TEST_CARD}
            </button>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Card Number */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Card Number</label>
            <div className="relative">
              <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="4242 4242 4242 4242"
                maxLength={19}
                required
                className={`input-cyber pl-9 font-mono ${isTestCard ? 'border-green-500/50' : ''}`}
              />
              {isTestCard && (
                <CheckCircle size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400" />
              )}
            </div>
          </div>

          {/* Cardholder Name */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Cardholder Name</label>
            <input
              type="text"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="John Doe"
              required
              className="input-cyber"
            />
          </div>

          {/* Expiry + CVV */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Expiry</label>
              <input
                type="text"
                value={expiry}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                maxLength={5}
                required
                className="input-cyber font-mono"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">CVV</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="123"
                  maxLength={4}
                  required
                  className="input-cyber pl-8 font-mono"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 mt-2 text-base"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Processing payment...
              </span>
            ) : (
              `Pay ${formatPrice(bookingData.price)}`
            )}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-600">
          <Lock size={12} />
          <span>256-bit SSL encrypted • Secure payment simulation</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
