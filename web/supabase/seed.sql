-- ============================================
-- SEED DATA - Halo Bugar
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Create auth users for therapists
-- This uses Supabase's internal function to create auth entries
DO $$
DECLARE
  therapist_ids UUID[] := ARRAY[
    '22222222-2222-2222-2222-222222222221'::UUID,
    '22222222-2222-2222-2222-222222222222'::UUID,
    '22222222-2222-2222-2222-222222222223'::UUID,
    '22222222-2222-2222-2222-222222222224'::UUID,
    '22222222-2222-2222-2222-222222222225'::UUID,
    '22222222-2222-2222-2222-222222222226'::UUID
  ];
  therapist_emails TEXT[] := ARRAY[
    'siti.rahmawati@halobugar.id',
    'ahmad.yusuf@halobugar.id', 
    'dewi.kartika@halobugar.id',
    'budi.santoso@halobugar.id',
    'rina.melati@halobugar.id',
    'hendra.putra@halobugar.id'
  ];
  i INT;
BEGIN
  FOR i IN 1..array_length(therapist_ids, 1) LOOP
    -- Insert into auth.users if not exists
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      aud
    ) VALUES (
      therapist_ids[i],
      '00000000-0000-0000-0000-000000000000',
      therapist_emails[i],
      crypt('therapist123', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      NOW(),
      NOW(),
      'authenticated',
      'authenticated'
    ) ON CONFLICT (id) DO NOTHING;
  END LOOP;
END $$;

-- Step 2: Insert Services
INSERT INTO services (id, name, category, description, duration_minutes, base_price, is_active, icon) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Pijat Relaksasi', 'home_recovery', 'Pijat untuk relaksasi dan mengurangi stres, menggunakan teknik Swedish massage yang lembut.', 60, 200000, true, 'spa'),
  ('11111111-1111-1111-1111-111111111112', 'Pijat Deep Tissue', 'pain_relief', 'Pijat dengan tekanan dalam untuk mengatasi nyeri otot kronis dan ketegangan.', 60, 250000, true, 'muscle'),
  ('11111111-1111-1111-1111-111111111113', 'Fisioterapi Cedera Olahraga', 'injury_support', 'Penanganan dan rehabilitasi cedera akibat aktivitas olahraga.', 90, 350000, true, 'activity'),
  ('11111111-1111-1111-1111-111111111114', 'Terapi Nyeri Punggung', 'pain_relief', 'Penanganan khusus untuk nyeri punggung bawah (lower back pain).', 60, 300000, true, 'spine'),
  ('11111111-1111-1111-1111-111111111115', 'Pemulihan Pasca Operasi', 'home_recovery', 'Program rehabilitasi untuk pemulihan setelah operasi.', 90, 400000, true, 'heart'),
  ('11111111-1111-1111-1111-111111111116', 'Pijat Sport Massage', 'performance_recovery', 'Pijat khusus untuk atlet, meningkatkan performa dan mempercepat recovery.', 60, 280000, true, 'zap'),
  ('11111111-1111-1111-1111-111111111117', 'Terapi Leher & Bahu', 'pain_relief', 'Penanganan nyeri dan kekakuan pada area leher dan bahu.', 45, 180000, true, 'neck'),
  ('11111111-1111-1111-1111-111111111118', 'Home Visit Fisioterapi', 'home_recovery', 'Layanan fisioterapi reguler di rumah Anda.', 60, 250000, true, 'home')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  duration_minutes = EXCLUDED.duration_minutes,
  base_price = EXCLUDED.base_price;

-- Create therapist users in auth.users first (this creates the auth entry)
-- Note: In production, therapists register themselves. This is for demo only.

-- Create users entries for therapists
INSERT INTO users (id, email, phone, name, role, avatar_url) VALUES
  ('22222222-2222-2222-2222-222222222221', 'siti.rahmawati@halobugar.id', '081234567891', 'Siti Rahmawati, S.Ft', 'therapist', null),
  ('22222222-2222-2222-2222-222222222222', 'ahmad.yusuf@halobugar.id', '081234567892', 'Ahmad Yusuf, S.Ft', 'therapist', null),
  ('22222222-2222-2222-2222-222222222223', 'dewi.kartika@halobugar.id', '081234567893', 'Dewi Kartika, S.Ft', 'therapist', null),
  ('22222222-2222-2222-2222-222222222224', 'budi.santoso@halobugar.id', '081234567894', 'Budi Santoso, S.Ft', 'therapist', null),
  ('22222222-2222-2222-2222-222222222225', 'rina.melati@halobugar.id', '081234567895', 'Rina Melati, S.Ft', 'therapist', null),
  ('22222222-2222-2222-2222-222222222226', 'hendra.putra@halobugar.id', '081234567896', 'Hendra Putra, S.Ft', 'therapist', null)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role;

-- Create therapist profiles
INSERT INTO therapists (id, user_id, str_number, specializations, experience_years, bio, hourly_rate, service_areas, is_verified, is_available, rating_avg, total_sessions) VALUES
  (
    '33333333-3333-3333-3333-333333333331',
    '22222222-2222-2222-2222-222222222221',
    'STR-31-2024-001234',
    ARRAY['Deep Tissue', 'Swedish Massage', 'Trigger Point'],
    8,
    'Fisioterapis berpengalaman dengan spesialisasi pijat deep tissue dan manajemen nyeri kronis. Lulusan Universitas Indonesia dengan sertifikasi internasional.',
    250000,
    ARRAY['Jakarta Selatan', 'Jakarta Pusat', 'Depok'],
    true,
    true,
    4.9,
    156
  ),
  (
    '33333333-3333-3333-3333-333333333332',
    '22222222-2222-2222-2222-222222222222',
    'STR-31-2024-001235',
    ARRAY['Sports Massage', 'Injury Rehabilitation', 'Performance Recovery'],
    6,
    'Spesialis fisioterapi olahraga. Berpengalaman menangani atlet profesional dari berbagai cabang olahraga.',
    280000,
    ARRAY['Jakarta Selatan', 'Jakarta Barat', 'Tangerang'],
    true,
    true,
    4.8,
    124
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '22222222-2222-2222-2222-222222222223',
    'STR-31-2024-001236',
    ARRAY['Relaxation', 'Prenatal Massage', 'Lymphatic Drainage'],
    5,
    'Terapis dengan sentuhan lembut, spesialis pijat relaksasi dan prenatal. Menciptakan pengalaman spa yang menenangkan di rumah Anda.',
    200000,
    ARRAY['Jakarta Selatan', 'Jakarta Timur', 'Bekasi'],
    true,
    true,
    4.9,
    198
  ),
  (
    '33333333-3333-3333-3333-333333333334',
    '22222222-2222-2222-2222-222222222224',
    'STR-31-2024-001237',
    ARRAY['Orthopedic', 'Post-Surgery Rehab', 'Geriatric Care'],
    10,
    'Senior fisioterapis dengan pengalaman lebih dari 10 tahun. Ahli dalam rehabilitasi pasca operasi dan perawatan lansia.',
    350000,
    ARRAY['Jakarta Pusat', 'Jakarta Utara', 'Kelapa Gading'],
    true,
    true,
    4.7,
    203
  ),
  (
    '33333333-3333-3333-3333-333333333335',
    '22222222-2222-2222-2222-222222222225',
    'STR-31-2024-001238',
    ARRAY['Neck & Shoulder', 'Office Syndrome', 'Headache Therapy'],
    4,
    'Spesialisasi menangani keluhan pekerja kantoran seperti nyeri leher, bahu, dan sakit kepala tegang.',
    220000,
    ARRAY['Jakarta Selatan', 'SCBD', 'Kuningan'],
    true,
    true,
    4.8,
    89
  ),
  (
    '33333333-3333-3333-3333-333333333336',
    '22222222-2222-2222-2222-222222222226',
    'STR-31-2024-001239',
    ARRAY['Cupping Therapy', 'Traditional Massage', 'Reflexology'],
    7,
    'Menggabungkan teknik fisioterapi modern dengan terapi tradisional seperti bekam dan refleksiologi.',
    230000,
    ARRAY['Jakarta Timur', 'Bekasi', 'Cibubur'],
    true,
    true,
    4.6,
    167
  )
ON CONFLICT (id) DO UPDATE SET
  specializations = EXCLUDED.specializations,
  bio = EXCLUDED.bio,
  hourly_rate = EXCLUDED.hourly_rate,
  service_areas = EXCLUDED.service_areas,
  is_verified = EXCLUDED.is_verified,
  is_available = EXCLUDED.is_available,
  rating_avg = EXCLUDED.rating_avg,
  total_sessions = EXCLUDED.total_sessions;

-- Verify the data
SELECT 
  t.id,
  u.name,
  t.specializations,
  t.rating_avg,
  t.is_verified,
  t.is_available
FROM therapists t
JOIN users u ON t.user_id = u.id;
