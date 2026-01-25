/**
 * Types TypeScript générés depuis la spécification OpenAPI
 * Game Plug API v1.0.0
 */

// ============================================================================
// Authentication Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  isGM: boolean;
  authType: 'local' | 'dev-bypass';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// ============================================================================
// Game Session Types
// ============================================================================

export interface GameSession {
  id: string;
  name: string;
  code?: string;
  gmId: string;
  status: 'preparation' | 'active' | 'ended';
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGameSessionRequest {
  name: string;
  code?: string;
  gmId: string;
}

export interface UpdateGameSessionRequest {
  name?: string;
  code?: string;
  status?: 'preparation' | 'active' | 'ended';
  isActive?: boolean;
}

// ============================================================================
// Character Types
// ============================================================================

export interface Character {
  id: string;
  userId?: string;
  sessionId: string;
  name: string;
  occupation: string;
  age?: number;
  birthplace?: string;
  residence?: string;
  gender?: string;
  height?: string;
  build?: string;
  hairColor?: string;
  eyeColor?: string;
  strength: number;
  constitution: number;
  size: number;
  dexterity: number;
  appearance: number;
  intelligence: number;
  power: number;
  education: number;
  luck: number;
  hitPoints: number;
  maxHitPoints: number;
  sanity: number;
  maxSanity: number;
  magicPoints: number;
  maxMagicPoints: number;
  avatarUrl?: string;
  avatarPrompt?: string;
  skills?: Record<string, number>;
  skillsLocked?: boolean;
  availableSkillPoints?: number;
  notes?: string;
  money?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCharacterRequest {
  userId?: string;
  sessionId: string;
  name: string;
  occupation: string;
  age?: number;
  birthplace?: string;
  residence?: string;
  gender?: string;
  height?: string;
  build?: string;
  hairColor?: string;
  eyeColor?: string;
  strength: number;
  constitution: number;
  size: number;
  dexterity: number;
  appearance: number;
  intelligence: number;
  power: number;
  education: number;
  luck: number;
  skills?: Record<string, number>;
  notes?: string;
  money?: string;
  avatarPrompt?: string;
}

export interface UpdateCharacterRequest {
  name?: string;
  occupation?: string;
  age?: number;
  birthplace?: string;
  residence?: string;
  gender?: string;
  height?: string;
  build?: string;
  hairColor?: string;
  eyeColor?: string;
  strength?: number;
  constitution?: number;
  size?: number;
  dexterity?: number;
  appearance?: number;
  intelligence?: number;
  power?: number;
  education?: number;
  luck?: number;
  hitPoints?: number;
  maxHitPoints?: number;
  sanity?: number;
  maxSanity?: number;
  magicPoints?: number;
  maxMagicPoints?: number;
  skills?: Record<string, number>;
  skillsLocked?: boolean;
  availableSkillPoints?: number;
  notes?: string;
  money?: string;
  avatarUrl?: string;
  avatarPrompt?: string;
  isActive?: boolean;
}

// ============================================================================
// Inventory Types
// ============================================================================

export type InventoryItemCategory = 'weapon' | 'armor' | 'tool' | 'book' | 'misc';

export interface InventoryItem {
  id: string;
  characterId: string;
  name: string;
  description?: string;
  category: InventoryItemCategory;
  quantity?: number;
  weight?: number;
  isEquipped?: boolean;
  damage?: string;
  armor?: number;
  properties?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInventoryItemRequest {
  characterId: string;
  name: string;
  description?: string;
  category: InventoryItemCategory;
  quantity?: number;
  weight?: number;
  isEquipped?: boolean;
  damage?: string;
  armor?: number;
  properties?: Record<string, unknown>;
}

export interface UpdateInventoryItemRequest {
  name?: string;
  description?: string;
  category?: InventoryItemCategory;
  quantity?: number;
  weight?: number;
  isEquipped?: boolean;
  damage?: string;
  armor?: number;
  properties?: Record<string, unknown>;
}

// ============================================================================
// Chapter Types
// ============================================================================

export interface Chapter {
  id: string;
  sessionId: string;
  name: string;
  description?: string;
  orderIndex: number;
  status: 'planned' | 'active' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChapterRequest {
  sessionId: string;
  name: string;
  description?: string;
  orderIndex: number;
  notes?: string;
}

export interface UpdateChapterRequest {
  name?: string;
  description?: string;
  orderIndex?: number;
  status?: 'planned' | 'active' | 'completed';
  notes?: string;
}

// ============================================================================
// Chapter Event Types
// ============================================================================

export type ChapterEventType =
  | 'roll'
  | 'narration'
  | 'decision'
  | 'sanity'
  | 'combat'
  | 'discovery'
  | 'milestone';

export interface ChapterEvent {
  id: string;
  chapterId: string;
  sessionId: string;
  eventType: ChapterEventType;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  characterId?: string;
  userId?: string;
  isImportant?: boolean;
  createdAt: string;
}

export interface CreateChapterEventRequest {
  chapterId: string;
  sessionId: string;
  eventType: ChapterEventType;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  characterId?: string;
  userId?: string;
  isImportant?: boolean;
}

export interface UpdateChapterEventRequest {
  eventType?: ChapterEventType;
  title?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  isImportant?: boolean;
}

// ============================================================================
// Narrative Types
// ============================================================================

export type NarrativeEntryType = 'note' | 'event' | 'npc' | 'location' | 'clue';

export interface NarrativeEntry {
  id: string;
  sessionId: string;
  gmId: string;
  content: string;
  entryType: NarrativeEntryType;
  isAiGenerated?: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNarrativeEntryRequest {
  sessionId: string;
  gmId: string;
  content: string;
  entryType: NarrativeEntryType;
  metadata?: Record<string, unknown>;
}

export interface UpdateNarrativeEntryRequest {
  content?: string;
  entryType?: NarrativeEntryType;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// Sanity Types
// ============================================================================

export type SanityConditionType =
  | 'phobia'
  | 'mania'
  | 'temporary_insanity'
  | 'indefinite_insanity';

export type SanityDuration = 'temporary' | 'indefinite' | 'permanent';

export interface SanityCondition {
  id: string;
  characterId: string;
  type: SanityConditionType;
  name: string;
  description?: string;
  isActive?: boolean;
  duration?: SanityDuration;
  createdAt: string;
}

export interface CreateSanityConditionRequest {
  characterId: string;
  type: SanityConditionType;
  name: string;
  description?: string;
  duration?: SanityDuration;
}

export interface UpdateSanityConditionRequest {
  type?: SanityConditionType;
  name?: string;
  description?: string;
  isActive?: boolean;
  duration?: SanityDuration;
}

// ============================================================================
// Dice Types
// ============================================================================

export type DiceRollType = 'skill' | 'sanity' | 'damage' | 'custom';

export type DiceRollOutcome =
  | 'success'
  | 'failure'
  | 'extreme_success'
  | 'hard_success';

export interface DiceRollRequest {
  diceFormula: string;
  rollType: DiceRollType;
  skillName?: string;
  skillValue?: number;
  characterId?: string;
  sessionId?: string;
  isGmRoll?: boolean;
}

export interface DiceRollResponse {
  id: string;
  diceFormula: string;
  result: number;
  outcome?: DiceRollOutcome;
  rollType: DiceRollType;
  skillName?: string;
  skillValue?: number;
  characterId?: string;
  sessionId?: string;
  userId?: string;
  isGmRoll?: boolean;
  createdAt: string;
}

// ============================================================================
// Health Check Types
// ============================================================================

export interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'down';
  timestamp: string;
  uptime?: number;
}

// ============================================================================
// Error Response Types
// ============================================================================

export interface ErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
}

export interface SuccessResponse {
  success: boolean;
}
