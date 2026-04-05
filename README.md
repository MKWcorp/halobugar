Halo Bugar adalah platform mobile-first yang menghubungkan pengguna dengan fisioterapis profesional untuk layanan **Home Recovery** langsung ke rumah.

## Demo

🌐 **Live Demo**: [halobugar.vercel.app](https://halobugar.vercel.app) (atau URL Vercel project)

## Fokus Produk
- Home Recovery
- Fisioterapi ke rumah
- Recovery pasca olahraga
- Pain relief & mobility
- Injury support

## Target User
- Pecinta olahraga
- Pekerja aktif
- Pengguna dengan keluhan nyeri ringan
- Keluarga dengan kebutuhan terapi di rumah

## Tech Stack
- **Frontend**: Next.js 16, TypeScript, TailwindCSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **UI Components**: shadcn/ui
- **Deployment**: Vercel

## MVP Status (April 2026)

### ✅ Completed
| Feature | Description |
|---------|-------------|
| Auth | Register & Login dengan email |
| Home | Dashboard, kategori layanan, terapis pilihan |
| Services | List layanan, detail layanan |
| Therapists | List terapis, profil detail, reviews |
| Booking | Full booking flow (pilih layanan → terapis → jadwal → alamat → keluhan) |
| Orders | Active bookings, order history, order detail |
| Reviews | Rating & write review setelah selesai |
| Profile | Edit profil, logout |

### 🔲 Backlog
- Payment Gateway (Midtrans/Xendit)
- Admin Panel (manage therapists)
- Therapist Portal
- Push Notifications
- Treatment Report

## Struktur Repository

```
halobugar/
├── docs/
│   ├── prd/           # Product Requirements
│   ├── ux/            # UX Documentation
│   └── tech/          # Technical Docs
└── web/               # Next.js Web App
    ├── src/app/       # Pages & Routes
    ├── src/components/# UI Components
    └── supabase/      # DB Migrations & Seed
```

## Quick Start

```bash
cd web
npm install
npm run dev
```

Lihat [web/README.md](web/README.md) untuk detail setup.

## Documentation

- [PRD](docs/prd/PRD_Halo_Bugar.md) - Product Requirement Document
- [Feature Backlog](docs/prd/Feature_Backlog.md) - Daftar fitur & status
- [Database Schema](docs/tech/Database_Schema.md) - ERD & struktur database
- [User Flow](docs/ux/User_Flow.md) - Flow pengguna

## User Roles

| Role | Access |
|------|--------|
| User | Booking, riwayat, review |
| Therapist | Terima order, update status |
| Admin | Manage users, therapists, services |

## Status
✅ MVP Development Complete - Ready for Stakeholder Preview