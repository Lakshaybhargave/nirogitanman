-- ============================================================
-- NirogiTanman - Row Level Security Policies
-- Migration: 002_rls_policies
-- ============================================================

-- ─── Helper Functions ────────────────────────────────────────

-- Get current user's profile id
CREATE OR REPLACE FUNCTION auth.profile_id()
RETURNS UUID AS $$
  SELECT id FROM profiles WHERE auth_user_id = auth.uid()
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Get current user's role
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE auth_user_id = auth.uid()
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Check if current user is admin or super_admin
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS BOOLEAN AS $$
  SELECT role IN ('admin', 'super_admin') FROM profiles WHERE auth_user_id = auth.uid()
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Check if current user is a super_admin
CREATE OR REPLACE FUNCTION auth.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT role = 'super_admin' FROM profiles WHERE auth_user_id = auth.uid()
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Get current user's partner id
CREATE OR REPLACE FUNCTION auth.partner_id()
RETURNS UUID AS $$
  SELECT p.id FROM partners p
  JOIN profiles pr ON pr.id = p.profile_id
  WHERE pr.auth_user_id = auth.uid()
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- ─── Enable RLS on all tables ────────────────────────────────

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_unavailability ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ─── PROFILES ────────────────────────────────────────────────

-- Everyone can read public profile info
CREATE POLICY "profiles_public_read" ON profiles
  FOR SELECT USING (TRUE);

-- Users can update their own profile
CREATE POLICY "profiles_own_update" ON profiles
  FOR UPDATE USING (auth_user_id = auth.uid());

-- Admins can update any profile
CREATE POLICY "profiles_admin_update" ON profiles
  FOR UPDATE USING (auth.is_admin());

-- Users can insert their own profile (handled via trigger but also allow directly)
CREATE POLICY "profiles_own_insert" ON profiles
  FOR INSERT WITH CHECK (auth_user_id = auth.uid());

-- Admins can delete profiles
CREATE POLICY "profiles_admin_delete" ON profiles
  FOR DELETE USING (auth.is_admin());

-- ─── PARTNER TYPES (read-only for non-admins) ────────────────

CREATE POLICY "partner_types_public_read" ON partner_types
  FOR SELECT USING (TRUE);

CREATE POLICY "partner_types_admin_all" ON partner_types
  FOR ALL USING (auth.is_admin());

-- ─── SERVICE CATEGORIES ──────────────────────────────────────

CREATE POLICY "service_categories_public_read" ON service_categories
  FOR SELECT USING (TRUE);

CREATE POLICY "service_categories_admin_all" ON service_categories
  FOR ALL USING (auth.is_admin());

-- ─── SERVICES ────────────────────────────────────────────────

CREATE POLICY "services_public_read" ON services
  FOR SELECT USING (TRUE);

CREATE POLICY "services_admin_all" ON services
  FOR ALL USING (auth.is_admin());

-- ─── PARTNERS ────────────────────────────────────────────────

-- Verified partners are publicly visible
CREATE POLICY "partners_verified_read" ON partners
  FOR SELECT USING (verification_status = 'verified');

-- Admins can see all partners
CREATE POLICY "partners_admin_all" ON partners
  FOR ALL USING (auth.is_admin());

-- Partners can see and update their own record
CREATE POLICY "partners_own_select" ON partners
  FOR SELECT USING (profile_id = auth.profile_id());

CREATE POLICY "partners_own_update" ON partners
  FOR UPDATE USING (profile_id = auth.profile_id());

-- Partner users can create their own partner record
CREATE POLICY "partners_own_insert" ON partners
  FOR INSERT WITH CHECK (
    profile_id = auth.profile_id()
    AND auth.user_role() = 'partner'
  );

-- ─── PARTNER SERVICES ────────────────────────────────────────

CREATE POLICY "partner_services_public_read" ON partner_services
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "partner_services_own_all" ON partner_services
  FOR ALL USING (partner_id = auth.partner_id());

CREATE POLICY "partner_services_admin_all" ON partner_services
  FOR ALL USING (auth.is_admin());

-- ─── PARTNER AVAILABILITY ────────────────────────────────────

