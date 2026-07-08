-- ============================================================
-- NirogiTanman - Initial Database Schema
-- Migration: 001_initial_schema
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";  -- for geo-location queries
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- for fuzzy text search

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('client', 'partner', 'admin', 'super_admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');
CREATE TYPE verification_status AS ENUM ('pending', 'under_review', 'verified', 'rejected', 'suspended');
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled');
CREATE TYPE appointment_mode AS ENUM ('in_person', 'video', 'phone', 'home_visit');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded', 'disputed');
CREATE TYPE payment_method AS ENUM ('upi', 'card', 'netbanking', 'wallet', 'cash', 'insurance');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled', 'returned');
CREATE TYPE order_type AS ENUM ('medicine', 'lab_test', 'equipment', 'other');
CREATE TYPE record_type AS ENUM ('prescription', 'lab_report', 'imaging', 'discharge_summary', 'vaccination', 'other');
CREATE TYPE gender AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');
CREATE TYPE blood_group AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
CREATE TYPE day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
CREATE TYPE notification_type AS ENUM (
  'appointment_booked', 'appointment_confirmed', 'appointment_cancelled',
  'appointment_reminder', 'prescription_added', 'report_ready',
  'order_update', 'payment_success', 'payment_failed',
  'verification_update', 'system'
);

-- ============================================================
-- PROFILES
-- Core user table linked to Supabase Auth
-- ============================================================

