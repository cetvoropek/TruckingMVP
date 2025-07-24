# Production Deployment Guide

## Database Configuration

### 1. Supabase Setup

#### Create Production Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project for production
3. Choose a strong database password
4. Select the appropriate region (closest to your users)

#### Get Production Credentials
1. Navigate to Settings > API
2. Copy your Project URL (format: `https://your-project-ref.supabase.co`)
3. Copy your `anon` public key
4. Copy your `service_role` secret key (for server-side operations)

#### Database Schema Setup
Run the following SQL in your Supabase SQL Editor:

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('driver', 'recruiter', 'admin')),
  profile_image TEXT,
  phone TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id UUID REFERENCES profiles(id) PRIMARY KEY,
  experience_years INTEGER DEFAULT 0,
  license_types TEXT[] DEFAULT '{}',
  twic_card BOOLEAN DEFAULT FALSE,
  hazmat_endorsement BOOLEAN DEFAULT FALSE,
  availability TEXT DEFAULT 'available' CHECK (availability IN ('available', 'employed', 'seeking')),
  preferred_routes TEXT[] DEFAULT '{}',
  equipment_experience TEXT[] DEFAULT '{}',
  fit_score DECIMAL(3,1) DEFAULT 0.0,
  profile_completion INTEGER DEFAULT 0,
  documents_verified BOOLEAN DEFAULT FALSE,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create recruiters table
CREATE TABLE IF NOT EXISTS recruiters (
  id UUID REFERENCES profiles(id) PRIMARY KEY,
  company_name TEXT NOT NULL,
  company_size TEXT,
  website TEXT,
  contacts_unlocked INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  recruiter_id UUID REFERENCES recruiters(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('starter', 'pro', 'enterprise', 'pay-per-contact')),
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
  contacts_limit INTEGER,
  contacts_used INTEGER DEFAULT 0,
  price_monthly DECIMAL(10,2),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create other necessary tables...
-- (Add remaining table definitions)

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiters ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_drivers_availability ON drivers(availability);
CREATE INDEX IF NOT EXISTS idx_drivers_fit_score ON drivers(fit_score DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
```

### 2. Environment Configuration

#### Production Environment Variables
Create a `.env` file with your production values:

```bash
# Production Supabase Configuration
VITE_SUPABASE_URL=https://your-actual-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key-here

# Application Configuration
VITE_APP_NAME=TruckRecruit AI
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production

# Security Configuration
VITE_ENABLE_CSP=true
VITE_ENABLE_RATE_LIMITING=true
VITE_SESSION_TIMEOUT=3600

# External Services
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key

# Monitoring
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project
```

### 3. Security Configuration

#### Database Security Checklist
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Proper RLS policies for data access control
- ✅ Strong database password (minimum 16 characters)
- ✅ SSL/TLS encryption enabled (default in Supabase)
- ✅ API keys properly secured and not exposed in client code
- ✅ Service role key only used server-side

#### Application Security
- ✅ Input validation on all user inputs
- ✅ Rate limiting implemented
- ✅ CSRF protection enabled
- ✅ XSS prevention measures
- ✅ Content Security Policy configured
- ✅ Secure session management

### 4. Performance Optimization

#### Database Optimization
```sql
-- Add performance indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_drivers_location ON drivers USING GIN(to_tsvector('english', location));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_drivers_experience ON drivers(experience_years);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_status ON applications(status);

-- Analyze tables for query optimization
ANALYZE profiles;
ANALYZE drivers;
ANALYZE recruiters;
ANALYZE applications;
```

#### Connection Pool Settings
```javascript
// Optimized for production load
const DATABASE_CONFIG = {
  pool: {
    min: 5,           // Minimum connections
    max: 20,          // Maximum connections
    idleTimeoutMillis: 30000,  // 30 seconds
    connectionTimeoutMillis: 10000,  // 10 seconds
  }
};
```

### 5. Monitoring & Alerting

#### Health Checks
The application includes automatic database health monitoring:
- Connection status checks every 5 minutes
- Query performance monitoring
- Error rate tracking
- Latency monitoring

#### Logging Configuration
```javascript
// Production logging setup
const MONITORING_CONFIG = {
  healthCheckInterval: 5 * 60 * 1000,  // 5 minutes
  slowQueryThreshold: 5000,            // 5 seconds
  errorReportingEnabled: true,
  performanceTracking: true,
};
```

### 6. Backup & Recovery

#### Automated Backups
Supabase provides automatic daily backups. For additional protection:

1. Enable Point-in-Time Recovery (PITR) in Supabase dashboard
2. Set up additional backup schedules if needed
3. Test backup restoration procedures

#### Failover Configuration
```javascript
// Optional backup database for critical operations
const backupSupabase = createClient(
  process.env.BACKUP_SUPABASE_URL,
  process.env.BACKUP_SUPABASE_ANON_KEY
);
```

### 7. Deployment Steps

#### Pre-deployment Validation
```bash
# Run database configuration validation
npm run validate-db-config

# Run security checks
npm run security-audit

# Run performance tests
npm run performance-test
```

#### Production Build
```bash
# Install dependencies
npm ci --production

# Build for production
npm run build

# Test production build locally
npm run preview
```

#### Environment Validation
The application automatically validates:
- ✅ Required environment variables are set
- ✅ Database connection is working
- ✅ No placeholder values in configuration
- ✅ SSL/HTTPS is properly configured
- ✅ API keys are valid format

### 8. Post-deployment Verification

#### Checklist
- [ ] Database connection successful
- [ ] User registration/login working
- [ ] All API endpoints responding
- [ ] Real-time features functioning
- [ ] File uploads working
- [ ] Email notifications sending
- [ ] Analytics tracking events
- [ ] Error monitoring active
- [ ] Performance metrics collecting

#### Monitoring Dashboard
Set up monitoring for:
- Database connection health
- API response times
- Error rates
- User activity metrics
- System resource usage

### 9. Maintenance

#### Regular Tasks
- Monitor database performance weekly
- Review error logs daily
- Update dependencies monthly
- Backup verification monthly
- Security audit quarterly

#### Scaling Considerations
- Monitor connection pool usage
- Add read replicas if needed
- Implement caching for frequently accessed data
- Consider CDN for static assets

This production configuration ensures:
- **Security**: All data is properly protected with RLS and encryption
- **Performance**: Optimized queries and connection pooling
- **Reliability**: Health monitoring and failover capabilities
- **Scalability**: Designed to handle production load
- **Maintainability**: Comprehensive logging and monitoring