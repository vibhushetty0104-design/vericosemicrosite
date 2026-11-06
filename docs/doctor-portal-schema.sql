-- ============================================================================
-- MERIDIAN VASCULAR CLINICAL PLATFORM — DOCTOR PORTAL DATABASE SCHEMA
-- PostgreSQL / Supabase Schema Definition with Row-Level Security (RLS)
-- Version: 1.0 (Clinical Enterprise Grade)
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. ENUMS
-- ----------------------------------------------------------------------------
CREATE TYPE doctor_specialty AS ENUM (
  'Vascular Surgery',
  'Interventional Radiology',
  'Phlebology',
  'Venous Wound Care',
  'Endovascular Surgery'
);

CREATE TYPE doctor_department AS ENUM (
  'Department of Peripheral Vascular Surgery',
  'Division of Interventional Radiology & Vein Care',
  'Venous & Lymphatic Medicine',
  'Wound Healing & Compression Therapy'
);

CREATE TYPE doctor_status AS ENUM (
  'Active',
  'Suspended',
  'Pending Approval'
);

CREATE TYPE doctor_role AS ENUM (
  'doctor',
  'lead_surgeon',
  'clinical_director'
);

CREATE TYPE consultation_mode AS ENUM (
  'In-Person OPD',
  'Video Teleconsultation',
  'Bedside / Cath Lab'
);

CREATE TYPE appointment_status AS ENUM (
  'Confirmed',
  'Pending',
  'Rescheduled',
  'Cancelled',
  'Completed',
  'No-show'
);

CREATE TYPE appointment_type AS ENUM (
  'Initial Evaluation',
  'Follow-up Consultation',
  'Duplex Ultrasound Review',
  'Pre-procedure Assessment (EVLA / Glue)',
  'Post-procedure Checkup',
  'Ulcer & Wound Care Review'
);

CREATE TYPE document_category AS ENUM (
  'Doppler ultrasound reports',
  'Medical prescriptions',
  'Laboratory reports',
  'Clinical photographs',
  'Discharge summaries',
  'Other medical documents'
);

CREATE TYPE document_review_status AS ENUM (
  'Pending Review',
  'Reviewed',
  'Action Required'
);

CREATE TYPE clinical_note_status AS ENUM (
  'Draft',
  'Finalized',
  'Amended'
);

CREATE TYPE notification_type AS ENUM (
  'new_appointment_request',
  'appointment_confirmed',
  'appointment_rescheduled',
  'upcoming_consultation',
  'document_uploaded',
  'pending_clinical_review'
);

