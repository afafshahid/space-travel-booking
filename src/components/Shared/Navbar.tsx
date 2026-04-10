import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Rocket, MapPin, Ticket, LogOut, LogIn, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/auth';

const Navbar: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await authService.signOut();
    navigate('/login');
  };

  const navLinks = [
    { to: '/explore', label: 'Explore', icon: <MapPin size={16} /> },
    ...(user ? [
      { to: '/my-bookings', label: 'My Bookings', icon: <Ticket size={16} /> },
    ] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="glass sticky top-0 z-50 border-b border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center group-hover:bg-purple-600/40 transition-all">
              <Rocket size={18} className="text-purple-400" />
            </div>
            <span className="font-bold text-lg gradient-text">SpaceTravel</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 text-sm font-medium transition-all ${
                  isActive(link.to)
                    ? 'text-purple-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-400 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  <LogIn size={16} />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary text-sm py-2 px-4 rounded-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800 animate-fade-up">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-2 py-2.5 text-sm text-slate-300 hover:text-white"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-slate-800">
              {user ? (
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="flex items-center gap-2 px-2 py-2.5 text-sm text-red-400"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="px-2 py-2.5 text-sm text-slate-300">
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="btn-primary text-sm text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
