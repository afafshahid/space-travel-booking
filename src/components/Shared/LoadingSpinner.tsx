import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
}

const sizeClasses = {
  sm: 'w-6 h-6 border-2',
  md: 'w-10 h-10 border-2',
  lg: 'w-16 h-16 border-4',
  xl: 'w-24 h-24 border-4',
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', text }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={`${sizeClasses[size]} border-[#7c3aed] border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {text && <p className="text-[#a0a0a0] text-sm animate-pulse">{text}</p>}
    </div>
  )
}

export const FullPageLoader: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => {
  return (
    <div className="min-h-screen bg-[#050811] flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-20 h-20 border-4 border-[#7c3aed]/30 rounded-full mx-auto" />
          <div className="w-20 h-20 border-4 border-[#7c3aed] border-t-transparent rounded-full animate-spin absolute top-0 left-1/2 -translate-x-1/2" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🚀</span>
          </div>
        </div>
        <p className="text-[#a0a0a0] animate-pulse">{text}</p>
      </div>
    </div>
  )
}
