# 🚀 Space Travel Booking App

A complete, production-ready React + Supabase space travel booking application with a cyberpunk dark theme.

![Space Travel App](https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1200&q=80)

## ✨ Features

- **7+ Screens**: Login/Signup, Explore Trips, Booking Flow, Payment, Ticket View, My Bookings, Reviews
- **Real-time Seat Selection**: Interactive seat map with live availability
- **Payment Simulation**: Test card flow (`4242 4242 4242 4242`)
- **Digital QR Tickets**: QR code generation for boarding passes
- **Booking Cancellation**: Refund calculation based on days until travel
  - 30+ days: 100% refund
  - 15-30 days: 75% refund
  - 7-15 days: 50% refund
  - <7 days: 25% refund
- **Review System**: Star ratings (1-5), edit/delete reviews, sort by newest/rating
- **Authentication**: Supabase Auth with email/password
- **Responsive Design**: Mobile, tablet, and desktop
- **Cyberpunk Theme**: Dark purple/blue color scheme with neon accents

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (v4) with custom cyberpunk theme
- **State**: Zustand
- **Data**: Supabase (PostgreSQL + Auth + Realtime)
- **Routing**: React Router v6
- **QR Code**: qrcode.react
- **Icons**: Lucide React
- **Dates**: date-fns

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/afafshahid/space-travel-booking.git
cd space-travel-booking
npm install
```

### 2. Configure Environment

Copy the example environment file:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Setup Supabase Database

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Open your project → **SQL Editor**
3. Click **New Query**
4. Copy the contents of `supabase/migrations/001_init_schema.sql`
5. Paste and click **Run**

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 📋 Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

## 🗄 Database Schema

### Tables

- **destinations** - Moon, Mars, ISS details
- **trips** - Available space trips with pricing
- **seats** - Individual seat records per trip
- **bookings** - User bookings with status and QR codes
- **reviews** - Trip reviews with star ratings
- **payments** - Payment records (simulated)

### Row Level Security

All tables have RLS enabled:
- Public read for destinations, trips, seats, reviews
- Authenticated write for own bookings/reviews
- Users can only modify their own data

## 🚀 Deploy to Vercel

### Method 1: Import from GitHub (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click **New Project** → **Import Git Repository**
3. Select `afafshahid/space-travel-booking`
4. Configure **Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy** ✅

### Method 2: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

## 📱 Screens & Navigation

| Route | Screen | Auth Required |
|-------|--------|---------------|
| `/` | Home / Landing Page | No |
| `/login` | Login | No |
| `/signup` | Signup | No |
| `/explore` | Browse Space Trips | No |
| `/booking/:tripId` | Booking Flow (class + seat) | Yes |
| `/payment` | Payment Simulation | Yes |
| `/ticket/:bookingId` | Digital Boarding Pass | Yes |
| `/my-bookings` | Booking History | Yes |
| `/review/:tripId` | Trip Reviews | Yes |

## 💳 Test Payment

Use the test card for payment simulation:
- **Card Number**: `4242 4242 4242 4242`
- **Expiry**: Any future date (e.g., `12/27`)
- **CVV**: Any 3 digits (e.g., `123`)

## 🔧 Troubleshooting

### "No trips found" on Explore page
- Run the SQL migration file in Supabase SQL Editor
- Check your environment variables are set correctly

### Auth not working
- Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Check that email auth is enabled in Supabase Dashboard → Authentication → Providers

### Seat map empty
- Seats are auto-generated when you first open a booking
- Make sure RLS policies are set (included in migration)

### Build errors
```bash
npm install
npm run build
```

## 📂 Project Structure

```
src/
├── components/
│   ├── Auth/         # Login, Signup
│   ├── Booking/      # BookingFlow, SeatMap, ClassSelection
│   ├── MyBookings/   # BookingsList, CancellationModal
│   ├── Payment/      # PaymentModal, PaymentSuccess
│   ├── Reviews/      # ReviewForm, ReviewsList, ReviewCard
│   ├── Shared/       # Navbar, Footer, LoadingSpinner
│   ├── Ticket/       # TicketView with QR code
│   └── Trips/        # ExploreTrips, TripCard
├── pages/            # Home, ReviewTrip
├── services/         # supabase.ts, api.ts, auth.ts
├── store/            # authStore, bookingStore, reviewStore
├── types/            # TypeScript interfaces
└── utils/            # formatters, calculations, validators
supabase/
└── migrations/       # SQL schema files
```

## 📄 License

MIT License
# Space Travel Booking App

This application allows users to book space travel experiences. It is built using React and Supabase.
