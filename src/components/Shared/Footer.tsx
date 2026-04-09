import React from 'react';
import { Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center">
              <Rocket size={18} className="text-purple-400" />
            </div>
            <span className="font-bold gradient-text">SpaceTravel</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link to="/explore" className="hover:text-slate-300 transition-colors">Explore Trips</Link>
            <Link to="/my-bookings" className="hover:text-slate-300 transition-colors">My Bookings</Link>
          </div>
          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} SpaceTravel. Journey to the stars.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
