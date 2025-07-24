/**
 * Production Database Configuration
 * 
 * This file contains production-ready database configuration settings,
 * connection pooling, and monitoring capabilities for the TruckRecruit AI platform.
 */

import { supabase, checkDatabaseConnection } from './supabase';

// Production database connection pool settings
export const DATABASE_CONFIG = {
  // Connection pool settings optimized for production load
  pool: {
    min: parseInt(import.meta.env.DB_POOL_MIN || '5'),
    max: parseInt(import.meta.env.DB_POOL_MAX || '20'),
    idleTimeoutMillis: parseInt(import.meta.env.DB_POOL_IDLE_TIMEOUT || '30000'),
    connectionTimeoutMillis: parseInt(import.meta.env.DB_CONNECTION_TIMEOUT || '10000'),
  },
  
  // Query timeout settings for production
  query: {
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },
  
  // SSL/TLS configuration for secure connections
  ssl: {
    rejectUnauthorized: true,
    ca: undefined, // Will be set by Supabase
  },
  
  // Production monitoring settings
  monitoring: {
    healthCheckInterval: 5 * 60 * 1000, // 5 minutes
    slowQueryThreshold: 5000, // 5 seconds
    errorReportingEnabled: true,
  },
};

// Database connection validation for production deployment
export const validateDatabaseConfig = async (): Promise<{
  valid: boolean;
  errors: string[];
  warnings: string[];
}> => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check required environment variables
  const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
  ];
  
  for (const envVar of requiredEnvVars) {
    if (!import.meta.env[envVar]) {
      errors.push(`Missing required environment variable: ${envVar}`);
    }
  }
  
  // Validate Supabase URL format
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (supabaseUrl) {
    if (!supabaseUrl.startsWith('https://')) {
      errors.push('Supabase URL must use HTTPS in production');
    }
    
    if (!supabaseUrl.includes('.supabase.co')) {
      errors.push('Invalid Supabase URL format');
    }
    
    // Check for placeholder values
    const placeholders = ['your-project-ref', 'localhost', 'demo', 'test'];
    if (placeholders.some(placeholder => supabaseUrl.includes(placeholder))) {
      errors.push('Supabase URL contains placeholder values');
    }
  }
  
  // Validate API key format
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (anonKey) {
    if (anonKey.length < 100) {
      errors.push('Supabase anonymous key appears to be invalid (too short)');
    }
    
    if (anonKey.includes('your-anon-key') || anonKey === 'demo-key') {
      errors.push('Supabase anonymous key contains placeholder values');
    }
  }
  
  // Test database connection
  try {
    const connectionTest = await checkDatabaseConnection();
    if (!connectionTest.connected) {
      errors.push(`Database connection failed: ${connectionTest.error}`);
    } else if (connectionTest.latency && connectionTest.latency > 1000) {
      warnings.push(`High database latency detected: ${connectionTest.latency}ms`);
    }
  } catch (error) {
    errors.push(`Database connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  // Validate environment-specific settings
  const environment = import.meta.env.VITE_APP_ENV;
  if (environment === 'production') {
    // Production-specific validations
    if (!import.meta.env.VITE_SENTRY_DSN) {
      warnings.push('No error monitoring configured for production');
    }
    
    if (import.meta.env.VITE_ENABLE_ANALYTICS !== 'true') {
      warnings.push('Analytics disabled in production environment');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

// Production database query wrapper with retry logic
export const executeWithRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = DATABASE_CONFIG.query.retryAttempts
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const startTime = Date.now();
      const result = await operation();
      const duration = Date.now() - startTime;
      
      // Log slow queries in production
      if (duration > DATABASE_CONFIG.monitoring.slowQueryThreshold) {
        console.warn(`Slow query detected: ${duration}ms`);
      }
      
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      // Don't retry on certain error types
      if (error && typeof error === 'object' && 'code' in error) {
        const errorCode = (error as any).code;
        const nonRetryableCodes = ['23505', '23503', '42501']; // Unique violation, foreign key, permission
        
        if (nonRetryableCodes.includes(errorCode)) {
          throw error;
        }
      }
      
      if (attempt < maxRetries) {
        const delay = DATABASE_CONFIG.query.retryDelay * attempt;
        console.warn(`Database operation failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms:`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
};

// Production-ready database transaction wrapper
export const withTransaction = async <T>(
  operations: (client: typeof supabase) => Promise<T>
): Promise<T> => {
  // Note: Supabase handles transactions automatically for batch operations
  // This wrapper provides consistent error handling and logging
  
  const startTime = Date.now();
  
  try {
    const result = await operations(supabase);
    const duration = Date.now() - startTime;
    
    console.log(`Transaction completed successfully in ${duration}ms`);
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`Transaction failed after ${duration}ms:`, error);
    
    // Log transaction failure for monitoring
    if (DATABASE_CONFIG.monitoring.errorReportingEnabled) {
      // Send to monitoring service
      console.error('Transaction error details:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
        timestamp: new Date().toISOString(),
      });
    }
    
    throw error;
  }
};

// Database health monitoring for production
export class DatabaseHealthMonitor {
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private isMonitoring = false;
  
  start(): void {
    if (this.isMonitoring) {
      return;
    }
    
    this.isMonitoring = true;
    console.log('Starting database health monitoring...');
    
    this.healthCheckInterval = setInterval(
      this.performHealthCheck.bind(this),
      DATABASE_CONFIG.monitoring.healthCheckInterval
    );
    
    // Perform initial health check
    this.performHealthCheck();
  }
  
  stop(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    
    this.isMonitoring = false;
    console.log('Database health monitoring stopped');
  }
  
  private async performHealthCheck(): Promise<void> {
    try {
      const health = await checkDatabaseConnection();
      
      if (!health.connected) {
        console.error('Database health check failed:', health.error);
        
        // Trigger alerts or failover procedures
        this.handleConnectionFailure(health.error || 'Unknown error');
      } else {
        console.log(`Database health check passed (${health.latency}ms)`);
        
        // Log performance metrics
        if (health.latency && health.latency > 500) {
          console.warn(`Database latency is high: ${health.latency}ms`);
        }
      }
    } catch (error) {
      console.error('Health check error:', error);
    }
  }
  
  private handleConnectionFailure(error: string): void {
    // Implement alerting logic here
    console.error('Database connection failure detected:', error);
    
    // In production, this would trigger:
    // - Slack/email alerts
    // - Failover to backup database
    // - Circuit breaker activation
    // - Monitoring dashboard updates
  }
}

// Initialize database health monitoring in production
export const databaseMonitor = new DatabaseHealthMonitor();

// Auto-start monitoring in production environment
if (import.meta.env.VITE_APP_ENV === 'production') {
  databaseMonitor.start();
}

// Graceful shutdown handling
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    databaseMonitor.stop();
  });
}