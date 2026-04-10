-- ============================================================
-- Space Travel Booking - Seed Data
-- ============================================================

-- Destinations
INSERT INTO destinations (id, name, description, image_url, distance_km, duration_days, base_price)
VALUES
  (
    'dest-moon-001',
    'Moon',
    'Experience the lunar surface firsthand. Walk on the Sea of Tranquility, visit historic Apollo landing sites, and witness Earthrise from the Moon''s surface. The ultimate weekend getaway!',
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80',
    384400,
    7,
    250000
  ),
  (
    'dest-mars-001',
    'Mars',
    'Embark on humanity''s greatest adventure to the Red Planet. Explore Olympus Mons, the Valles Marineris canyon system, and witness the Martian sunrise. A journey that defines an era.',
    'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&q=80',
    225000000,
    180,
    5000000
  ),
  (
    'dest-iss-001',
    'ISS',
    'Visit the International Space Station in low Earth orbit. Experience zero gravity, watch 16 sunrises per day, and see Earth from 400km above. The most accessible space destination.',
    'https://images.unsplash.com/photo-1451186859696-371d9477be93?w=800&q=80',
    408,
    14,
    50000
  )
ON CONFLICT DO NOTHING;

-- Trips for Moon
INSERT INTO trips (id, destination_id, departure_date, arrival_date, capacity, economy_price, business_price, first_class_price, status)
VALUES
  (
    'trip-moon-001',
    'dest-moon-001',
    NOW() + INTERVAL '30 days',
    NOW() + INTERVAL '37 days',
    20,
    250000,
    625000,
    1250000,
    'upcoming'
  ),
  (
    'trip-moon-002',
    'dest-moon-001',
    NOW() + INTERVAL '60 days',
    NOW() + INTERVAL '67 days',
    20,
    280000,
    700000,
    1400000,
    'upcoming'
  )
ON CONFLICT DO NOTHING;

-- Trips for Mars
INSERT INTO trips (id, destination_id, departure_date, arrival_date, capacity, economy_price, business_price, first_class_price, status)
VALUES
  (
    'trip-mars-001',
    'dest-mars-001',
    NOW() + INTERVAL '90 days',
    NOW() + INTERVAL '270 days',
    10,
    5000000,
    12500000,
    25000000,
    'upcoming'
  )
ON CONFLICT DO NOTHING;

-- Trips for ISS
INSERT INTO trips (id, destination_id, departure_date, arrival_date, capacity, economy_price, business_price, first_class_price, status)
VALUES
  (
    'trip-iss-001',
    'dest-iss-001',
    NOW() + INTERVAL '14 days',
    NOW() + INTERVAL '28 days',
    20,
    50000,
    125000,
    250000,
    'upcoming'
  ),
  (
    'trip-iss-002',
    'dest-iss-001',
    NOW() + INTERVAL '45 days',
    NOW() + INTERVAL '59 days',
    20,
    55000,
    137500,
    275000,
    'upcoming'
  )
ON CONFLICT DO NOTHING;

-- Seats for Moon Trip 1 (economy: A1-A10, business: B1-B6, first_class: C1-C4)
INSERT INTO seats (trip_id, seat_number, seat_class, is_available)
SELECT 'trip-moon-001', seat_num, seat_class, TRUE FROM (
  VALUES
    ('A01', 'economy'), ('A02', 'economy'), ('A03', 'economy'), ('A04', 'economy'), ('A05', 'economy'),
    ('A06', 'economy'), ('A07', 'economy'), ('A08', 'economy'), ('A09', 'economy'), ('A10', 'economy'),
    ('B01', 'business'), ('B02', 'business'), ('B03', 'business'), ('B04', 'business'), ('B05', 'business'), ('B06', 'business'),
    ('C01', 'first_class'), ('C02', 'first_class'), ('C03', 'first_class'), ('C04', 'first_class')
) AS s(seat_num, seat_class)
ON CONFLICT DO NOTHING;

-- Seats for Moon Trip 2
INSERT INTO seats (trip_id, seat_number, seat_class, is_available)
SELECT 'trip-moon-002', seat_num, seat_class, TRUE FROM (
  VALUES
    ('A01', 'economy'), ('A02', 'economy'), ('A03', 'economy'), ('A04', 'economy'), ('A05', 'economy'),
    ('A06', 'economy'), ('A07', 'economy'), ('A08', 'economy'), ('A09', 'economy'), ('A10', 'economy'),
    ('B01', 'business'), ('B02', 'business'), ('B03', 'business'), ('B04', 'business'), ('B05', 'business'), ('B06', 'business'),
    ('C01', 'first_class'), ('C02', 'first_class'), ('C03', 'first_class'), ('C04', 'first_class')
) AS s(seat_num, seat_class)
ON CONFLICT DO NOTHING;

-- Seats for Mars Trip 1 (smaller capacity)
INSERT INTO seats (trip_id, seat_number, seat_class, is_available)
SELECT 'trip-mars-001', seat_num, seat_class, TRUE FROM (
  VALUES
    ('A01', 'economy'), ('A02', 'economy'), ('A03', 'economy'), ('A04', 'economy'),
    ('B01', 'business'), ('B02', 'business'), ('B03', 'business'),
    ('C01', 'first_class'), ('C02', 'first_class'), ('C03', 'first_class')
) AS s(seat_num, seat_class)
ON CONFLICT DO NOTHING;

-- Seats for ISS Trip 1
INSERT INTO seats (trip_id, seat_number, seat_class, is_available)
SELECT 'trip-iss-001', seat_num, seat_class, TRUE FROM (
  VALUES
    ('A01', 'economy'), ('A02', 'economy'), ('A03', 'economy'), ('A04', 'economy'), ('A05', 'economy'),
    ('A06', 'economy'), ('A07', 'economy'), ('A08', 'economy'), ('A09', 'economy'), ('A10', 'economy'),
    ('B01', 'business'), ('B02', 'business'), ('B03', 'business'), ('B04', 'business'), ('B05', 'business'), ('B06', 'business'),
    ('C01', 'first_class'), ('C02', 'first_class'), ('C03', 'first_class'), ('C04', 'first_class')
) AS s(seat_num, seat_class)
ON CONFLICT DO NOTHING;

-- Seats for ISS Trip 2
INSERT INTO seats (trip_id, seat_number, seat_class, is_available)
SELECT 'trip-iss-002', seat_num, seat_class, TRUE FROM (
  VALUES
    ('A01', 'economy'), ('A02', 'economy'), ('A03', 'economy'), ('A04', 'economy'), ('A05', 'economy'),
    ('A06', 'economy'), ('A07', 'economy'), ('A08', 'economy'), ('A09', 'economy'), ('A10', 'economy'),
    ('B01', 'business'), ('B02', 'business'), ('B03', 'business'), ('B04', 'business'), ('B05', 'business'), ('B06', 'business'),
    ('C01', 'first_class'), ('C02', 'first_class'), ('C03', 'first_class'), ('C04', 'first_class')
) AS s(seat_num, seat_class)
ON CONFLICT DO NOTHING;
