/**
 * TEMPORARY: Legacy queryClient compatibility layer
 * To be replaced with tRPC by Agent 9
 */

// Always use empty string to trigger Next.js proxy rewrite
// DO NOT use NEXT_PUBLIC_BACKEND_URL - it causes CORS issues
const BACKEND_URL = '';

export async function apiRequest(
  method: string,
  path: string,
  body?: any
): Promise<Response> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add Authorization header if token exists
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response;
}

// Placeholder for React Query client (to be removed)
export const queryClient = {
  invalidateQueries: () => {},
  setQueryData: () => {},
  getQueryData: () => null,
};
