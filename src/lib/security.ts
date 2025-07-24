import { supabase } from './supabase';
import { trackEvent } from './analytics';

// Rate limiting implementation
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Get existing requests for this identifier
    const requests = this.requests.get(identifier) || [];
    
    // Filter out old requests
    const recentRequests = requests.filter(time => time > windowStart);
    
    // Check if limit exceeded
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }

    // Add current request
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);

    return true;
  }

  getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const requests = this.requests.get(identifier) || [];
    const recentRequests = requests.filter(time => time > windowStart);
    
    return Math.max(0, this.maxRequests - recentRequests.length);
  }

  getResetTime(identifier: string): number {
    const requests = this.requests.get(identifier) || [];
    if (requests.length === 0) return 0;
    
    const oldestRequest = Math.min(...requests);
    return oldestRequest + this.windowMs;
  }
}

// Create rate limiters for different operations
export const authRateLimiter = new RateLimiter(15 * 60 * 1000, 5); // 5 attempts per 15 minutes
export const apiRateLimiter = new RateLimiter(60 * 1000, 100); // 100 requests per minute
export const searchRateLimiter = new RateLimiter(60 * 1000, 30); // 30 searches per minute

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length
};

// SQL injection prevention (additional layer beyond Supabase's built-in protection)
export const sanitizeSqlInput = (input: string): string => {
  return input
    .replace(/[';--]/g, '') // Remove SQL comment and statement terminators
    .replace(/\b(DROP|DELETE|INSERT|UPDATE|CREATE|ALTER|EXEC|EXECUTE)\b/gi, '') // Remove dangerous SQL keywords
    .trim();
};

// XSS prevention
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// CSRF token management
class CSRFProtection {
  private token: string | null = null;

  generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    this.token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    sessionStorage.setItem('csrf_token', this.token);
    return this.token;
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = sessionStorage.getItem('csrf_token');
    }
    return this.token;
  }

  validateToken(token: string): boolean {
    const storedToken = this.getToken();
    return storedToken !== null && storedToken === token;
  }

  clearToken(): void {
    this.token = null;
    sessionStorage.removeItem('csrf_token');
  }
}

export const csrfProtection = new CSRFProtection();

// Content Security Policy helpers
export const setupCSP = (): void => {
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://js.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-src https://js.stripe.com"
  ].join('; ');
  
  document.head.appendChild(meta);
};

// Secure session management
export const secureSessionManager = {
  setItem: (key: string, value: string): void => {
    try {
      // Encrypt sensitive data before storing
      const encrypted = btoa(value); // Simple base64 encoding (use proper encryption in production)
      sessionStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Failed to store session data:', error);
    }
  },

  getItem: (key: string): string | null => {
    try {
      const encrypted = sessionStorage.getItem(key);
      if (!encrypted) return null;
      
      // Decrypt data
      return atob(encrypted); // Simple base64 decoding
    } catch (error) {
      console.error('Failed to retrieve session data:', error);
      return null;
    }
  },

  removeItem: (key: string): void => {
    sessionStorage.removeItem(key);
  },

  clear: (): void => {
    sessionStorage.clear();
  }
};

// Audit logging
export const auditLog = {
  logSecurityEvent: async (event: string, details: Record<string, any> = {}) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await trackEvent('security_event', {
        event,
        user_id: user?.id,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        ip_address: await getClientIP(),
        ...details
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  },

  logFailedLogin: (email: string, reason: string) => {
    auditLog.logSecurityEvent('failed_login', {
      email: email.toLowerCase(),
      reason,
      severity: 'medium'
    });
  },

  logSuccessfulLogin: (userId: string) => {
    auditLog.logSecurityEvent('successful_login', {
      user_id: userId,
      severity: 'low'
    });
  },

  logPermissionDenied: (resource: string, action: string) => {
    auditLog.logSecurityEvent('permission_denied', {
      resource,
      action,
      severity: 'high'
    });
  },

  logDataAccess: (resource: string, recordId?: string) => {
    auditLog.logSecurityEvent('data_access', {
      resource,
      record_id: recordId,
      severity: 'low'
    });
  }
};

// Get client IP address (best effort)
const getClientIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return 'unknown';
  }
};

// Password strength validation
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password should be at least 8 characters long');
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password should contain at least one uppercase letter');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password should contain at least one lowercase letter');
  }

  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password should contain at least one number');
  }

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password should contain at least one special character');
  }

  // Common password check
  const commonPasswords = ['password', '123456', 'qwerty', 'abc123', 'password123'];
  if (commonPasswords.includes(password.toLowerCase())) {
    score = 0;
    feedback.push('Password is too common');
  }

  return {
    isValid: score >= 4,
    score,
    feedback
  };
};

// File upload security
export const validateFileUpload = (file: File): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  // Size check
  if (file.size > maxSize) {
    errors.push(`File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed size of 10MB`);
  }

  // Type check
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`);
  }

  // Name check
  if (!/^[a-zA-Z0-9._-]+$/.test(file.name)) {
    errors.push('File name contains invalid characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Initialize security measures
export const initializeSecurity = (): void => {
  // Setup CSP
  setupCSP();

  // Generate CSRF token
  csrfProtection.generateToken();

  // Log security initialization
  auditLog.logSecurityEvent('security_initialized', {
    timestamp: new Date().toISOString()
  });
};