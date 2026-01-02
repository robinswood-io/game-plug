// API Client pour communiquer avec le backend NestJS

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    credentials: 'include', // Important pour les cookies de session
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new ApiError(response.status, error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// === Auth API ===
export const authApi = {
  signup: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    fetchApi('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    fetchApi('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    fetchApi('/api/auth/logout', {
      method: 'POST',
    }),

  getCurrentUser: () =>
    fetchApi('/api/auth/user'),
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

  join: (code: string, userId: string) =>
    fetchApi('/api/sessions/join', {
      method: 'POST',
      body: JSON.stringify({ code, userId }),
    }),

  getPlayers: (sessionId: string) =>
    fetchApi(`/api/sessions/${sessionId}/players`),

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

export default {
  auth: authApi,
  sessions: sessionsApi,
  characters: charactersApi,
};
