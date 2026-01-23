import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { chapters } from '@shared/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ChaptersService {
  constructor(private readonly db: DatabaseService) {}

  async findBySession(sessionId: string) {
    return this.db.db.query.chapters.findMany({
      where: eq(chapters.sessionId, sessionId),
      orderBy: (chapters, { asc }) => [asc(chapters.orderIndex)],
      with: {
        events: {
          orderBy: (events, { desc }) => [desc(events.createdAt)],
          limit: 5,
        },
      },
    });
  }

  async findOne(id: string) {
    const chapter = await this.db.db.query.chapters.findFirst({
      where: eq(chapters.id, id),
      with: {
        events: {
          orderBy: (events, { desc }) => [desc(events.createdAt)],
        },
      },
    });
    if (!chapter) {
      throw new NotFoundException(`Chapter ${id} not found`);
    }
    return chapter;
  }

  async create(data: any) {
    const [chapter] = await this.db.db
      .insert(chapters)
      .values(data)
      .returning();
    return chapter;
  }

  async update(id: string, data: any) {
    const [updated] = await this.db.db
      .update(chapters)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(chapters.id, id))
      .returning();
    if (!updated) {
      throw new NotFoundException(`Chapter ${id} not found`);
    }
    return updated;
  }

  async delete(id: string) {
    const result = await this.db.db
      .delete(chapters)
      .where(eq(chapters.id, id))
      .returning();
    if (result.length === 0) {
      throw new NotFoundException(`Chapter ${id} not found`);
    }
  }
}
