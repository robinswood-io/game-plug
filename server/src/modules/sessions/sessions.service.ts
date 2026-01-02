import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';
import { eq } from 'drizzle-orm';
import type { CreateSessionDto } from './dto/create-session.dto';
import type { UpdateSessionDto } from './dto/update-session.dto';
import type { CreateChapterDto } from './dto/create-chapter.dto';
import type { UpdateChapterDto } from './dto/update-chapter.dto';
import type { GameSession, Chapter } from '../../shared/schema';

/**
 * Sessions Service
 * Handles game sessions and chapters CRUD operations
 * Replicates logic from Express backend's storage layer
 */
@Injectable()
export class SessionsService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Generate a unique 6-character session code
   */
  private generateSessionCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Create a new game session
   */
  async createSession(gmId: string, data: CreateSessionDto): Promise<GameSession> {
    const sessionData = {
      ...data,
      gmId,
      code: this.generateSessionCode(),
      status: 'active' as const,
    };

    const [session] = await this.db.client
      .insert(this.db.schema.gameSessions)
      .values(sessionData as any) // Cast to bypass type issues - data validated by Zod
      .returning();

    return session;
  }

  /**
   * Get all sessions for a specific GM
   */
  async getSessionsByGM(gmId: string): Promise<GameSession[]> {
    const sessions = await this.db.client
      .select()
      .from(this.db.schema.gameSessions)
      .where(eq(this.db.schema.gameSessions.gmId, gmId));

    return sessions;
  }

  /**
   * Get a session by ID
   */
  async getSessionById(id: string): Promise<GameSession> {
    const [session] = await this.db.client
      .select()
      .from(this.db.schema.gameSessions)
      .where(eq(this.db.schema.gameSessions.id, id));

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  /**
   * Get a session by join code
   */
  async getSessionByCode(code: string): Promise<GameSession> {
    const [session] = await this.db.client
      .select()
      .from(this.db.schema.gameSessions)
      .where(eq(this.db.schema.gameSessions.code, code.toUpperCase()));

    if (!session || session.status !== 'active') {
      throw new NotFoundException('Session not found or inactive');
    }

    return session;
  }

  /**
   * Update a session
   */
  async updateSession(
    id: string,
    gmId: string,
    data: UpdateSessionDto,
  ): Promise<GameSession> {
    const session = await this.getSessionById(id);

    if (session.gmId !== gmId) {
      throw new ForbiddenException('Not authorized');
    }

    const [updatedSession] = await this.db.client
      .update(this.db.schema.gameSessions)
      .set(data)
      .where(eq(this.db.schema.gameSessions.id, id))
      .returning();

    return updatedSession;
  }

  /**
   * Delete a session
   */
  async deleteSession(id: string, gmId: string): Promise<void> {
    const session = await this.getSessionById(id);

    if (session.gmId !== gmId) {
      throw new ForbiddenException('Not authorized');
    }

    await this.db.client
      .delete(this.db.schema.gameSessions)
      .where(eq(this.db.schema.gameSessions.id, id));
  }

  /**
   * Get all characters for a session (with sanity conditions and active effects)
   */
  async getSessionCharacters(sessionId: string) {
    const characters = await this.db.client
      .select()
      .from(this.db.schema.characters)
      .where(eq(this.db.schema.characters.sessionId, sessionId));

    // Get sanity conditions and active effects for each character
    const charactersWithDetails = await Promise.all(
      characters.map(async (character) => {
        const [sanityConditions, activeEffects] = await Promise.all([
          this.db.client
            .select()
            .from(this.db.schema.sanityConditions)
            .where(eq(this.db.schema.sanityConditions.characterId, character.id)),
          this.db.client
            .select()
            .from(this.db.schema.activeEffects)
            .where(eq(this.db.schema.activeEffects.characterId, character.id)),
        ]);

        return { ...character, sanityConditions, activeEffects };
      }),
    );

    return charactersWithDetails;
  }

  /**
   * Create a chapter
   */
  async createChapter(sessionId: string, gmId: string, data: CreateChapterDto): Promise<Chapter> {
    const session = await this.getSessionById(sessionId);

    if (session.gmId !== gmId) {
      throw new ForbiddenException('Not authorized');
    }

    const chapterData = {
      ...data,
      sessionId,
    };

    const [chapter] = await this.db.client
      .insert(this.db.schema.chapters)
      .values(chapterData as any) // Cast to bypass type issues - data validated by Zod
      .returning();

    return chapter;
  }

  /**
   * Get all chapters for a session
   */
  async getSessionChapters(sessionId: string): Promise<Chapter[]> {
    const chapters = await this.db.client
      .select()
      .from(this.db.schema.chapters)
      .where(eq(this.db.schema.chapters.sessionId, sessionId));

    return chapters;
  }

  /**
   * Get a chapter by ID
   */
  async getChapterById(id: string): Promise<Chapter> {
    const [chapter] = await this.db.client
      .select()
      .from(this.db.schema.chapters)
      .where(eq(this.db.schema.chapters.id, id));

    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    return chapter;
  }

  /**
   * Update a chapter
   */
  async updateChapter(
    id: string,
    gmId: string,
    data: UpdateChapterDto,
  ): Promise<Chapter> {
    const chapter = await this.getChapterById(id);
    const session = await this.getSessionById(chapter.sessionId);

    if (session.gmId !== gmId) {
      throw new ForbiddenException('Not authorized');
    }

    const [updatedChapter] = await this.db.client
      .update(this.db.schema.chapters)
      .set(data)
      .where(eq(this.db.schema.chapters.id, id))
      .returning();

    return updatedChapter;
  }

  /**
   * Delete a chapter
   */
  async deleteChapter(id: string, gmId: string): Promise<void> {
    const chapter = await this.getChapterById(id);
    const session = await this.getSessionById(chapter.sessionId);

    if (session.gmId !== gmId) {
      throw new ForbiddenException('Not authorized');
    }

    await this.db.client
      .delete(this.db.schema.chapters)
      .where(eq(this.db.schema.chapters.id, id));
  }
}
