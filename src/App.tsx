import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from './store/authStore'
import { authService } from './services/auth'
import { Navbar } from './components/Navigation/Navbar'
import { Footer } from './components/Navigation/Footer'
import { ProtectedRoute } from './components/Auth/ProtectedRoute'
import { FullPageLoader } from './components/Shared/LoadingSpinner'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { ExplorePage } from './pages/Explore'
import { BookingPage } from './pages/BookingPage'
import { PaymentPage } from './pages/PaymentPage'
import { TicketPage } from './pages/TicketPage'
import { MyBookingsPage } from './pages/MyBookingsPage'
import { ReviewsPageWrapper } from './pages/ReviewsPage'
import type { User as AppUser } from './types'
import './App.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    },
  },
})

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -8 },
}

const pageTransition = { duration: 0.15, ease: 'easeInOut' }

const AnimatedRoutes: React.FC = () => {
  const location = useLocation()
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <Routes location={location}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/explore"
            element={
              <ProtectedRoute>
                <ExplorePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking/:tripId"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ticket/:bookingId"
            element={
              <ProtectedRoute>
                <TicketPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reviews/:tripId"
            element={
              <ProtectedRoute>
                <ReviewsPageWrapper />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

const AppContent: React.FC = () => {
  const { isLoading, setUser, setLoading } = useAuthStore()

  useEffect(() => {
    // Initialize auth
    const initAuth = async () => {
      setLoading(true)
      try {
        const session = await authService.getSession()
        if (session?.user) {
          const appUser: AppUser = {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name,
            created_at: session.user.created_at,
          }
          setUser(appUser)
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // Listen for auth changes
    const { data: listener } = authService.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session && typeof session === 'object' && 'user' in session) {
        const s = session as { user: { id: string; email?: string; user_metadata?: { full_name?: string }; created_at: string } }
        if (s.user) {
          setUser({
            id: s.user.id,
            email: s.user.email || '',
            full_name: s.user.user_metadata?.full_name,
            created_at: s.user.created_at,
          })
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => {
      listener?.subscription?.unsubscribe()
    }
  }, [setUser, setLoading])

  if (isLoading) {
    return <FullPageLoader text="Initializing Orbit X..." />
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <AnimatedRoutes />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0a0e27',
              color: '#e0e0e0',
              border: '1px solid rgba(124, 58, 237, 0.3)',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#0a0e27' },
            },
            error: {
              iconTheme: { primary: '#ec4899', secondary: '#0a0e27' },
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
