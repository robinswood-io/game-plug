'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * AuthContext pour game-plug
 * Migration vers JWT + Refresh Tokens (@robinswood/auth@3.0.0)
 *
 * Features:
 * - Access Token JWT (15min) stocké en mémoire
 * - Refresh Token (30 jours) en HttpOnly cookie
 * - Refresh automatique avant expiration
 * - Logout avec révocation refresh token
 *
 * Pattern: Similar to jlm-app auth context
 */

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'gamemaster' | 'player';
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
}

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'gamemaster' | 'player';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5174';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Refresh access token using refresh token cookie
   * Called automatically before token expiration
   */
  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // Send refresh token cookie
      });

      if (!response.ok) {
        // Refresh token expired or invalid
        setUser(null);
        setAccessToken(null);
        return null;
      }

      const data = await response.json();
      setAccessToken(data.accessToken);

      // Also update user if provided
      if (data.user) {
        setUser(data.user);
      }

      return data.accessToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      setUser(null);
      setAccessToken(null);
      return null;
    }
  }, []);

  /**
   * Login with email + password
   * Stores access token in memory, refresh token in HttpOnly cookie
   */
  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Receive refresh token cookie
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      setAccessToken(data.accessToken);
      setUser(data.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  /**
   * Signup new user (GM or Player)
   * Auto-login after successful registration
   */
  const signup = useCallback(async (data: SignupData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }

      const result = await response.json();
      setAccessToken(result.accessToken);
      setUser(result.user);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }, []);

  /**
   * Logout and revoke refresh token
   */
  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {},
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state even if request fails
      setUser(null);
      setAccessToken(null);
    }
  }, [accessToken]);

  /**
   * Fetch current user profile on mount (if refresh token exists)
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Try to refresh token on mount (will use refresh token cookie)
        const token = await refreshAccessToken();

        if (token) {
          // Fetch user profile
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` },
            credentials: 'include',
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [refreshAccessToken]);

  /**
   * Auto-refresh token before expiration
   * JWT expires in 15min, refresh at 12min
   */
  useEffect(() => {
    if (!accessToken) return;

    const refreshInterval = 12 * 60 * 1000; // 12 minutes
    const intervalId = setInterval(() => {
      refreshAccessToken();
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [accessToken, refreshAccessToken]);

  const value: AuthContextType = {
    user,
    accessToken,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    refreshAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 * @throws Error if used outside AuthProvider
 */
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
