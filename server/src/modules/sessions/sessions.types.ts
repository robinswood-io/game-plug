import { Socket } from 'socket.io';

export interface JoinSessionData {
  sessionId: string;
  userId?: string;
  role?: string;
}

export interface RollData {
  rollType: string;
  result: number;
  skillName?: string;
  characterId?: string;
  success?: string;
  diceFormula: string;
}

export interface EffectData {
  characterId: string;
  effectType: string;
  value: string | number;
  duration?: number;
}

export interface ProjectionData {
  imageUrl?: string;
  description?: string;
  isActive: boolean;
}

export interface NarrationData {
  text: string;
  isPublic: boolean;
}

export interface AmbianceData {
  type: string;
  isActive: boolean;
}

export interface ExtendedSocket extends Socket {
  userId?: string;
  sessionId?: string;
}

export interface BroadcastMessage {
  type: string;
  data?: unknown;
  timestamp: Date;
}

// New types for real-time character updates
export interface CharacterUpdateData {
  characterId: string;
  updates: {
    hitPoints?: number;
    maxHitPoints?: number;
    sanity?: number;
    maxSanity?: number;
    magicPoints?: number;
    maxMagicPoints?: number;
    movement?: number;
    armor?: number;
    build?: number;
    damageBonus?: string;
    money?: number;
    notes?: string;
    skills?: Record<string, number>;
  };
  source?: 'gm' | 'player';
  reason?: string;
}

export interface SanityUpdateData {
  characterId: string;
  previousValue: number;
  newValue: number;
  change: number;
  reason?: string;
  temporaryInsanity?: boolean;
  indefiniteInsanity?: boolean;
}

export interface InventoryUpdateData {
  characterId: string;
  action: 'added' | 'removed' | 'updated';
  item: {
    id?: string;
    name: string;
    quantity?: number;
    category?: string;
  };
}

export interface SkillUpdateData {
  characterId: string;
  skillName: string;
  previousValue: number;
  newValue: number;
  change: number;
}

export interface EffectAppliedData {
  characterId: string;
  effectId: string;
  effectName: string;
  effectType: 'buff' | 'debuff' | 'condition';
  value: number;
  duration?: number;
  description?: string;
}
