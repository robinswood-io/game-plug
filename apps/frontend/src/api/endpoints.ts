/**
 * API Endpoints - Wrapper autour du client Axios
 * Centralize toutes les requêtes API du frontend
 */

import apiClient from './client';
import * as Types from './types';

// ============================================================================
// Health Check
// ============================================================================

export const health = {
  check: async (): Promise<Types.HealthCheckResponse> => {
    const response = await apiClient.get<Types.HealthCheckResponse>('/api/health');
    return response.data;
  },
};

// ============================================================================
// Authentication Endpoints
// ============================================================================

export const auth = {
  signup: async (data: Types.SignupRequest): Promise<Types.AuthResponse> => {
    const response = await apiClient.post<Types.AuthResponse>('/api/auth/signup', data);
    return response.data;
  },

  login: async (data: Types.LoginRequest): Promise<Types.AuthResponse> => {
    const response = await apiClient.post<Types.AuthResponse>('/api/auth/login', data);
    return response.data;
  },

  refresh: async (data: Types.RefreshTokenRequest): Promise<Types.AuthResponse> => {
    const response = await apiClient.post<Types.AuthResponse>('/api/auth/refresh', data);
    return response.data;
  },
};

// ============================================================================
// Game Session Endpoints
// ============================================================================

export const gameSessions = {
  list: async (gmId?: string): Promise<Types.GameSession[]> => {
    const response = await apiClient.get<Types.GameSession[]>('/api/sessions', {
      params: { gmId },
    });
    return response.data;
  },

  create: async (data: Types.CreateGameSessionRequest): Promise<Types.GameSession> => {
    const response = await apiClient.post<Types.GameSession>('/api/sessions', data);
    return response.data;
  },

  get: async (id: string): Promise<Types.GameSession> => {
    const response = await apiClient.get<Types.GameSession>(`/api/sessions/${id}`);
    return response.data;
  },

  update: async (
    id: string,
    data: Types.UpdateGameSessionRequest
  ): Promise<Types.GameSession> => {
    const response = await apiClient.patch<Types.GameSession>(`/api/sessions/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<Types.SuccessResponse> => {
    const response = await apiClient.delete<Types.SuccessResponse>(`/api/sessions/${id}`);
    return response.data;
  },
};

// ============================================================================
// Character Endpoints
// ============================================================================

export const characters = {
  list: async (userId?: string): Promise<Types.Character[]> => {
    const response = await apiClient.get<Types.Character[]>('/api/characters', {
      params: { userId },
    });
    return response.data;
  },

  create: async (data: Types.CreateCharacterRequest): Promise<Types.Character> => {
    const response = await apiClient.post<Types.Character>('/api/characters', data);
    return response.data;
  },

  get: async (id: string): Promise<Types.Character> => {
    const response = await apiClient.get<Types.Character>(`/api/characters/${id}`);
    return response.data;
  },

  update: async (
    id: string,
    data: Types.UpdateCharacterRequest
  ): Promise<Types.Character> => {
    const response = await apiClient.patch<Types.Character>(`/api/characters/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<Types.SuccessResponse> => {
    const response = await apiClient.delete<Types.SuccessResponse>(`/api/characters/${id}`);
    return response.data;
  },
};

// ============================================================================
// Inventory Endpoints
// ============================================================================

export const inventory = {
  list: async (characterId: string): Promise<Types.InventoryItem[]> => {
    const response = await apiClient.get<Types.InventoryItem[]>('/api/inventory', {
      params: { characterId },
    });
    return response.data;
  },

  add: async (data: Types.CreateInventoryItemRequest): Promise<Types.InventoryItem> => {
    const response = await apiClient.post<Types.InventoryItem>('/api/inventory', data);
    return response.data;
  },

  update: async (
    id: string,
    data: Types.UpdateInventoryItemRequest
  ): Promise<Types.InventoryItem> => {
    const response = await apiClient.patch<Types.InventoryItem>(
      `/api/inventory/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string): Promise<Types.SuccessResponse> => {
    const response = await apiClient.delete<Types.SuccessResponse>(`/api/inventory/${id}`);
    return response.data;
  },
};

// ============================================================================
// Chapter Endpoints
// ============================================================================

export const chapters = {
  list: async (sessionId: string): Promise<Types.Chapter[]> => {
    const response = await apiClient.get<Types.Chapter[]>('/api/chapters', {
      params: { sessionId },
    });
    return response.data;
  },

  create: async (data: Types.CreateChapterRequest): Promise<Types.Chapter> => {
    const response = await apiClient.post<Types.Chapter>('/api/chapters', data);
    return response.data;
  },

  get: async (id: string): Promise<Types.Chapter> => {
    const response = await apiClient.get<Types.Chapter>(`/api/chapters/${id}`);
    return response.data;
  },

  update: async (id: string, data: Types.UpdateChapterRequest): Promise<Types.Chapter> => {
    const response = await apiClient.patch<Types.Chapter>(`/api/chapters/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<Types.SuccessResponse> => {
    const response = await apiClient.delete<Types.SuccessResponse>(`/api/chapters/${id}`);
    return response.data;
  },
};

// ============================================================================
// Chapter Event Endpoints
// ============================================================================

export const chapterEvents = {
  list: async (filters?: {
    chapterId?: string;
    sessionId?: string;
  }): Promise<Types.ChapterEvent[]> => {
    const response = await apiClient.get<Types.ChapterEvent[]>('/api/chapter-events', {
      params: filters,
    });
    return response.data;
  },

  create: async (data: Types.CreateChapterEventRequest): Promise<Types.ChapterEvent> => {
    const response = await apiClient.post<Types.ChapterEvent>('/api/chapter-events', data);
    return response.data;
  },

  get: async (id: string): Promise<Types.ChapterEvent> => {
    const response = await apiClient.get<Types.ChapterEvent>(`/api/chapter-events/${id}`);
    return response.data;
  },

  update: async (
    id: string,
    data: Types.UpdateChapterEventRequest
  ): Promise<Types.ChapterEvent> => {
    const response = await apiClient.patch<Types.ChapterEvent>(
      `/api/chapter-events/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string): Promise<Types.SuccessResponse> => {
    const response = await apiClient.delete<Types.SuccessResponse>(
      `/api/chapter-events/${id}`
    );
    return response.data;
  },
};

// ============================================================================
// Narrative Endpoints
// ============================================================================

export const narrative = {
  list: async (sessionId: string): Promise<Types.NarrativeEntry[]> => {
    const response = await apiClient.get<Types.NarrativeEntry[]>('/api/narrative', {
      params: { sessionId },
    });
    return response.data;
  },

  create: async (data: Types.CreateNarrativeEntryRequest): Promise<Types.NarrativeEntry> => {
    const response = await apiClient.post<Types.NarrativeEntry>('/api/narrative', data);
    return response.data;
  },

  update: async (
    id: string,
    data: Types.UpdateNarrativeEntryRequest
  ): Promise<Types.NarrativeEntry> => {
    const response = await apiClient.patch<Types.NarrativeEntry>(
      `/api/narrative/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string): Promise<Types.SuccessResponse> => {
    const response = await apiClient.delete<Types.SuccessResponse>(`/api/narrative/${id}`);
    return response.data;
  },
};

// ============================================================================
// Sanity Condition Endpoints
// ============================================================================

export const sanity = {
  list: async (characterId: string): Promise<Types.SanityCondition[]> => {
    const response = await apiClient.get<Types.SanityCondition[]>('/api/sanity', {
      params: { characterId },
    });
    return response.data;
  },

  create: async (
    data: Types.CreateSanityConditionRequest
  ): Promise<Types.SanityCondition> => {
    const response = await apiClient.post<Types.SanityCondition>('/api/sanity', data);
    return response.data;
  },

  update: async (
    id: string,
    data: Types.UpdateSanityConditionRequest
  ): Promise<Types.SanityCondition> => {
    const response = await apiClient.patch<Types.SanityCondition>(`/api/sanity/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<Types.SuccessResponse> => {
    const response = await apiClient.delete<Types.SuccessResponse>(`/api/sanity/${id}`);
    return response.data;
  },
};

// ============================================================================
// Dice Endpoints
// ============================================================================

export const dice = {
  roll: async (data: Types.DiceRollRequest): Promise<Types.DiceRollResponse> => {
    const response = await apiClient.post<Types.DiceRollResponse>('/api/dice/roll', data);
    return response.data;
  },
};

// Export tous les endpoints
export default {
  health,
  auth,
  gameSessions,
  characters,
  inventory,
  chapters,
  chapterEvents,
  narrative,
  sanity,
  dice,
};
