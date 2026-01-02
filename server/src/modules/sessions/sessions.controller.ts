import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionAuthGuard } from '../../common/guards/session-auth.guard';
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
import type { Request } from 'express';
import type { User } from '../../shared/schema';

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
   * Helper to get user ID from request
   */
  private getUserId(req: Request): string {
    return ((req as any).user as User).id;
  }

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
  @UseGuards(SessionAuthGuard)
  async createSession(
    @Body(new ZodValidationPipe(createSessionSchema)) data: CreateSessionDto,
    @Req() req: Request,
  ) {
    const gmId = this.getUserId(req);
    const session = await this.sessionsService.createSession(gmId, data);
    return session;
  }

  /**
   * Get all sessions for the authenticated GM
   * GET /api/sessions
   */
  @Get('sessions')
  @UseGuards(SessionAuthGuard)
  async getGMSessions(@Req() req: Request) {
    const gmId = this.getUserId(req);
    const sessions = await this.sessionsService.getSessionsByGM(gmId);
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
  @UseGuards(SessionAuthGuard)
  async updateSession(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateSessionSchema)) data: UpdateSessionDto,
    @Req() req: Request,
  ) {
    const gmId = this.getUserId(req);
    const session = await this.sessionsService.updateSession(id, gmId, data);
    return session;
  }

  /**
   * Delete a session (GM authenticated + owner check)
   * DELETE /api/sessions/:id
   */
  @Delete('sessions/:id')
  @UseGuards(SessionAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteSession(@Param('id') id: string, @Req() req: Request) {
    const gmId = this.getUserId(req);
    await this.sessionsService.deleteSession(id, gmId);
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
  @UseGuards(SessionAuthGuard)
  async createChapter(
    @Param('sessionId') sessionId: string,
    @Body(new ZodValidationPipe(createChapterSchema)) data: CreateChapterDto,
    @Req() req: Request,
  ) {
    const gmId = this.getUserId(req);
    const chapter = await this.sessionsService.createChapter(sessionId, gmId, data);
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
  @UseGuards(SessionAuthGuard)
  async updateChapter(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateChapterSchema)) data: UpdateChapterDto,
    @Req() req: Request,
  ) {
    const gmId = this.getUserId(req);
    const chapter = await this.sessionsService.updateChapter(id, gmId, data);
    return chapter;
  }

  /**
   * Delete a chapter (GM authenticated + owner check)
   * DELETE /api/chapters/:id
   */
  @Delete('chapters/:id')
  @UseGuards(SessionAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteChapter(@Param('id') id: string, @Req() req: Request) {
    const gmId = this.getUserId(req);
    await this.sessionsService.deleteChapter(id, gmId);
    return { message: 'Chapter deleted successfully' };
  }
}
