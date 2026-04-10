import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Trip, Seat, SeatClass } from '../../types';
import { getTripById, generateSeatsForTrip } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { useBookingStore } from '../../store/bookingStore';
import ClassSelection from './ClassSelection';
import SeatMap from './SeatMap';
import BookingSummary from './BookingSummary';
import LoadingSpinner from '../Shared/LoadingSpinner';

const BookingFlow: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { setSelectedTrip, setBookingData } = useBookingStore();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [step, setStep] = useState(1); // 1: class, 2: seat, 3: confirm
  const [selectedClass, setSelectedClass] = useState<SeatClass>('economy');
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!tripId) return;
    loadTripData();
  }, [tripId, user]);

  const loadTripData = async () => {
    try {
      setLoading(true);
      const [tripData] = await Promise.all([getTripById(tripId!)]);
      if (!tripData) {
        setError('Trip not found');
        return;
      }
      setTrip(tripData);
      setSelectedTrip(tripData);

      // Generate and load seats
      const seatData = await generateSeatsForTrip(tripId!, tripData.total_seats);
      setSeats(seatData);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to load trip');
    } finally {
      setLoading(false);
    }
  };

  const getPrice = () => {
    if (!trip) return 0;
    const prices = {
      economy: trip.economy_price,
      business: trip.business_price,
      first_class: trip.first_class_price,
    };
    return prices[selectedClass];
  };

  const handleProceed = () => {
    if (step === 1) {
      setSelectedSeat(null);
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      // Proceed to payment
      if (!trip) return;
      setBookingData({
        tripId: trip.id,
        seatId: selectedSeat?.id || null,
        seatNumber: selectedSeat?.seat_number || null,
        class: selectedClass,
        price: getPrice() * 1.1, // include taxes
        travelDate: trip.departure_date,
      });
      navigate('/payment');
    }
  };

  const handleClassChange = (cls: SeatClass) => {
    setSelectedClass(cls);
    setSelectedSeat(null);
  };

  if (loading) return <LoadingSpinner message="Preparing your journey..." size="lg" />;

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="cyber-card p-8">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={() => navigate('/explore')} className="btn-primary">
            Back to Trips
          </button>
        </div>
      </div>
    );
  }

  if (!trip) return null;

  const steps = ['Select Class', 'Choose Seat', 'Confirm'];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/explore')} className="text-slate-400 hover:text-white">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">
            Book Trip to <span className="gradient-text">{trip.destination?.name}</span>
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Complete your booking in 3 steps</p>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 ${i + 1 <= step ? 'text-purple-400' : 'text-slate-600'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                i + 1 < step ? 'bg-purple-600 text-white' :
                i + 1 === step ? 'border-2 border-purple-500 text-purple-400' :
                'border border-slate-700 text-slate-600'
              }`}>
                {i + 1 < step ? '✓' : i + 1}
              </div>
              <span className="text-sm hidden sm:block">{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px ${i + 1 < step ? 'bg-purple-600' : 'bg-slate-800'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="cyber-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Choose Your Class</h2>
              <ClassSelection
                trip={trip}
                selected={selectedClass}
                onSelect={handleClassChange}
              />
            </div>
          )}

          {step === 2 && (
            <div className="cyber-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Select Your Seat</h2>
              <p className="text-slate-400 text-sm mb-4">
                {seats.filter(s => s.class === selectedClass && s.is_available).length} seats available in {selectedClass} class
              </p>
              <SeatMap
                seats={seats}
                selectedSeat={selectedSeat}
                selectedClass={selectedClass}
                onSeatSelect={setSelectedSeat}
              />
              <p className="text-xs text-slate-600 mt-3">
                * Seat selection is optional. A seat will be auto-assigned if skipped.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="cyber-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Confirm Your Booking</h2>
              <div className="space-y-4 text-sm">
                <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                  <p className="text-green-400 font-medium mb-1">✓ Ready to book!</p>
                  <p className="text-slate-400">
                    Review your booking details and proceed to payment.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
                  <p className="text-amber-400 font-medium mb-1">💳 Test Payment</p>
                  <p className="text-slate-400">
                    Use test card: <span className="text-white font-mono">4242 4242 4242 4242</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-4">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="btn-secondary flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            )}
            <button
              onClick={handleProceed}
              className="btn-primary flex items-center gap-2 ml-auto"
            >
              {step === 3 ? 'Proceed to Payment' : 'Continue'}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Summary sidebar */}
        <div>
          <BookingSummary
            trip={trip}
            selectedSeat={selectedSeat}
            selectedClass={selectedClass}
            price={getPrice()}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
