import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { narrativeEntries } from '@shared/schema';
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

  async findOne(id: string) {
    const entry = await this.db.db.query.narrativeEntries.findFirst({
      where: eq(narrativeEntries.id, id),
    });
    if (!entry) {
      throw new NotFoundException(`Narrative entry ${id} not found`);
    }
    return entry;
  }

  async create(data: any) {
    const [entry] = await this.db.db
      .insert(narrativeEntries)
      .values(data)
      .returning();
    return entry;
  }

  async update(id: string, data: any) {
    const [updated] = await this.db.db
      .update(narrativeEntries)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(narrativeEntries.id, id))
      .returning();
    if (!updated) {
      throw new NotFoundException(`Narrative entry ${id} not found`);
    }
    return updated;
  }

  async delete(id: string) {
    const result = await this.db.db
      .delete(narrativeEntries)
      .where(eq(narrativeEntries.id, id))
      .returning();
    if (result.length === 0) {
      throw new NotFoundException(`Narrative entry ${id} not found`);
    }
  }
}
