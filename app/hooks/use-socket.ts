'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { useAuthContext } from '@/contexts/auth-context';
import { getSocket, connectSocket, GameMessage, JoinSessionData } from '@/lib/socket-client-jwt';

export interface UseSocketReturn {
  socket: Socket | null;
  connected: boolean;
  joinSession: (data: JoinSessionData) => void;
  leaveSession: (sessionId: string, userId: string) => void;
  sendMessage: (type: string, data: any) => void;
  onMessage: (handler: (message: GameMessage) => void) => void;
  removeMessageHandler: (handler: (message: GameMessage) => void) => void;
}

export const useSocket = (): UseSocketReturn => {
  const { accessToken } = useAuthContext();
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const messageHandlersRef = useRef<Set<(message: GameMessage) => void>>(new Set());

  useEffect(() => {
    // Only initialize socket if authenticated
    if (!accessToken) {
      setSocket(null);
      setConnected(false);
      return;
    }

    // Initialize Socket.IO with JWT
    const s = getSocket(accessToken);
    setSocket(s);

    // Event handlers
    const onConnect = () => {
      setConnected(true);
      console.log('✅ Socket.IO connected with JWT');
    };

    const onDisconnect = () => {
      setConnected(false);
      console.log('❌ Socket.IO disconnected');
    };

    const onMessage = (message: GameMessage) => {
      // Call all registered handlers
      messageHandlersRef.current.forEach((handler) => {
        handler(message);
      });
    };

    s.on('connect', onConnect);
    s.on('disconnect', onDisconnect);
    s.on('message', onMessage);

    // Initial connection
    if (!s.connected) {
      s.connect();
    } else {
      setConnected(true);
    }

    // Cleanup
    return () => {
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
      s.off('message', onMessage);
      // Don't disconnect socket (singleton)
    };
  }, [accessToken]); // Reconnect when token changes

  const joinSession = useCallback((data: JoinSessionData) => {
    if (socket) {
      socket.emit('join_session', data);
    }
  }, [socket]);

  const leaveSession = useCallback((sessionId: string, userId: string) => {
    if (socket) {
      socket.emit('leave_session', { sessionId, userId });
    }
  }, [socket]);

  const sendMessage = useCallback((type: string, data: any) => {
    if (socket && connected) {
      socket.emit(type, data);
    }
  }, [socket, connected]);

  const onMessage = useCallback((handler: (message: GameMessage) => void) => {
    messageHandlersRef.current.add(handler);
  }, []);

  const removeMessageHandler = useCallback((handler: (message: GameMessage) => void) => {
    messageHandlersRef.current.delete(handler);
  }, []);

  return {
    socket,
    connected,
    joinSession,
    leaveSession,
    sendMessage,
    onMessage,
    removeMessageHandler,
  };
};
