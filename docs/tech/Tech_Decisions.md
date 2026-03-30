# Tech Decisions - Halo Bugar

## Keputusan Arsitektur

### Strategi Development

| Phase | Platform | Target | Timeline |
|-------|----------|--------|----------|
| MVP | Web (PWA) | < 100 users | 4-6 minggu |
| Scale | Native App (Flutter) | > 500 users | Setelah traction |

**Alasan Web-First:**
- Faster time to market
- Instant deploy & update via Vercel
- Iterasi cepat untuk validasi market
- Cost effective untuk early stage
- Satu codebase untuk semua portal (User, Therapist, Admin)

---

## Tech Stack MVP

### Frontend

| Component | Technology | Alasan |
|-----------|------------|--------|
| Framework | **Next.js 14** (App Router) | SSR, SEO, file-based routing |
| Styling | **Tailwind CSS** | Rapid UI development |
| UI Components | **shadcn/ui** | Customizable, accessible |
| Icons | **Lucide React** | Konsisten, ringan |
| Forms | **React Hook Form + Zod** | Validation robust |
| State | **Zustand** | Simple global state |
| Date Picker | **date-fns + react-day-picker** | Booking calendar |

### Backend & Database

| Component | Technology | Alasan |
|-----------|------------|--------|
| Backend | **Supabase** | All-in-one BaaS |
| Database | **PostgreSQL** (via Supabase) | Relational, robust |
| Auth | **Supabase Auth** | Email, phone OTP, social login |
| Realtime | **Supabase Realtime** | Live status tracking |
| Storage | **Supabase Storage** | Upload foto, dokumen |
| Edge Functions | **Supabase Edge Functions** | Server-side logic |

### Infrastructure & DevOps

| Component | Technology | Alasan |
|-----------|------------|--------|
| Hosting | **Vercel** | Zero-config, free tier |
| Domain | Custom domain | Via Vercel |
| CI/CD | **Vercel + GitHub** | Auto deploy on push |
| Monitoring | **Vercel Analytics** | Basic analytics |

### Payment

| Component | Technology | Alasan |
|-----------|------------|--------|
| Payment Gateway | **Midtrans** atau **Xendit** | Support Indonesia |
| Methods | VA, E-wallet, QRIS | Coverage luas |

### Communication

| Component | Technology | Alasan |
|-----------|------------|--------|
| SMS OTP | **Twilio** atau **Fazpass** | Verifikasi phone |
| Email | **Resend** | Transactional email |
| Push Notif | **Web Push API** | Browser notification |

---

## Folder Structure

```
halobugar/
├── docs/                    # Documentation (existing)
├── web/                     # Next.js monorepo
│   ├── src/
│   │   ├── app/
│   │   │   ├── (user)/     # User routes
│   │   │   ├── (therapist)/ # Therapist portal
│   │   │   ├── (admin)/    # Admin dashboard
│   │   │   └── api/        # API routes
│   │   ├── components/
│   │   │   ├── ui/         # Base components
│   │   │   ├── user/       # User-specific
│   │   │   ├── therapist/  # Therapist-specific
│   │   │   └── admin/      # Admin-specific
│   │   ├── lib/
│   │   │   ├── supabase/   # Supabase client
│   │   │   ├── utils/      # Helpers
│   │   │   └── hooks/      # Custom hooks
│   │   └── types/          # TypeScript types
│   ├── public/
│   └── package.json
└── supabase/                # Supabase config
    ├── migrations/          # Database migrations
    └── seed.sql             # Seed data
```

---

## Database Design (High Level)

### Core Entities

```
users
├── id (uuid)
├── email
├── phone
├── name
├── role (user | therapist | admin)
└── created_at

therapists
├── id (uuid)
├── user_id (fk)
├── str_number
├── specializations[]
├── experience_years
├── bio
├── hourly_rate
├── service_areas[]
├── is_verified
├── rating_avg
└── total_sessions

services
├── id (uuid)
├── name
├── category
├── description
├── duration_minutes
├── base_price
└── is_active

bookings
├── id (uuid)
├── user_id (fk)
├── therapist_id (fk)
├── service_id (fk)
├── scheduled_at
├── address
├── complaint_notes
├── status (pending | accepted | on_the_way | arrived | in_session | completed | cancelled)
├── total_price
└── created_at

payments
├── id (uuid)
├── booking_id (fk)
├── amount
├── method
├── status
├── paid_at
└── gateway_ref

treatment_reports
├── id (uuid)
├── booking_id (fk)
├── complaint
├── findings
├── treatment_given
├── recommendations
└── created_at

reviews
├── id (uuid)
├── booking_id (fk)
├── rating (1-5)
├── comment
└── created_at
```

---

## Security Considerations

- Row Level Security (RLS) di Supabase
- JWT token untuk auth
- Validasi input di client + server
- Rate limiting di API
- HTTPS enforced

---

## MVP Scope Reminder

### In Scope
- ✅ User: browse, book, pay, track, review
- ✅ Therapist: manage profile, schedule, orders, reports
- ✅ Admin: verify therapist, monitor bookings
- ✅ Payment integration
- ✅ Real-time status tracking

### Out of Scope MVP
- ❌ Video call
- ❌ In-app chat
- ❌ Membership/subscription
- ❌ AI recommendation
- ❌ Wearable integration

---

## Future Migration Path

Ketika ready untuk native app:

```
Web (Next.js)         →    Mobile (Flutter)
─────────────────────────────────────────────
Supabase tetap        →    Supabase tetap
API structure sama    →    Konsumsi API yang sama
UI/UX validated       →    Rebuild UI di Flutter
```

Benefit: Backend sudah mature, tinggal rebuild frontend.