'use client';

import { io, Socket } from 'socket.io-client';

/**
 * Socket.io client configuration
 * Connects to the NestJS WebSocket Gateway
 *
 * Path: /game-ws
 * Namespace: /game
 */

let socket: Socket | null = null;

/**
 * Initialize and return Socket.io client singleton
 * This ensures we only create one socket connection
 */
export function getSocket(): Socket {
  if (!socket) {
    const backendUrl = '' || '';

    socket = io(`${backendUrl}/game`, {
      path: '/game-ws',
      transports: ['websocket', 'polling'],
      autoConnect: false, // Manual connection control
      reconnection: true,
      reconnectionAttempts: 10, // BUG-011 fix: increase reconnection attempts
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000, // Exponential backoff max
      withCredentials: true,
    });

    // Connection event handlers
    socket.on('connect', () => {
      console.log('✅ Socket.io connected:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket.io disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket.io connection error:', error.message);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log(`✅ Socket.io reconnected after ${attemptNumber} attempts`);
    });
  }

  return socket;
}

/**
 * Connect to socket if not already connected
 */
export function connectSocket(): Socket {
  const socket = getSocket();
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
}

/**
 * Disconnect socket
 */
export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect();
  }
}

/**
 * Check if socket is connected
 */
export function isSocketConnected(): boolean {
  return socket?.connected ?? false;
}

/**
 * Socket event emitter helper with type safety
 */
export function emitSocketEvent<T = any>(event: string, data: T): void {
  const socket = getSocket();
  if (socket.connected) {
    socket.emit(event, data);
  } else {
    console.warn('⚠️ Socket not connected, cannot emit event:', event);
  }
}

/**
 * Socket event listener helper with cleanup
 */
export function onSocketEvent<T = any>(
  event: string,
  handler: (data: T) => void
): () => void {
  const socket = getSocket();
  socket.on(event, handler);

  // Return cleanup function
  return () => {
    socket.off(event, handler);
  };
}

/**
 * Join a session room for targeted broadcasting
 */
export function joinSessionRoom(sessionId: string): void {
  emitSocketEvent('session:join', { sessionId });
}

/**
 * Leave a session room
 */
export function leaveSessionRoom(sessionId: string): void {
  emitSocketEvent('session:leave', { sessionId });
}

// Export socket instance for direct access if needed
export { socket };
