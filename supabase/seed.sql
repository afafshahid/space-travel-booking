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
    'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=800&q=80',
    384400,
    7,
    250000
  ),
  (
    'dest-mars-001',
    'Mars',
    'Embark on humanity''s greatest adventure to the Red Planet. Explore Olympus Mons, the Valles Marineris canyon system, and witness the Martian sunrise. A journey that defines an era.',
    'https://images.unsplash.com/photo-1545156521-77bd85671d30?w=800&q=80',
    225000000,
    180,
    5000000
  ),
  (
    'dest-iss-001',
    'ISS',
    'Visit the International Space Station in low Earth orbit. Experience zero gravity, watch 16 sunrises per day, and see Earth from 400km above. The most accessible space destination.',
    'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=800&q=80',
    408,
    14,
    50000
  ),
  (
    'dest-venus-001',
    'Venus',
    'Experience the extreme conditions of Venus. Explore the sulfuric acid clouds, witness the retrograde rotation, and study the hottest planet in our solar system. A journey for the brave.',
    'https://images.unsplash.com/photo-1614314107768-6018061b5b72?w=800&q=80',
    108000000,
    175,
    3000000
  ),
  (
    'dest-jupiter-001',
    'Jupiter',
    'Witness the Great Red Spot and explore Jupiter''s magnificent storm systems. Visit the Galilean moons and experience the most powerful planet in our solar system.',
    'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&q=80',
    550000000,
    300,
    8000000
  ),
  (
    'dest-saturn-001',
    'Saturn',
    'Marvel at Saturn''s stunning ring system up close. Explore Titan''s methane lakes and experience one of the most visually spectacular destinations in the solar system.',
    'https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=800&q=80',
    1400000000,
    400,
    10000000
  ),
  (
    'dest-europa-001',
    'Europa',
    'Discover the icy surface of Europa and explore the possibility of life in its subsurface ocean. A scientific adventure to the edge of human knowledge.',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    600000000,
    320,
    7500000
  ),
  (
    'dest-proxima-001',
    'Proxima Centauri',
    'The ultimate journey! Travel to humanity''s nearest star neighbor. A once-in-a-lifetime adventure aboard our next-generation generation ship. Book now for your descendants!',
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80',
    40000000000000,
    18250,
    50000000
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

-- Trips for Venus
INSERT INTO trips (id, destination_id, departure_date, arrival_date, capacity, economy_price, business_price, first_class_price, status)
VALUES
  (
    'trip-venus-001',
    'dest-venus-001',
    NOW() + INTERVAL '30 days',
    NOW() + INTERVAL '205 days',
    12,
    3000000,
    7500000,
    15000000,
    'upcoming'
  ),
  (
    'trip-venus-002',
    'dest-venus-001',
    NOW() + INTERVAL '60 days',
    NOW() + INTERVAL '235 days',
    12,
    3200000,
    8000000,
    16000000,
    'upcoming'
  ),
  (
    'trip-venus-003',
    'dest-venus-001',
    NOW() + INTERVAL '90 days',
    NOW() + INTERVAL '265 days',
    12,
    3500000,
    8750000,
    17500000,
    'upcoming'
  )
ON CONFLICT DO NOTHING;

-- Trips for Jupiter
INSERT INTO trips (id, destination_id, departure_date, arrival_date, capacity, economy_price, business_price, first_class_price, status)
VALUES
  (
    'trip-jupiter-001',
    'dest-jupiter-001',
    NOW() + INTERVAL '30 days',
    NOW() + INTERVAL '330 days',
    10,
    8000000,
    20000000,
    40000000,
    'upcoming'
  ),
  (
    'trip-jupiter-002',
    'dest-jupiter-001',
    NOW() + INTERVAL '60 days',
    NOW() + INTERVAL '360 days',
    10,
    8500000,
    21250000,
    42500000,
    'upcoming'
  ),
  (
    'trip-jupiter-003',
    'dest-jupiter-001',
    NOW() + INTERVAL '90 days',
    NOW() + INTERVAL '390 days',
    10,
    9000000,
    22500000,
    45000000,
    'upcoming'
  )
ON CONFLICT DO NOTHING;

-- Trips for Saturn
INSERT INTO trips (id, destination_id, departure_date, arrival_date, capacity, economy_price, business_price, first_class_price, status)
VALUES
  (
    'trip-saturn-001',
    'dest-saturn-001',
    NOW() + INTERVAL '30 days',
    NOW() + INTERVAL '430 days',
    8,
    10000000,
    25000000,
    50000000,
    'upcoming'
  ),
  (
    'trip-saturn-002',
    'dest-saturn-001',
    NOW() + INTERVAL '60 days',
    NOW() + INTERVAL '460 days',
    8,
    10500000,
    26250000,
    52500000,
    'upcoming'
  ),
  (
    'trip-saturn-003',
    'dest-saturn-001',
    NOW() + INTERVAL '90 days',
    NOW() + INTERVAL '490 days',
    8,
    11000000,
    27500000,
    55000000,
    'upcoming'
  )
ON CONFLICT DO NOTHING;

-- Trips for Europa
INSERT INTO trips (id, destination_id, departure_date, arrival_date, capacity, economy_price, business_price, first_class_price, status)
VALUES
  (
    'trip-europa-001',
    'dest-europa-001',
    NOW() + INTERVAL '30 days',
    NOW() + INTERVAL '350 days',
    10,
    7500000,
    18750000,
    37500000,
    'upcoming'
  ),
  (
    'trip-europa-002',
    'dest-europa-001',
    NOW() + INTERVAL '60 days',
    NOW() + INTERVAL '380 days',
    10,
    7800000,
    19500000,
    39000000,
    'upcoming'
  ),
  (
    'trip-europa-003',
    'dest-europa-001',
    NOW() + INTERVAL '90 days',
    NOW() + INTERVAL '410 days',
    10,
    8000000,
    20000000,
    40000000,
    'upcoming'
  )
ON CONFLICT DO NOTHING;

-- Trips for Proxima Centauri
INSERT INTO trips (id, destination_id, departure_date, arrival_date, capacity, economy_price, business_price, first_class_price, status)
VALUES
  (
    'trip-proxima-001',
    'dest-proxima-001',
    NOW() + INTERVAL '30 days',
    NOW() + INTERVAL '18280 days',
    6,
    50000000,
    125000000,
    250000000,
    'upcoming'
  ),
  (
    'trip-proxima-002',
    'dest-proxima-001',
    NOW() + INTERVAL '60 days',
    NOW() + INTERVAL '18310 days',
    6,
    52000000,
    130000000,
    260000000,
    'upcoming'
  ),
  (
    'trip-proxima-003',
    'dest-proxima-001',
    NOW() + INTERVAL '90 days',
    NOW() + INTERVAL '18340 days',
    6,
    55000000,
    137500000,
    275000000,
    'upcoming'
  )
ON CONFLICT DO NOTHING;

-- Seats for Venus trips (economy: A1-A6, business: B1-B4, first_class: C1-C2)
INSERT INTO seats (trip_id, seat_number, seat_class, is_available)
SELECT 'trip-venus-001', seat_num, seat_class, TRUE FROM (
  VALUES
    ('A01', 'economy'), ('A02', 'economy'), ('A03', 'economy'), ('A04', 'economy'), ('A05', 'economy'), ('A06', 'economy'),
    ('B01', 'business'), ('B02', 'business'), ('B03', 'business'), ('B04', 'business'),
    ('C01', 'first_class'), ('C02', 'first_class')
) AS s(seat_num, seat_class)
ON CONFLICT DO NOTHING;

INSERT INTO seats (trip_id, seat_number, seat_class, is_available)
SELECT 'trip-venus-002', seat_num, seat_class, TRUE FROM (
  VALUES
    ('A01', 'economy'), ('A02', 'economy'), ('A03', 'economy'), ('A04', 'economy'), ('A05', 'economy'), ('A06', 'economy'),
    ('B01', 'business'), ('B02', 'business'), ('B03', 'business'), ('B04', 'business'),
    ('C01', 'first_class'), ('C02', 'first_class')
) AS s(seat_num, seat_class)
ON CONFLICT DO NOTHING;

INSERT INTO seats (trip_id, seat_number, seat_class, is_available)
SELECT 'trip-venus-003', seat_num, seat_class, TRUE FROM (
  VALUES
    ('A01', 'economy'), ('A02', 'economy'), ('A03', 'economy'), ('A04', 'economy'), ('A05', 'economy'), ('A06', 'economy'),
    ('B01', 'business'), ('B02', 'business'), ('B03', 'business'), ('B04', 'business'),
    ('C01', 'first_class'), ('C02', 'first_class')
) AS s(seat_num, seat_class)
ON CONFLICT DO NOTHING;

-- Seats for Jupiter trips (economy: A1-A5, business: B1-B3, first_class: C1-C2)
INSERT INTO seats (trip_id, seat_number, seat_class, is_available)
SELECT 'trip-jupiter-001', seat_num, seat_class, TRUE FROM (
  VALUES
    ('A01', 'economy'), ('A02', 'economy'), ('A03', 'economy'), ('A04', 'economy'), ('A05', 'economy'),
    ('B01', 'business'), ('B02', 'business'), ('B03', 'business'),
    ('C01', 'first_class'), ('C02', 'first_class')
) AS s(seat_num, seat_class)
ON CONFLICT DO NOTHING;

INSERT INTO seats (trip_id, seat_number, seat_class, is_available)
SELECT 'trip-jupiter-002', seat_num, seat_class, TRUE FROM (
  VALUES
    ('A01', 'economy'), ('A02', 'economy'), ('A03', 'economy'), ('A04', 'economy'), ('A05', 'economy'),
    ('B01', 'business'), ('B02', 'business'), ('B03', 'business'),
    ('C01', 'first_class'), ('C02', 'first_class')
) AS s(seat_num, seat_class)
ON CONFLICT DO NOTHING;

INSERT INTO seats (trip_id, seat_number, seat_class, is_available)
SELECT 'trip-jupiter-003', seat_num, seat_class, TRUE FROM (
  VALUES
    ('A01', 'economy'), ('A02', 'economy'), ('A03', 'economy'), ('A04', 'economy'), ('A05', 'economy'),
    ('B01', 'business'), ('B02', 'business'), ('B03', 'business'),
    ('C01', 'first_class'), ('C02', 'first_class')
) AS s(seat_num, seat_class)
ON CONFLICT DO NOTHING;

-- Seats for Saturn trips (economy: A1-A4, business: B1-B2, first_class: C1-C2)
INSERT INTO seats (trip_id, seat_number, seat_class, is_available)
SELECT 'trip-saturn-001', seat_num, seat_class, TRUE FROM (
  VALUES
    ('A01', 'economy'), ('A02', 'economy'), ('A03', 'economy'), ('A04', 'economy'),
    ('B01', 'business'), ('B02', 'business'),
    ('C01', 'first_class'), ('C02', 'first_class')
) AS s(seat_num, seat_class)
ON CONFLICT DO NOTHING;

INSERT INTO seats (trip_id, seat_number, seat_class, is_available)
SELECT 'trip-saturn-002', seat_num, seat_class, TRUE FROM (
  VALUES
    ('A01', 'economy'), ('A02', 'economy'), ('A03', 'economy'), ('A04', 'economy'),
    ('B01', 'business'), ('B02', 'business'),
    ('C01', 'first_class'), ('C02', 'first_class')
) AS s(seat_num, seat_class)
ON CONFLICT DO NOTHING;

INSERT INTO seats (trip_id, seat_number, seat_class, is_available)
SELECT 'trip-saturn-003', seat_num, seat_class, TRUE FROM (
  VALUES
    ('A01', 'economy'), ('A02', 'economy'), ('A03', 'economy'), ('A04', 'economy'),
    ('B01', 'business'), ('B02', 'business'),
    ('C01', 'first_class'), ('C02', 'first_class')
) AS s(seat_num, seat_class)
ON CONFLICT DO NOTHING;

-- Seats for Europa trips (economy: A1-A5, business: B1-B3, first_class: C1-C2)
INSERT INTO seats (trip_id, seat_number, seat_class, is_available)
SELECT 'trip-europa-001', seat_num, seat_class, TRUE FROM (
  VALUES
    ('A01', 'economy'), ('A02', 'economy'), ('A03', 'economy'), ('A04', 'economy'), ('A05', 'economy'),
    ('B01', 'business'), ('B02', 'business'), ('B03', 'business'),
    ('C01', 'first_class'), ('C02', 'first_class')
) AS s(seat_num, seat_class)
ON CONFLICT DO NOTHING;

INSERT INTO seats (trip_id, seat_number, seat_class, is_available)
SELECT 'trip-europa-002', seat_num, seat_class, TRUE FROM (
  VALUES
    ('A01', 'economy'), ('A02', 'economy'), ('A03', 'economy'), ('A04', 'economy'), ('A05', 'economy'),
    ('B01', 'business'), ('B02', 'business'), ('B03', 'business'),
    ('C01', 'first_class'), ('C02', 'first_class')
) AS s(seat_num, seat_class)
ON CONFLICT DO NOTHING;

INSERT INTO seats (trip_id, seat_number, seat_class, is_available)
SELECT 'trip-europa-003', seat_num, seat_class, TRUE FROM (
  VALUES
    ('A01', 'economy'), ('A02', 'economy'), ('A03', 'economy'), ('A04', 'economy'), ('A05', 'economy'),
    ('B01', 'business'), ('B02', 'business'), ('B03', 'business'),
    ('C01', 'first_class'), ('C02', 'first_class')
) AS s(seat_num, seat_class)
ON CONFLICT DO NOTHING;

-- Seats for Proxima Centauri trips (economy: A1-A3, business: B1-B2, first_class: C1)
INSERT INTO seats (trip_id, seat_number, seat_class, is_available)
SELECT 'trip-proxima-001', seat_num, seat_class, TRUE FROM (
  VALUES
    ('A01', 'economy'), ('A02', 'economy'), ('A03', 'economy'),
    ('B01', 'business'), ('B02', 'business'),
    ('C01', 'first_class')
) AS s(seat_num, seat_class)
ON CONFLICT DO NOTHING;

INSERT INTO seats (trip_id, seat_number, seat_class, is_available)
SELECT 'trip-proxima-002', seat_num, seat_class, TRUE FROM (
  VALUES
    ('A01', 'economy'), ('A02', 'economy'), ('A03', 'economy'),
    ('B01', 'business'), ('B02', 'business'),
    ('C01', 'first_class')
) AS s(seat_num, seat_class)
ON CONFLICT DO NOTHING;

INSERT INTO seats (trip_id, seat_number, seat_class, is_available)
SELECT 'trip-proxima-003', seat_num, seat_class, TRUE FROM (
  VALUES
    ('A01', 'economy'), ('A02', 'economy'), ('A03', 'economy'),
    ('B01', 'business'), ('B02', 'business'),
    ('C01', 'first_class')
) AS s(seat_num, seat_class)
ON CONFLICT DO NOTHING;
