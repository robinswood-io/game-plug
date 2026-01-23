import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { gameSessions } from '@shared/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class SessionsService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(gmId?: string) {
    if (gmId) {
      return this.db.db.query.gameSessions.findMany({
        where: eq(gameSessions.gmId, gmId),
      });
    }
    return this.db.db.query.gameSessions.findMany();
  }

  async findOne(id: string) {
    const session = await this.db.db.query.gameSessions.findFirst({
      where: eq(gameSessions.id, id),
    });
    if (!session) {
      throw new NotFoundException(`Session ${id} not found`);
    }
    return session;
  }

  async create(data: any) {
    const [session] = await this.db.db
      .insert(gameSessions)
      .values(data)
      .returning();
    return session;
  }

  async update(id: string, data: any) {
    const [updated] = await this.db.db
      .update(gameSessions)
      .set(data)
      .where(eq(gameSessions.id, id))
      .returning();
    return updated;
  }

  async delete(id: string) {
    await this.db.db.delete(gameSessions).where(eq(gameSessions.id, id));
  }
}
