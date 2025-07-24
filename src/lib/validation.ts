import { z } from 'zod';

// User validation schemas
export const signUpSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  role: z.enum(['driver', 'recruiter'], {
    errorMap: () => ({ message: 'Please select a valid role' })
  }),
  company: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters')
    .optional()
});

export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

// Profile validation schemas
export const profileUpdateSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  phone: z.string()
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  location: z.string()
    .max(100, 'Location must be less than 100 characters')
    .optional()
    .or(z.literal(''))
});

// Driver profile validation
export const driverProfileSchema = z.object({
  experience_years: z.number()
    .min(0, 'Experience cannot be negative')
    .max(50, 'Experience cannot exceed 50 years'),
  license_types: z.array(z.string())
    .min(1, 'At least one license type is required'),
  twic_card: z.boolean(),
  hazmat_endorsement: z.boolean(),
  availability: z.enum(['available', 'employed', 'seeking']),
  preferred_routes: z.array(z.string()),
  equipment_experience: z.array(z.string()),
  bio: z.string()
    .max(1000, 'Bio must be less than 1000 characters')
    .optional()
    .or(z.literal(''))
});

// Recruiter profile validation
export const recruiterProfileSchema = z.object({
  company_name: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters'),
  company_size: z.string()
    .max(50, 'Company size must be less than 50 characters')
    .optional()
    .or(z.literal('')),
  website: z.string()
    .url('Please enter a valid website URL')
    .optional()
    .or(z.literal(''))
});

// Job posting validation
export const jobPostingSchema = z.object({
  title: z.string()
    .min(5, 'Job title must be at least 5 characters')
    .max(100, 'Job title must be less than 100 characters'),
  description: z.string()
    .min(50, 'Job description must be at least 50 characters')
    .max(5000, 'Job description must be less than 5000 characters'),
  location: z.string()
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must be less than 100 characters'),
  job_type: z.string()
    .min(1, 'Job type is required'),
  salary_min: z.number()
    .min(0, 'Minimum salary cannot be negative')
    .optional(),
  salary_max: z.number()
    .min(0, 'Maximum salary cannot be negative')
    .optional(),
  requirements: z.array(z.string())
    .min(1, 'At least one requirement is needed'),
  benefits: z.array(z.string())
});

// Message validation
export const messageSchema = z.object({
  content: z.string()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message must be less than 2000 characters'),
  recipient_id: z.string().uuid('Invalid recipient ID'),
  application_id: z.string().uuid('Invalid application ID').optional()
});

// Interview validation
export const interviewSchema = z.object({
  title: z.string()
    .min(5, 'Interview title must be at least 5 characters')
    .max(100, 'Interview title must be less than 100 characters'),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
  scheduled_at: z.string()
    .datetime('Please enter a valid date and time'),
  duration_minutes: z.number()
    .min(15, 'Interview must be at least 15 minutes')
    .max(240, 'Interview cannot exceed 4 hours'),
  type: z.enum(['phone', 'video', 'in-person']),
  meeting_url: z.string()
    .url('Please enter a valid meeting URL')
    .optional()
    .or(z.literal('')),
  notes: z.string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
    .or(z.literal(''))
});

// Application validation
export const applicationSchema = z.object({
  job_id: z.string().uuid('Invalid job ID'),
  cover_letter: z.string()
    .max(2000, 'Cover letter must be less than 2000 characters')
    .optional()
    .or(z.literal(''))
});

// Search and filter validation
export const candidateSearchSchema = z.object({
  search: z.string().max(100, 'Search term must be less than 100 characters').optional(),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  experience_min: z.number().min(0).max(50).optional(),
  experience_max: z.number().min(0).max(50).optional(),
  license_types: z.array(z.string()).optional(),
  availability: z.enum(['available', 'employed', 'seeking']).optional(),
  twic_card: z.boolean().optional(),
  hazmat_endorsement: z.boolean().optional(),
  equipment_experience: z.array(z.string()).optional(),
  fit_score_min: z.number().min(0).max(10).optional()
});

// Utility function to validate and sanitize input
export const validateAndSanitize = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      throw new Error(firstError.message);
    }
    throw new Error('Validation failed');
  }
};

// Sanitize HTML content to prevent XSS
export const sanitizeHtml = (content: string): string => {
  return content
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Validate file uploads
export const validateFileUpload = (file: File, allowedTypes: string[], maxSize: number) => {
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }
  
  if (file.size > maxSize) {
    throw new Error(`File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed size of ${(maxSize / 1024 / 1024).toFixed(2)}MB`);
  }
  
  return true;
};