# Halo Bugar - Web App

Platform booking fisioterapi dan pijat profesional ke rumah.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Styling**: TailwindCSS + shadcn/ui
- **Language**: TypeScript

## MVP Features (Completed ✅)

### User Authentication
- ✅ Register dengan email
- ✅ Login dengan email + password
- ✅ Email confirmation flow

### Home & Discovery
- ✅ Home Dashboard dengan kategori layanan
- ✅ Featured Therapists section
- ✅ Active Booking Card (hari ini)

### Service & Booking
- ✅ Service List per kategori
- ✅ Service Detail + booking CTA
- ✅ Therapist List dengan search
- ✅ Therapist Detail + reviews
- ✅ Booking Flow (pilih layanan → terapis → tanggal → waktu → alamat → keluhan)
- ✅ Booking Confirmation page

### Order Management
- ✅ Active Bookings list
- ✅ Order History
- ✅ Order Detail page

### Rating & Review
- ✅ Rating form (1-5 stars)
- ✅ Write review
- ✅ View reviews di therapist detail

### Profile
- ✅ User Profile page
- ✅ Edit nama & telepon
- ✅ Logout

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Setup Database

Run migrations di Supabase SQL Editor:
1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_fix_services_policy.sql`
3. `supabase/seed.sql` (untuk data demo)

### 4. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── (main)/          # Protected routes dengan navbar
│   │   ├── booking/     # Booking flow
│   │   ├── dashboard/   # User dashboard
│   │   ├── services/    # Service listing & detail
│   │   └── therapists/  # Therapist listing & detail
│   ├── login/           # Login page
│   └── register/        # Registration page
├── components/
│   ├── layout/          # Header, Footer
│   ├── providers/       # Auth provider
│   └── ui/              # shadcn components
└── lib/
    ├── supabase/        # Supabase client
    └── utils.ts         # Utility functions
```

## User Roles

| Role | Description |
|------|-------------|
| `user` | Customer yang booking layanan |
| `therapist` | Fisioterapis yang melayani |
| `admin` | Manage therapists & layanan |

## Deploy

Deploy ke Vercel dengan connect ke repo GitHub.

## Backlog

Lihat [Feature_Backlog.md](../docs/prd/Feature_Backlog.md) untuk daftar lengkap fitur.

