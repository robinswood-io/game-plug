/**
 * useAuth hook - Wrapper for AuthContext
 *
 * Migration JWT: This hook now delegates to useAuthContext
 * instead of using React Query for auth state.
 *
 * Kept for backwards compatibility with existing components.
 * New components should use useAuthContext directly.
 */
import { useAuthContext } from '@/contexts/auth-context';

export function useAuth() {
  return useAuthContext();
}