-- ----------------------------------------------------------------------------
-- 2. DOCTORS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE doctors (
  id VARCHAR(32) PRIMARY KEY, -- e.g. 'MVD-BLR-0192'
  username VARCHAR(64) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  credentials VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  specialization doctor_specialty NOT NULL,
  department doctor_department NOT NULL,
  profile_photo_url TEXT NOT NULL,
  consultation_location VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(32) NOT NULL,
  medical_registration_number VARCHAR(64) NOT NULL,
  status doctor_status NOT NULL DEFAULT 'Active',
  timezone VARCHAR(64) NOT NULL DEFAULT 'Asia/Kolkata (IST)',
  role doctor_role NOT NULL DEFAULT 'doctor',
  two_factor_enabled BOOLEAN NOT NULL DEFAULT false,
  provisioned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. DOCTOR CREDENTIALS & SESSIONS
-- ----------------------------------------------------------------------------
CREATE TABLE doctor_credentials (
  doctor_id VARCHAR(32) PRIMARY KEY REFERENCES doctors(id) ON DELETE CASCADE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  failed_login_attempts INT NOT NULL DEFAULT 0,
  lockout_until TIMESTAMPTZ,
  password_changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reset_token TEXT,
  reset_token_expires_at TIMESTAMPTZ,
  totp_secret TEXT
);

CREATE TABLE doctor_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id VARCHAR(32) NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  token_hash TEXT UNIQUE NOT NULL,
  authenticated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address INET,
  mfa_verified BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_doctor_sessions_token ON doctor_sessions(token_hash);
CREATE INDEX idx_doctor_sessions_doctor ON doctor_sessions(doctor_id);

-- ----------------------------------------------------------------------------
-- 4. DOCTOR AVAILABILITY
-- ----------------------------------------------------------------------------
CREATE TABLE doctor_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id VARCHAR(32) UNIQUE NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  working_days INT[] NOT NULL DEFAULT '{1,2,3,4,5,6}', -- Mon-Sat
  working_hours_start TIME NOT NULL DEFAULT '09:00',
  working_hours_end TIME NOT NULL DEFAULT '17:00',
  slot_duration_minutes INT NOT NULL DEFAULT 30,
  breaks JSONB NOT NULL DEFAULT '[]'::jsonb,
  unavailable_periods JSONB NOT NULL DEFAULT '[]'::jsonb,
  max_appointments_per_slot INT NOT NULL DEFAULT 1,
  buffer_between_slots_minutes INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. PATIENTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE patients (
  id VARCHAR(32) PRIMARY KEY, -- e.g. 'MVP-2026-8841'
  name VARCHAR(255) NOT NULL,
  age INT NOT NULL,
  gender VARCHAR(16) NOT NULL,
  dob DATE NOT NULL,
  phone VARCHAR(32) NOT NULL,
  email VARCHAR(255),
  city VARCHAR(128) NOT NULL DEFAULT 'Bengaluru',
  emergency_contact JSONB NOT NULL DEFAULT '{}'::jsonb,
  blood_group VARCHAR(8),
  ceap_classification VARCHAR(64) NOT NULL,
  primary_diagnosis TEXT NOT NULL,
  medical_history TEXT[] NOT NULL DEFAULT '{}',
  allergies TEXT[] NOT NULL DEFAULT '{}',
  current_medications TEXT[] NOT NULL DEFAULT '{}',
  registered_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  assigned_doctor_id VARCHAR(32) REFERENCES doctors(id) ON DELETE SET NULL,
  review_status VARCHAR(64) NOT NULL DEFAULT 'Under Active Care',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_patients_assigned_doctor ON patients(assigned_doctor_id);
CREATE INDEX idx_patients_phone ON patients(phone);

-- ----------------------------------------------------------------------------
-- 6. APPOINTMENTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE appointments (
  id VARCHAR(32) PRIMARY KEY, -- e.g. 'APT-2026-0491'
  patient_id VARCHAR(32) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id VARCHAR(32) NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  appointment_type appointment_type NOT NULL,
  consultation_mode consultation_mode NOT NULL DEFAULT 'In-Person OPD',
  status appointment_status NOT NULL DEFAULT 'Confirmed',
  location VARCHAR(255) NOT NULL,
  meeting_link TEXT,
  reason_for_visit TEXT NOT NULL,
  administrative_notes TEXT,
  cancellation_reason TEXT,
  rescheduling_reason TEXT,
  linked_clinical_note_id VARCHAR(32),
  follow_up_date DATE,
  history JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent overlapping appointments for the same doctor unless status is Cancelled/No-show
  CONSTRAINT no_doctor_double_booking EXCLUDE USING gist (
    doctor_id WITH =,
    appointment_date WITH =,
    tsrange(
      (appointment_date + start_time),
      (appointment_date + end_time)
    ) WITH &&
  ) WHERE (status NOT IN ('Cancelled', 'No-show'))
);

CREATE INDEX idx_appointments_doctor_date ON appointments(doctor_id, appointment_date);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_status ON appointments(status);

-- ----------------------------------------------------------------------------
-- 7. PATIENT DOCUMENTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE patient_documents (
  id VARCHAR(32) PRIMARY KEY, -- e.g. 'DOC-2026-3301'
  patient_id VARCHAR(32) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  appointment_id VARCHAR(32) REFERENCES appointments(id) ON DELETE SET NULL,
  category document_category NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  mime_type VARCHAR(64) NOT NULL,
  storage_path TEXT NOT NULL, -- Private secure bucket path (e.g. 'patient_records/{patient_id}/{doc_id}')
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  uploaded_by VARCHAR(255) NOT NULL,
  review_status document_review_status NOT NULL DEFAULT 'Pending Review',
  reviewed_at TIMESTAMPTZ,
  reviewed_by_doctor_id VARCHAR(32) REFERENCES doctors(id) ON DELETE SET NULL,
  summary_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_patient_documents_patient ON patient_documents(patient_id);
CREATE INDEX idx_patient_documents_category ON patient_documents(category);

-- ----------------------------------------------------------------------------
-- 8. CLINICAL NOTES & NOTE VERSIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE clinical_notes (
  id VARCHAR(32) PRIMARY KEY, -- e.g. 'NOTE-2026-1102'
  patient_id VARCHAR(32) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  appointment_id VARCHAR(32) NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  doctor_id VARCHAR(32) NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
  consultation_date DATE NOT NULL,
  status clinical_note_status NOT NULL DEFAULT 'Draft',
  presenting_complaint TEXT NOT NULL DEFAULT '',
  clinical_observations TEXT NOT NULL DEFAULT '',
  examination_findings TEXT NOT NULL DEFAULT '',
  assessment TEXT NOT NULL DEFAULT '',
  treatment_plan TEXT NOT NULL DEFAULT '',
  follow_up_recommendations TEXT NOT NULL DEFAULT '',
  additional_notes TEXT NOT NULL DEFAULT '',
  signed_at TIMESTAMPTZ,
  signed_by_doctor_name VARCHAR(255),
  signature_verification_hash TEXT,
  version INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE clinical_note_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  note_id VARCHAR(32) NOT NULL REFERENCES clinical_notes(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  amended_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  amended_by_doctor_id VARCHAR(32) NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
  amended_by_doctor_name VARCHAR(255) NOT NULL,
  amendment_reason TEXT NOT NULL,
  previous_content JSONB NOT NULL
);

CREATE INDEX idx_clinical_notes_patient ON clinical_notes(patient_id);
CREATE INDEX idx_clinical_notes_appointment ON clinical_notes(appointment_id);
CREATE INDEX idx_clinical_note_versions_note ON clinical_note_versions(note_id);

-- ----------------------------------------------------------------------------
-- 9. DOCTOR NOTIFICATIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE doctor_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id VARCHAR(32) NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  priority VARCHAR(16) NOT NULL DEFAULT 'normal',
  read BOOLEAN NOT NULL DEFAULT false,
  dismissed BOOLEAN NOT NULL DEFAULT false,
  related_entity_type VARCHAR(32),
  related_entity_id VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_doctor ON doctor_notifications(doctor_id, read);

-- ----------------------------------------------------------------------------
-- 10. AUDIT LOGS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  doctor_id VARCHAR(32) NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  doctor_name VARCHAR(255) NOT NULL,
  action VARCHAR(64) NOT NULL,
  entity_type VARCHAR(64) NOT NULL,
  entity_id VARCHAR(64) NOT NULL,
  details TEXT NOT NULL,
  ip_address INET
);

CREATE INDEX idx_audit_logs_doctor ON audit_logs(doctor_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);

-- ----------------------------------------------------------------------------
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------

-- Enable RLS on all sensitive clinical tables
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_note_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Doctors can view their own profile
CREATE POLICY doctor_self_read ON doctors
  FOR SELECT
  USING (auth.uid()::text = id);

-- Policy: Only doctor themselves can read/modify their availability
CREATE POLICY doctor_availability_policy ON doctor_availability
  FOR ALL
  USING (auth.uid()::text = doctor_id);

-- Policy: Doctors can only view patients assigned to them or in their department consultations
CREATE POLICY doctor_patient_read ON patients
  FOR SELECT
  USING (
    auth.uid()::text = assigned_doctor_id OR
    EXISTS (
      SELECT 1 FROM appointments a
      WHERE a.patient_id = patients.id AND a.doctor_id = auth.uid()::text
    )
  );

-- Policy: Doctors can only manage their own appointments
CREATE POLICY doctor_appointments_policy ON appointments
  FOR ALL
  USING (auth.uid()::text = doctor_id);

-- Policy: Doctors can access patient documents only if they have an active clinical relationship
CREATE POLICY doctor_documents_policy ON patient_documents
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM appointments a
      WHERE a.patient_id = patient_documents.patient_id AND a.doctor_id = auth.uid()::text
    )
  );

-- Policy: Doctors can create and update notes for their consultations
CREATE POLICY doctor_clinical_notes_policy ON clinical_notes
  FOR ALL
  USING (auth.uid()::text = doctor_id);

-- Policy: Audit logs are append-only; doctors cannot modify or delete audit entries
CREATE POLICY audit_logs_insert ON audit_logs
  FOR INSERT
  WITH CHECK (auth.uid()::text = doctor_id);

CREATE POLICY audit_logs_select ON audit_logs
  FOR SELECT
  USING (auth.uid()::text = doctor_id);
