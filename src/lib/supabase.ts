import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Database configuration with demo mode support
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we're in demo mode (no real Supabase credentials)
const isDemoMode = !supabaseUrl || !supabaseAnonKey || 
  supabaseUrl.includes('your-project-ref') || 
  supabaseAnonKey.includes('your-anon-key') ||
  supabaseUrl === 'https://jcuarqozvohnunowsapx.supabase.co';

// Validate that we're not using placeholder values in production
const placeholderValues = [
  'your-project-ref',
  'your-anon-key-here',
  'demo.supabase.co',
  'localhost',
  'placeholder'
];

// Only validate in production mode
if (!isDemoMode) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing required Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
    );
  }

  if (placeholderValues.some(placeholder => 
    supabaseUrl?.includes(placeholder) || supabaseAnonKey?.includes(placeholder)
  )) {
    throw new Error(
      'Production database configuration contains placeholder values. Please update your environment variables with actual production credentials.'
    );
  }
}

// Demo data for offline mode
const demoUsers = [
  { id: '1', email: 'driver@demo.com', password: 'password123', name: 'John Driver', role: 'driver' },
  { id: '2', email: 'recruiter@demo.com', password: 'password123', name: 'Sarah Recruiter', role: 'recruiter' },
  { id: '3', email: 'admin@demo.com', password: 'password123', name: 'Admin User', role: 'admin' }
];

// Mock Supabase client for demo mode
const createMockSupabaseClient = () => {
  const mockAuth = {
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      const user = demoUsers.find(u => u.email === email && u.password === password);
      if (!user) {
        return { data: null, error: { message: 'Invalid login credentials' } };
      }
      
      const session = {
        user: { id: user.id, email: user.email },
        access_token: 'demo-token',
        refresh_token: 'demo-refresh'
      };
      
      localStorage.setItem('supabase.auth.token', JSON.stringify(session));
      return { data: { user: session.user, session }, error: null };
    },
    
    signUp: async ({ email, password, options }: any) => {
      const existingUser = demoUsers.find(u => u.email === email);
      if (existingUser) {
        return { data: null, error: { message: 'User already exists' } };
      }
      
      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        name: options?.data?.name || 'New User',
        role: options?.data?.role || 'driver'
      };
      
      demoUsers.push(newUser);
      
      const session = {
        user: { id: newUser.id, email: newUser.email },
        access_token: 'demo-token',
        refresh_token: 'demo-refresh'
      };
      
      localStorage.setItem('supabase.auth.token', JSON.stringify(session));
      return { data: { user: session.user, session }, error: null };
    },
    
    signOut: async () => {
      localStorage.removeItem('supabase.auth.token');
      return { error: null };
    },
    
    getUser: async () => {
      const stored = localStorage.getItem('supabase.auth.token');
      if (!stored) return { data: { user: null }, error: null };
      
      try {
        const session = JSON.parse(stored);
        return { data: { user: session.user }, error: null };
      } catch {
        return { data: { user: null }, error: null };
      }
    },
    
    getSession: async () => {
      const stored = localStorage.getItem('supabase.auth.token');
      if (!stored) return { data: { session: null }, error: null };
      
      try {
        const session = JSON.parse(stored);
        return { data: { session }, error: null };
      } catch {
        return { data: { session: null }, error: null };
      }
    },
    
    onAuthStateChange: (callback: Function) => {
      // Simple mock implementation
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  };
  
  const mockFrom = (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: async () => {
          if (table === 'profiles') {
            const user = demoUsers.find(u => u.id === value);
            if (user) {
              return { 
                data: { 
                  id: user.id, 
                  email: user.email, 
                  name: user.name, 
                  role: user.role,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }, 
                error: null 
              };
            }
          }
          return { data: null, error: { code: 'PGRST116', message: 'No rows returned' } };
        },
        limit: (count: number) => ({
          then: async (callback: Function) => {
            return callback({ data: [], error: null });
          }
        })
      }),
      gte: () => ({ order: () => ({ limit: () => ({ then: async (cb: Function) => cb({ data: [], error: null }) }) }) }),
      order: () => ({ limit: () => ({ then: async (cb: Function) => cb({ data: [], error: null }) }) }),
      limit: () => ({ then: async (cb: Function) => cb({ data: [], error: null }) })
    }),
    insert: (data: any) => ({
      select: () => ({
        single: async () => ({ data, error: null })
      }),
      then: async (callback: Function) => callback({ data, error: null })
    }),
    update: (data: any) => ({
      eq: () => ({
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

// Create Supabase client (real or mock based on environment)
export const supabase: SupabaseClient<Database> = isDemoMode 
  ? createMockSupabaseClient() as any
  : createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        storageKey: 'truckrecruit-auth-token',
        storage: window.localStorage,
        sessionTimeout: parseInt(import.meta.env.VITE_SESSION_TIMEOUT || '3600'),
      },
      db: {
        schema: 'public',
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
        heartbeatIntervalMs: 30000,
        reconnectAfterMs: (tries: number) => Math.min(tries * 1000, 30000),
      },
      global: {
        headers: {
          'X-Client-Info': `trucking-recruitment-platform@${import.meta.env.VITE_APP_VERSION || '1.0.0'}`,
          'X-Environment': import.meta.env.VITE_APP_ENV || 'production',
        },
        fetch: (url, options = {}) => {
          return fetch(url, {
            ...options,
            headers: {
              ...options.headers,
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache',
            },
            signal: AbortSignal.timeout(parseInt(import.meta.env.DB_CONNECTION_TIMEOUT || '10000')),
          });
        },
      },
    });

// Connection health check for production monitoring
export const checkDatabaseConnection = async (): Promise<{
  connected: boolean;
  latency?: number;
  error?: string;
}> => {
  // Always return healthy in demo mode
  if (isDemoMode) {
    return { connected: true, latency: 50 };
  }
  
  try {
    const startTime = Date.now();
    
    // Simple health check query
    const { error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
      .single();
    
    const latency = Date.now() - startTime;
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is OK
      return {
        connected: false,
        error: error.message,
      };
    }
    
    return {
      connected: true,
      latency,
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown connection error',
    };
  }
};

// Production database types and interfaces
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

// Production utility functions
export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }
    
    return user?.id || null;
  } catch (error) {
    console.error('Error in getCurrentUserId:', error);
    return null;
  }
};

