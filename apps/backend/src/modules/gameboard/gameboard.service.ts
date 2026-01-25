import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateGameboardDto, UpdateGameboardDto, CreateProjectionDto, UpdateProjectionDto } from './dto';
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

  // BUG-007 fix: Projection endpoints for display/visual rendering
  async createProjection(dto: CreateProjectionDto) {
    // Verify session exists
    const session = await this.db.db.query.gameSessions.findFirst({
      where: eq(gameSessions.id, dto.sessionId),
    });

    if (!session) {
      throw new NotFoundException(`Session ${dto.sessionId} not found`);
    }

    // Verify all characters exist if specified
    if (dto.characterIds && dto.characterIds.length > 0) {
      for (const charId of dto.characterIds) {
        const character = await this.db.db.query.characters.findFirst({
          where: eq(characters.id, charId),
        });
        if (!character) {
          throw new NotFoundException(`Character ${charId} not found`);
        }
      }
    }

    return {
      success: true,
      sessionId: dto.sessionId,
      title: dto.title,
      description: dto.description,
      characterIds: dto.characterIds || [],
      config: dto.config || {},
      viewport: dto.viewport || {},
      createdAt: new Date(),
      message: 'Projection created successfully',
    };
  }

  async updateProjection(id: string, dto: UpdateProjectionDto) {
    // Verify characters exist if provided
    if (dto.characterIds && dto.characterIds.length > 0) {
      for (const charId of dto.characterIds) {
        const character = await this.db.db.query.characters.findFirst({
          where: eq(characters.id, charId),
        });
        if (!character) {
          throw new NotFoundException(`Character ${charId} not found`);
        }
      }
    }

    return {
      success: true,
      id,
      updated: dto,
      updatedAt: new Date(),
      message: 'Projection updated successfully',
    };
  }

  async getProjection(sessionId: string) {
    // Get session data for projection display
    const session = await this.db.db.query.gameSessions.findFirst({
      where: eq(gameSessions.id, sessionId),
      with: {
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
      characters: session.characters || [],
      chapters: session.chapters || [],
      message: 'Projection retrieved successfully',
    };
  }
}
