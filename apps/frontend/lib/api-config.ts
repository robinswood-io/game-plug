'use client';

import { OpenAPI } from './api-client';
import { QueryClient } from '@tanstack/react-query';

/**
 * Configure OpenAPI client with backend URL and credentials
 */
export const configureApiClient = () => {
  // Use relative path to trigger Next.js proxy (/api)
  OpenAPI.BASE = '';
  OpenAPI.WITH_CREDENTIALS = true;
  OpenAPI.CREDENTIALS = 'include';

  // Add Authorization header if token exists
  OpenAPI.HEADERS = async () => {
    const headers: Record<string, string> = {};

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  };
};

let clientQueryClientSingleton: QueryClient | undefined = undefined;

/**
 * Get or create QueryClient singleton
 * Ensures we only create one QueryClient instance on the client side
 */
export const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server: always create a new QueryClient
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1 minute
          retry: 1,
        },
      },
    });
  }

  // Client: reuse singleton
  if (!clientQueryClientSingleton) {
    clientQueryClientSingleton = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1 minute
          retry: 1,
        },
      },
    });
  }
  return clientQueryClientSingleton;
};

// Initialize configuration
if (typeof window !== 'undefined') {
  configureApiClient();
}
