# Sitemap - Halo Bugar

## 1. User App (Mobile)

```
📱 Halo Bugar App
│
├── 🚀 Onboarding
│   ├── Splash Screen
│   ├── Onboarding 1
│   ├── Onboarding 2
│   └── Onboarding 3
│
├── 🔐 Auth
│   ├── Register
│   ├── Login
│   ├── OTP Verification
│   └── Forgot Password
│
├── 🏠 Home (Tab 1)
│   ├── Greeting
│   ├── Kategori Layanan
│   ├── Banner Promo
│   ├── Fisioterapis Unggulan
│   └── Booking Aktif
│
├── 📋 Layanan
│   ├── List Layanan
│   │   ├── Home Recovery
│   │   ├── Injury Support
│   │   ├── Pain Relief & Mobility
│   │   └── Performance Recovery
│   │
│   └── Detail Layanan
│       ├── Deskripsi
│       ├── Manfaat
│       ├── Durasi & Harga
│       └── CTA Booking
│
├── 👨‍⚕️ Fisioterapis
│   ├── List Fisioterapis
│   │   ├── Filter (spesialisasi, rating, jarak)
│   │   └── Search
│   │
│   └── Detail Fisioterapis
│       ├── Foto & Nama
│       ├── Rating & Review
│       ├── Spesialisasi
│       ├── Pengalaman
│       ├── Area Layanan
│       ├── Tarif
│       └── CTA Booking
│
├── 📅 Booking Flow
│   ├── Pilih Tanggal
│   ├── Pilih Jam
│   ├── Input Alamat
│   ├── Catatan Keluhan
│   ├── Ringkasan Booking
│   ├── Pilih Pembayaran
│   └── Konfirmasi
│
├── 📦 Orders (Tab 2)
│   ├── Booking Aktif
│   │   ├── Status Tracking
│   │   └── Detail Booking
│   │
│   └── Riwayat Booking
│       ├── List Riwayat
│       ├── Detail Riwayat
│       ├── Laporan Treatment
│       └── Reorder
│
├── ⭐ Rating & Review
│   ├── Input Rating
│   └── Tulis Review
│
├── 🔔 Notifikasi (Tab 3)
│   ├── Booking Updates
│   ├── Promo
│   └── Info Sistem
│
└── 👤 Profile (Tab 4)
    ├── Edit Profil
    ├── Alamat Tersimpan
    ├── Metode Pembayaran
    ├── Pengaturan Notifikasi
    ├── Bantuan
    ├── Tentang Aplikasi
    └── Logout
```

---

## 2. Therapist Portal (Web/Mobile)

```
💼 Therapist Portal
│
├── 🔐 Auth
│   ├── Login
│   ├── Register
│   └── Verifikasi Dokumen
│
├── 📊 Dashboard
│   ├── Summary Today
│   ├── Upcoming Orders
│   ├── Pending Orders
│   └── Quick Stats
│
├── 👤 Profil
│   ├── Data Diri
│   ├── Dokumen (STR, Sertifikat)
│   ├── Spesialisasi
│   ├── Bio
│   ├── Area Layanan
│   └── Tarif
│
├── 📅 Jadwal
│   ├── Atur Hari Kerja
│   ├── Atur Jam Operasional
│   └── Block Unavailable Time
│
├── 📦 Orders
│   ├── Order Masuk
│   │   ├── Detail Order
│   │   ├── Accept/Reject
│   │   └── Update Status
│   │
│   ├── Order Aktif
│   │   ├── Navigation
│   │   ├── Start Session
│   │   └── End Session
│   │
│   └── Riwayat Order
│       ├── List History
│       └── Detail History
│
├── 📝 Treatment Report
│   ├── Input Keluhan
│   ├── Input Temuan
│   ├── Input Tindakan
│   └── Input Rekomendasi
│
├── 💰 Earnings
│   ├── Total Pendapatan
│   ├── Jumlah Sesi
│   ├── Riwayat Payout
│   └── Komisi Platform
│
├── ⭐ Reviews
│   ├── List Review
│   └── Rating Summary
│
└── ⚙️ Settings
    ├── Notifikasi
    ├── Bantuan
    └── Logout
```

---

## 3. Admin Dashboard (Web)

```
🖥️ Admin Dashboard
│
├── 🔐 Auth
│   └── Login
│
├── 📊 Dashboard
│   ├── Overview Metrics
│   ├── Today's Bookings
│   ├── Pending Verifications
│   └── Revenue Summary
│
├── 👥 User Management
│   ├── List Users
│   ├── User Detail
│   ├── User Status
│   └── User History
│
├── 👨‍⚕️ Therapist Management
│   ├── List Therapists
│   ├── Pending Verification
│   │   ├── Review Documents
│   │   ├── Approve
│   │   └── Reject
│   ├── Active Therapists
│   └── Therapist Performance
│
├── 📦 Booking Management
│   ├── All Bookings
│   ├── Filter & Search
│   ├── Booking Detail
│   ├── Reassign Therapist
│   └── Handle Disputes
│
├── 🏷️ Service Management
│   ├── List Services
│   ├── Add Service
│   ├── Edit Service
│   └── Service Categories
│
├── 💳 Payment Management
│   ├── Transaction List
│   ├── Payment Status
│   ├── Therapist Payouts
│   └── Refund Handling
│
├── 📰 Content Management
│   ├── Banner Home
│   ├── Promo
│   └── Push Notification
│
├── 📈 Analytics
│   ├── Booking Stats
│   ├── Revenue Report
│   ├── Therapist Utilization
│   ├── User Growth
│   └── Rating Overview
│
└── ⚙️ Settings
    ├── Admin Users
    ├── System Config
    └── Logs
```

---

## 4. Bottom Navigation Structure

### User App
| Tab | Icon | Label | Primary Screen |
|-----|------|-------|----------------|
| 1 | 🏠 | Home | Home Dashboard |
| 2 | 📦 | Orders | Booking List |
| 3 | 🔔 | Notifikasi | Notification List |
| 4 | 👤 | Profile | User Profile |

### Therapist Portal
| Tab | Icon | Label | Primary Screen |
|-----|------|-------|----------------|
| 1 | 📊 | Dashboard | Home Dashboard |
| 2 | 📦 | Orders | Order Management |
| 3 | 📅 | Jadwal | Schedule Manager |
| 4 | 👤 | Profile | Therapist Profile |

---

## 5. Page Count Summary

| Platform | Total Pages |
|----------|-------------|
| User App | 22 pages |
| Therapist Portal | 15 pages |
| Admin Dashboard | 18 pages |
| **Total** | **55 pages** |