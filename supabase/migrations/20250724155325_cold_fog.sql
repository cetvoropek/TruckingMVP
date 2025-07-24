/*
  # TruckRecruit AI Database Schema

  1. New Tables
    - `profiles` - Extended user profile information
    - `drivers` - Driver-specific information and preferences
    - `recruiters` - Recruiter company and subscription information
    - `driver_documents` - Document storage and verification status
    - `job_postings` - Job opportunities posted by recruiters
    - `applications` - Driver applications to jobs
    - `messages` - Communication between drivers and recruiters
    - `interviews` - Scheduled interviews
    - `contact_unlocks` - Track when recruiters unlock driver contacts
    - `subscriptions` - Recruiter subscription management
    - `analytics_events` - Track user interactions for analytics

  2. Security
    - Enable RLS on all tables
    - Add policies for multi-tenant data isolation
    - Ensure recruiters only see their own data
    - Drivers only see their own information

  3. Features
    - Real-time messaging
    - Document verification workflow
    - Subscription management
    - Analytics tracking
    - AI fit scoring system
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('driver', 'recruiter', 'admin');
CREATE TYPE availability_status AS ENUM ('available', 'employed', 'seeking');
CREATE TYPE application_status AS ENUM ('pending', 'reviewed', 'interviewed', 'hired', 'rejected');
CREATE TYPE interview_type AS ENUM ('phone', 'video', 'in-person');
CREATE TYPE interview_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no-show');
CREATE TYPE document_type AS ENUM ('license', 'medical', 'twic', 'hazmat', 'cv', 'other');
CREATE TYPE subscription_type AS ENUM ('starter', 'pro', 'enterprise', 'pay-per-contact');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'trial');

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role user_role NOT NULL,
  profile_image text,
  phone text,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  experience_years integer DEFAULT 0,
  license_types text[] DEFAULT '{}',
  twic_card boolean DEFAULT false,
  hazmat_endorsement boolean DEFAULT false,
  availability availability_status DEFAULT 'available',
  preferred_routes text[] DEFAULT '{}',
  equipment_experience text[] DEFAULT '{}',
  fit_score decimal(3,1) DEFAULT 0.0,
  profile_completion integer DEFAULT 0,
  documents_verified boolean DEFAULT false,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Recruiters table
CREATE TABLE IF NOT EXISTS recruiters (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  company_size text,
  website text,
  contacts_unlocked integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  recruiter_id uuid REFERENCES recruiters(id) ON DELETE CASCADE,
  type subscription_type NOT NULL,
  status subscription_status NOT NULL,
  contacts_limit integer,
  contacts_used integer DEFAULT 0,
  price_monthly decimal(10,2),
  current_period_start timestamptz DEFAULT now(),
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Driver documents table
CREATE TABLE IF NOT EXISTS driver_documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id uuid REFERENCES drivers(id) ON DELETE CASCADE,
  name text NOT NULL,
  type document_type NOT NULL,
  file_name text NOT NULL,
  file_url text,
  file_size text,
  verified boolean DEFAULT false,
  expiry_date date,
  uploaded_at timestamptz DEFAULT now(),
  verified_at timestamptz
);

-- Job postings table
CREATE TABLE IF NOT EXISTS job_postings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  recruiter_id uuid REFERENCES recruiters(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  job_type text NOT NULL,
  salary_min integer,
  salary_max integer,
  requirements text[] DEFAULT '{}',
  benefits text[] DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id uuid REFERENCES drivers(id) ON DELETE CASCADE,
  job_id uuid REFERENCES job_postings(id) ON DELETE CASCADE,
  recruiter_id uuid REFERENCES recruiters(id) ON DELETE CASCADE,
  status application_status DEFAULT 'pending',
  cover_letter text,
  notes text,
  applied_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  application_id uuid REFERENCES applications(id) ON DELETE SET NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  recruiter_id uuid REFERENCES recruiters(id) ON DELETE CASCADE,
  driver_id uuid REFERENCES drivers(id) ON DELETE CASCADE,
  application_id uuid REFERENCES applications(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer DEFAULT 30,
  type interview_type NOT NULL,
  status interview_status DEFAULT 'scheduled',
  meeting_url text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Contact unlocks table
CREATE TABLE IF NOT EXISTS contact_unlocks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  recruiter_id uuid REFERENCES recruiters(id) ON DELETE CASCADE,
  driver_id uuid REFERENCES drivers(id) ON DELETE CASCADE,
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE(recruiter_id, driver_id)
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiters ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Drivers policies
CREATE POLICY "Drivers can read own data"
  ON drivers FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Drivers can update own data"
  ON drivers FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Recruiters can read driver profiles"
  ON drivers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'recruiter'
    )
  );

-- Recruiters policies
CREATE POLICY "Recruiters can read own data"
  ON recruiters FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Recruiters can update own data"
  ON recruiters FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Subscriptions policies
CREATE POLICY "Recruiters can read own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (
    recruiter_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Driver documents policies
CREATE POLICY "Drivers can manage own documents"
  ON driver_documents FOR ALL
  TO authenticated
  USING (driver_id = auth.uid());

CREATE POLICY "Recruiters can read driver documents"
  ON driver_documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'recruiter'
    )
  );

-- Job postings policies
CREATE POLICY "Recruiters can manage own job postings"
  ON job_postings FOR ALL
  TO authenticated
  USING (recruiter_id = auth.uid());

CREATE POLICY "Drivers can read active job postings"
  ON job_postings FOR SELECT
  TO authenticated
  USING (
    active = true AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'driver'
    )
  );

-- Applications policies
CREATE POLICY "Drivers can manage own applications"
  ON applications FOR ALL
  TO authenticated
  USING (driver_id = auth.uid());

CREATE POLICY "Recruiters can read applications to their jobs"
  ON applications FOR SELECT
  TO authenticated
  USING (recruiter_id = auth.uid());

CREATE POLICY "Recruiters can update applications to their jobs"
  ON applications FOR UPDATE
  TO authenticated
  USING (recruiter_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can read own messages"
  ON messages FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update own sent messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (sender_id = auth.uid());

-- Interviews policies
CREATE POLICY "Recruiters can manage own interviews"
  ON interviews FOR ALL
  TO authenticated
  USING (recruiter_id = auth.uid());

CREATE POLICY "Drivers can read their interviews"
  ON interviews FOR SELECT
  TO authenticated
  USING (driver_id = auth.uid());

-- Contact unlocks policies
CREATE POLICY "Recruiters can manage own contact unlocks"
  ON contact_unlocks FOR ALL
  TO authenticated
  USING (recruiter_id = auth.uid());

-- Analytics events policies
CREATE POLICY "Users can create own analytics events"
  ON analytics_events FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read own analytics events"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_drivers_availability ON drivers(availability);
CREATE INDEX IF NOT EXISTS idx_drivers_fit_score ON drivers(fit_score DESC);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_recruiter ON applications(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_interviews_recruiter ON interviews(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_interviews_scheduled_at ON interviews(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_contact_unlocks_recruiter ON contact_unlocks(recruiter_id);

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recruiters_updated_at BEFORE UPDATE ON recruiters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_postings_updated_at BEFORE UPDATE ON job_postings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON interviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();