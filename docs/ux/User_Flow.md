# User Flow - Halo Bugar

## 1. User App Flows

### 1.1 Onboarding Flow

```
[Splash Screen]
    ↓
[Onboarding 1: Kenalan dengan Halo Bugar]
    ↓
[Onboarding 2: Cara kerja Home Recovery]
    ↓
[Onboarding 3: Mulai sekarang]
    ↓
[Register / Login]
```

### 1.2 Register Flow

```
[Halaman Register]
    ↓
[Input nama, email/phone]
    ↓
[Kirim OTP]
    ↓
[Verifikasi OTP]
    ↓
[Buat password]
    ↓
[✓ Masuk ke Home]
```

### 1.3 Login Flow

```
[Halaman Login]
    ↓
[Input email/phone + password]
    ↓
[Validasi]
    ↓
[✓ Masuk ke Home]
```

### 1.4 Booking Flow (Main Flow)

```
[Home]
    ↓
[Pilih Kategori Layanan]
    ├── Home Recovery
    ├── Injury Support
    ├── Pain Relief & Mobility
    └── Performance Recovery
    ↓
[Detail Layanan]
    ↓
[Pilih Fisioterapis]
    ├── [Pilih Manual] → [Detail Fisioterapis]
    └── [Auto-Assign]
    ↓
[Pilih Tanggal]
    ↓
[Pilih Jam]
    ↓
[Input/Pilih Alamat]
    ↓
[Isi Catatan Keluhan]
    ↓
[Ringkasan Booking]
    ↓
[Pilih Metode Pembayaran]
    ↓
[Konfirmasi & Bayar]
    ↓
[✓ Booking Berhasil]
    ↓
[Status Tracking]
```

### 1.5 Tracking Flow

```
[Status Booking]
    ↓
┌─────────────────────────────┐
│ Status Timeline:            │
│ ● Menunggu Konfirmasi       │
│ ● Diterima Fisioterapis     │
│ ● Dalam Perjalanan          │
│ ● Sampai Lokasi             │
│ ● Sesi Berlangsung          │
│ ● Selesai                   │
└─────────────────────────────┘
    ↓
[Sesi Selesai]
    ↓
[Rating & Review]
    ↓
[Laporan Treatment]
```

### 1.6 Riwayat & Reorder Flow

```
[Riwayat Booking]
    ↓
[Pilih Booking Sebelumnya]
    ↓
[Detail Riwayat]
    ├── [Lihat Laporan Treatment]
    └── [Pesan Lagi] → [Booking Flow]
```

---

## 2. Therapist Portal Flows

### 2.1 Registrasi & Verifikasi Flow

```
[Halaman Register Therapist]
    ↓
[Input Data Diri]
    ↓
[Upload Dokumen]
    ├── STR (Surat Tanda Registrasi)
    ├── Ijazah
    └── Sertifikat
    ↓
[Submit Verifikasi]
    ↓
[Menunggu Review Admin]
    ↓
[✓ Approved] → [Akses Dashboard]
[✗ Rejected] → [Revisi & Upload Ulang]
```

### 2.2 Setup Profil Flow

```
[Dashboard]
    ↓
[Edit Profil]
    ↓
[Lengkapi:]
    ├── Foto profil
    ├── Bio
    ├── Spesialisasi
    ├── Pengalaman
    ├── Area layanan
    └── Tarif
    ↓
[Simpan]
    ↓
[✓ Profil Aktif]
```

### 2.3 Kelola Jadwal Flow

```
[Menu Jadwal]
    ↓
[Atur Hari Kerja]
    ↓
[Atur Jam Operasional]
    ↓
[Block Waktu Unavailable (jika ada)]
    ↓
[Simpan Jadwal]
```

### 2.4 Order Management Flow

```
[Notifikasi Order Masuk]
    ↓
[Lihat Detail Order]
    ├── Info User
    ├── Layanan
    ├── Jadwal
    ├── Alamat
    └── Keluhan
    ↓
[Terima] / [Tolak]
    ↓ (jika Terima)
[Update Status: Diterima]
    ↓
[Waktu Berangkat] → [Update: Dalam Perjalanan]
    ↓
[Sampai] → [Update: Sampai Lokasi]
    ↓
[Mulai Sesi] → [Update: Sesi Berlangsung]
    ↓
[Selesai] → [Input Laporan Treatment]
    ↓
[Submit Laporan]
    ↓
[✓ Order Selesai]
```

### 2.5 Input Laporan Treatment Flow

```
[Form Laporan]
    ↓
[Input:]
    ├── Keluhan utama
    ├── Temuan/observasi
    ├── Tindakan yang dilakukan
    ├── Saran latihan
    └── Rekomendasi follow-up
    ↓
[Submit]
    ↓
[✓ Laporan Terkirim ke User]
```

---

## 3. Admin Dashboard Flows

### 3.1 Verifikasi Therapist Flow

```
[Dashboard Admin]
    ↓
[Menu: Therapist Management]
    ↓
[List Pending Verification]
    ↓
[Pilih Therapist]
    ↓
[Review Dokumen]
    ├── Cek STR
    ├── Cek Ijazah
    └── Cek Sertifikat
    ↓
[Approve] / [Reject]
    ├── [Approve] → Therapist bisa terima order
    └── [Reject] → Kirim alasan, minta revisi
```

### 3.2 Booking Management Flow

```
[Menu: Booking Management]
    ↓
[List Semua Booking]
    ↓
[Filter by Status / Tanggal / Therapist]
    ↓
[Pilih Booking]
    ↓
[Detail Booking]
    ├── Info User
    ├── Info Therapist
    ├── Status
    └── Payment Status
    ↓
[Action (jika diperlukan)]
    ├── Reassign Therapist
    ├── Cancel Booking
    └── Handle Dispute
```

### 3.3 Service Management Flow

```
[Menu: Service Management]
    ↓
[List Layanan]
    ↓
[Tambah Layanan Baru]
    ├── Nama
    ├── Deskripsi
    ├── Kategori
    ├── Durasi
    └── Harga dasar
    ↓
[Simpan]
    ↓
[✓ Layanan Aktif]
```

---

## 4. Error & Edge Case Flows

### 4.1 Payment Failed

```
[Pembayaran Gagal]
    ↓
[Tampilkan Error Message]
    ↓
[Coba Lagi] / [Ganti Metode Pembayaran]
```

### 4.2 Therapist Cancel

```
[Therapist Menolak Order]
    ↓
[Notifikasi ke User]
    ↓
[Auto-Reassign] / [User Pilih Therapist Lain]
```

### 4.3 User Cancel

```
[User Batalkan Booking]
    ↓
[Konfirmasi Pembatalan]
    ↓
[Cek Kebijakan Refund]
    ├── [> 24 jam] → Full refund
    ├── [< 24 jam] → Partial refund
    └── [< 2 jam] → No refund
    ↓
[Proses Refund (jika ada)]
```

---

## Legend

| Simbol | Arti |
|--------|------|
| `[ ]` | Screen/Halaman |
| `↓` | Navigasi ke halaman berikutnya |
| `├──` | Opsi/branch |
| `└──` | Opsi terakhir/branch terakhir |
| `✓` | Success state |
| `✗` | Failed state |