import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { Profile } from '../lib/supabase';

// Mock user data for demo purposes
const DEMO_USERS = {
  'recruiter@demo.com': {
    id: '1',
    email: 'recruiter@demo.com',
    password: 'password123',
    profile: {
      id: '1',
      email: 'recruiter@demo.com',
      name: 'Demo Recruiter',
      role: 'recruiter' as const,
      profile_image: null,
      phone: '+1 (555) 123-4567',
      location: 'Dallas, TX',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  },
  'driver@demo.com': {
    id: '2',
    email: 'driver@demo.com',
    password: 'password123',
    profile: {
      id: '2',
      email: 'driver@demo.com',
      name: 'Demo Driver',
      role: 'driver' as const,
      profile_image: null,
      phone: '+1 (555) 987-6543',
      location: 'Houston, TX',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  },
  'admin@demo.com': {
    id: '3',
    email: 'admin@demo.com',
    password: 'password123',
    profile: {
      id: '3',
      email: 'admin@demo.com',
      name: 'Demo Admin',
      role: 'admin' as const,
      profile_image: null,
      phone: '+1 (555) 555-5555',
      location: 'Austin, TX',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  }
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('demo_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData.user);
      setProfile(userData.profile);
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const demoUser = DEMO_USERS[email as keyof typeof DEMO_USERS];
    
    if (!demoUser || demoUser.password !== password) {
      return { 
        data: null, 
        error: { message: 'Invalid email or password' } 
      };
    }

    const mockUser = {
      id: demoUser.id,
      email: demoUser.email,
      created_at: demoUser.profile.created_at,
      updated_at: demoUser.profile.updated_at,
    } as User;

    setUser(mockUser);
    setProfile(demoUser.profile);
    
    // Store in localStorage for persistence
    localStorage.setItem('demo_user', JSON.stringify({
      user: mockUser,
      profile: demoUser.profile
    }));

    return { data: { user: mockUser }, error: null };
  };

  const signUp = async (email: string, password: string, userData: {
    name: string;
    role: 'driver' | 'recruiter';
    company_name?: string;
  }) => {
    // For demo purposes, just return success
    const newUserId = Math.random().toString(36).substr(2, 9);
    const mockUser = {
      id: newUserId,
      email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as User;

    return { 
      data: { user: mockUser }, 
      error: null 
    };
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('demo_user');
    return { error: null };
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