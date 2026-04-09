import React from 'react'
import { Link } from 'react-router-dom'
import { Rocket, Github, Twitter, Mail } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050811] border-t border-[#7c3aed]/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-[#7c3aed] to-[#0ea5e9] rounded flex items-center justify-center">
              <Rocket className="w-3 h-3 text-white" />
            </div>
            <span className="text-[#a0a0a0] text-sm">
              © 2026 SpaceTravel. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-4 text-[#a0a0a0] text-sm">
            <Link to="/explore" className="hover:text-[#7c3aed] transition-colors">
              Explore
            </Link>
            <Link to="/bookings" className="hover:text-[#7c3aed] transition-colors">
              Bookings
            </Link>
            <span className="text-[#7c3aed]">🚀 To the stars!</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