CREATE POLICY "partner_availability_public_read" ON partner_availability
  FOR SELECT USING (TRUE);

CREATE POLICY "partner_availability_own_all" ON partner_availability
  FOR ALL USING (partner_id = auth.partner_id());

CREATE POLICY "partner_availability_admin_read" ON partner_availability
  FOR SELECT USING (auth.is_admin());

-- ─── PARTNER UNAVAILABILITY ──────────────────────────────────

CREATE POLICY "partner_unavailability_public_read" ON partner_unavailability
  FOR SELECT USING (TRUE);

CREATE POLICY "partner_unavailability_own_all" ON partner_unavailability
  FOR ALL USING (partner_id = auth.partner_id());

-- ─── APPOINTMENTS ────────────────────────────────────────────

-- Clients see their own appointments
CREATE POLICY "appointments_client_select" ON appointments
  FOR SELECT USING (client_id = auth.profile_id());

-- Partners see appointments assigned to them
CREATE POLICY "appointments_partner_select" ON appointments
  FOR SELECT USING (partner_id = auth.partner_id());

-- Admins see all
CREATE POLICY "appointments_admin_all" ON appointments
  FOR ALL USING (auth.is_admin());

-- Clients can create appointments
CREATE POLICY "appointments_client_insert" ON appointments
  FOR INSERT WITH CHECK (
    client_id = auth.profile_id()
    AND auth.user_role() = 'client'
  );

-- Clients can cancel (update status to cancelled) their own appointments
CREATE POLICY "appointments_client_update" ON appointments
  FOR UPDATE USING (
    client_id = auth.profile_id()
    AND status NOT IN ('completed', 'cancelled')
  );

-- Partners can update their appointment status
CREATE POLICY "appointments_partner_update" ON appointments
  FOR UPDATE USING (partner_id = auth.partner_id());

-- ─── MEDICAL RECORDS ─────────────────────────────────────────

-- Clients see their own records
CREATE POLICY "medical_records_client_select" ON medical_records
  FOR SELECT USING (client_id = auth.profile_id());

-- Partners see records they created
CREATE POLICY "medical_records_partner_select" ON medical_records
  FOR SELECT USING (partner_id = auth.partner_id());

-- Admins see all
CREATE POLICY "medical_records_admin_all" ON medical_records
  FOR ALL USING (auth.is_admin());

-- Clients can upload their own records
CREATE POLICY "medical_records_client_insert" ON medical_records
  FOR INSERT WITH CHECK (client_id = auth.profile_id());

-- Partners can add records for their patients
CREATE POLICY "medical_records_partner_insert" ON medical_records
  FOR INSERT WITH CHECK (partner_id = auth.partner_id());

-- ─── PRESCRIPTIONS ───────────────────────────────────────────

CREATE POLICY "prescriptions_client_select" ON prescriptions
  FOR SELECT USING (client_id = auth.profile_id());

CREATE POLICY "prescriptions_partner_select" ON prescriptions
  FOR SELECT USING (partner_id = auth.partner_id());

CREATE POLICY "prescriptions_partner_insert" ON prescriptions
  FOR INSERT WITH CHECK (partner_id = auth.partner_id());

CREATE POLICY "prescriptions_partner_update" ON prescriptions
  FOR UPDATE USING (partner_id = auth.partner_id());

CREATE POLICY "prescriptions_admin_all" ON prescriptions
  FOR ALL USING (auth.is_admin());

-- ─── PRESCRIPTION MEDICINES ──────────────────────────────────

CREATE POLICY "prescription_medicines_client_select" ON prescription_medicines
  FOR SELECT USING (
    prescription_id IN (
      SELECT id FROM prescriptions WHERE client_id = auth.profile_id()
    )
  );

CREATE POLICY "prescription_medicines_partner_all" ON prescription_medicines
  FOR ALL USING (
    prescription_id IN (
      SELECT id FROM prescriptions WHERE partner_id = auth.partner_id()
    )
  );

CREATE POLICY "prescription_medicines_admin_all" ON prescription_medicines
  FOR ALL USING (auth.is_admin());

-- ─── ORDERS ──────────────────────────────────────────────────

CREATE POLICY "orders_client_select" ON orders
  FOR SELECT USING (client_id = auth.profile_id());

