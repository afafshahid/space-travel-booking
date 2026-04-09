import React from 'react'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  isDanger?: boolean
  isLoading?: boolean
  children?: React.ReactNode
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isDanger = false,
  isLoading = false,
  children,
}) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="bg-[#0a0e27] border border-[#7c3aed]/30 rounded-2xl max-w-md w-full p-6 shadow-2xl shadow-[#7c3aed]/20">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isDanger ? 'bg-[#ec4899]/20' : 'bg-[#7c3aed]/20'
              }`}
            >
              <AlertTriangle
                className={`w-5 h-5 ${isDanger ? 'text-[#ec4899]' : 'text-[#7c3aed]'}`}
              />
            </div>
            <h3 className="text-white font-semibold text-lg">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="text-[#a0a0a0] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[#a0a0a0] mb-4">{message}</p>

        {children}

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-lg border border-[#7c3aed]/30 text-[#a0a0a0] hover:text-white hover:border-[#7c3aed] transition-all disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all disabled:opacity-50 ${
              isDanger
                ? 'bg-gradient-to-r from-[#ec4899] to-[#ef4444] text-white hover:shadow-lg hover:shadow-[#ec4899]/30'
                : 'bg-gradient-to-r from-[#7c3aed] to-[#0ea5e9] text-white hover:shadow-lg hover:shadow-[#7c3aed]/30'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
