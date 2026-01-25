import axios, { AxiosInstance, AxiosError } from 'axios';

// Types pour les réponses d'authentification
interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    isGM: boolean;
    authType: 'local' | 'dev-bypass';
    createdAt: string;
    updatedAt: string;
  };
}

interface RefreshTokenRequest {
  refreshToken: string;
}

// Configuration de base du client Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur requête: ajouter le JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur réponse: refresh token si 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post<AuthResponse>(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002'}/api/auth/refresh`,
            { refreshToken } as RefreshTokenRequest
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          // Mettre à jour les tokens dans le localStorage
          localStorage.setItem('access_token', accessToken);
          localStorage.setItem('refresh_token', newRefreshToken);

          // Mettre à jour l'header de la requête originale
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          // Réessayer la requête originale
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Redirection vers login si le refresh échoue
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');

          // Émettre un événement personnalisé pour notifier la déconnexion
          window.dispatchEvent(new Event('unauthorized'));

          // Redirection vers la page de login
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }

          return Promise.reject(refreshError);
        }
      } else {
        // Pas de refresh token, redirection vers login
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');

        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
export type { AuthResponse };
