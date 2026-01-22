'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface HeadsUpContextType {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

const HeadsUpContext = createContext<HeadsUpContextType | undefined>(undefined);

export function HeadsUpProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const savedPreference = localStorage.getItem('cockpit-headup-enabled');
    if (savedPreference === 'false') {
      setEnabled(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cockpit-headup-enabled', enabled.toString());
  }, [enabled]);

  return (
    <HeadsUpContext.Provider value={{ enabled, setEnabled }}>
      {children}
    </HeadsUpContext.Provider>
  );
}

export function useHeadsUp() {
  const context = useContext(HeadsUpContext);
  // 🔧 FIX HMR: Retourner valeur par défaut au lieu de throw pendant les états transitoires HMR
  // L'erreur "useHeadsUp must be used within a HeadsUpProvider" survient quand HMR
  // recharge les modules dans un ordre qui détruit temporairement le contexte
  if (context === undefined) {
    console.warn('[HeadsUp] Context not available - returning default (likely HMR transition)');
    return { enabled: false, setEnabled: () => {} };
  }
  return context;
}
