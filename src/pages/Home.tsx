import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Star, Shield, Zap, ArrowRight, Globe } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Home: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20">
        {/* Animated background stars */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white opacity-30 animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-600/10 border border-purple-600/30 text-purple-300 text-sm mb-8 animate-slide-in">
            <Zap size={14} />
            The future of space travel is here
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-up">
            Journey to{' '}
            <span className="gradient-text">The Stars</span>
          </h1>

          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto animate-fade-up">
            Book your seat on humanity's greatest adventure. Visit the Moon, Mars, or the International Space Station.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up">
            <Link to="/explore" className="btn-primary text-base px-8 py-4 flex items-center gap-2 justify-center">
              <Rocket size={18} />
              Explore Trips
              <ArrowRight size={16} />
            </Link>
            {!user && (
              <Link to="/signup" className="btn-secondary text-base px-8 py-4 flex items-center gap-2 justify-center">
                Create Account
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto">
            {[
              { value: '3+', label: 'Destinations' },
              { value: '1K+', label: 'Travelers' },
              { value: '99%', label: 'Satisfaction' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Preview */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">
            Choose Your <span className="gradient-text">Destination</span>
          </h2>
          <p className="text-slate-400">Three extraordinary worlds await you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Moon',
              distance: '384,400 km',
              duration: '3 days',
              price: '$250,000',
              description: 'Experience lunar gravity and breathtaking Earth views from our nearest celestial neighbor.',
              image: 'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?w=800&q=80',
              color: 'text-slate-300',
            },
            {
              name: 'Mars',
              distance: '54.6M km',
              duration: '180 days',
              price: '$1,000,000',
              description: 'The red planet adventure with research stations, colony bases, and Martian landscapes.',
              image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&q=80',
              color: 'text-red-400',
            },
            {
              name: 'ISS',
              distance: '408 km',
              duration: '1 day',
              price: '$100,000',
              description: 'Float in zero-gravity aboard the International Space Station orbiting Earth at 27,600 km/h.',
              image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&q=80',
              color: 'text-blue-400',
            },
          ].map((dest) => (
            <div key={dest.name} className="cyber-card overflow-hidden group">
              <div className="relative h-44 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-space-card/90 to-transparent" />
                <h3 className={`absolute bottom-3 left-4 text-2xl font-bold ${dest.color}`}>{dest.name}</h3>
              </div>
              <div className="p-4">
                <p className="text-sm text-slate-400 mb-3">{dest.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{dest.distance}</span>
                  <span>{dest.duration}</span>
                  <span className="text-green-400 font-medium">from {dest.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/explore" className="btn-primary inline-flex items-center gap-2">
            View All Trips <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">
            Why Choose <span className="gradient-text">SpaceTravel?</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: <Shield size={24} className="text-green-400" />, title: 'Safe & Certified', desc: 'All vehicles are certified and regularly maintained to the highest safety standards.' },
            { icon: <Star size={24} className="text-amber-400" />, title: 'Premium Experience', desc: 'Choose from Economy, Business, or First Class for your journey.' },
            { icon: <Zap size={24} className="text-blue-400" />, title: 'Real-time Booking', desc: 'Instant seat selection with real-time availability updates.' },
            { icon: <Globe size={24} className="text-purple-400" />, title: 'Full Refund Policy', desc: 'Flexible cancellation with up to 100% refund for early cancellations.' },
          ].map((feature) => (
            <div key={feature.title} className="cyber-card p-5 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
