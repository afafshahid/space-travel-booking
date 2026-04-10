import { useAuthStore } from '../store/authStore'

export const useAuth = () => {
  const { user, isLoading, isAuthenticated, setUser, setLoading, signOut } = useAuthStore()
  return { user, isLoading, isAuthenticated, setUser, setLoading, signOut }
}
