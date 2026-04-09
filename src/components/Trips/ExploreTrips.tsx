import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import TripCard from './TripCard';
import LoadingSpinner from '../Shared/LoadingSpinner';
import { getTrips } from '../../services/api';
import type { Trip } from '../../types';

const ExploreTrips: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'available' | 'full'>('all');
  const [sortBy, setSortBy] = useState<'departure' | 'price_asc' | 'price_desc'>('departure');

  const fetchTrips = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getTrips();
      setTrips(data);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const filteredTrips = trips
    .filter((trip) => {
      const destName = trip.destination?.name?.toLowerCase() || '';
      const matchesSearch = destName.includes(search.toLowerCase()) ||
        trip.destination?.description?.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'all' || trip.status === filter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.economy_price - b.economy_price;
      if (sortBy === 'price_desc') return b.economy_price - a.economy_price;
      return new Date(a.departure_date).getTime() - new Date(b.departure_date).getTime();
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Explore <span className="gradient-text">Space Trips</span>
        </h1>
        <p className="text-slate-400">Discover your next cosmic adventure</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search destinations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-cyber pl-9"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="input-cyber pl-8 pr-4 cursor-pointer appearance-none"
              style={{ minWidth: '130px' }}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="full">Full</option>
            </select>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="input-cyber cursor-pointer appearance-none px-3"
            style={{ minWidth: '140px' }}
          >
            <option value="departure">By Departure</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>
          <button
            onClick={fetchTrips}
            className="btn-secondary flex items-center gap-1.5 px-3"
            title="Refresh"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Loading space trips..." />
      ) : error ? (
        <div className="cyber-card p-8 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={fetchTrips} className="btn-primary">Try Again</button>
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="cyber-card p-12 text-center">
          <p className="text-slate-400 text-lg mb-2">No trips found</p>
          <p className="text-slate-600 text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreTrips;
