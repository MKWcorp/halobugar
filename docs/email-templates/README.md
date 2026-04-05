# Email Templates - Halo Bugar

Template email untuk integrasi Supabase Authentication dengan branding Halo Bugar.

## Cara Update di Supabase Dashboard

### 1. Buka Supabase Dashboard
- Pergi ke https://supabase.com/dashboard
- Pilih project **tmsgryiosssnaiheyzaw**

### 2. Update Email Templates
- Klik **Authentication** di sidebar kiri
- Klik tab **Email Templates**

### 3. Copy-Paste Template

#### Confirm Signup
1. Klik **Confirm signup**
2. Subject: `🎉 Konfirmasi Pendaftaran Anda di Halo Bugar`
3. Body: Copy isi file `confirm-signup.html`
4. Klik **Save**

#### Reset Password
1. Klik **Reset password**
2. Subject: `🔐 Reset Password Akun Halo Bugar Anda`
3. Body: Copy isi file `reset-password.html`
4. Klik **Save**

## Template Variables (Supabase)
- `{{ .ConfirmationURL }}` - URL untuk konfirmasi/reset
- `{{ .Email }}` - Email pengguna
- `{{ .Token }}` - Token verifikasi
- `{{ .TokenHash }}` - Hash dari token
- `{{ .SiteURL }}` - URL website

## Preview
Buka file HTML di browser untuk melihat preview email.

## Tips
- Test email setelah update dengan mendaftar akun dummy
- Pastikan link konfirmasi berfungsi dengan benar
- Cek folder spam jika email tidak masuk inbox
