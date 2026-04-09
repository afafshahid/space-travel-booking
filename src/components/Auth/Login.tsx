import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Rocket, Lock, Mail } from 'lucide-react'
import { authService } from '../../services/auth'
import { useAuthStore } from '../../store/authStore'
import type { User as AppUser } from '../../types'
import toast from 'react-hot-toast'

export const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const navigate = useNavigate()
  const { setUser } = useAuthStore()

  const validate = () => {
    const newErrors: typeof errors = {}
    if (!email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email address'
    if (!password) newErrors.password = 'Password is required'
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      const data = await authService.signIn(email, password)
      if (data.user) {
        const appUser: AppUser = {
          id: data.user.id,
          email: data.user.email || '',
          full_name: data.user.user_metadata?.full_name,
          created_at: data.user.created_at,
        }
        setUser(appUser)
        toast.success('Welcome back! 🚀')
        navigate('/explore')
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Login failed'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050811] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#7c3aed]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#0ea5e9]/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#7c3aed] to-[#0ea5e9] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#7c3aed]/30">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#0ea5e9]">
            Welcome Back
          </h1>
          <p className="text-[#a0a0a0] mt-2">Sign in to continue your cosmic journey</p>
        </div>

        {/* Form */}
        <div className="bg-[#0a0e27] border border-[#7c3aed]/30 rounded-2xl p-8 shadow-2xl shadow-[#7c3aed]/10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[#e0e0e0] text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a0a0a0]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                  }}
                  placeholder="astronaut@space.com"
                  className={`w-full bg-[#050811] border rounded-lg pl-10 pr-4 py-3 text-[#e0e0e0] placeholder-[#a0a0a0]/50 focus:outline-none focus:ring-1 transition-all ${
                    errors.email
                      ? 'border-[#ec4899] focus:ring-[#ec4899]'
                      : 'border-[#7c3aed]/30 focus:border-[#0ea5e9] focus:ring-[#0ea5e9]'
                  }`}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="text-[#ec4899] text-xs mt-1">
                  {errors.email}
                </p>
              )}
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
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                  }}
                  placeholder="••••••••"
                  className={`w-full bg-[#050811] border rounded-lg pl-10 pr-12 py-3 text-[#e0e0e0] placeholder-[#a0a0a0]/50 focus:outline-none focus:ring-1 transition-all ${
                    errors.password
                      ? 'border-[#ec4899] focus:ring-[#ec4899]'
                      : 'border-[#7c3aed]/30 focus:border-[#0ea5e9] focus:ring-[#0ea5e9]'
                  }`}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0a0a0] hover:text-[#e0e0e0] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-[#ec4899] text-xs mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-[#7c3aed] to-[#0ea5e9] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#7c3aed]/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In 🚀'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-[#a0a0a0] text-sm">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-[#7c3aed] hover:text-[#0ea5e9] font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
