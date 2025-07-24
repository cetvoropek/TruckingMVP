import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string, userData: {
    name: string;
    role: 'driver' | 'recruiter';
    company_name?: string;
  }) => {
    try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (data.user && !error) {
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email,
          name: userData.name,
          role: userData.role,
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        return { data, error: profileError };
      }

      // Create role-specific record
      if (userData.role === 'recruiter' && userData.company_name) {
        const { error: recruiterError } = await supabase
          .from('recruiters')
          .insert({
            id: data.user.id,
            company_name: userData.company_name,
          });

        if (recruiterError) {
          console.error('Error creating recruiter profile:', recruiterError);
          return { data, error: recruiterError };
        }

        // Create default subscription
        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .insert({
            recruiter_id: data.user.id,
            type: 'starter',
            status: 'trial',
            contacts_limit: 25,
            contacts_used: 0,
            price_monthly: 99.00,
            current_period_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          });

        if (subscriptionError) {
          console.error('Error creating subscription:', subscriptionError);
          return { data, error: subscriptionError };
        }
      } else if (userData.role === 'driver') {
        const { error: driverError } = await supabase
          .from('drivers')
          .insert({
            id: data.user.id,
            experience_years: 0,
            license_types: [],
            availability: 'available',
            preferred_routes: [],
            equipment_experience: [],
            fit_score: 0.0,
            profile_completion: 20,
            documents_verified: false,
          });

        if (driverError) {
          console.error('Error creating driver profile:', driverError);
          return { data, error: driverError };
        }
      }
    }

    return { data, error };
    } catch (err) {
      console.error('Signup error:', err);
      return { data: null, error: err };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };
}