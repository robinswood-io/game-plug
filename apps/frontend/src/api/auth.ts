/**
 * Utilitaires d'authentification
 * Gestion des tokens JWT et de l'utilisateur actuellement connecté
 */

import * as Types from './types';

// ============================================================================
// Token Management
// ============================================================================

export const tokenStorage = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  },

  clearTokens: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  hasValidToken: (): boolean => {
    const token = tokenStorage.getAccessToken();
    if (!token) return false;

    try {
      // Décoder le JWT et vérifier l'expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // exp est en secondes, convertir en ms
      return Date.now() < expirationTime;
    } catch {
      return false;
    }
  },

  getTokenExpirationTime: (): number | null => {
    const token = tokenStorage.getAccessToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000; // Retourner en millisecondes
    } catch {
      return null;
    }
  },

  getTimeUntilExpiration: (): number => {
    const expirationTime = tokenStorage.getTokenExpirationTime();
    if (!expirationTime) return 0;
    return Math.max(0, expirationTime - Date.now());
  },
};

// ============================================================================
// User Management
// ============================================================================

export const userStorage = {
  getUser: (): Types.User | null => {
    if (typeof window === 'undefined') return null;

    const userJson = localStorage.getItem('user');
    if (!userJson) return null;

    try {
      return JSON.parse(userJson) as Types.User;
    } catch {
      return null;
    }
  },

  setUser: (user: Types.User): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('user', JSON.stringify(user));
  },

  clearUser: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('user');
  },

  getCurrentUserId: (): string | null => {
    const user = userStorage.getUser();
    return user?.id ?? null;
  },

  isGameMaster: (): boolean => {
    const user = userStorage.getUser();
    return user?.isGM ?? false;
  },
};

// ============================================================================
// Authentication State
// ============================================================================

export const authState = {
  isAuthenticated: (): boolean => {
    return tokenStorage.hasValidToken() && userStorage.getUser() !== null;
  },

  logout: (): void => {
    tokenStorage.clearTokens();
    userStorage.clearUser();

    // Émettre un événement personnalisé pour notifier la déconnexion
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('logout'));
    }
  },

  handleAuthResponse: (response: Types.AuthResponse): void => {
    tokenStorage.setTokens(response.accessToken, response.refreshToken);
    userStorage.setUser(response.user);

    // Émettre un événement personnalisé pour notifier la connexion
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('login', {
          detail: { user: response.user },
        })
      );
    }
  },

  handleUnauthorized: (): void => {
    tokenStorage.clearTokens();
    userStorage.clearUser();

    // Émettre un événement personnalisé
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('unauthorized'));
    }
  },
};

// ============================================================================
// JWT Decoding (pour debug et affichage)
// ============================================================================

export const jwtUtils = {
  decode: (token: string): Record<string, unknown> | null => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = atob(parts[1]);
      return JSON.parse(payload);
    } catch {
      return null;
    }
  },

  getPayload: (): Record<string, unknown> | null => {
    const token = tokenStorage.getAccessToken();
    if (!token) return null;
    return jwtUtils.decode(token);
  },

  getUserIdFromToken: (): string | null => {
    const payload = jwtUtils.getPayload();
    return (payload?.sub as string) || null;
  },
};

// ============================================================================
// Session Management
// ============================================================================

/**
 * Hook utilitaire pour gérer la déconnexion automatique à l'expiration du token
 * À utiliser dans un composant useEffect
 */
export const setupAutoLogout = (callback?: () => void): (() => void) => {
  const checkTokenExpiration = () => {
    const timeUntilExpiration = tokenStorage.getTimeUntilExpiration();

    if (timeUntilExpiration <= 0) {
      // Token expiré, déconnecter l'utilisateur
      authState.logout();
      callback?.();
      return;
    }

    // Configurer un timeout pour vérifier à nouveau avant l'expiration
    // Vérifier 1 minute avant l'expiration
    const warningTime = Math.max(0, timeUntilExpiration - 60000);
    const timeoutId = setTimeout(checkTokenExpiration, warningTime);

    return () => clearTimeout(timeoutId);
  };

  return checkTokenExpiration();
};
