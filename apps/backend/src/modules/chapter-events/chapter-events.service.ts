import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { chapterEvents } from '@shared/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ChapterEventsService {
  constructor(private readonly db: DatabaseService) {}

  async findByChapter(chapterId: string) {
    return this.db.db.query.chapterEvents.findMany({
      where: eq(chapterEvents.chapterId, chapterId),
      orderBy: (chapterEvents, { desc }) => [desc(chapterEvents.createdAt)],
    });
  }

  async findBySession(sessionId: string) {
    return this.db.db.query.chapterEvents.findMany({
      where: eq(chapterEvents.sessionId, sessionId),
      orderBy: (chapterEvents, { desc }) => [desc(chapterEvents.createdAt)],
    });
  }

  async findOne(id: string) {
    const event = await this.db.db.query.chapterEvents.findFirst({
      where: eq(chapterEvents.id, id),
    });
    if (!event) {
      throw new NotFoundException(`Chapter event ${id} not found`);
    }
    return event;
  }

  async create(data: any) {
    const [event] = await this.db.db
      .insert(chapterEvents)
      .values(data)
      .returning();
    return event;
  }

  async update(id: string, data: any) {
    const [updated] = await this.db.db
      .update(chapterEvents)
      .set(data)
      .where(eq(chapterEvents.id, id))
      .returning();
    if (!updated) {
      throw new NotFoundException(`Chapter event ${id} not found`);
    }
    return updated;
  }

  async delete(id: string) {
    const result = await this.db.db
      .delete(chapterEvents)
      .where(eq(chapterEvents.id, id))
      .returning();
    if (result.length === 0) {
      throw new NotFoundException(`Chapter event ${id} not found`);
    }
  }
}
