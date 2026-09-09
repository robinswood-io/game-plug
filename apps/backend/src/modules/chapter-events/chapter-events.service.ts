import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { chapterEvents, chapters, gameSessions } from '@shared/schema';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class ChapterEventsService {
  constructor(private readonly db: DatabaseService) {}

  async findByChapter(chapterId: string) {
    return this.db.db.query.chapterEvents.findMany({
      where: eq(chapterEvents.chapterId, chapterId),
      orderBy: (chapterEvents, { desc }) => [desc(chapterEvents.createdAt)],
    });
  }

  async findByChapterForGm(chapterId: string, gmId: string) {
    await this.assertChapterGm(chapterId, gmId);
    return this.findByChapter(chapterId);
  }

  async findBySession(sessionId: string) {
    return this.db.db.query.chapterEvents.findMany({
      where: eq(chapterEvents.sessionId, sessionId),
      orderBy: (chapterEvents, { desc }) => [desc(chapterEvents.createdAt)],
    });
  }

  async findBySessionForGm(sessionId: string, gmId: string) {
    await this.assertSessionGm(sessionId, gmId);
    return this.findBySession(sessionId);
  }

  async findImportantBySession(sessionId: string) {
    return this.db.db.query.chapterEvents.findMany({
      where: and(
        eq(chapterEvents.sessionId, sessionId),
        eq(chapterEvents.isImportant, true),
      ),
      orderBy: (chapterEvents, { desc }) => [desc(chapterEvents.createdAt)],
    });
  }

  async findImportantBySessionForGm(sessionId: string, gmId: string) {
    await this.assertSessionGm(sessionId, gmId);
    return this.findImportantBySession(sessionId);
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

  async findOneForGm(id: string, gmId: string) {
    const event = await this.findOne(id);
    if (!event.sessionId) {
      throw new ForbiddenException('Chapter event is not attached to an authorized session');
    }
    await this.assertSessionGm(event.sessionId, gmId);
    return event;
  }

  async create(data: any, gmId: string) {
    const chapter = await this.assertChapterGm(data.chapterId, gmId);
    const [event] = await this.db.db
      .insert(chapterEvents)
      .values({ ...data, sessionId: chapter.sessionId, userId: gmId })
      .returning();
    return event;
  }

  async update(id: string, data: any, gmId: string) {
    await this.findOneForGm(id, gmId);
    const { userId: _userId, sessionId: _sessionId, chapterId: _chapterId, ...updateData } = data;
    const [updated] = await this.db.db
      .update(chapterEvents)
      .set(updateData)
      .where(eq(chapterEvents.id, id))
      .returning();
    if (!updated) {
      throw new NotFoundException(`Chapter event ${id} not found`);
    }
    return updated;
  }

  async delete(id: string, gmId: string) {
    await this.findOneForGm(id, gmId);
    const result = await this.db.db
      .delete(chapterEvents)
      .where(eq(chapterEvents.id, id))
      .returning();
    if (result.length === 0) {
      throw new NotFoundException(`Chapter event ${id} not found`);
    }
  }

  private async assertChapterGm(chapterId: string, gmId: string) {
    const chapter = await this.db.db.query.chapters.findFirst({
      where: eq(chapters.id, chapterId),
    });

    if (!chapter?.sessionId) {
      throw new ForbiddenException('Chapter event is not attached to an authorized session');
    }

    await this.assertSessionGm(chapter.sessionId, gmId);
    return chapter;
  }

  private async assertSessionGm(sessionId: string, gmId: string) {
    const session = await this.db.db.query.gameSessions.findFirst({
      where: eq(gameSessions.id, sessionId),
    });

    if (!session || session.gmId !== gmId) {
      throw new ForbiddenException('Only the GM can access chapter events for this session');
    }
  }
}
