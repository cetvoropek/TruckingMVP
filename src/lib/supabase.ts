import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Production database configuration with validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing required Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  );
}

// Validate Supabase URL format
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
  throw new Error(
    'Invalid Supabase URL format. Expected format: https://your-project-ref.supabase.co'
  );
}

// Validate that we're not using placeholder values
const placeholderValues = [
  'your-project-ref',
  'your-anon-key-here',
  'demo.supabase.co',
  'localhost',
  'placeholder'
];

if (placeholderValues.some(placeholder => 
  supabaseUrl.includes(placeholder) || supabaseAnonKey.includes(placeholder)
)) {
  throw new Error(
    'Production database configuration contains placeholder values. Please update your environment variables with actual production credentials.'
  );
}

// Production-grade Supabase client configuration
export const supabase: SupabaseClient<Database> = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Production auth settings
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    // Production security settings
    storageKey: 'truckrecruit-auth-token',
    storage: window.localStorage,
    // Session timeout (1 hour)
    sessionTimeout: parseInt(import.meta.env.VITE_SESSION_TIMEOUT || '3600'),
  },
  db: {
    schema: 'public',
  },
  realtime: {
    // Production realtime settings
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
    // Production fetch configuration
    fetch: (url, options = {}) => {
      return fetch(url, {
        ...options,
        // Add production-specific headers
        headers: {
          ...options.headers,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
        // Connection timeout for production
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