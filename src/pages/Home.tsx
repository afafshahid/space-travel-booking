import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Rocket, Moon, MapPin, Shield, Star, ArrowRight } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const FEATURES = [
  { icon: '🚀', title: 'Real-time Booking', desc: 'Live seat maps with instant confirmation' },
  { icon: '🛸', title: 'Multiple Destinations', desc: 'Moon, Mars, ISS and beyond' },
  { icon: '⭐', title: 'Verified Reviews', desc: 'Honest reviews from real travelers' },
  { icon: '🔒', title: 'Secure Payments', desc: 'Bank-grade encryption for your safety' },
]

export const Home: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="min-h-screen bg-[#050811] overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-[85vh] flex items-center justify-center">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#7c3aed]/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#0ea5e9]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7c3aed]/5 rounded-full blur-3xl" />
          {/* Stars */}
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7c3aed]/20 border border-[#7c3aed]/30 text-[#7c3aed] text-sm mb-6">
            <Star className="w-4 h-4 fill-[#7c3aed]" />
            The Future of Space Travel is Here
          </div>

          <h1 className="text-5xl sm:text-7xl font-black text-white mb-6 leading-tight">
            Journey to the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] via-[#0ea5e9] to-[#10b981]">
              Stars
            </span>
          </h1>

          <p className="text-[#a0a0a0] text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Book your seat on humanity's most extraordinary adventure. Explore the Moon, Mars, and
            the International Space Station.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/explore')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#7c3aed] to-[#0ea5e9] text-white font-bold rounded-xl text-lg hover:shadow-xl hover:shadow-[#7c3aed]/30 hover:scale-105 transition-all"
              >
                <Rocket className="w-5 h-5" />
                Explore Missions
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/signup')}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#7c3aed] to-[#0ea5e9] text-white font-bold rounded-xl text-lg hover:shadow-xl hover:shadow-[#7c3aed]/30 hover:scale-105 transition-all"
                >
                  <Rocket className="w-5 h-5" />
                  Start Your Journey
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center gap-2 px-8 py-4 border border-[#7c3aed]/40 text-[#e0e0e0] font-semibold rounded-xl text-lg hover:border-[#7c3aed] hover:bg-[#7c3aed]/10 transition-all"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Why Choose SpaceTravel?
        </h2>
        <p className="text-[#a0a0a0] text-center mb-12">
          Everything you need for the journey of a lifetime
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="bg-[#0a0e27] border border-[#7c3aed]/20 rounded-2xl p-6 text-center hover:border-[#7c3aed]/50 hover:shadow-lg hover:shadow-[#7c3aed]/10 transition-all group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-[#e0e0e0] font-semibold mb-2">{feature.title}</h3>
              <p className="text-[#a0a0a0] text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
