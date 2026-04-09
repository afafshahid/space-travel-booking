import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
  className?: string
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry, className = '' }) => {
  return (
    <div className={`bg-[#ec4899]/10 border border-[#ec4899]/30 rounded-xl p-6 ${className}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="text-[#ec4899] w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-[#ec4899] font-medium">Error</p>
          <p className="text-[#a0a0a0] text-sm mt-1">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 flex items-center gap-2 text-[#0ea5e9] hover:text-[#7c3aed] text-sm transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
