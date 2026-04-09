/*
  SQL Migration Example
  Create bookings table in Supabase
*/

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  travel_date TIMESTAMP,
  destination VARCHAR(255)
);