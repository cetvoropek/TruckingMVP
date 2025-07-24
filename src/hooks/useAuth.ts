import { useState, useEffect } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, Profile, handleDatabaseError } from '../lib/supabase';
import { executeWithRetry } from '../lib/database-config';
import { validateAndSanitize, signUpSchema, signInSchema } from '../lib/validation';
import { trackEvent } from '../lib/analytics';
import { auditLog } from '../lib/security';
import { validateAndSanitize, signUpSchema, signInSchema } from '../lib/validation';
import { trackEvent } from '../lib/analytics';

interface SignUpData {
  name: string;
  role: 'driver' | 'recruiter';
  company_name?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setProfile(null);
        }

        setLoading(false);

        // Track authentication events
        if (event === 'SIGNED_IN' && session?.user) {
          trackEvent('user_signed_in', { user_id: session.user.id });
        } else if (event === 'SIGNED_OUT') {
          trackEvent('user_signed_out', {});
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await executeWithRetry(async () => {
        return await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
      });

      if (error) {
        handleDatabaseError(error, 'fetchUserProfile');
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Validate and sanitize input
      const validatedData = validateAndSanitize(signInSchema, { email, password });
      
      // Rate limiting check would go here in production
      
      const { data, error } = await executeWithRetry(async () => {
        return await supabase.auth.signInWithPassword({
          email: validatedData.email,
          password: validatedData.password,
        });
      });

      if (error) {
        // Log failed login attempt
        auditLog.logFailedLogin(validatedData.email, error.message);
        throw error;
      }
      
      // Log successful login
      if (data.user) {
        auditLog.logSuccessfulLogin(data.user.id);
        trackEvent('user_signed_in', { user_id: data.user.id });
      }

      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { 
        data: null, 
        error: error instanceof AuthError ? error : new Error('An unexpected error occurred during sign in')
      };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: SignUpData) => {
    try {
      setLoading(true);
      
      // Validate and sanitize input
      const validatedData = validateAndSanitize(signUpSchema, {
        email,
        password,
        name: userData.name,
        role: userData.role,
        company: userData.company_name
      });

      // Sign up the user with retry logic
      const { data: authData, error: authError } = await executeWithRetry(async () => {
        return await supabase.auth.signUp({
          email: validatedData.email,
          password: validatedData.password,
          options: {
            data: {
              name: validatedData.name,
              role: validatedData.role,
              company_name: validatedData.company || null
            }
          }
        });
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('User creation failed');
      }

      // Create profile
      const { error: profileError } = await executeWithRetry(async () => {
        return await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: validatedData.email,
            name: validatedData.name,
            role: validatedData.role
          });
      });

      if (profileError) {
        handleDatabaseError(profileError, 'createProfile');
      }

      // Create role-specific record
      if (validatedData.role === 'driver') {
        const { error: driverError } = await executeWithRetry(async () => {
          return await supabase
            .from('drivers')
            .insert({
              id: authData.user.id,
              experience_years: 0,
              license_types: [],
              twic_card: false,
              hazmat_endorsement: false,
              availability: 'available',
              preferred_routes: [],
              equipment_experience: [],
              fit_score: 0,
              profile_completion: 20,
              documents_verified: false
            });
        });

        if (driverError) {
          handleDatabaseError(driverError, 'createDriverProfile');
        }
      } else if (validatedData.role === 'recruiter') {
        const { error: recruiterError } = await executeWithRetry(async () => {
          return await supabase
            .from('recruiters')
            .insert({
              id: authData.user.id,
              company_name: validatedData.company || 'Unknown Company',
              contacts_unlocked: 0
            });
        });

        if (recruiterError) {
          handleDatabaseError(recruiterError, 'createRecruiterProfile');
        }

        // Create default subscription (trial)
        const { error: subscriptionError } = await executeWithRetry(async () => {
          return await supabase
            .from('subscriptions')
            .insert({
              recruiter_id: authData.user.id,
              type: 'starter',
              status: 'trial',
              contacts_limit: 5,
              contacts_used: 0,
              current_period_start: new Date().toISOString(),
              current_period_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days trial
            });
        });

        if (subscriptionError) {
          handleDatabaseError(subscriptionError, 'createSubscription');
        }
      }

      // Track signup event
      trackEvent('user_signed_up', {
        user_id: authData.user.id,
        role: validatedData.role,
        company: validatedData.company
      });

      return { data: authData, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { 
        data: null, 
        error: error instanceof AuthError ? error : new Error('An unexpected error occurred during sign up')
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      // Clear local state
      setUser(null);
      setProfile(null);
      setSession(null);

      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { 
        error: error instanceof AuthError ? error : new Error('An unexpected error occurred during sign out')
      };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!user) {
        throw new AuthenticationError('No authenticated user');
      }

      const { data, error } = await executeWithRetry(async () => {
        return await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id)
          .select()
          .single();
      });

      if (error) {
        handleDatabaseError(error, 'updateProfile');
        return { data: null, error };
      }

      setProfile(data);
      
      // Track profile update
      trackEvent('profile_updated', {
        user_id: user.id,
        fields_updated: Object.keys(updates)
      });

      return { data, error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error : new Error('Failed to update profile')
      };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await executeWithRetry(async () => {
        return await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`
        });
      });

      if (error) {
        throw error;
      }

      return { error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { 
        error: error instanceof AuthError ? error : new Error('Failed to send reset password email')
      };
    }
  };

  return {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
    refreshProfile: () => user ? fetchUserProfile(user.id) : Promise.resolve()
  };
}