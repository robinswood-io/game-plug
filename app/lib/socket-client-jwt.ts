import { io, Socket } from 'socket.io-client';

/**
 * WebSocket client avec authentification JWT pour game-plug
 * Migration @robinswood/auth@3.0.0
 *
 * Features:
 * - JWT dans query param (handshake)
 * - Auto-reconnect avec nouveau token
 * - Protection userId spoofing côté serveur (WsJwtGuard)
 *
 * Pattern: Similar to jlm-app socket client
 */

// Types pour les messages WebSocket
export interface GameMessage {
  type: string;
  data: any;
  timestamp: Date;
}

export interface JoinSessionData {
  sessionId: string;
  // userId removed - serveur l'extrait du JWT
}

export interface RollData {
  characterId?: string;
  rollType: string;
  result: number;
  success: boolean;
  details?: any;
}

// Singleton Socket.IO client
let socket: Socket | null = null;
let currentToken: string | null = null;

/**
 * Get Socket.IO instance with JWT authentication
 * @param accessToken JWT access token from AuthContext
 */
export const getSocket = (accessToken: string | null): Socket => {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5174';

  // Reconnect if token changed
  if (socket && currentToken !== accessToken) {
    console.log('🔄 Token changed - reconnecting socket');
    socket.disconnect();
    socket = null;
  }

  if (!socket && accessToken) {
    currentToken = accessToken;

    socket = io(BACKEND_URL, {
      path: '/game-ws',
      withCredentials: true,
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      // ✅ JWT dans query param (validé par WsJwtGuard)
      query: {
        token: accessToken,
      },
    });

    // Logs de debug
    socket.on('connect', () => {
      console.log('✅ Socket.IO connecté avec JWT:', socket!.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket.IO déconnecté:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Erreur connexion Socket.IO:', error.message);

      // Si erreur d'auth, le token est probablement expiré
      if (error.message.includes('authentication') || error.message.includes('token')) {
        console.error('🔐 Token JWT invalide ou expiré - déconnexion');
        disconnectSocket();
      }
    });

    // Message générique du serveur
    socket.on('message', (message: GameMessage) => {
      console.log('📨 Message serveur:', message);
    });
  }

  if (!socket) {
    throw new Error('Cannot create socket without access token');
  }

  return socket;
};

/**
 * Connect socket if not already connected
 * @param accessToken JWT access token
 */
export const connectSocket = (accessToken: string) => {
  const s = getSocket(accessToken);
  if (!s.connected) {
    s.connect();
  }
  return s;
};

/**
 * Déconnexion propre
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentToken = null;
  }
};

/**
 * Helper pour rejoindre une session
 * userId extrait automatiquement du JWT côté serveur
 */
export const joinSession = (accessToken: string, sessionId: string) => {
  const s = connectSocket(accessToken);

  const data: JoinSessionData = {
    sessionId,
    // ✅ userId removed - serveur l'extrait du JWT (sécurité)
  };

  s.emit('join_session', data);
};

/**
 * Helper pour quitter une session
 */
export const leaveSession = (accessToken: string) => {
  const s = getSocket(accessToken);
  s.emit('leave_session');
};

/**
 * GM Roll (visible seulement au GM)
 */
export const gmRoll = (accessToken: string, data: RollData) => {
  const s = getSocket(accessToken);
  s.emit('gm_roll', data);
};

/**
 * Player Roll (visible à tous)
 */
export const playerRoll = (accessToken: string, data: RollData) => {
  const s = getSocket(accessToken);
  s.emit('player_roll', data);
};

/**
 * Ambiance update (musique, son)
 */
export const sendAmbiance = (accessToken: string, data: { type: string; url?: string; volume?: number }) => {
  const s = getSocket(accessToken);
  s.emit('ambiance', data);
};

/**
 * Narration update
 */
export const sendNarration = (accessToken: string, data: { content: string; speaker?: string }) => {
  const s = getSocket(accessToken);
  s.emit('narration', data);
};

/**
 * Effect applied to character
 */
export const sendEffectApplied = (accessToken: string, data: { characterId: string; effect: any }) => {
  const s = getSocket(accessToken);
  s.emit('effect_applied', data);
};

/**
 * Projection update (GameBoard)
 */
export const sendProjectionUpdate = (accessToken: string, data: { imageUrl: string; caption?: string }) => {
  const s = getSocket(accessToken);
  s.emit('projection_update', data);
};

/**
 * Character update (real-time sync)
 */
export const sendCharacterUpdate = (accessToken: string, data: { characterId: string; updates: any }) => {
  const s = getSocket(accessToken);
  s.emit('character_update', data);
};

/**
 * Sanity update
 */
export const sendSanityUpdate = (accessToken: string, data: { characterId: string; currentSanity: number; maxSanity: number }) => {
  const s = getSocket(accessToken);
  s.emit('sanity_update', data);
};

/**
 * Inventory update
 */
export const sendInventoryUpdate = (accessToken: string, data: { characterId: string; inventory: any[] }) => {
  const s = getSocket(accessToken);
  s.emit('inventory_update', data);
};

/**
 * Skill update
 */
export const sendSkillUpdate = (accessToken: string, data: { characterId: string; skillName: string; newValue: number }) => {
  const s = getSocket(accessToken);
  s.emit('skill_update', data);
};

/**
 * Ping (health check)
 */
export const ping = (accessToken: string) => {
  const s = getSocket(accessToken);
  s.emit('ping');
};
