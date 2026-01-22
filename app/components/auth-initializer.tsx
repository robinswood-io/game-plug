'use client';

import { useEffect } from 'react';
import { useAuthContext } from '@/contexts/auth-context';
import { setAuthTokenHandlers } from '@/lib/api-client-jwt';

/**
 * AuthInitializer - Connects AuthContext with API client
 *
 * This component initializes the API client with token handlers
 * from the AuthContext, enabling automatic JWT inclusion in API calls
 * and 401 refresh handling.
 *
 * Must be rendered inside AuthProvider.
 */
export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { accessToken, refreshAccessToken } = useAuthContext();

  useEffect(() => {
    // Connect API client with AuthContext token handlers
    setAuthTokenHandlers(
      () => accessToken,
      refreshAccessToken
    );

    console.log('🔗 API client connected to AuthContext');
  }, [accessToken, refreshAccessToken]);

  return <>{children}</>;
}
