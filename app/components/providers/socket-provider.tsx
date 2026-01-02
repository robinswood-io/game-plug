'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useSocket, UseSocketReturn } from '@/hooks/use-socket';

const SocketContext = createContext<UseSocketReturn | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socket = useSocket();

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = (): UseSocketReturn => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within SocketProvider');
  }
  return context;
};
