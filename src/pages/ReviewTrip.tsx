import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ReviewsList from '../components/Reviews/ReviewsList';
import LoadingSpinner from '../components/Shared/LoadingSpinner';
import { getTripById } from '../services/api';
import { useAuthStore } from '../store/authStore';
import type { Trip } from '../types';
import { DESTINATION_IMAGES } from '../utils/constants';
import { formatDate } from '../utils/formatters';

const ReviewTrip: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId') || undefined;
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadData();
  }, [tripId, bookingId, user]);

  const loadData = async () => {
    if (!tripId) return;
    try {
      const tripData = await getTripById(tripId);
      setTrip(tripData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading..." />;

  if (!trip) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="cyber-card p-8">
          <p className="text-slate-400">Trip not found</p>
        </div>
      </div>
    );
  }

  const destName = trip.destination?.name || '';
  const imageUrl = DESTINATION_IMAGES[destName] || '';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-white">
          Review <span className="gradient-text">{destName}</span>
        </h1>
      </div>

      {/* Trip summary card */}
      <div className="cyber-card overflow-hidden mb-6">
        {imageUrl && (
          <div className="relative h-36 overflow-hidden">
            <img src={imageUrl} alt={destName} className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-space-card/90 to-transparent" />
            <h2 className="absolute bottom-3 left-4 text-xl font-bold text-white">{destName}</h2>
          </div>
        )}
        <div className="p-4 text-sm text-slate-400">
          Departure: {formatDate(trip.departure_date)} → Return: {formatDate(trip.return_date)}
        </div>
      </div>

      <ReviewsList tripId={trip.id} bookingId={bookingId} />
    </div>
  );
};

export default ReviewTrip;
