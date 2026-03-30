-- ============================================
-- HALO BUGAR - Initial Database Schema
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('user', 'therapist', 'admin');

CREATE TYPE service_category AS ENUM (
  'home_recovery',
  'injury_support', 
  'pain_relief',
  'performance_recovery'
);

CREATE TYPE booking_status AS ENUM (
  'pending',
  'accepted',
  'on_the_way',
  'arrived',
  'in_session',
  'completed',
  'cancelled'
);

CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

CREATE TYPE payment_method AS ENUM (
  'va_bca',
  'va_bni', 
  'va_mandiri',
  'gopay',
  'ovo',
  'qris'
);

-- ============================================
-- TABLES
-- ============================================

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Therapists table
CREATE TABLE therapists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  str_number TEXT NOT NULL UNIQUE, -- Surat Tanda Registrasi
  specializations TEXT[] NOT NULL DEFAULT '{}',
  experience_years INTEGER NOT NULL DEFAULT 0,
  bio TEXT,
  hourly_rate DECIMAL(12,2) NOT NULL,
  service_areas TEXT[] NOT NULL DEFAULT '{}',
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  rating_avg DECIMAL(2,1) NOT NULL DEFAULT 0,
  total_sessions INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category service_category NOT NULL,
  description TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  base_price DECIMAL(12,2) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User addresses table
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label TEXT NOT NULL, -- e.g., "Rumah", "Kantor"
  full_address TEXT NOT NULL,
  notes TEXT, -- e.g., "Lantai 3, Apt 301"
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES therapists(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  address_id UUID NOT NULL REFERENCES addresses(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  complaint_notes TEXT,
  status booking_status NOT NULL DEFAULT 'pending',
  total_price DECIMAL(12,2) NOT NULL,
  cancelled_at TIMESTAMPTZ,
  cancelled_by UUID REFERENCES users(id),
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  method payment_method NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  gateway_ref TEXT, -- Reference from payment gateway
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Treatment reports table
CREATE TABLE treatment_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  complaint TEXT NOT NULL,
  findings TEXT NOT NULL,
  treatment_given TEXT NOT NULL,
  recommendations TEXT,
  follow_up_needed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES therapists(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Users indexes
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- Therapists indexes
CREATE INDEX idx_therapists_user_id ON therapists(user_id);
CREATE INDEX idx_therapists_is_verified ON therapists(is_verified);
CREATE INDEX idx_therapists_is_available ON therapists(is_available);
CREATE INDEX idx_therapists_rating ON therapists(rating_avg DESC);
CREATE INDEX idx_therapists_service_areas ON therapists USING GIN(service_areas);
CREATE INDEX idx_therapists_specializations ON therapists USING GIN(specializations);

-- Services indexes
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_is_active ON services(is_active);

-- Addresses indexes
CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- Bookings indexes
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_therapist_id ON bookings(therapist_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_scheduled_at ON bookings(scheduled_at);

-- Payments indexes
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Reviews indexes
CREATE INDEX idx_reviews_therapist_id ON reviews(therapist_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_therapists_updated_at
  BEFORE UPDATE ON therapists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_addresses_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_treatment_reports_updated_at
  BEFORE UPDATE ON treatment_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to update therapist rating when review is added
CREATE OR REPLACE FUNCTION update_therapist_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE therapists
  SET rating_avg = (
    SELECT COALESCE(AVG(rating), 0)
    FROM reviews
    WHERE therapist_id = NEW.therapist_id
  )
  WHERE id = NEW.therapist_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_on_review
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_therapist_rating();

-- Function to update therapist total_sessions when booking completed
CREATE OR REPLACE FUNCTION update_therapist_sessions()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE therapists
    SET total_sessions = total_sessions + 1
    WHERE id = NEW.therapist_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sessions_on_booking
  AFTER UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_therapist_sessions();

-- Function to ensure only one default address per user
CREATE OR REPLACE FUNCTION ensure_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = TRUE THEN
    UPDATE addresses
    SET is_default = FALSE
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_default
  AFTER INSERT OR UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION ensure_single_default_address();

-- Function to create user profile on auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Public can view therapist profiles"
  ON users FOR SELECT
  USING (role = 'therapist');

CREATE POLICY "Admin can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Therapists policies
CREATE POLICY "Anyone can view verified therapists"
  ON therapists FOR SELECT
  USING (is_verified = TRUE);

CREATE POLICY "Therapists can update own profile"
  ON therapists FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Admin can manage all therapists"
  ON therapists FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Services policies
CREATE POLICY "Anyone can view active services"
  ON services FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admin can manage services"
  ON services FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Addresses policies
CREATE POLICY "Users can manage own addresses"
  ON addresses FOR ALL
  USING (user_id = auth.uid());

-- Bookings policies
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Therapists can view their bookings"
  ON bookings FOR SELECT
  USING (
    therapist_id IN (
      SELECT id FROM therapists WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Therapists can update booking status"
  ON bookings FOR UPDATE
  USING (
    therapist_id IN (
      SELECT id FROM therapists WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admin can manage all bookings"
  ON bookings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Payments policies
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (
    booking_id IN (
      SELECT id FROM bookings WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admin can manage all payments"
  ON payments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Treatment reports policies
CREATE POLICY "Users can view own treatment reports"
  ON treatment_reports FOR SELECT
  USING (
    booking_id IN (
      SELECT id FROM bookings WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Therapists can manage treatment reports"
  ON treatment_reports FOR ALL
  USING (
    booking_id IN (
      SELECT id FROM bookings 
      WHERE therapist_id IN (
        SELECT id FROM therapists WHERE user_id = auth.uid()
      )
    )
  );

-- Reviews policies
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can create reviews for their bookings"
  ON reviews FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    booking_id IN (
      SELECT id FROM bookings 
      WHERE user_id = auth.uid() AND status = 'completed'
    )
  );

-- ============================================
-- SEED DATA - Services
-- ============================================

INSERT INTO services (name, category, description, duration_minutes, base_price, icon) VALUES
-- Home Recovery
('Post-Surgery Recovery', 'home_recovery', 'Rehabilitasi pasca operasi untuk memulihkan fungsi tubuh', 60, 350000, 'surgery'),
('Stroke Rehabilitation', 'home_recovery', 'Program pemulihan untuk pasien stroke', 90, 500000, 'brain'),
('Post-Fracture Recovery', 'home_recovery', 'Pemulihan pasca patah tulang', 60, 350000, 'bone'),

-- Injury Support
('Sports Injury Treatment', 'injury_support', 'Penanganan cedera olahraga', 60, 300000, 'sports'),
('Sprain & Strain Treatment', 'injury_support', 'Terapi untuk keseleo dan strain otot', 45, 250000, 'muscle'),
('Tennis/Golf Elbow', 'injury_support', 'Penanganan tennis elbow dan golf elbow', 45, 275000, 'elbow'),

-- Pain Relief  
('Back Pain Therapy', 'pain_relief', 'Terapi untuk nyeri punggung kronis', 60, 300000, 'back'),
('Neck & Shoulder Pain', 'pain_relief', 'Penanganan nyeri leher dan bahu', 45, 275000, 'neck'),
('Knee Pain Treatment', 'pain_relief', 'Terapi untuk nyeri lutut', 45, 275000, 'knee'),
('Sciatica Treatment', 'pain_relief', 'Penanganan nyeri sciatica', 60, 325000, 'nerve'),

-- Performance Recovery
('Athlete Recovery', 'performance_recovery', 'Program recovery untuk atlet profesional', 90, 450000, 'athlete'),
('Office Worker Wellness', 'performance_recovery', 'Program untuk pekerja kantoran', 45, 225000, 'office'),
('Elderly Mobility', 'performance_recovery', 'Program mobilitas untuk lansia', 60, 300000, 'elderly');
