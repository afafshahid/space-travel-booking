import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Components
import Navbar from './components/Shared/Navbar';
import Footer from './components/Shared/Footer';
import ErrorBoundary from './components/Shared/ErrorBoundary';
import LoadingSpinner from './components/Shared/LoadingSpinner';

// Auth Components
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';

// Booking Flow Components
import BookingFlow from './components/Booking/BookingFlow';
import PaymentModal from './components/Payment/PaymentModal';
import TicketView from './components/Ticket/TicketView';

// Pages
import Home from './pages/Home';
import ExploreTrips from './components/Trips/ExploreTrips';
import BookingsList from './components/MyBookings/BookingsList';
import ReviewTrip from './pages/ReviewTrip';

// Store & Services
import { useAuthStore } from './store/authStore';
import { authService } from './services/auth';

// Styles
import './styles/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuthStore();
  if (loading) return <LoadingSpinner message="Checking authentication..." />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    authService.getSession().then((session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || '' });
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary>
          <div className="min-h-screen flex flex-col" style={{ background: '#050811' }}>
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/explore" element={<ExploreTrips />} />
                <Route path="/booking/:tripId" element={<ProtectedRoute><BookingFlow /></ProtectedRoute>} />
                <Route path="/payment" element={<ProtectedRoute><PaymentModal /></ProtectedRoute>} />
                <Route path="/ticket/:bookingId" element={<ProtectedRoute><TicketView /></ProtectedRoute>} />
                <Route path="/my-bookings" element={<ProtectedRoute><BookingsList /></ProtectedRoute>} />
                <Route path="/review/:tripId" element={<ProtectedRoute><ReviewTrip /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