CREATE POLICY "orders_client_insert" ON orders
  FOR INSERT WITH CHECK (client_id = auth.profile_id());

CREATE POLICY "orders_client_update" ON orders
  FOR UPDATE USING (
    client_id = auth.profile_id()
    AND status = 'pending'
  );

CREATE POLICY "orders_partner_select" ON orders
  FOR SELECT USING (partner_id = auth.partner_id());

CREATE POLICY "orders_partner_update" ON orders
  FOR UPDATE USING (partner_id = auth.partner_id());

CREATE POLICY "orders_admin_all" ON orders
  FOR ALL USING (auth.is_admin());

-- ─── ORDER ITEMS ─────────────────────────────────────────────

CREATE POLICY "order_items_client_select" ON order_items
  FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE client_id = auth.profile_id())
  );

CREATE POLICY "order_items_partner_select" ON order_items
  FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE partner_id = auth.partner_id())
  );

CREATE POLICY "order_items_client_insert" ON order_items
  FOR INSERT WITH CHECK (
    order_id IN (SELECT id FROM orders WHERE client_id = auth.profile_id())
  );

CREATE POLICY "order_items_admin_all" ON order_items
  FOR ALL USING (auth.is_admin());

-- ─── PAYMENTS ────────────────────────────────────────────────

CREATE POLICY "payments_client_select" ON payments
  FOR SELECT USING (client_id = auth.profile_id());

CREATE POLICY "payments_client_insert" ON payments
  FOR INSERT WITH CHECK (client_id = auth.profile_id());

CREATE POLICY "payments_partner_select" ON payments
  FOR SELECT USING (partner_id = auth.partner_id());

CREATE POLICY "payments_admin_all" ON payments
  FOR ALL USING (auth.is_admin());

-- ─── REVIEWS ─────────────────────────────────────────────────

-- Public read for visible reviews
CREATE POLICY "reviews_public_select" ON reviews
  FOR SELECT USING (is_visible = TRUE);

-- Clients see their own (including invisible)
CREATE POLICY "reviews_client_select" ON reviews
  FOR SELECT USING (client_id = auth.profile_id());

-- Clients can write reviews
CREATE POLICY "reviews_client_insert" ON reviews
  FOR INSERT WITH CHECK (client_id = auth.profile_id());

CREATE POLICY "reviews_client_update" ON reviews
  FOR UPDATE USING (client_id = auth.profile_id());

-- Partners can reply to reviews about them
CREATE POLICY "reviews_partner_update" ON reviews
  FOR UPDATE USING (partner_id = auth.partner_id());

CREATE POLICY "reviews_admin_all" ON reviews
  FOR ALL USING (auth.is_admin());

-- ─── NOTIFICATIONS ───────────────────────────────────────────

CREATE POLICY "notifications_own_select" ON notifications
  FOR SELECT USING (user_id = auth.profile_id());

CREATE POLICY "notifications_own_update" ON notifications
  FOR UPDATE USING (user_id = auth.profile_id());

CREATE POLICY "notifications_admin_all" ON notifications
  FOR ALL USING (auth.is_admin());

-- System can insert notifications for any user (via service role)
CREATE POLICY "notifications_service_insert" ON notifications
  FOR INSERT WITH CHECK (TRUE);

-- ─── BLOG POSTS ──────────────────────────────────────────────

CREATE POLICY "blog_posts_public_select" ON blog_posts
  FOR SELECT USING (published = TRUE);

CREATE POLICY "blog_posts_admin_all" ON blog_posts
  FOR ALL USING (auth.is_admin());

-- Authors can manage their own posts
CREATE POLICY "blog_posts_author_all" ON blog_posts
  FOR ALL USING (author_id = auth.profile_id());

-- ─── AUDIT LOGS ──────────────────────────────────────────────

-- Only admins can read audit logs
CREATE POLICY "audit_logs_admin_select" ON audit_logs
  FOR SELECT USING (auth.is_admin());

-- Service role inserts audit logs (no user-level insert)
CREATE POLICY "audit_logs_service_insert" ON audit_logs
  FOR INSERT WITH CHECK (TRUE);
