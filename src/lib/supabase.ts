import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

// Check if we're in demo mode (no real Supabase credentials)
const isDemoMode = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('demo');

// Create a mock Supabase client for demo mode
const createMockSupabaseClient = () => {
  const mockAuth = {
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      // Demo credentials
      const demoUsers = {
        'recruiter@demo.com': { id: 'recruiter-1', role: 'recruiter', name: 'Demo Recruiter' },
        'driver@demo.com': { id: 'driver-1', role: 'driver', name: 'Demo Driver' },
        'admin@demo.com': { id: 'admin-1', role: 'admin', name: 'Demo Admin' }
      };

      if (password !== 'password123') {
        return { data: null, error: { message: 'Invalid credentials' } };
      }

      const user = demoUsers[email as keyof typeof demoUsers];
      if (!user) {
        return { data: null, error: { message: 'User not found' } };
      }

      const mockUser = {
        id: user.id,
        email,
        user_metadata: { name: user.name, role: user.role }
      };

      // Store in localStorage for persistence
      localStorage.setItem('demo_user', JSON.stringify(mockUser));
      localStorage.setItem('demo_session', JSON.stringify({ user: mockUser, access_token: 'demo-token' }));

      return {
        data: {
          user: mockUser,
          session: { user: mockUser, access_token: 'demo-token' }
        },
        error: null
      };
    },

    signUp: async ({ email, password, options }: any) => {
      if (password.length < 6) {
        return { data: null, error: { message: 'Password must be at least 6 characters' } };
      }

      const userData = options?.data || {};
      const mockUser = {
        id: `user-${Date.now()}`,
        email,
        user_metadata: userData
      };

      localStorage.setItem('demo_user', JSON.stringify(mockUser));
      localStorage.setItem('demo_session', JSON.stringify({ user: mockUser, access_token: 'demo-token' }));

      return {
        data: {
          user: mockUser,
          session: { user: mockUser, access_token: 'demo-token' }
        },
        error: null
      };
    },

    signOut: async () => {
      localStorage.removeItem('demo_user');
      localStorage.removeItem('demo_session');
      return { error: null };
    },

    getSession: async () => {
      const session = localStorage.getItem('demo_session');
      return {
        data: { session: session ? JSON.parse(session) : null },
        error: null
      };
    },

    getUser: async () => {
      const user = localStorage.getItem('demo_user');
      return {
        data: { user: user ? JSON.parse(user) : null },
        error: null
      };
    },

    onAuthStateChange: (callback: Function) => {
      // Simulate auth state change
      setTimeout(() => {
        const session = localStorage.getItem('demo_session');
        callback('SIGNED_IN', session ? JSON.parse(session) : null);
      }, 100);

      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    },

    resetPasswordForEmail: async (email: string) => {
      console.log('Password reset requested for:', email);
      return { error: null };
    }
  };

  const mockFrom = (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: async () => {
          // Return mock profile data based on user
          const user = JSON.parse(localStorage.getItem('demo_user') || '{}');
          if (table === 'profiles' && user.id) {
            return {
              data: {
                id: user.id,
                email: user.email,
                name: user.user_metadata?.name || 'Demo User',
                role: user.user_metadata?.role || 'driver',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              },
              error: null
            };
          }
          return { data: null, error: { message: 'Not found' } };
        },
        limit: (count: number) => ({
          order: (column: string, options?: any) => ({
            then: async (callback: Function) => {
              return callback({ data: [], error: null });
            }
          })
        })
      }),
      gte: (column: string, value: any) => ({
        order: (column: string, options?: any) => ({
          limit: (count: number) => ({
            then: async (callback: Function) => {
              return callback({ data: [], error: null });
            }
          })
        })
      }),
      order: (column: string, options?: any) => ({
        limit: (count: number) => ({
          then: async (callback: Function) => {
            return callback({ data: [], error: null });
          }
        })
      })
    }),
    insert: (data: any) => ({
      select: () => ({
        single: async () => ({ data, error: null })
      }),
      then: async (callback: Function) => {
        return callback({ data, error: null });
      }
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          single: async () => ({ data, error: null })
        })
      })
    })
  });

  return {
    auth: mockAuth,
    from: mockFrom
  };
};

export const supabase: any = isDemoMode 
  ? createMockSupabaseClient()
  : createClient(supabaseUrl, supabaseAnonKey, {
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
    });

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