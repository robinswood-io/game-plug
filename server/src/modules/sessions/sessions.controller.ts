import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard, User } from '@robinswood/auth';
import type { IAuthUser } from '@robinswood/auth';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  createSessionSchema,
  type CreateSessionDto,
} from './dto/create-session.dto';
import {
  updateSessionSchema,
  type UpdateSessionDto,
} from './dto/update-session.dto';
import {
  createChapterSchema,
  type CreateChapterDto,
} from './dto/create-chapter.dto';
import {
  updateChapterSchema,
  type UpdateChapterDto,
} from './dto/update-chapter.dto';

/**
 * Sessions Controller
 * Handles game sessions and chapters endpoints
 *
 * Sessions endpoints:
 * - GET /api/sessions/join/:code - Join session by code (public)
 * - POST /api/sessions - Create session (GM auth)
 * - GET /api/sessions - List GM's sessions (GM auth)
 * - GET /api/sessions/:id - Get session by ID (public)
 * - PATCH /api/sessions/:id - Update session (GM auth + owner)
 * - DELETE /api/sessions/:id - Delete session (GM auth + owner)
 * - GET /api/sessions/:id/characters - Get session characters (public)
 *
 * Chapters endpoints:
 * - POST /api/sessions/:sessionId/chapters - Create chapter (GM auth + owner)
 * - GET /api/sessions/:sessionId/chapters - List chapters (public)
 * - PATCH /api/chapters/:id - Update chapter (GM auth + owner)
 * - DELETE /api/chapters/:id - Delete chapter (GM auth + owner)
 */
@Controller('api')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  /**
   * Join a session by code (public)
   * GET /api/sessions/join/:code
   */
  @Get('sessions/join/:code')
  async joinSessionByCode(@Param('code') code: string) {
    const session = await this.sessionsService.getSessionByCode(code);
    return session;
  }

  /**
   * Create a new session (GM authenticated)
   * POST /api/sessions
   */
  @Post('sessions')
  @UseGuards(JwtAuthGuard)
  async createSession(
    @Body(new ZodValidationPipe(createSessionSchema)) data: CreateSessionDto,
    @User() user: IAuthUser,
  ) {
    const session = await this.sessionsService.createSessionByEmail(user.email, data);
    return session;
  }

  /**
   * Get all sessions for the authenticated GM
   * GET /api/sessions
   */
  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  async getGMSessions(@User() user: IAuthUser) {
    const sessions = await this.sessionsService.getSessionsByGMEmail(user.email);
    return sessions;
  }

  /**
   * Get a session by ID (public)
   * GET /api/sessions/:id
   */
  @Get('sessions/:id')
  async getSession(@Param('id') id: string) {
    const session = await this.sessionsService.getSessionById(id);
    return session;
  }

  /**
   * Update a session (GM authenticated + owner check)
   * PATCH /api/sessions/:id
   */
  @Patch('sessions/:id')
  @UseGuards(JwtAuthGuard)
  async updateSession(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateSessionSchema)) data: UpdateSessionDto,
    @User() user: IAuthUser,
  ) {
    const session = await this.sessionsService.updateSessionByEmail(id, user.email, data);
    return session;
  }

  /**
   * Delete a session (GM authenticated + owner check)
   * DELETE /api/sessions/:id
   */
  @Delete('sessions/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteSession(@Param('id') id: string, @User() user: IAuthUser) {
    await this.sessionsService.deleteSessionByEmail(id, user.email);
    return { message: 'Session deleted successfully' };
  }

  /**
   * Get all characters for a session (public)
   * GET /api/sessions/:id/characters
   */
  @Get('sessions/:id/characters')
  async getSessionCharacters(@Param('id') id: string) {
    const characters = await this.sessionsService.getSessionCharacters(id);
    return characters;
  }

  /**
   * Create a chapter (GM authenticated + owner check)
   * POST /api/sessions/:sessionId/chapters
   */
  @Post('sessions/:sessionId/chapters')
  @UseGuards(JwtAuthGuard)
  async createChapter(
    @Param('sessionId') sessionId: string,
    @Body(new ZodValidationPipe(createChapterSchema)) data: CreateChapterDto,
    @User() user: IAuthUser,
  ) {
    const chapter = await this.sessionsService.createChapterByEmail(sessionId, user.email, data);
    return chapter;
  }

  /**
   * Get all chapters for a session (public)
   * GET /api/sessions/:sessionId/chapters
   */
  @Get('sessions/:sessionId/chapters')
  async getSessionChapters(@Param('sessionId') sessionId: string) {
    const chapters = await this.sessionsService.getSessionChapters(sessionId);
    return chapters;
  }

  /**
   * Update a chapter (GM authenticated + owner check)
   * PATCH /api/chapters/:id
   */
  @Patch('chapters/:id')
  @UseGuards(JwtAuthGuard)
  async updateChapter(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateChapterSchema)) data: UpdateChapterDto,
    @User() user: IAuthUser,
  ) {
    const chapter = await this.sessionsService.updateChapterByEmail(id, user.email, data);
    return chapter;
  }

  /**
   * Delete a chapter (GM authenticated + owner check)
   * DELETE /api/chapters/:id
   */
  @Delete('chapters/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteChapter(@Param('id') id: string, @User() user: IAuthUser) {
    await this.sessionsService.deleteChapterByEmail(id, user.email);
    return { message: 'Chapter deleted successfully' };
  }
}