CREATE TABLE profiles (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id      UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email             TEXT UNIQUE NOT NULL,
  full_name         TEXT NOT NULL,
  phone             TEXT,
  avatar_url        TEXT,
  role              user_role NOT NULL DEFAULT 'client',
  status            user_status NOT NULL DEFAULT 'active',
  date_of_birth     DATE,
  gender            gender,
  blood_group       blood_group,
  address           TEXT,
  city              TEXT,
  state             TEXT,
  country           TEXT NOT NULL DEFAULT 'India',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_auth_user_id ON profiles(auth_user_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_status ON profiles(status);

-- ============================================================
-- PARTNER TYPES
-- Data-driven: add new types without schema changes
-- ============================================================

CREATE TABLE partner_types (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT UNIQUE NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  icon        TEXT,
  description TEXT,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_partner_types_slug ON partner_types(slug);
CREATE INDEX idx_partner_types_active ON partner_types(active);

-- Seed partner types
INSERT INTO partner_types (name, slug, icon, sort_order) VALUES
  ('Doctor',             'doctor',           '🩺', 1),
  ('Hospital',           'hospital',         '🏥', 2),
  ('Clinic',             'clinic',           '🏨', 3),
  ('Laboratory',         'laboratory',       '🔬', 4),
  ('Pharmacy',           'pharmacy',         '💊', 5),
  ('Dietitian',          'dietitian',        '🥗', 6),
  ('Nutritionist',       'nutritionist',     '🥦', 7),
  ('Psychologist',       'psychologist',     '🧠', 8),
  ('Yoga Trainer',       'yoga-trainer',     '🧘', 9),
  ('Fitness Coach',      'fitness-coach',    '💪', 10),
  ('Home Care Provider', 'home-care',        '🏠', 11),
  ('Ambulance Service',  'ambulance',        '🚑', 12),
  ('Insurance Partner',  'insurance',        '📋', 13),
  ('NGO',                'ngo',              '❤️', 14),
  ('Blood Bank',         'blood-bank',       '🩸', 15);

-- ============================================================
-- PARTNERS
-- Business profiles for all service providers
-- ============================================================

CREATE TABLE partners (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id            UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  partner_type_id       UUID NOT NULL REFERENCES partner_types(id),
  business_name         TEXT NOT NULL,
  license_number        TEXT,
  verification_status   verification_status NOT NULL DEFAULT 'pending',
  specialization        TEXT[],
  experience_years      INTEGER,
  bio                   TEXT,
  phone                 TEXT,
  email                 TEXT,
  website               TEXT,
  address               TEXT,
  city                  TEXT,
  state                 TEXT,
  country               TEXT NOT NULL DEFAULT 'India',
  latitude              DOUBLE PRECISION,
  longitude             DOUBLE PRECISION,
  geolocation           GEOGRAPHY(POINT, 4326),
  logo_url              TEXT,
  cover_url             TEXT,
  rating                DECIMAL(3,2) NOT NULL DEFAULT 0,
  total_reviews         INTEGER NOT NULL DEFAULT 0,
  is_available          BOOLEAN NOT NULL DEFAULT TRUE,
  consultation_fee      DECIMAL(10,2),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_partners_profile_id ON partners(profile_id);
CREATE INDEX idx_partners_partner_type_id ON partners(partner_type_id);
CREATE INDEX idx_partners_verification_status ON partners(verification_status);
CREATE INDEX idx_partners_city ON partners(city);
CREATE INDEX idx_partners_rating ON partners(rating DESC);
CREATE INDEX idx_partners_geolocation ON partners USING GIST(geolocation);
CREATE INDEX idx_partners_business_name_trgm ON partners USING GIN(business_name gin_trgm_ops);

-- ============================================================
-- SERVICE CATEGORIES
-- ============================================================

CREATE TABLE service_categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT UNIQUE NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  icon        TEXT,
  description TEXT,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO service_categories (name, slug, icon, sort_order) VALUES
  ('Consultation',     'consultation',   '🩺', 1),
  ('Diagnostics',      'diagnostics',    '🔬', 2),
  ('Pharmacy',         'pharmacy',       '💊', 3),
  ('Mental Health',    'mental-health',  '🧠', 4),
  ('Wellness',         'wellness',       '🌿', 5),
  ('Emergency',        'emergency',      '🚨', 6),
  ('Home Healthcare',  'home-care',      '🏠', 7),
  ('Telemedicine',     'telemedicine',   '💻', 8);

-- ============================================================
-- SERVICES
-- ============================================================

CREATE TABLE services (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES service_categories(id),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  icon        TEXT,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_services_category_id ON services(category_id);
CREATE INDEX idx_services_slug ON services(slug);

-- ============================================================
-- PARTNER SERVICES
-- What each partner offers and their pricing
-- ============================================================

CREATE TABLE partner_services (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id       UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  service_id       UUID NOT NULL REFERENCES services(id),
  price            DECIMAL(10,2),
  duration_minutes INTEGER DEFAULT 30,
  description      TEXT,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(partner_id, service_id)
);

CREATE INDEX idx_partner_services_partner_id ON partner_services(partner_id);
CREATE INDEX idx_partner_services_service_id ON partner_services(service_id);

-- ============================================================
-- PARTNER AVAILABILITY
-- Weekly schedule
-- ============================================================

CREATE TABLE partner_availability (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id  UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  day_of_week day_of_week NOT NULL,
  start_time  TIME NOT NULL,
  end_time    TIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(partner_id, day_of_week)
);

CREATE INDEX idx_partner_availability_partner_id ON partner_availability(partner_id);

-- ============================================================
-- PARTNER UNAVAILABILITY
-- Specific date overrides (holidays, leaves)
-- ============================================================

CREATE TABLE partner_unavailability (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id  UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  reason      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(partner_id, date)
);

-- ============================================================
-- APPOINTMENTS
-- ============================================================

CREATE TABLE appointments (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id             UUID NOT NULL REFERENCES profiles(id),
  partner_id            UUID NOT NULL REFERENCES partners(id),
  partner_service_id    UUID REFERENCES partner_services(id),
  status                appointment_status NOT NULL DEFAULT 'pending',
  mode                  appointment_mode NOT NULL DEFAULT 'in_person',
  scheduled_at          TIMESTAMPTZ NOT NULL,
  duration_minutes      INTEGER NOT NULL DEFAULT 30,
  notes                 TEXT,
  symptoms              TEXT,
  cancellation_reason   TEXT,
  video_call_url        TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_appointments_client_id ON appointments(client_id);
CREATE INDEX idx_appointments_partner_id ON appointments(partner_id);
CREATE INDEX idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX idx_appointments_status ON appointments(status);

-- ============================================================
-- MEDICAL RECORDS
-- ============================================================

CREATE TABLE medical_records (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id       UUID NOT NULL REFERENCES profiles(id),
  partner_id      UUID REFERENCES partners(id),
  appointment_id  UUID REFERENCES appointments(id),
  title           TEXT NOT NULL,
  description     TEXT,
  file_url        TEXT,
  record_type     record_type NOT NULL DEFAULT 'other',
  record_date     DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_medical_records_client_id ON medical_records(client_id);
CREATE INDEX idx_medical_records_appointment_id ON medical_records(appointment_id);

-- ============================================================
-- PRESCRIPTIONS
-- ============================================================

CREATE TABLE prescriptions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id  UUID NOT NULL REFERENCES appointments(id),
  client_id       UUID NOT NULL REFERENCES profiles(id),
  partner_id      UUID NOT NULL REFERENCES partners(id),
  diagnosis       TEXT,
  instructions    TEXT,
  follow_up_date  DATE,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_prescriptions_client_id ON prescriptions(client_id);
CREATE INDEX idx_prescriptions_appointment_id ON prescriptions(appointment_id);

CREATE TABLE prescription_medicines (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  medicine_name   TEXT NOT NULL,
  dosage          TEXT NOT NULL,
  frequency       TEXT NOT NULL,
  duration        TEXT NOT NULL,
  instructions    TEXT
);

-- ============================================================
-- ORDERS
-- Medicines, lab tests, etc.
-- ============================================================

CREATE TABLE orders (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id        UUID NOT NULL REFERENCES profiles(id),
  partner_id       UUID REFERENCES partners(id),
  status           order_status NOT NULL DEFAULT 'pending',
  order_type       order_type NOT NULL DEFAULT 'medicine',
  total_amount     DECIMAL(10,2) NOT NULL DEFAULT 0,
  delivery_address TEXT,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_client_id ON orders(client_id);
CREATE INDEX idx_orders_partner_id ON orders(partner_id);
CREATE INDEX idx_orders_status ON orders(status);

CREATE TABLE order_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  item_name   TEXT NOT NULL,
  quantity    INTEGER NOT NULL DEFAULT 1,
  unit_price  DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL
);

-- ============================================================
-- PAYMENTS
-- ============================================================

CREATE TABLE payments (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id                 UUID NOT NULL REFERENCES profiles(id),
  partner_id                UUID REFERENCES partners(id),
  appointment_id            UUID REFERENCES appointments(id),
  order_id                  UUID REFERENCES orders(id),
  amount                    DECIMAL(10,2) NOT NULL,
  currency                  TEXT NOT NULL DEFAULT 'INR',
  status                    payment_status NOT NULL DEFAULT 'pending',
  payment_method            payment_method,
  gateway_transaction_id    TEXT,
  gateway_response          JSONB,
  platform_fee              DECIMAL(10,2) DEFAULT 0,
  partner_payout            DECIMAL(10,2),
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_client_id ON payments(client_id);
CREATE INDEX idx_payments_partner_id ON payments(partner_id);
CREATE INDEX idx_payments_appointment_id ON payments(appointment_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ============================================================
-- REVIEWS
-- ============================================================

CREATE TABLE reviews (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id       UUID NOT NULL REFERENCES profiles(id),
  partner_id      UUID NOT NULL REFERENCES partners(id),
  appointment_id  UUID REFERENCES appointments(id),
  rating          INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment         TEXT,
  reply           TEXT,
  is_visible      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(client_id, appointment_id)
);

CREATE INDEX idx_reviews_partner_id ON reviews(partner_id);
CREATE INDEX idx_reviews_client_id ON reviews(client_id);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type        notification_type NOT NULL DEFAULT 'system',
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  data        JSONB,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================================
-- BLOG POSTS (CMS)
-- ============================================================

CREATE TABLE blog_posts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id       UUID NOT NULL REFERENCES profiles(id),
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  excerpt         TEXT,
  content         TEXT NOT NULL,
  cover_image_url TEXT,
  tags            TEXT[] DEFAULT '{}',
  published       BOOLEAN NOT NULL DEFAULT FALSE,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN(tags);

-- ============================================================
-- AUDIT LOGS
-- ============================================================

CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES profiles(id),
  action      TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id   UUID,
  old_values  JSONB,
  new_values  JSONB,
  ip_address  INET,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_partners_updated_at BEFORE UPDATE ON partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_prescriptions_updated_at BEFORE UPDATE ON prescriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (auth_user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update partner rating when a review is added
CREATE OR REPLACE FUNCTION update_partner_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE partners
  SET
    rating = (
      SELECT ROUND(AVG(rating)::NUMERIC, 2)
      FROM reviews
      WHERE partner_id = NEW.partner_id AND is_visible = TRUE
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews
      WHERE partner_id = NEW.partner_id AND is_visible = TRUE
    )
  WHERE id = NEW.partner_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_partner_rating
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_partner_rating();

-- Update geolocation point when lat/lng changes
CREATE OR REPLACE FUNCTION update_partner_geolocation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.geolocation = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::GEOGRAPHY;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_partner_geolocation
  BEFORE INSERT OR UPDATE OF latitude, longitude ON partners
  FOR EACH ROW EXECUTE FUNCTION update_partner_geolocation();
