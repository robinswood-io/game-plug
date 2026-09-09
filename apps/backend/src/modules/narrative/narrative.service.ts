import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { gameSessions, narrativeEntries } from '@shared/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class NarrativeService {
  constructor(private readonly db: DatabaseService) {}

  async findBySession(sessionId: string) {
    return this.db.db.query.narrativeEntries.findMany({
      where: eq(narrativeEntries.sessionId, sessionId),
      orderBy: (narrativeEntries, { desc }) => [desc(narrativeEntries.createdAt)],
    });
  }

  async findBySessionForGm(sessionId: string, gmId: string) {
    await this.assertSessionGm(sessionId, gmId);
    return this.findBySession(sessionId);
  }

  async findOne(id: string) {
    const entry = await this.db.db.query.narrativeEntries.findFirst({
      where: eq(narrativeEntries.id, id),
    });
    if (!entry) {
      throw new NotFoundException(`Narrative entry ${id} not found`);
    }
    return entry;
  }

  async findOneForGm(id: string, gmId: string) {
    const entry = await this.findOne(id);
    if (!entry.sessionId) {
      throw new ForbiddenException('Narrative entry is not attached to an authorized session');
    }
    await this.assertSessionGm(entry.sessionId, gmId);
    return entry;
  }

  async create(data: any, gmId: string) {
    await this.assertSessionGm(data.sessionId, gmId);
    const [entry] = await this.db.db
      .insert(narrativeEntries)
      .values({ ...data, gmId })
      .returning();
    return entry;
  }

  async update(id: string, data: any, gmId: string) {
    await this.findOneForGm(id, gmId);
    const { gmId: _gmId, sessionId: _sessionId, ...updateData } = data;
    const [updated] = await this.db.db
      .update(narrativeEntries)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(narrativeEntries.id, id))
      .returning();
    if (!updated) {
      throw new NotFoundException(`Narrative entry ${id} not found`);
    }
    return updated;
  }

  async delete(id: string, gmId: string) {
    await this.findOneForGm(id, gmId);
    const result = await this.db.db
      .delete(narrativeEntries)
      .where(eq(narrativeEntries.id, id))
      .returning();
    if (result.length === 0) {
      throw new NotFoundException(`Narrative entry ${id} not found`);
    }
  }

  private async assertSessionGm(sessionId: string, gmId: string) {
    const session = await this.db.db.query.gameSessions.findFirst({
      where: eq(gameSessions.id, sessionId),
    });

    if (!session || session.gmId !== gmId) {
      throw new ForbiddenException('Only the GM can access narrative entries for this session');
    }
  }
}
