'use client';

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

/**
 * useAuth - Next.js-compatible authentication hook
 *
 * Migrated from Express session-based auth to JWT token-based auth.
 * Uses TanStack Query for efficient state management and caching.
 *
 * Auth flow:
 * 1. JWT tokens stored in httpOnly cookies (set by backend)
 * 2. /api/auth/user endpoint validates token and returns user data
 * 3. Hook provides isAuthenticated state based on user data presence
 *
 * Backend integration:
 * - Expects NestJS backend with /api/auth/user endpoint
 * - Token automatically included via credentials: 'include'
 * - 401 response = not authenticated
 * - 200 response = authenticated with user data
 */
export interface User {
  id: string;
  username: string;
  email?: string;
  createdAt?: string;
  isGM?: boolean;
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      // Get token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

      // If no token, return null immediately (not authenticated)
      if (!token) {
        return null;
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      const response = await fetch('/api/auth/user', {
        credentials: "include",
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Not authenticated - clear token and return null
          if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
          }
          return null;
        }
        throw new Error("Failed to fetch user");
      }

      return response.json();
    },
    retry: false, // Don't retry on 401 (not authenticated)
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on every mount - use staleTime instead
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  // Development logging
  if (process.env.NODE_ENV === 'development') {
    console.log('useAuth:', { user, isLoading, error, isAuthenticated: !!user });
  }

  return useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
  }), [user, isLoading, error]);
}
