'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'analyst' | 'admin' | 'viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user', e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock authentication
    const mockUser: User = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      role: 'analyst',
      organization: 'Acme Corp',
    };
    setUser(mockUser);
    localStorage.setItem('auth_user', JSON.stringify(mockUser));
  };

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    // Mock signup
    const mockUser: User = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      email,
      name,
      role,
      organization: 'New Organization',
    };
    setUser(mockUser);
    localStorage.setItem('auth_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
