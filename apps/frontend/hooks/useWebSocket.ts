'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { getSocket, connectSocket, disconnectSocket, isSocketConnected } from "@/lib/socket";
import type { Socket } from "socket.io-client";

/**
 * useWebSocket - Socket.io-client hook for real-time communication
 *
 * MIGRATED FROM: ws library (client/src/hooks/useWebSocket.ts)
 * MIGRATED TO: socket.io-client
 *
 * Key Migration Changes:
 * - ws.send() → socket.emit()
 * - ws.onmessage → socket.on()
 * - ws.onopen → socket.on("connect")
 * - ws.onclose → socket.on("disconnect")
 * - JSON parsing automatic in socket.io (no need for JSON.parse)
 * - Event-based messaging (typed events instead of generic message handler)
 *
 * WebSocket Events (from backend/src/modules/websockets/websockets.types.ts):
 * - Connection: connected, ping, pong
 * - Session: join_session, joined_session, leave_session, user_joined, user_left
 * - Dice: gm_roll, player_roll
 * - Effects: effect_applied
 * - GameBoard: projection_update
 * - Narration: narration, ambiance
 */

// Event type constants (matching backend WSEventTypes)
export const WSEventTypes = {
  // Connection
  CONNECTED: 'connected',
  PING: 'ping',
  PONG: 'pong',

  // Session Management
  JOIN_SESSION: 'join_session',
  JOINED_SESSION: 'joined_session',
  LEAVE_SESSION: 'leave_session',
  USER_JOINED: 'user_joined',
  USER_LEFT: 'user_left',

  // Dice Rolling
  GM_ROLL: 'gm_roll',
  PLAYER_ROLL: 'player_roll',

  // Effects & State
  EFFECT_APPLIED: 'effect_applied',

  // GameBoard
  PROJECTION_UPDATE: 'projection_update',

  // Narration & Ambiance
  NARRATION: 'narration',
  AMBIANCE: 'ambiance',

  // Errors
  ERROR: 'error',
} as const;

// WebSocket Message Interface
export interface WebSocketMessage<T = unknown> {
  type: string;
  data?: T;
  timestamp?: Date;
}

// Typed event handlers
export type EventHandler<T = unknown> = (message: WebSocketMessage<T>) => void;

const MAX_HISTORY_SIZE = 100;

/**
 * useWebSocket Hook
 *
 * @param autoConnect - Automatically connect on mount (default: true)
 * @returns Socket state and control functions
 */
