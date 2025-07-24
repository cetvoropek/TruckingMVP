import { useState, useEffect } from 'react';
import { Driver, Application, Message, Interview, Subscription, ContactUnlock } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// Mock data for demo purposes
const MOCK_DRIVERS: Driver[] = [
  {
    id: '1',
    experience_years: 8,
    license_types: ['CDL-A'],
    twic_card: true,
    hazmat_endorsement: true,
    availability: 'available',
    preferred_routes: ['OTR', 'Regional'],
    equipment_experience: ['Dry Van', 'Flatbed'],
    fit_score: 9.2,
    profile_completion: 95,
    documents_verified: true,
    bio: 'Experienced professional driver with 8 years of safe driving.',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    profile: {
      id: '1',
      email: 'michael.rodriguez@email.com',
      name: 'Michael Rodriguez',
      role: 'driver',
      phone: '+1 (555) 123-4567',
      location: 'Dallas, TX',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  },
  {
    id: '2',
    experience_years: 5,
    license_types: ['CDL-A'],
    twic_card: false,
    hazmat_endorsement: true,
    availability: 'available',
    preferred_routes: ['Regional', 'Local'],
    equipment_experience: ['Reefer', 'Dry Van'],
    fit_score: 8.8,
    profile_completion: 88,
    documents_verified: true,
    bio: 'Reliable driver with experience in temperature-controlled freight.',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    profile: {
      id: '2',
      email: 'james.wilson@email.com',
      name: 'James Wilson',
      role: 'driver',
      phone: '+1 (555) 987-6543',
      location: 'Houston, TX',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  },
  {
    id: '3',
    experience_years: 12,
    license_types: ['CDL-A'],
    twic_card: true,
    hazmat_endorsement: false,
    availability: 'available',
    preferred_routes: ['OTR'],
    equipment_experience: ['Flatbed', 'Auto Transport'],
    fit_score: 8.5,
    profile_completion: 92,
    documents_verified: true,
    bio: 'Veteran driver specializing in specialized freight transport.',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    profile: {
      id: '3',
      email: 'sarah.johnson@email.com',
      name: 'Sarah Johnson',
      role: 'driver',
      phone: '+1 (555) 456-7890',
      location: 'Phoenix, AZ',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  }
];

const MOCK_SUBSCRIPTION: Subscription = {
  id: '1',
  recruiter_id: '1',
  type: 'pro',
  status: 'active',
  contacts_limit: 100,
  contacts_used: 45,
  price_monthly: 199,
  current_period_start: '2024-01-01T00:00:00Z',
  current_period_end: '2024-02-01T00:00:00Z',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

export function useRecruiterData() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCandidates: 0,
    activeConversations: 0,
    interviewsThisWeek: 0,
    avgFitScore: 0,
  });
  const [topCandidates, setTopCandidates] = useState<Driver[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    if (profile?.role === 'recruiter' && profile.id) {
      fetchRecruiterData();
    }
  }, [profile]);

  const fetchRecruiterData = async () => {
    if (!profile?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Use mock data instead of Supabase
      setSubscription(MOCK_SUBSCRIPTION);
      setTopCandidates(MOCK_DRIVERS);

      // Calculate stats
      const totalCandidates = MOCK_DRIVERS.length;
      
      // Mock stats
      const activeConversations = 8;
      const interviewsThisWeek = 3;

      // Calculate average fit score
      const avgFitScore = MOCK_DRIVERS.length 
        ? MOCK_DRIVERS.reduce((sum, candidate) => sum + candidate.fit_score, 0) / MOCK_DRIVERS.length
        : 0;

      setStats({
        totalCandidates,
        activeConversations,
        interviewsThisWeek,
        avgFitScore: Math.round(avgFitScore * 10) / 10,
      });

      // Build recent activity
      const activities = [];
      
      // Mock recent activity
      activities.push(
        { type: 'message', text: 'New message from Michael Rodriguez', time: '2 min ago' },
        { type: 'interview', text: 'Interview scheduled with James Wilson', time: '1 hour ago' },
        { type: 'application', text: 'New application received', time: '3 hours ago' },
        { type: 'contact', text: 'Contact unlocked for Sarah Johnson', time: '1 day ago' }
      );

      setRecentActivity(activities);

    } catch (error) {
      console.error('Error fetching recruiter data:', error);
    } finally {
      setLoading(false);
    }
  };

  const unlockContact = async (driverId: string) => {
    if (!profile?.id || !subscription) return { error: 'Not authenticated or no subscription' };

    // Check subscription limits
    if (subscription.contacts_limit && subscription.contacts_used >= subscription.contacts_limit) {
      return { error: 'Contact limit reached' };
    }

    // Mock unlock - just update the subscription usage
    setSubscription(prev => prev ? {
      ...prev,
      contacts_used: prev.contacts_used + 1
    } : null);

    return { success: true };
  };

  const isContactUnlocked = async (driverId: string): Promise<boolean> => {
    // Mock - return false for demo
    return false;
  };

  return {
    loading,
    stats,
    topCandidates,
    recentActivity,
    subscription,
    unlockContact,
    isContactUnlocked,
    refreshData: fetchRecruiterData,
  };
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
}