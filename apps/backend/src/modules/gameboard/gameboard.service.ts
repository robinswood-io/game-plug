import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateGameboardDto, UpdateGameboardDto } from './dto';
import { eq } from 'drizzle-orm';
import { gameSessions, characters, chapters, chapterEvents } from '@shared/schema';

@Injectable()
export class GameboardService {
  constructor(private readonly db: DatabaseService) {}

  async getGameboard(sessionId: string) {
    // Get session data
    const session = await this.db.db.query.gameSessions.findFirst({
      where: eq(gameSessions.id, sessionId),
      with: {
        gm: true,
        characters: true,
        chapters: {
          with: {
            events: true,
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }

    return {
      session,
      message: 'Gameboard retrieved successfully',
    };
  }

  async create(dto: CreateGameboardDto) {
    // Verify session exists
    const session = await this.db.db.query.gameSessions.findFirst({
      where: eq(gameSessions.id, dto.sessionId),
    });

    if (!session) {
      throw new NotFoundException(`Session ${dto.sessionId} not found`);
    }

    // For now, gameboard is a virtual concept aggregating session data
    // In the future, we could add a dedicated gameboards table if needed
    return {
      success: true,
      sessionId: dto.sessionId,
      title: dto.title,
      description: dto.description,
      characterIds: dto.characterIds || [],
      state: dto.state || {},
      message: 'Gameboard created (virtual concept based on session)',
    };
  }

  async update(id: string, dto: UpdateGameboardDto) {
    // Since gameboard is currently a virtual concept,
    // we update the underlying session if needed
    if (dto.sessionId) {
      const session = await this.db.db.query.gameSessions.findFirst({
        where: eq(gameSessions.id, dto.sessionId),
      });

      if (!session) {
        throw new NotFoundException(`Session ${dto.sessionId} not found`);
      }
    }

    return {
      success: true,
      id,
      updated: dto,
      message: 'Gameboard updated (virtual concept)',
    };
  }
}
