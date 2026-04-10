import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Rocket, Moon, MapPin, Shield, Star, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
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
          <motion.div
            className="absolute top-1/4 -left-32 w-96 h-96 bg-[#7c3aed]/15 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#0ea5e9]/15 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7c3aed]/5 rounded-full blur-3xl" />
          {/* Stars */}
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: `${(i * 17 + 7) % 100}%`,
                left: `${(i * 23 + 13) % 100}%`,
              }}
              animate={{ opacity: [0.1, 0.6, 0.1] }}
              transition={{
                duration: 2 + (i % 3),
                repeat: Infinity,
                delay: (i % 5) * 0.4,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <div className="relative text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7c3aed]/20 border border-[#7c3aed]/30 text-[#7c3aed] text-sm mb-6"
          >
            <Star className="w-4 h-4 fill-[#7c3aed]" />
            The Future of Space Travel is Here
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-7xl font-black text-white mb-6 leading-tight"
          >
            Journey to the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] via-[#0ea5e9] to-[#10b981]">
              Stars
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-[#a0a0a0] text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Book your seat on humanity's most extraordinary adventure. Explore the Moon, Mars, and
            the International Space Station.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {isAuthenticated ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/explore')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#7c3aed] to-[#0ea5e9] text-white font-bold rounded-xl text-lg hover:shadow-xl hover:shadow-[#7c3aed]/30 transition-shadow"
              >
                <Rocket className="w-5 h-5" />
                Explore Missions
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/signup')}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#7c3aed] to-[#0ea5e9] text-white font-bold rounded-xl text-lg hover:shadow-xl hover:shadow-[#7c3aed]/30 transition-shadow"
                >
                  <Rocket className="w-5 h-5" />
                  Start Your Journey
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, borderColor: '#7c3aed' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center gap-2 px-8 py-4 border border-[#7c3aed]/40 text-[#e0e0e0] font-semibold rounded-xl text-lg hover:bg-[#7c3aed]/10 transition-colors"
                >
                  Sign In
                </motion.button>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center text-white mb-2"
        >
          Why Choose Orbit X?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[#a0a0a0] text-center mb-12"
        >
          Everything you need for the journey of a lifetime
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6, boxShadow: '0 0 24px rgba(124,58,237,0.2)' }}
              className="bg-[#0a0e27] border border-[#7c3aed]/20 rounded-2xl p-6 text-center hover:border-[#7c3aed]/50 transition-colors group cursor-default"
            >
              <motion.div
                whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.3 }}
                className="text-4xl mb-4"
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-[#e0e0e0] font-semibold mb-2">{feature.title}</h3>
              <p className="text-[#a0a0a0] text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
