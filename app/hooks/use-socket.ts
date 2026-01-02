'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket, GameMessage, JoinSessionData } from '@/lib/socket-client';

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
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const messageHandlersRef = useRef<Set<(message: GameMessage) => void>>(new Set());

  useEffect(() => {
    // Initialiser Socket.IO
    const s = getSocket();
    setSocket(s);

    // Event handlers
    const onConnect = () => {
      setConnected(true);
    };

    const onDisconnect = () => {
      setConnected(false);
    };

    const onMessage = (message: GameMessage) => {
      // Appeler tous les handlers enregistrés
      messageHandlersRef.current.forEach((handler) => {
        handler(message);
      });
    };

    s.on('connect', onConnect);
    s.on('disconnect', onDisconnect);
    s.on('message', onMessage);

    // Connexion initiale
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
      // Ne pas déconnecter le socket (singleton)
    };
  }, []);

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
