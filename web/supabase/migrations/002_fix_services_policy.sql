-- Fix RLS policies to avoid infinite recursion and allow anonymous access
-- The issue: policies were checking users table from within users table policies

-- ============================================
-- 1. DROP ALL PROBLEMATIC POLICIES
-- ============================================

-- Drop users policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Public can view therapist profiles" ON users;
DROP POLICY IF EXISTS "Admin can view all users" ON users;

-- Drop therapists policies  
DROP POLICY IF EXISTS "Anyone can view verified therapists" ON therapists;
DROP POLICY IF EXISTS "Therapists can update own profile" ON therapists;
DROP POLICY IF EXISTS "Admin can manage all therapists" ON therapists;

-- Drop services policies
DROP POLICY IF EXISTS "Anyone can view active services" ON services;
DROP POLICY IF EXISTS "Admin can manage services" ON services;

-- Drop addresses policies
DROP POLICY IF EXISTS "Users can manage own addresses" ON addresses;

-- Drop bookings policies
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Therapists can view their bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
DROP POLICY IF EXISTS "Therapists can update booking status" ON bookings;

-- Drop payments policies
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
DROP POLICY IF EXISTS "Therapists can view their payments" ON payments;

-- Drop treatment_reports policies
DROP POLICY IF EXISTS "Users can view own treatment reports" ON treatment_reports;
DROP POLICY IF EXISTS "Therapists can manage treatment reports" ON treatment_reports;

-- Drop reviews policies
DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;

-- ============================================
-- 2. CREATE SECURITY DEFINER FUNCTION FOR ADMIN CHECK
-- ============================================

-- Helper function to check if current user is admin (avoids recursion)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 3. RECREATE POLICIES WITHOUT RECURSION
-- ============================================

-- Drop new policy names (in case of re-run)
DROP POLICY IF EXISTS "Public can view verified therapists" ON therapists;
DROP POLICY IF EXISTS "Public can view active services" ON services;
DROP POLICY IF EXISTS "Therapists can update their assigned bookings" ON bookings;
DROP POLICY IF EXISTS "Therapists can manage treatment reports for their bookings" ON treatment_reports;
DROP POLICY IF EXISTS "Public can view reviews" ON reviews;
DROP POLICY IF EXISTS "Users can create reviews for their bookings" ON reviews;

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

-- Therapists policies
CREATE POLICY "Public can view verified therapists"
  ON therapists FOR SELECT
  TO anon, authenticated
  USING (is_verified = TRUE);

CREATE POLICY "Therapists can update own profile"
  ON therapists FOR UPDATE
  USING (user_id = auth.uid());

-- Services policies (allow anonymous)
CREATE POLICY "Public can view active services"
  ON services FOR SELECT
  TO anon, authenticated
  USING (is_active = TRUE);

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

CREATE POLICY "Therapists can update their assigned bookings"
  ON bookings FOR UPDATE
  USING (
    therapist_id IN (
      SELECT id FROM therapists WHERE user_id = auth.uid()
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

CREATE POLICY "Therapists can view their payments"
  ON payments FOR SELECT
  USING (
    booking_id IN (
      SELECT id FROM bookings 
      WHERE therapist_id IN (
        SELECT id FROM therapists WHERE user_id = auth.uid()
      )
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

CREATE POLICY "Therapists can manage treatment reports for their bookings"
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
CREATE POLICY "Public can view reviews"
  ON reviews FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Users can create reviews for their bookings"
  ON reviews FOR INSERT
  WITH CHECK (
    booking_id IN (
      SELECT id FROM bookings WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  USING (user_id = auth.uid());