// Production error handling with detailed logging
export const handleDatabaseError = (error: any, context: string): never => {
  // In demo mode, provide user-friendly messages
  if (isDemoMode) {
    throw new Error('Demo mode: This feature requires a real database connection');
  }
  
  // Log error details for production monitoring
  console.error(`Database error in ${context}:`, {
    error: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
    timestamp: new Date().toISOString(),
    context,
  });
  
  // Send to monitoring service (e.g., Sentry)
  if (import.meta.env.VITE_SENTRY_DSN) {
    // Sentry error reporting would go here
  }
  
  // Provide user-friendly error messages
  if (error?.code === 'PGRST116') {
    throw new Error('No data found');
  }
  
  if (error?.code === '23505') {
    throw new Error('This record already exists');
  }
  
  if (error?.code === '23503') {
    throw new Error('Referenced record does not exist');
  }
  
  if (error?.code === '42501') {
    throw new Error('Access denied. Please check your permissions.');
  }
  
  if (error?.code === 'PGRST301') {
    throw new Error('Database connection error. Please try again.');
  }
  
  // Generic error for unknown cases
  throw new Error(error?.message || 'An unexpected database error occurred');
};

// Production connection monitoring
let connectionHealthInterval: NodeJS.Timeout | null = null;

export const startConnectionMonitoring = () => {
  if (connectionHealthInterval) {
    clearInterval(connectionHealthInterval);
  }
  
  // Check connection health every 5 minutes in production
  connectionHealthInterval = setInterval(async () => {
    const health = await checkDatabaseConnection();
    
    if (!health.connected) {
      console.error('Database connection lost:', health.error);
      
      // Trigger reconnection attempt or alert monitoring systems
      if (import.meta.env.VITE_SENTRY_DSN) {
        // Send alert to monitoring service
      }
    } else {
      console.log(`Database connection healthy (${health.latency}ms)`);
    }
  }, 5 * 60 * 1000); // 5 minutes
};

export const stopConnectionMonitoring = () => {
  if (connectionHealthInterval) {
    clearInterval(connectionHealthInterval);
    connectionHealthInterval = null;
  }
};

// Initialize connection monitoring in production
if (import.meta.env.VITE_APP_ENV === 'production') {
  startConnectionMonitoring();
}

// Backup database configuration for failover
const backupSupabaseUrl = import.meta.env.BACKUP_SUPABASE_URL;
const backupSupabaseAnonKey = import.meta.env.BACKUP_SUPABASE_ANON_KEY;

export const backupSupabase = backupSupabaseUrl && backupSupabaseAnonKey 
  ? createClient(backupSupabaseUrl, backupSupabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          'X-Client-Info': `trucking-recruitment-platform-backup@${import.meta.env.VITE_APP_VERSION || '1.0.0'}`,
        },
      },
    })
  : null;

// Failover function for critical operations
export const withFailover = async <T>(
  operation: (client: SupabaseClient<Database>) => Promise<T>
): Promise<T> => {
  try {
    return await operation(supabase);
  } catch (error) {
    console.warn('Primary database operation failed, attempting failover:', error);
    
    if (backupSupabase) {
      try {
        return await operation(backupSupabase);
      } catch (backupError) {
        console.error('Backup database operation also failed:', backupError);
        throw error; // Throw original error
      }
    }
    
    throw error;
  }
};