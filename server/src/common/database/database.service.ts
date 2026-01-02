import { Injectable, Inject, OnModuleDestroy } from '@nestjs/common';
import { DRIZZLE_ORM, DATABASE_CONNECTION } from './database.constants';
import { Pool } from 'pg';
import * as schema from '../../shared/schema';
import { eq, and, desc } from 'drizzle-orm';
import type {
  Character,
  GameSession,
  ActiveEffect,
  RollHistory,
  NarrativeEntry,
} from '../../shared/schema';

export type DrizzleDB = ReturnType<typeof import('drizzle-orm/node-postgres').drizzle<typeof schema>>;

// Export Insert types (use $inferSelect, remove auto-generated, make fields-with-defaults optional)
export type InsertCharacter = Omit<typeof schema.characters.$inferSelect, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertGameSession = Omit<typeof schema.gameSessions.$inferSelect, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertChapter = Omit<typeof schema.chapters.$inferSelect, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertActiveEffect = Partial<Omit<typeof schema.activeEffects.$inferSelect, 'id' | 'createdAt'>> & {
  characterId: string;
  name: string;
  type: string;
};
export type InsertRollHistory = Omit<typeof schema.rollHistory.$inferSelect, 'id' | 'createdAt'>;
export type InsertNarrativeEntry = Partial<Omit<typeof schema.narrativeEntries.$inferSelect, 'id' | 'createdAt' | 'updatedAt'>> & {
  sessionId: string;
  gmId: string;
  content: string;
};

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  constructor(
    @Inject(DRIZZLE_ORM) private readonly drizzle: DrizzleDB,
    @Inject(DATABASE_CONNECTION) private readonly pool: Pool,
  ) {}

  /**
   * Get the Drizzle client for direct queries
   * IMPORTANT: Réutilise exactement le même schéma que l'Express backend
   */
  get client(): DrizzleDB {
    return this.drizzle;
  }

  /**
   * Get the database schema
   */
  get schema() {
    return schema;
  }

  /**
   * Execute a transaction
   */
  async transaction<T>(callback: (tx: any) => Promise<T>): Promise<T> {
    return this.client.transaction(callback);
  }

  // Character operations
  async getCharacter(id: string): Promise<Character | undefined> {
    const [character] = await this.drizzle
      .select()
      .from(schema.characters)
      .where(eq(schema.characters.id, id));
    return character;
  }

  async updateCharacter(id: string, data: Partial<InsertCharacter>): Promise<Character> {
    const [character] = await this.drizzle
      .update(schema.characters)
      .set(data)
      .where(eq(schema.characters.id, id))
      .returning();
    return character;
  }

  async getCharactersBySession(sessionId: string): Promise<Character[]> {
    return await this.drizzle
      .select()
      .from(schema.characters)
      .where(and(eq(schema.characters.sessionId, sessionId), eq(schema.characters.isActive, true)))
      .orderBy(desc(schema.characters.createdAt));
  }

  async getAllCharacters(): Promise<Character[]> {
    return await this.drizzle
      .select()
      .from(schema.characters)
      .where(eq(schema.characters.isActive, true))
      .orderBy(desc(schema.characters.createdAt));
  }

  // GameSession operations
  async getGameSession(id: string): Promise<GameSession | undefined> {
    const [session] = await this.drizzle
      .select()
      .from(schema.gameSessions)
      .where(eq(schema.gameSessions.id, id));
    return session;
  }

  // ActiveEffect operations
  async addActiveEffect(effect: InsertActiveEffect): Promise<ActiveEffect> {
    const [newEffect] = await this.drizzle
      .insert(schema.activeEffects)
      .values(effect)
      .returning();
    return newEffect;
  }

  async addActiveEffects(effects: InsertActiveEffect[]): Promise<ActiveEffect[]> {
    if (effects.length === 0) return [];
    const newEffects = await this.drizzle
      .insert(schema.activeEffects)
      .values(effects)
      .returning();
    return newEffects;
  }

  async updateActiveEffect(id: string, data: Partial<InsertActiveEffect>): Promise<ActiveEffect> {
    const [effect] = await this.drizzle
      .update(schema.activeEffects)
      .set(data)
      .where(eq(schema.activeEffects.id, id))
      .returning();
    return effect;
  }

  async deleteActiveEffect(id: string): Promise<void> {
    await this.drizzle
      .delete(schema.activeEffects)
      .where(eq(schema.activeEffects.id, id));
  }

  // RollHistory operations
  async addRollHistory(roll: InsertRollHistory): Promise<RollHistory> {
    const [newRoll] = await this.drizzle
      .insert(schema.rollHistory)
      .values(roll)
      .returning();
    return newRoll;
  }

  async getSessionRollHistory(sessionId: string, limit: number = 50): Promise<RollHistory[]> {
    return await this.drizzle
      .select()
      .from(schema.rollHistory)
      .where(eq(schema.rollHistory.sessionId, sessionId))
      .orderBy(desc(schema.rollHistory.createdAt))
      .limit(limit);
  }

  // NarrativeEntry operations
  async createNarrativeEntry(entry: InsertNarrativeEntry): Promise<NarrativeEntry> {
    const [narrativeEntry] = await this.drizzle
      .insert(schema.narrativeEntries)
      .values(entry)
      .returning();
    return narrativeEntry;
  }

  async getNarrativeEntry(id: string): Promise<NarrativeEntry | undefined> {
    const [entry] = await this.drizzle
      .select()
      .from(schema.narrativeEntries)
      .where(eq(schema.narrativeEntries.id, id));
    return entry;
  }

  async getSessionNarrativeEntries(sessionId: string): Promise<NarrativeEntry[]> {
    return await this.drizzle
      .select()
      .from(schema.narrativeEntries)
      .where(eq(schema.narrativeEntries.sessionId, sessionId))
      .orderBy(desc(schema.narrativeEntries.createdAt));
  }

  async updateNarrativeEntry(id: string, data: Partial<InsertNarrativeEntry>): Promise<NarrativeEntry> {
    const [entry] = await this.drizzle
      .update(schema.narrativeEntries)
      .set(data)
      .where(eq(schema.narrativeEntries.id, id))
      .returning();
    return entry;
  }

  async deleteNarrativeEntry(id: string): Promise<void> {
    await this.drizzle
      .delete(schema.narrativeEntries)
      .where(eq(schema.narrativeEntries.id, id));
  }

  /**
   * Cleanup on module destruction
   */
  async onModuleDestroy() {
    await this.pool.end();
  }
}
