import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Rocket, Lock, Mail, User } from 'lucide-react'
import { authService } from '../../services/auth'
import { useAuthStore } from '../../store/authStore'
import type { User as AppUser } from '../../types'
import toast from 'react-hot-toast'

export const Signup: React.FC = () => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    fullName?: string
    email?: string
    password?: string
    confirmPassword?: string
  }>({})

  const navigate = useNavigate()
  const { setUser } = useAuthStore()

  const validate = () => {
    const newErrors: typeof errors = {}
    if (!fullName.trim()) newErrors.fullName = 'Full name is required'
    else if (fullName.trim().length < 2) newErrors.fullName = 'Name must be at least 2 characters'
    if (!email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email address'
    if (!password) newErrors.password = 'Password is required'
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      const data = await authService.signUp(email, password, fullName)
      if (data.user) {
        const appUser: AppUser = {
          id: data.user.id,
          email: data.user.email || '',
          full_name: fullName,
          created_at: data.user.created_at,
        }
        setUser(appUser)
        toast.success('Account created! Welcome aboard! 🚀')
        navigate('/explore')
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Signup failed'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = (fieldError?: string) =>
    `w-full bg-[#050811] border rounded-lg py-3 text-[#e0e0e0] placeholder-[#a0a0a0]/50 focus:outline-none focus:ring-1 transition-all ${
      fieldError
        ? 'border-[#ec4899] focus:ring-[#ec4899]'
        : 'border-[#7c3aed]/30 focus:border-[#0ea5e9] focus:ring-[#0ea5e9]'
    }`

  return (
    <div className="min-h-screen bg-[#050811] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#7c3aed]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#0ea5e9]/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#7c3aed] to-[#0ea5e9] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#7c3aed]/30">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#0ea5e9]">
            Join the Mission
          </h1>
          <p className="text-[#a0a0a0] mt-2">Create your account and start exploring</p>
        </div>

        <div className="bg-[#0a0e27] border border-[#7c3aed]/30 rounded-2xl p-8 shadow-2xl shadow-[#7c3aed]/10">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-[#e0e0e0] text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a0a0a0]" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value)
                    if (errors.fullName) setErrors((p) => ({ ...p, fullName: undefined }))
                  }}
                  placeholder="Commander Shepard"
                  className={`${inputClass(errors.fullName)} pl-10 pr-4`}
                />
              </div>
              {errors.fullName && (
                <p className="text-[#ec4899] text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-[#e0e0e0] text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a0a0a0]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors((p) => ({ ...p, email: undefined }))
                  }}
                  placeholder="commander@space.com"
                  className={`${inputClass(errors.email)} pl-10 pr-4`}
                />
              </div>
              {errors.email && <p className="text-[#ec4899] text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[#e0e0e0] text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a0a0a0]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors((p) => ({ ...p, password: undefined }))
                  }}
                  placeholder="Min 8 characters"
                  className={`${inputClass(errors.password)} pl-10 pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0a0a0] hover:text-[#e0e0e0] transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[#ec4899] text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[#e0e0e0] text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a0a0a0]" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (errors.confirmPassword)
                      setErrors((p) => ({ ...p, confirmPassword: undefined }))
                  }}
                  placeholder="Repeat password"
                  className={`${inputClass(errors.confirmPassword)} pl-10 pr-4`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-[#ec4899] text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-2 bg-gradient-to-r from-[#7c3aed] to-[#0ea5e9] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#7c3aed]/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                'Create Account 🚀'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#a0a0a0] text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-[#7c3aed] hover:text-[#0ea5e9] font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
