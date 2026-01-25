'use client';

import { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getQueryClient, configureApiClient } from '@/lib/api-config';

/**
 * Client-side providers wrapper
 * Provides TanStack Query context to the entire application
 * Now using OpenAPI generated client instead of tRPC
 */
export function Providers({ children }: { children: React.ReactNode }) {
  // Create stable QueryClient instance that persists across re-renders
  const [queryClient] = useState(() => getQueryClient());

  // Configure OpenAPI client on mount
  useEffect(() => {
    configureApiClient();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* React Query Devtools - only in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
