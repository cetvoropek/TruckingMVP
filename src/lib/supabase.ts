import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  );
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch {
  throw new Error('Invalid VITE_SUPABASE_URL format. Please provide a valid URL.');
}

export const supabase: SupabaseClient<Database> = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'X-Client-Info': 'trucking-recruitment-platform@1.0.0'
      }
    }
  }
);

// Database types based on the schema
export interface Profile {
  id: string;
  email: string;
  name: string;
  role: 'driver' | 'recruiter' | 'admin';
  profile_image?: string;
  phone?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface Driver {
  id: string;
  experience_years: number;
  license_types: string[];
  twic_card: boolean;
  hazmat_endorsement: boolean;
  availability: 'available' | 'employed' | 'seeking';
  preferred_routes: string[];
  equipment_experience: string[];
  fit_score: number;
  profile_completion: number;
  documents_verified: boolean;
  bio?: string;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface Recruiter {
  id: string;
  company_name: string;
  company_size?: string;
  website?: string;
  contacts_unlocked: number;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface Subscription {
  id: string;
  recruiter_id: string;
  type: 'starter' | 'pro' | 'enterprise' | 'pay-per-contact';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  contacts_limit?: number;
  contacts_used: number;
  price_monthly?: number;
  current_period_start: string;
  current_period_end?: string;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  driver_id: string;
  job_id: string;
  recruiter_id: string;
  status: 'pending' | 'reviewed' | 'interviewed' | 'hired' | 'rejected';
  cover_letter?: string;
  notes?: string;
  applied_at: string;
  updated_at: string;
  driver?: Driver;
  job_posting?: JobPosting;
}

export interface JobPosting {
  id: string;
  recruiter_id: string;
  title: string;
  description: string;
  location: string;
  job_type: string;
  salary_min?: number;
  salary_max?: number;
  requirements: string[];
  benefits: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  application_id?: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: Profile;
  recipient?: Profile;
}

export interface Interview {
  id: string;
  recruiter_id: string;
  driver_id: string;
  application_id?: string;
  title: string;
  description?: string;
  scheduled_at: string;
  duration_minutes: number;
  type: 'phone' | 'video' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  meeting_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  driver?: Driver;
}

export interface ContactUnlock {
  id: string;
  recruiter_id: string;
  driver_id: string;
  unlocked_at: string;
}

export interface AnalyticsEvent {
  id: string;
  user_id: string;
  event_type: string;
  event_data: Record<string, any>;
  created_at: string;
}

// Helper function to get current user ID
export const getCurrentUserId = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
};

// Helper function to handle database errors
export const handleDatabaseError = (error: any, context: string) => {
  console.error(`Database error in ${context}:`, error);
  
  if (error?.code === 'PGRST116') {
    throw new Error('No data found');
  }
  
  if (error?.code === '23505') {
    throw new Error('This record already exists');
  }
  
  if (error?.code === '23503') {
    throw new Error('Referenced record does not exist');
  }
  
  throw new Error(error?.message || 'An unexpected database error occurred');
};