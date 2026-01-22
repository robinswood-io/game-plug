/**
 * API Client avec support JWT pour game-plug
 * Migration @robinswood/auth@3.0.0
 *
 * Features:
 * - Authorization header avec JWT access token
 * - Refresh automatique si 401 Unauthorized
 * - Credentials include pour refresh token cookie
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5174';

export class ApiError extends Error {
  constructor(public status: number, message: string, public errorId?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Get access token from AuthContext
 * This will be injected by the app
 */
let getAccessToken: (() => string | null) | null = null;
let refreshAccessToken: (() => Promise<string | null>) | null = null;

export function setAuthTokenHandlers(
  getToken: () => string | null,
  refreshToken: () => Promise<string | null>
) {
  getAccessToken = getToken;
  refreshAccessToken = refreshToken;
}

interface FetchApiOptions extends RequestInit {
  skipAuth?: boolean; // Skip Authorization header (for public endpoints)
  skipRefresh?: boolean; // Skip automatic refresh on 401
}

async function fetchApi<T>(
  endpoint: string,
  options?: FetchApiOptions
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Build headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add existing headers if provided
  if (options?.headers) {
    const existingHeaders = options.headers as Record<string, string>;
    Object.assign(headers, existingHeaders);
  }

  // Add Authorization header if not skipped and token available
  if (!options?.skipAuth && getAccessToken) {
    const token = getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    credentials: 'include', // Always include cookies (for refresh token)
    headers,
  });

  // Handle 401 Unauthorized - try to refresh token
  if (response.status === 401 && !options?.skipRefresh && refreshAccessToken) {
    console.log('[API Client] 401 Unauthorized - attempting token refresh');

    const newToken = await refreshAccessToken();
    if (newToken) {
      // Retry request with new token
      console.log('[API Client] Token refreshed - retrying request');
      headers['Authorization'] = `Bearer ${newToken}`;

      const retryResponse = await fetch(url, {
        ...options,
        credentials: 'include',
        headers,
      });

      if (!retryResponse.ok) {
        const error = await retryResponse.json().catch(() => ({ message: 'Unknown error' }));
        throw new ApiError(retryResponse.status, error.message || `HTTP ${retryResponse.status}`, error.errorId);
      }

      return retryResponse.json();
    } else {
      // Refresh failed - redirect to login
      console.error('[API Client] Token refresh failed - user must re-login');
      throw new ApiError(401, 'Session expired - please login again');
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new ApiError(response.status, error.message || `HTTP ${response.status}`, error.errorId);
  }

  // Handle empty responses (204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// === Auth API ===
export const authApi = {
  signup: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: 'gamemaster' | 'player';
  }) =>
    fetchApi('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true, // No token needed for signup
      skipRefresh: true,
    }),

  login: (data: { email: string; password: string }) =>
    fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true, // No token needed for login
      skipRefresh: true,
    }),

  logout: () =>
    fetchApi('/auth/logout', {
      method: 'POST',
      skipRefresh: true, // Don't refresh on logout
    }),

  getCurrentUser: () =>
    fetchApi('/auth/me'),

  refreshToken: () =>
    fetchApi('/auth/refresh', {
      method: 'POST',
      skipAuth: true, // Refresh uses HttpOnly cookie, not access token
      skipRefresh: true, // Don't retry refresh endpoint
    }),

  requestPasswordReset: (email: string) =>
    fetchApi('/auth/password-reset/request', {
      method: 'POST',
      body: JSON.stringify({ email }),
      skipAuth: true,
      skipRefresh: true,
    }),

  confirmPasswordReset: (token: string, newPassword: string) =>
    fetchApi('/auth/password-reset/confirm', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
      skipAuth: true,
      skipRefresh: true,
    }),
};

