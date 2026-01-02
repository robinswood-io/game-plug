import { io, Socket } from 'socket.io-client';

// Types pour les messages WebSocket
export interface GameMessage {
  type: string;
  data: any;
  timestamp: Date;
}

export interface JoinSessionData {
  sessionId: string;
  userId?: string;
  role: 'gm' | 'player';
}

// Singleton Socket.IO client
let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

    socket = io(BACKEND_URL, {
      path: '/game-ws',
      withCredentials: true,
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Logs de debug
    socket.on('connect', () => {
      console.log('✅ Socket.IO connecté:', socket!.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket.IO déconnecté:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Erreur connexion Socket.IO:', error.message);
    });
  }

  return socket;
};

// Déconnexion propre
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Helper pour rejoindre une session
export const joinSession = (data: JoinSessionData) => {
  const s = getSocket();
  s.emit('join_session', data);
};

// Helper pour quitter une session
export const leaveSession = (sessionId: string, userId: string) => {
  const s = getSocket();
  s.emit('leave_session', { sessionId, userId });
};
