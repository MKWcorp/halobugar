# MVP Scope - Halo Bugar

## Tujuan MVP

Memvalidasi konsep Home Recovery dengan fitur booking fisioterapis ke rumah yang simpel, cepat, dan bisa diuji ke market.

---

## User App (Mobile-First)

### Fitur MVP

| Fitur | Deskripsi | Prioritas |
|-------|-----------|-----------|
| Onboarding | Splash + 3 screen intro | P0 |
| Register/Login | Email/phone + OTP | P0 |
| Home | Greeting, kategori layanan, booking aktif | P0 |
| List Layanan | 4 kategori utama | P0 |
| Detail Layanan | Nama, deskripsi, durasi, harga, CTA | P0 |
| Pilih Fisioterapis | List + filter + auto-assign option | P0 |
| Booking Flow | Tanggal, jam, alamat, keluhan, pembayaran | P0 |
| Status Booking | Tracking real-time | P0 |
| Riwayat Booking | List booking sebelumnya | P0 |
| Rating & Review | Bintang + komentar | P0 |
| Profil User | Edit profil, alamat, logout | P0 |

### Halaman MVP User

1. Splash Screen
2. Onboarding (3 screen)
3. Register
4. Login
5. OTP Verification
6. Home
7. List Layanan
8. Detail Layanan
9. List Fisioterapis
10. Detail Fisioterapis
11. Pilih Jadwal
12. Input Alamat
13. Ringkasan Booking
14. Pembayaran
15. Status Booking
16. Riwayat Booking
17. Rating & Review
18. Profile

---

## Therapist Portal (Web/Mobile)

### Fitur MVP

| Fitur | Deskripsi | Prioritas |
|-------|-----------|-----------|
| Login | Email + password | P0 |
| Profil | Data diri, STR, spesialisasi, tarif | P0 |
| Verifikasi Dokumen | Upload STR/sertifikat | P0 |
| Jadwal | Atur hari & jam kerja | P0 |
| Order Masuk | Terima/tolak booking | P0 |
| Update Status | Perjalanan → Sesi → Selesai | P0 |
| Input Laporan | Keluhan, tindakan, saran | P0 |
| Dashboard Penghasilan | Total sesi, pendapatan | P1 |

### Halaman MVP Therapist

1. Login
2. Dashboard
3. Profil
4. Verifikasi Dokumen
5. Jadwal
6. Order Masuk
7. Detail Order
8. Update Status
9. Input Treatment Report
10. Earnings

---

## Admin Dashboard (Web)

### Fitur MVP

| Fitur | Deskripsi | Prioritas |
|-------|-----------|-----------|
| Login | Admin authentication | P0 |
| Dashboard | Overview metrics | P0 |
| User Management | List, detail, status | P0 |
| Therapist Verification | Approve/reject | P0 |
| Booking Management | Monitor semua booking | P0 |
| Service Management | CRUD layanan | P0 |
| Payment Monitor | Status pembayaran | P1 |

### Halaman MVP Admin

1. Login
2. Dashboard
3. User Management
4. Therapist Management
5. Booking Management
6. Service Management
7. Payment Overview

---

## Tech Stack MVP

### Frontend
- **User App**: Flutter (cross-platform mobile)
- **Therapist Portal**: Flutter Web / React
- **Admin Dashboard**: React + Tailwind CSS

### Backend
- **Framework**: Node.js + Express / FastAPI
- **Database**: PostgreSQL
- **Auth**: JWT + OTP via SMS gateway
- **Payment**: Midtrans / Xendit

### Infrastructure
- Docker containers
- Cloud hosting (GCP/AWS)
- CI/CD pipeline

---

## Out of Scope MVP

- ❌ Video call konsultasi
- ❌ Chat real-time
- ❌ Integrasi wearable
- ❌ Membership/subscription
- ❌ AI recommendation
- ❌ Marketplace alat recovery
- ❌ Edukasi/artikel
- ❌ Corporate package

---

## Success Criteria MVP

| Metric | Target |
|--------|--------|
| Booking completion rate | > 70% |
| Therapist response time | < 30 menit |
| User rating average | > 4.0 |
| Repeat order rate | > 25% |
| Cancellation rate | < 15% |

---

## Timeline Estimasi

| Phase | Durasi | Deliverable |
|-------|--------|-------------|
| Setup & Architecture | 1 minggu | Project structure, env setup |
| User App Core | 3 minggu | Auth, home, booking flow |
| Therapist Portal | 2 minggu | Login, order management |
| Admin Dashboard | 2 minggu | Verification, monitoring |
| Payment Integration | 1 minggu | Midtrans integration |
| Testing & QA | 1 minggu | Bug fixes, UAT |
| **Total** | **10 minggu** | MVP Ready |

---

## Catatan

- Fokus pada **booking flow** yang smooth
- Prioritaskan **trust** dengan profil therapist yang lengkap
- Pastikan **status tracking** real-time berjalan baik
- Area layanan dimulai dari **1 kota** dulu