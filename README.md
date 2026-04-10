# 🚀 Orbit X - Space Travel Booking App

A complete, production-ready space travel booking application built with React 18, TypeScript, Supabase, and Tailwind CSS.

## ✨ Features

- 🔐 **Authentication** - Secure email/password auth via Supabase Auth
- 🌌 **Explore Trips** - Browse Moon, Mars, and ISS destinations with filters
- 🪑 **Interactive Seat Map** - Real-time seat availability with visual selection
- 💳 **Payment Flow** - Simulated payment processing with card validation
- 🎫 **Digital Tickets** - Beautiful boarding pass with QR code generation
- 📋 **My Bookings** - Manage all bookings with cancellation & refunds
- ⭐ **Reviews & Ratings** - Leave and manage reviews for completed trips
- 🌙 **Cyberpunk Dark Theme** - Beautiful purple/blue neon aesthetic
- 📱 **Mobile Responsive** - Works perfectly on all screen sizes

## 🛠️ Tech Stack

React 18 · TypeScript · Vite 5 · Tailwind CSS · Supabase · React Router v6 · TanStack Query · Zustand · qrcode.react

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

## 🗄️ Database Setup

1. Create a Supabase project
2. Run `supabase/migrations/001_init_schema.sql` in the SQL editor
3. Run `supabase/seed.sql` for sample data

## 📱 Screens

1. **Home** (`/`) - Landing page
2. **Login/Signup** - Authentication
3. **Explore Trips** (`/explore`) - Browse destinations
4. **Booking** (`/booking/:tripId`) - Select seat & class
5. **Payment** (`/payment`) - Complete payment
6. **Ticket** (`/ticket/:bookingId`) - Digital boarding pass
7. **My Bookings** (`/bookings`) - Manage bookings
8. **Reviews** (`/reviews/:tripId`) - Reviews & ratings

## 💳 Test Payment

Card: `4242 4242 4242 4242`, Expiry: any future date, CVC: any 3 digits

## 🚢 Deployment

Deploy to Vercel with these environment variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`