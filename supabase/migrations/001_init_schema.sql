-- ============================================================
-- Space Travel Booking - Database Migration
-- Supabase SQL Schema with RLS Policies & Sample Data
-- ============================================================

-- ============================================================
-- TABLES
-- ============================================================

-- Destinations table
CREATE TABLE IF NOT EXISTS destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image_url VARCHAR(500),
  distance_km DECIMAL(15, 2),
  travel_duration_days INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trips table
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  departure_date DATE NOT NULL,
  return_date DATE NOT NULL,
  economy_price DECIMAL(12, 2) NOT NULL DEFAULT 0,
  business_price DECIMAL(12, 2) NOT NULL DEFAULT 0,
  first_class_price DECIMAL(12, 2) NOT NULL DEFAULT 0,
  total_seats INT NOT NULL DEFAULT 100,
  available_seats INT NOT NULL DEFAULT 100,
  status VARCHAR(50) NOT NULL DEFAULT 'available'
    CHECK (status IN ('available', 'full', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seats table
CREATE TABLE IF NOT EXISTS seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  seat_number VARCHAR(10) NOT NULL,
  class VARCHAR(50) NOT NULL CHECK (class IN ('economy', 'business', 'first_class')),
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  booked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  seat_id UUID REFERENCES seats(id) ON DELETE SET NULL,
  class VARCHAR(50) NOT NULL CHECK (class IN ('economy', 'business', 'first_class')),
  price DECIMAL(12, 2) NOT NULL,
  booking_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  travel_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'confirmed'
    CHECK (status IN ('confirmed', 'cancelled')),
  qr_code VARCHAR(255),
  refund_amount DECIMAL(12, 2),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  helpful_count INT NOT NULL DEFAULT 0,
  UNIQUE(booking_id) -- one review per booking
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  payment_method VARCHAR(50),
  status VARCHAR(50) NOT NULL DEFAULT 'completed'
    CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_trips_destination ON trips(destination_id);
CREATE INDEX IF NOT EXISTS idx_trips_departure ON trips(departure_date);
CREATE INDEX IF NOT EXISTS idx_seats_trip ON seats(trip_id);
CREATE INDEX IF NOT EXISTS idx_seats_class ON seats(trip_id, class);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_trip ON bookings(trip_id);
CREATE INDEX IF NOT EXISTS idx_reviews_trip ON reviews(trip_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking ON reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);

-- ============================================================
-- HELPER FUNCTIONS (for seat availability)
-- ============================================================

CREATE OR REPLACE FUNCTION decrement_available_seats(trip_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE trips
  SET
    available_seats = GREATEST(0, available_seats - 1),
    status = CASE WHEN available_seats <= 1 THEN 'full' ELSE status END
  WHERE id = trip_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_available_seats(trip_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE trips
  SET
    available_seats = available_seats + 1,
    status = CASE WHEN status = 'full' THEN 'available' ELSE status END
  WHERE id = trip_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Destinations: read-only for everyone
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view destinations"
  ON destinations FOR SELECT USING (TRUE);

-- Trips: read-only for everyone
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view trips"
  ON trips FOR SELECT USING (TRUE);

-- Seats: read for everyone, update only for authenticated users
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view seats"
  ON seats FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can update seats"
  ON seats FOR UPDATE
  TO authenticated
  USING (TRUE);
CREATE POLICY "Authenticated users can insert seats"
  ON seats FOR INSERT
  TO authenticated
  WITH CHECK (TRUE);

-- Bookings: full access for own records
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = user_id);

-- Reviews: read for everyone, write for own records
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT USING (TRUE);
CREATE POLICY "Users can create their own reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Payments: users can view own payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  USING (
    auth.uid() = (SELECT user_id FROM bookings WHERE id = booking_id)
  );
CREATE POLICY "Authenticated users can create payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (TRUE);

-- ============================================================
-- SAMPLE DATA
-- ============================================================

-- Destinations
INSERT INTO destinations (name, description, image_url, distance_km, travel_duration_days)
VALUES
  (
    'Moon',
    'Experience lunar gravity and stunning Earth views from 384,400 km away. Perfect for first-time space travelers. Walk on the lunar surface, explore craters, and witness Earthrise firsthand.',
    'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?w=800&q=80',
    384400,
    3
  ),
  (
    'Mars',
    'Red planet adventure with research colonies and stations. The longest journey with the most spectacular views. Explore the Olympus Mons, Valles Marineris, and the Martian poles.',
    'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&q=80',
    54600000,
    180
  ),
  (
    'International Space Station (ISS)',
    'Orbit Earth and experience zero gravity from 408 km altitude. The most accessible space experience available. Join the crew for science experiments and breathtaking Earth observations.',
    'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&q=80',
    408,
    1
  )
ON CONFLICT (name) DO NOTHING;

-- Trips (departure dates in 2026-2027)
INSERT INTO trips (destination_id, departure_date, return_date, economy_price, business_price, first_class_price, total_seats, available_seats, status)
VALUES
  (
    (SELECT id FROM destinations WHERE name = 'Moon'),
    '2026-06-15', '2026-06-18',
    250000, 500000, 750000,
    100, 100, 'available'
  ),
  (
    (SELECT id FROM destinations WHERE name = 'Moon'),
    '2026-08-20', '2026-08-23',
    275000, 550000, 825000,
    80, 80, 'available'
  ),
  (
    (SELECT id FROM destinations WHERE name = 'Mars'),
    '2026-07-01', '2026-12-28',
    1000000, 2000000, 3500000,
    50, 50, 'available'
  ),
  (
    (SELECT id FROM destinations WHERE name = 'Mars'),
    '2027-01-15', '2027-07-14',
    1200000, 2400000, 4000000,
    40, 40, 'available'
  ),
  (
    (SELECT id FROM destinations WHERE name = 'International Space Station (ISS)'),
    '2026-05-20', '2026-05-21',
    100000, 200000, 350000,
    80, 80, 'available'
  ),
  (
    (SELECT id FROM destinations WHERE name = 'International Space Station (ISS)'),
    '2026-07-10', '2026-07-11',
    110000, 220000, 385000,
    60, 60, 'available'
  )
ON CONFLICT DO NOTHING;
