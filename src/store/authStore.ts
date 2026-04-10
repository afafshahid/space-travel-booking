import { create } from 'zustand'
import type { User as AppUser } from '../types'
import { authService } from '../services/auth'

interface AuthState {
  user: AppUser | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: AppUser | null) => void
  setLoading: (loading: boolean) => void
  signOut: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) =>
    set({ user, isAuthenticated: !!user }),

  setLoading: (isLoading) => set({ isLoading }),

  signOut: async () => {
    await authService.signOut()
    set({ user: null, isAuthenticated: false })
  },

  initialize: async () => {
    set({ isLoading: true })
    try {
      const session = await authService.getSession()
      if (session?.user) {
        const appUser: AppUser = {
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name,
          created_at: session.user.created_at,
        }
        set({ user: appUser, isAuthenticated: true })
      } else {
        set({ user: null, isAuthenticated: false })
      }
    } catch {
      set({ user: null, isAuthenticated: false })
    } finally {
      set({ isLoading: false })
    }
  },
}))
