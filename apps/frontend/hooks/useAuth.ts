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
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      const backendUrl = '' || '';
      const response = await fetch(`${backendUrl}/api/auth/user`, {
        credentials: "include", // Include httpOnly cookies with JWT
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Not authenticated - return null instead of throwing
          return null;
        }
        throw new Error("Failed to fetch user");
      }

      return response.json();
    },
    retry: false, // Don't retry on 401 (not authenticated)
    refetchOnWindowFocus: false, // Don't refetch on window focus (JWT doesn't expire that fast)
    refetchOnMount: true, // Refetch when component mounts
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
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
