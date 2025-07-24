import { useState, useEffect } from 'react';
import { supabase, Driver, Application, Message, Interview, Subscription, ContactUnlock } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

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
    if (profile?.role === 'recruiter') {
      fetchRecruiterData();
    }
  }, [profile]);

  const fetchRecruiterData = async () => {
    if (!profile?.id) return;

    try {
      setLoading(true);

      // Fetch subscription
      const { data: subscriptionData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('recruiter_id', profile.id)
        .single();

      setSubscription(subscriptionData);

      // Fetch top candidates (drivers with highest fit scores)
      const { data: candidatesData } = await supabase
        .from('drivers')
        .select(`
          *,
          profile:profiles(*)
        `)
        .eq('availability', 'available')
        .order('fit_score', { ascending: false })
        .limit(10);

      setTopCandidates(candidatesData || []);

      // Fetch applications to recruiter's jobs
      const { data: applicationsData } = await supabase
        .from('applications')
        .select('*')
        .eq('recruiter_id', profile.id);

      // Fetch messages where recruiter is involved
      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${profile.id},recipient_id.eq.${profile.id}`)
        .order('created_at', { ascending: false });

      // Fetch interviews
      const { data: interviewsData } = await supabase
        .from('interviews')
        .select('*')
        .eq('recruiter_id', profile.id);

      // Calculate stats
      const totalCandidates = candidatesData?.length || 0;
      
      // Count unique conversations (unique driver IDs in messages)
      const uniqueDriverIds = new Set();
      messagesData?.forEach(msg => {
        if (msg.sender_id !== profile.id) uniqueDriverIds.add(msg.sender_id);
        if (msg.recipient_id !== profile.id) uniqueDriverIds.add(msg.recipient_id);
      });
      const activeConversations = uniqueDriverIds.size;

      // Count interviews this week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const interviewsThisWeek = interviewsData?.filter(
        interview => new Date(interview.scheduled_at) >= oneWeekAgo
      ).length || 0;

      // Calculate average fit score
      const avgFitScore = candidatesData?.length 
        ? candidatesData.reduce((sum, candidate) => sum + candidate.fit_score, 0) / candidatesData.length
        : 0;

      setStats({
        totalCandidates,
        activeConversations,
        interviewsThisWeek,
        avgFitScore: Math.round(avgFitScore * 10) / 10,
      });

      // Build recent activity
      const activities = [];
      
      // Recent messages
      messagesData?.slice(0, 3).forEach(msg => {
        if (msg.sender_id !== profile.id) {
          activities.push({
            type: 'message',
            text: `New message received`,
            time: formatTimeAgo(msg.created_at),
          });
        }
      });

      // Recent interviews
      interviewsData?.slice(0, 2).forEach(interview => {
        activities.push({
          type: 'interview',
          text: `Interview scheduled`,
          time: formatTimeAgo(interview.created_at),
        });
      });

      // Recent applications
      applicationsData?.slice(0, 2).forEach(app => {
        activities.push({
          type: 'application',
          text: `New application received`,
          time: formatTimeAgo(app.applied_at),
        });
      });

      // Sort by most recent
      activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      setRecentActivity(activities.slice(0, 4));

    } catch (error) {
      console.error('Error fetching recruiter data:', error);
    } finally {
      setLoading(false);
    }
  };

  const unlockContact = async (driverId: string) => {
    if (!profile?.id || !subscription) return { error: 'Not authenticated or no subscription' };

    // Check if already unlocked
    const { data: existingUnlock } = await supabase
      .from('contact_unlocks')
      .select('*')
      .eq('recruiter_id', profile.id)
      .eq('driver_id', driverId)
      .single();

    if (existingUnlock) {
      return { error: 'Contact already unlocked' };
    }

    // Check subscription limits
    if (subscription.contacts_limit && subscription.contacts_used >= subscription.contacts_limit) {
      return { error: 'Contact limit reached' };
    }

    try {
      // Create unlock record
      const { error: unlockError } = await supabase
        .from('contact_unlocks')
        .insert({
          recruiter_id: profile.id,
          driver_id: driverId,
        });

      if (unlockError) throw unlockError;

      // Update subscription usage
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .update({
          contacts_used: subscription.contacts_used + 1,
        })
        .eq('id', subscription.id);

      if (subscriptionError) throw subscriptionError;

      // Refresh data
      await fetchRecruiterData();

      return { success: true };
    } catch (error) {
      console.error('Error unlocking contact:', error);
      return { error: 'Failed to unlock contact' };
    }
  };

  const isContactUnlocked = async (driverId: string): Promise<boolean> => {
    if (!profile?.id) return false;

    const { data } = await supabase
      .from('contact_unlocks')
      .select('*')
      .eq('recruiter_id', profile.id)
      .eq('driver_id', driverId)
      .single();

    return !!data;
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