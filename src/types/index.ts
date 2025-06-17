export interface User {
  id: string;
  email: string;
  name: string;
  role: 'driver' | 'recruiter' | 'admin';
  profileImage?: string;
  createdAt: string;
}

export interface Driver extends User {
  role: 'driver';
  profile: DriverProfile;
}

export interface DriverProfile {
  phone: string;
  location: string;
  experience: number;
  licenseType: string[];
  twic: boolean;
  hazmat: boolean;
  availability: 'available' | 'employed' | 'seeking';
  preferredRoutes: string[];
  equipment: string[];
  documents: Document[];
  fitScore?: number;
  tags: string[];
}

export interface Recruiter extends User {
  role: 'recruiter';
  company: string;
  subscription: Subscription;
  contactsUnlocked: number;
  analytics: RecruiterAnalytics;
}

export interface Subscription {
  type: 'monthly' | 'yearly' | 'pay-per-contact';
  status: 'active' | 'cancelled' | 'expired';
  renewalDate?: string;
  contactsRemaining?: number;
}

export interface RecruiterAnalytics {
  candidatesReached: number;
  contactConversionRate: number;
  avgResponseTime: number;
  topRegions: string[];
  avgFitScore: number;
}

export interface Document {
  id: string;
  name: string;
  type: 'license' | 'cv' | 'twic' | 'hazmat' | 'medical' | 'other';
  url: string;
  uploadedAt: string;
  verified: boolean;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'OTR' | 'Local' | 'Regional' | 'Dedicated';
  requirements: string[];
  salary: string;
  benefits: string[];
  postedAt: string;
  recruiterId: string;
}

export interface Application {
  id: string;
  driverId: string;
  jobId: string;
  status: 'pending' | 'reviewed' | 'interviewed' | 'hired' | 'rejected';
  appliedAt: string;
  notes?: string;
}

export interface CommunicationLog {
  id: string;
  driverId: string;
  recruiterId: string;
  channel: 'whatsapp' | 'viber' | 'email' | 'phone' | 'web';
  message: string;
  timestamp: string;
  aiAnalysis?: {
    sentiment: 'positive' | 'neutral' | 'negative';
    engagementScore: number;
    followUpNeeded: boolean;
  };
}