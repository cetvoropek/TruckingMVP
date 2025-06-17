import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'driver' | 'recruiter' | 'admin') => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string, role: 'driver' | 'recruiter' | 'admin', company?: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const mockUsers: User[] = [
  {
    id: '1',
    email: 'driver@demo.com',
    name: 'John Driver',
    role: 'driver',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'recruiter@demo.com',
    name: 'Sarah Recruiter',
    role: 'recruiter',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    email: 'admin@demo.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'driver' | 'recruiter' | 'admin') => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.role === role);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
    } else {
      throw new Error('Invalid credentials');
    }
    
    setLoading(false);
  };

  const signup = async (email: string, password: string, name: string, role: 'driver' | 'recruiter' | 'admin', company?: string) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role,
      createdAt: new Date().toISOString()
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}