// === Sessions API ===
export const sessionsApi = {
  create: (data: { title: string; currentChapter: string }) =>
    fetchApi('/api/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  list: () =>
    fetchApi('/api/sessions'),

  getById: (id: string) =>
    fetchApi(`/api/sessions/${id}`),

  update: (id: string, data: Partial<{ title: string; currentChapter: string; archived: boolean }>) =>
    fetchApi(`/api/sessions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi(`/api/sessions/${id}`, {
      method: 'DELETE',
    }),

  join: (code: string) =>
    fetchApi('/api/sessions/join', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),

  getPlayers: (sessionId: string) =>
    fetchApi(`/api/sessions/${sessionId}/players`),

  getCharacters: (sessionId: string) =>
    fetchApi(`/api/sessions/${sessionId}/characters`),

  archive: (sessionId: string) =>
    fetchApi(`/api/sessions/${sessionId}/archive`, {
      method: 'POST',
    }),
};

// === Characters API ===
export const charactersApi = {
  create: (data: any) =>
    fetchApi('/api/characters', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getById: (id: string) =>
    fetchApi(`/api/characters/${id}`),

  listBySession: (sessionId: string) =>
    fetchApi(`/api/characters/session/${sessionId}`),

  update: (id: string, data: any) =>
    fetchApi(`/api/characters/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi(`/api/characters/${id}`, {
      method: 'DELETE',
    }),

  generateAvatar: (id: string) =>
    fetchApi(`/api/characters/${id}/generate-avatar`, {
      method: 'POST',
    }),

  // Inventory
  addInventoryItem: (characterId: string, data: { name: string; description?: string; quantity: number }) =>
    fetchApi(`/api/characters/${characterId}/inventory`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateInventoryItem: (characterId: string, itemId: string, data: Partial<{ name: string; description: string; quantity: number }>) =>
    fetchApi(`/api/characters/${characterId}/inventory/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  removeInventoryItem: (characterId: string, itemId: string) =>
    fetchApi(`/api/characters/${characterId}/inventory/${itemId}`, {
      method: 'DELETE',
    }),

  // Effects
  applyHealing: (characterId: string, data: { amount: number }) =>
    fetchApi(`/api/characters/${characterId}/healing`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  applySanityLoss: (characterId: string, data: { amount: number; condition?: string }) =>
    fetchApi(`/api/characters/${characterId}/sanity-loss`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  applyBuff: (characterId: string, data: { name: string; duration: number; effects: any }) =>
    fetchApi(`/api/characters/${characterId}/buff`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// === Gameplay API ===
export const gameplayApi = {
  grantSkillPoints: (characterId: string, data: { amount: number; reason?: string }) =>
    fetchApi(`/api/characters/${characterId}/skill-points`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  distributeSkillPoints: (characterId: string, data: { skills: Record<string, number> }) =>
    fetchApi(`/api/characters/${characterId}/distribute-points`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  createRoll: (data: { sessionId: string; characterId?: string; rollType: string; result: number; success: boolean }) =>
    fetchApi('/api/rolls', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getSessionRolls: (sessionId: string) =>
    fetchApi(`/api/sessions/${sessionId}/rolls`),
};

// === AI API ===
export const aiApi = {
  generateAvatar: (data: { characterName: string; description: string }) =>
    fetchApi('/api/generate-avatar', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  generateCharacterAvatar: (characterId: string) =>
    fetchApi(`/api/characters/${characterId}/generate-avatar`, {
      method: 'POST',
    }),

  generateSessionAvatars: (sessionId: string, forceRegenerate?: boolean) =>
    fetchApi(`/api/sessions/${sessionId}/generate-all-avatars`, {
      method: 'POST',
      body: JSON.stringify({ forceRegenerate }),
    }),

  generateScene: (data: { prompt: string; sessionId?: string }) =>
    fetchApi('/api/gameboard/generate-scene', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// === Narrative API ===
export const narrativeApi = {
  getSessionEntries: (sessionId: string) =>
    fetchApi(`/api/sessions/${sessionId}/narrative`),

  createEntry: (sessionId: string, data: { content: string; type: string; isGMOnly: boolean }) =>
    fetchApi(`/api/sessions/${sessionId}/narrative`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateEntry: (entryId: string, data: Partial<{ content: string; type: string; isGMOnly: boolean }>) =>
    fetchApi(`/api/narrative/${entryId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteEntry: (entryId: string) =>
    fetchApi(`/api/narrative/${entryId}`, {
      method: 'DELETE',
    }),

  toggleVisibility: (entryId: string) =>
    fetchApi(`/api/narrative/${entryId}/toggle-visibility`, {
      method: 'PATCH',
    }),

  getAISuggestion: (sessionId: string, data: { context: string; characterName?: string }) =>
    fetchApi(`/api/sessions/${sessionId}/narrative/ai-suggest`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export default {
  auth: authApi,
  sessions: sessionsApi,
  characters: charactersApi,
  gameplay: gameplayApi,
  ai: aiApi,
  narrative: narrativeApi,
};
