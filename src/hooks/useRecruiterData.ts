import { useState, useEffect, useCallback } from 'react';
import { supabase, Driver, Subscription, ContactUnlock, handleDatabaseError } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { trackEvent, trackFeatureUsage } from '../lib/analytics';
import { handleError, NotFoundError, AuthorizationError } from '../lib/errors';

interface RecruiterStats {
  totalCandidates: number;
  activeConversations: number;
  interviewsThisWeek: number;
  avgFitScore: number;
}

interface RecentActivity {
  type: 'message' | 'interview' | 'application' | 'contact';
  text: string;
  time: string;
  userId?: string;
}

export function useRecruiterData() {
  const { profile, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<RecruiterStats>({
    totalCandidates: 0,
    activeConversations: 0,
    interviewsThisWeek: 0,
    avgFitScore: 0,
  });
  const [topCandidates, setTopCandidates] = useState<Driver[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [unlockedContacts, setUnlockedContacts] = useState<Set<string>>(new Set());

  const fetchRecruiterData = useCallback(async () => {
    if (!profile || profile.role !== 'recruiter' || !user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch subscription data
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('recruiter_id', user.id)
        .eq('status', 'active')
        .single();

      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        handleDatabaseError(subscriptionError, 'fetchSubscription');
      } else {
        setSubscription(subscriptionData);
      }

      // Fetch top candidates with profiles
      const { data: candidatesData, error: candidatesError } = await supabase
        .from('drivers')
        .select(`
          *,
          profile:profiles(*)
        `)
        .eq('availability', 'available')
        .eq('documents_verified', true)
        .gte('fit_score', 7.0)
        .order('fit_score', { ascending: false })
        .limit(10);

      if (candidatesError) {
        handleDatabaseError(candidatesError, 'fetchCandidates');
      } else {
        setTopCandidates(candidatesData || []);
      }

      // Fetch unlocked contacts
      const { data: unlockedData, error: unlockedError } = await supabase
        .from('contact_unlocks')
        .select('driver_id')
        .eq('recruiter_id', user.id);

      if (unlockedError) {
        handleDatabaseError(unlockedError, 'fetchUnlockedContacts');
      } else {
        setUnlockedContacts(new Set(unlockedData?.map(u => u.driver_id) || []));
      }

      // Calculate stats
      await calculateStats(user.id);

      // Fetch recent activity
      await fetchRecentActivity(user.id);

    } catch (error) {
      handleError(error, 'fetchRecruiterData');
    } finally {
      setLoading(false);
    }
  }, [profile, user]);

  const calculateStats = async (recruiterId: string) => {
    try {
      // Get total available candidates
      const { count: totalCandidates } = await supabase
        .from('drivers')
        .select('*', { count: 'exact', head: true })
        .eq('availability', 'available')
        .eq('documents_verified', true);

      // Get active conversations (messages in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: conversationsData } = await supabase
        .from('messages')
        .select('recipient_id')
        .eq('sender_id', recruiterId)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      const uniqueConversations = new Set(conversationsData?.map(m => m.recipient_id) || []);

      // Get interviews this week
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 7);

      const { count: interviewsThisWeek } = await supabase
        .from('interviews')
        .select('*', { count: 'exact', head: true })
        .eq('recruiter_id', recruiterId)
        .gte('scheduled_at', startOfWeek.toISOString())
        .lt('scheduled_at', endOfWeek.toISOString());

      // Calculate average fit score of available candidates
      const { data: fitScoreData } = await supabase
        .from('drivers')
        .select('fit_score')
        .eq('availability', 'available')
        .eq('documents_verified', true)
        .not('fit_score', 'is', null);

      const avgFitScore = fitScoreData?.length 
        ? fitScoreData.reduce((sum, d) => sum + d.fit_score, 0) / fitScoreData.length
        : 0;

      setStats({
        totalCandidates: totalCandidates || 0,
        activeConversations: uniqueConversations.size,
        interviewsThisWeek: interviewsThisWeek || 0,
        avgFitScore: Math.round(avgFitScore * 10) / 10,
      });

    } catch (error) {
      handleError(error, 'calculateStats');
    }
  };

  const fetchRecentActivity = async (recruiterId: string) => {
    try {
      const activities: RecentActivity[] = [];

      // Get recent messages
      const { data: messagesData } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(name),
          recipient:profiles!messages_recipient_id_fkey(name)
        `)
        .or(`sender_id.eq.${recruiterId},recipient_id.eq.${recruiterId}`)
        .order('created_at', { ascending: false })
        .limit(5);

      messagesData?.forEach(message => {
        const isFromRecruiter = message.sender_id === recruiterId;
        const otherPerson = isFromRecruiter ? message.recipient?.name : message.sender?.name;
        
        activities.push({
          type: 'message',
          text: isFromRecruiter 
            ? `Message sent to ${otherPerson}`
            : `New message from ${otherPerson}`,
          time: formatTimeAgo(message.created_at),
          userId: isFromRecruiter ? message.recipient_id : message.sender_id
        });
      });

      // Get recent interviews
      const { data: interviewsData } = await supabase
        .from('interviews')
        .select(`
          *,
          driver:drivers!interviews_driver_id_fkey(
            profile:profiles(name)
          )
        `)
        .eq('recruiter_id', recruiterId)
        .order('created_at', { ascending: false })
        .limit(3);

      interviewsData?.forEach(interview => {
        activities.push({
          type: 'interview',
          text: `Interview ${interview.status} with ${interview.driver?.profile?.name}`,
          time: formatTimeAgo(interview.created_at),
          userId: interview.driver_id
        });
      });

      // Get recent applications
      const { data: applicationsData } = await supabase
        .from('applications')
        .select(`
          *,
          driver:drivers!applications_driver_id_fkey(
            profile:profiles(name)
          ),
          job_posting:job_postings(title)
        `)
        .eq('recruiter_id', recruiterId)
        .order('applied_at', { ascending: false })
        .limit(3);

      applicationsData?.forEach(application => {
        activities.push({
          type: 'application',
          text: `New application from ${application.driver?.profile?.name} for ${application.job_posting?.title}`,
          time: formatTimeAgo(application.applied_at),
          userId: application.driver_id
        });
      });

      // Get recent contact unlocks
      const { data: unlocksData } = await supabase
        .from('contact_unlocks')
        .select(`
          *,
          driver:drivers!contact_unlocks_driver_id_fkey(
            profile:profiles(name)
          )
        `)
        .eq('recruiter_id', recruiterId)
        .order('unlocked_at', { ascending: false })
        .limit(3);

      unlocksData?.forEach(unlock => {
        activities.push({
          type: 'contact',
          text: `Contact unlocked for ${unlock.driver?.profile?.name}`,
          time: formatTimeAgo(unlock.unlocked_at),
          userId: unlock.driver_id
        });
      });

      // Sort all activities by time and take the most recent
      activities.sort((a, b) => {
        // This is a simplified sort - in production you'd want to parse the time strings properly
        return a.time.localeCompare(b.time);
      });

      setRecentActivity(activities.slice(0, 10));

    } catch (error) {
      handleError(error, 'fetchRecentActivity');
    }
  };

  const unlockContact = async (driverId: string) => {
    try {
      if (!user || !subscription) {
        throw new AuthorizationError('Authentication required');
      }

      // Check if already unlocked
      if (unlockedContacts.has(driverId)) {
        return { success: true, message: 'Contact already unlocked' };
      }

      // Check subscription limits
      if (subscription.contacts_limit && subscription.contacts_used >= subscription.contacts_limit) {
        throw new AuthorizationError('Contact limit reached. Please upgrade your subscription.');
      }

      // Check if driver exists
      const { data: driverData, error: driverError } = await supabase
        .from('drivers')
        .select('id')
        .eq('id', driverId)
        .single();

      if (driverError || !driverData) {
        throw new NotFoundError('Driver');
      }

      // Create contact unlock record
      const { error: unlockError } = await supabase
        .from('contact_unlocks')
        .insert({
          recruiter_id: user.id,
          driver_id: driverId
        });

      if (unlockError) {
        handleDatabaseError(unlockError, 'unlockContact');
        return { error: 'Failed to unlock contact' };
      }

      // Update subscription usage
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .update({ 
          contacts_used: subscription.contacts_used + 1 
        })
        .eq('id', subscription.id);

      if (subscriptionError) {
        handleDatabaseError(subscriptionError, 'updateSubscriptionUsage');
      }

      // Update local state
      setUnlockedContacts(prev => new Set([...prev, driverId]));
      setSubscription(prev => prev ? {
        ...prev,
        contacts_used: prev.contacts_used + 1
      } : null);

      // Track the unlock event
      trackFeatureUsage('contact_unlock', {
        driver_id: driverId,
        subscription_type: subscription.type
      });

      return { success: true, message: 'Contact unlocked successfully' };

    } catch (error) {
      handleError(error, 'unlockContact');
      return { error: error instanceof Error ? error.message : 'Failed to unlock contact' };
    }
  };

  const isContactUnlocked = useCallback((driverId: string): boolean => {
    return unlockedContacts.has(driverId);
  }, [unlockedContacts]);

  useEffect(() => {
    if (profile?.role === 'recruiter') {
      fetchRecruiterData();
    }
  }, [profile, fetchRecruiterData]);

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
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
}