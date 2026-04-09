import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Rocket, Menu, X, LogOut, User, BookOpen, Star } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, signOut } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
    toast.success('Signed out successfully')
    navigate('/login')
    setIsMenuOpen(false)
  }

  const isActive = (path: string) => location.pathname === path

  const navLinks = isAuthenticated
    ? [
        { path: '/explore', label: 'Explore Trips', icon: <Rocket className="w-4 h-4" /> },
        { path: '/bookings', label: 'My Bookings', icon: <BookOpen className="w-4 h-4" /> },
      ]
    : []

  return (
    <nav className="sticky top-0 z-40 bg-[#050811]/90 backdrop-blur-md border-b border-[#7c3aed]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-[#7c3aed] to-[#0ea5e9] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#0ea5e9] text-lg hidden sm:block">
              SpaceTravel
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-[#7c3aed]/20 text-[#7c3aed]'
                    : 'text-[#a0a0a0] hover:text-white hover:bg-white/5'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#7c3aed]/10 border border-[#7c3aed]/20">
                  <User className="w-4 h-4 text-[#7c3aed]" />
                  <span className="text-sm text-[#e0e0e0] truncate max-w-[150px]">
                    {user?.full_name || user?.email?.split('@')[0] || 'User'}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#a0a0a0] hover:text-white hover:bg-white/5 transition-all text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm text-[#a0a0a0] hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm bg-gradient-to-r from-[#7c3aed] to-[#0ea5e9] text-white rounded-lg hover:shadow-lg hover:shadow-[#7c3aed]/30 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#a0a0a0] hover:text-white hover:bg-white/5 transition-all"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-[#7c3aed]/20 bg-[#050811]/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-[#7c3aed]/20 text-[#7c3aed]'
                    : 'text-[#a0a0a0] hover:text-white hover:bg-white/5'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="pt-3 border-t border-[#7c3aed]/20">
                <div className="flex items-center gap-2 px-4 py-2 mb-2">
                  <User className="w-4 h-4 text-[#7c3aed]" />
                  <span className="text-sm text-[#e0e0e0]">
                    {user?.full_name || user?.email || 'User'}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#ec4899] hover:bg-[#ec4899]/10 transition-all text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-[#7c3aed]/20 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-[#a0a0a0] hover:text-white hover:bg-white/5 transition-all text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#0ea5e9] text-white text-sm text-center"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