export function useWebSocket(autoConnect = true) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const messageHistoryRef = useRef<WebSocketMessage[]>([]);
  const [historyUpdateTrigger, setHistoryUpdateTrigger] = useState(0);
  const socketRef = useRef<Socket | null>(null);
  const eventHandlersRef = useRef<Map<string, Set<EventHandler>>>(new Map());
  const toastShownRef = useRef(false);
  const { toast } = useToast();

  /**
   * Initialize socket and attach event listeners
   */
  const initSocket = useCallback(() => {
    if (socketRef.current) return socketRef.current;

    const socket = getSocket();
    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('✅ WebSocket connected:', socket.id);
      setIsConnected(true);
      toastShownRef.current = false; // Reset toast flag on successful reconnect
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
      setIsConnected(false);

      if (reason === 'io server disconnect') {
        // Server forcefully disconnected - try to reconnect
        socket.connect();
      }
    });

    socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error.message);
      setIsConnected(false);

      if (!toastShownRef.current) {
        toastShownRef.current = true;
        toast({
          title: "Connexion perdue",
          description: "Impossible de se connecter au serveur",
          variant: "destructive",
        });
      }
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log(`✅ WebSocket reconnected after ${attemptNumber} attempts`);
      setIsConnected(true);
      toastShownRef.current = false;
    });

    // Set initial connection state
    setIsConnected(socket.connected);

    return socket;
  }, [toast]);

  /**
   * Subscribe to a specific event
   */
  const on = useCallback(<T = unknown>(event: string, handler: EventHandler<T>) => {
    const socket = initSocket();

    // Track handler for cleanup
    if (!eventHandlersRef.current.has(event)) {
      eventHandlersRef.current.set(event, new Set());
    }
    eventHandlersRef.current.get(event)!.add(handler as EventHandler);

    // Socket.io event handler wrapper
    const socketHandler = (message: WebSocketMessage<T>) => {
      // Store in history
      const messageWithTimestamp = {
        ...message,
        timestamp: message.timestamp || new Date(),
      };

      setLastMessage(messageWithTimestamp);

      if (messageHistoryRef.current.length >= MAX_HISTORY_SIZE) {
        messageHistoryRef.current = messageHistoryRef.current.slice(-MAX_HISTORY_SIZE + 1);
      }
      messageHistoryRef.current.push(messageWithTimestamp);
      setHistoryUpdateTrigger(prev => prev + 1);

      // Call user handler
      handler(messageWithTimestamp);
    };

    socket.on(event, socketHandler);

    // Return cleanup function
    return () => {
      socket.off(event, socketHandler);
      const handlers = eventHandlersRef.current.get(event);
      if (handlers) {
        handlers.delete(handler as EventHandler);
        if (handlers.size === 0) {
          eventHandlersRef.current.delete(event);
        }
      }
    };
  }, [initSocket]);

  /**
   * Emit an event to the server
   */
  const emit = useCallback(<T = unknown>(event: string, data: T) => {
    const socket = socketRef.current;
    if (socket?.connected) {
      socket.emit(event, data);
      return true;
    } else {
      console.warn('⚠️ Socket not connected, cannot emit event:', event);
      return false;
    }
  }, []);

  /**
   * Send a message (legacy API compatibility)
   * Maps to emit for backward compatibility with old ws API
   */
  const sendMessage = useCallback((type: string, data: unknown) => {
    return emit(type, data);
  }, [emit]);

  /**
   * Join a session room
   */
  const joinSession = useCallback((sessionId: string, userId?: string, role?: string) => {
    return emit(WSEventTypes.JOIN_SESSION, { sessionId, userId, role });
  }, [emit]);

  /**
   * Leave current session
   */
  const leaveSession = useCallback(() => {
    return emit(WSEventTypes.LEAVE_SESSION, {});
  }, [emit]);

  /**
   * Manual connection control
   */
  const connect = useCallback(() => {
    const socket = initSocket();
    if (!socket.connected) {
      connectSocket();
    }
  }, [initSocket]);

  /**
   * Manual disconnection control
   */
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      disconnectSocket();
      setIsConnected(false);
    }
  }, []);

  /**
   * Ping the server (health check)
   */
  const ping = useCallback(() => {
    return emit(WSEventTypes.PING, {});
  }, [emit]);

  /**
   * Auto-connect on mount if enabled
   */
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      // Cleanup: remove all event handlers
      if (socketRef.current) {
        eventHandlersRef.current.forEach((handlers, event) => {
          handlers.forEach((handler) => {
            socketRef.current?.off(event, (data: unknown) => handler({ type: event, data } as WebSocketMessage));
          });
        });
        eventHandlersRef.current.clear();
      }

      // Don't disconnect on unmount - keep connection alive for app lifetime
      // The socket is a singleton managed by lib/socket.ts
    };
  }, [autoConnect, connect]);

  // Memoized message history
  const messageHistory = useMemo(
    () => [...messageHistoryRef.current],
    [historyUpdateTrigger]
  );

  return useMemo(() => ({
    // Connection state
    isConnected,
    socket: socketRef.current,

    // Event subscription
    on,

    // Event emission
    emit,
    sendMessage, // Legacy compatibility

    // Session management
    joinSession,
    leaveSession,

    // Connection control
    connect,
    disconnect,
    reconnect: connect, // Alias

    // Health check
    ping,

    // Message history
    lastMessage,
    messageHistory,

    // Event types for consumers
    events: WSEventTypes,
  }), [
    isConnected,
    on,
    emit,
    sendMessage,
    joinSession,
    leaveSession,
    connect,
    disconnect,
    ping,
    lastMessage,
    messageHistory,
  ]);
}
