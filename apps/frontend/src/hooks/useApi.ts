/**
 * React Hooks pour les requêtes API
 * Utilise React Query (TanStack Query) pour la gestion du cache et des états
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as api from '@/api/endpoints';
import * as Types from '@/api/types';

// ============================================================================
// Query Keys (pour le cache React Query)
// ============================================================================

export const queryKeys = {
  all: ['api'] as const,

  // Health
  health: () => [...queryKeys.all, 'health'] as const,

  // Sessions
  sessions: () => [...queryKeys.all, 'sessions'] as const,
  session: (id: string) => [...queryKeys.sessions(), id] as const,
  sessionsByGm: (gmId: string) => [...queryKeys.sessions(), 'gm', gmId] as const,

  // Characters
  characters: () => [...queryKeys.all, 'characters'] as const,
  character: (id: string) => [...queryKeys.characters(), id] as const,
  charactersByUser: (userId: string) => [...queryKeys.characters(), 'user', userId] as const,

  // Inventory
  inventory: () => [...queryKeys.all, 'inventory'] as const,
  inventoryByCharacter: (characterId: string) =>
    [...queryKeys.inventory(), characterId] as const,

  // Chapters
  chapters: () => [...queryKeys.all, 'chapters'] as const,
  chapter: (id: string) => [...queryKeys.chapters(), id] as const,
  chaptersBySession: (sessionId: string) =>
    [...queryKeys.chapters(), 'session', sessionId] as const,

  // Chapter Events
  chapterEvents: () => [...queryKeys.all, 'chapterEvents'] as const,
  chapterEventsByChapter: (chapterId: string) =>
    [...queryKeys.chapterEvents(), 'chapter', chapterId] as const,
  chapterEventsBySession: (sessionId: string) =>
    [...queryKeys.chapterEvents(), 'session', sessionId] as const,

  // Narrative
  narrative: () => [...queryKeys.all, 'narrative'] as const,
  narrativeBySession: (sessionId: string) =>
    [...queryKeys.narrative(), 'session', sessionId] as const,

  // Sanity
  sanity: () => [...queryKeys.all, 'sanity'] as const,
  sanityByCharacter: (characterId: string) =>
    [...queryKeys.sanity(), 'character', characterId] as const,
};

// ============================================================================
// Health Hook
// ============================================================================

export const useHealthCheck = () => {
  return useQuery({
    queryKey: queryKeys.health(),
    queryFn: api.health.check,
    staleTime: 30000, // 30 seconds
  });
};

// ============================================================================
// Authentication Hooks
// ============================================================================

export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.auth.signup,
    onSuccess: (data) => {
      // Sauvegarder les tokens et l'utilisateur dans le localStorage
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Invalider les requêtes liées à l'authentification
      queryClient.clear();
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.auth.login,
    onSuccess: (data) => {
      // Sauvegarder les tokens et l'utilisateur dans le localStorage
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Invalider les requêtes liées à l'authentification
      queryClient.clear();
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    queryClient.clear();
  };
};

// ============================================================================
// Game Session Hooks
// ============================================================================

export const useGameSessions = (gmId?: string) => {
  return useQuery({
    queryKey: gmId ? queryKeys.sessionsByGm(gmId) : queryKeys.sessions(),
    queryFn: () => api.gameSessions.list(gmId),
  });
};

export const useGameSession = (id: string) => {
  return useQuery({
    queryKey: queryKeys.session(id),
    queryFn: () => api.gameSessions.get(id),
  });
};

export const useCreateGameSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.gameSessions.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions() });
    },
  });
};

export const useUpdateGameSession = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Types.UpdateGameSessionRequest) =>
      api.gameSessions.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.session(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions() });
    },
  });
};

export const useDeleteGameSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.gameSessions.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions() });
    },
  });
};

// ============================================================================
// Character Hooks
// ============================================================================

export const useCharacters = (userId?: string) => {
  return useQuery({
    queryKey: userId ? queryKeys.charactersByUser(userId) : queryKeys.characters(),
    queryFn: () => api.characters.list(userId),
  });
};

export const useCharacter = (id: string) => {
  return useQuery({
    queryKey: queryKeys.character(id),
    queryFn: () => api.characters.get(id),
  });
};

export const useCreateCharacter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.characters.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.characters() });
    },
  });
};

export const useUpdateCharacter = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Types.UpdateCharacterRequest) => api.characters.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.character(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.characters() });
    },
  });
};

export const useDeleteCharacter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.characters.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.characters() });
    },
  });
};

// ============================================================================
// Inventory Hooks
// ============================================================================

export const useInventory = (characterId: string) => {
  return useQuery({
    queryKey: queryKeys.inventoryByCharacter(characterId),
    queryFn: () => api.inventory.list(characterId),
  });
};

export const useAddInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.inventory.add,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.inventoryByCharacter(data.characterId),
      });
    },
  });
};

export const useUpdateInventoryItem = (id: string, characterId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Types.UpdateInventoryItemRequest) =>
      api.inventory.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.inventoryByCharacter(characterId),
      });
    },
  });
};

export const useDeleteInventoryItem = (characterId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.inventory.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.inventoryByCharacter(characterId),
      });
    },
  });
};

// ============================================================================
// Chapter Hooks
// ============================================================================

export const useChapters = (sessionId: string) => {
  return useQuery({
    queryKey: queryKeys.chaptersBySession(sessionId),
    queryFn: () => api.chapters.list(sessionId),
  });
};

export const useChapter = (id: string) => {
  return useQuery({
    queryKey: queryKeys.chapter(id),
    queryFn: () => api.chapters.get(id),
  });
};

export const useCreateChapter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.chapters.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.chaptersBySession(data.sessionId),
      });
    },
  });
};

export const useUpdateChapter = (id: string, sessionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Types.UpdateChapterRequest) => api.chapters.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chapter(id) });
      queryClient.invalidateQueries({
        queryKey: queryKeys.chaptersBySession(sessionId),
      });
    },
  });
};

export const useDeleteChapter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.chapters.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chapters() });
    },
  });
};

// ============================================================================
// Chapter Event Hooks
// ============================================================================

export const useChapterEvents = (filters?: {
  chapterId?: string;
  sessionId?: string;
}) => {
  return useQuery({
    queryKey:
      filters?.chapterId && !filters?.sessionId
        ? queryKeys.chapterEventsByChapter(filters.chapterId)
        : filters?.sessionId
        ? queryKeys.chapterEventsBySession(filters.sessionId)
        : queryKeys.chapterEvents(),
    queryFn: () => api.chapterEvents.list(filters),
  });
};

export const useCreateChapterEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.chapterEvents.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.chapterEventsByChapter(data.chapterId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.chapterEventsBySession(data.sessionId),
      });
    },
  });
};

export const useUpdateChapterEvent = (id: string, chapterId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Types.UpdateChapterEventRequest) =>
      api.chapterEvents.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.chapterEventsByChapter(chapterId),
      });
    },
  });
};

export const useDeleteChapterEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.chapterEvents.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chapterEvents() });
    },
  });
};

// ============================================================================
// Narrative Hooks
// ============================================================================

export const useNarrativeEntries = (sessionId: string) => {
  return useQuery({
    queryKey: queryKeys.narrativeBySession(sessionId),
    queryFn: () => api.narrative.list(sessionId),
  });
};

export const useCreateNarrativeEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.narrative.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.narrativeBySession(data.sessionId),
      });
    },
  });
};

export const useUpdateNarrativeEntry = (id: string, sessionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Types.UpdateNarrativeEntryRequest) =>
      api.narrative.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.narrativeBySession(sessionId),
      });
    },
  });
};

export const useDeleteNarrativeEntry = (sessionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.narrative.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.narrativeBySession(sessionId),
      });
    },
  });
};

// ============================================================================
// Sanity Condition Hooks
// ============================================================================

export const useSanityConditions = (characterId: string) => {
  return useQuery({
    queryKey: queryKeys.sanityByCharacter(characterId),
    queryFn: () => api.sanity.list(characterId),
  });
};

export const useCreateSanityCondition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.sanity.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.sanityByCharacter(data.characterId),
      });
    },
  });
};

export const useUpdateSanityCondition = (id: string, characterId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Types.UpdateSanityConditionRequest) =>
      api.sanity.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.sanityByCharacter(characterId),
      });
    },
  });
};

export const useDeleteSanityCondition = (characterId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.sanity.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.sanityByCharacter(characterId),
      });
    },
  });
};

// ============================================================================
// Dice Hooks
// ============================================================================

export const useDiceRoll = () => {
  return useMutation({
    mutationFn: api.dice.roll,
  });
};
