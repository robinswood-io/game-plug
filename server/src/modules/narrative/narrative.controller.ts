import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';
import { AiService } from '../ai/ai.service';
import { JwtAuthGuard, User } from '@robinswood/auth';
import type { IAuthUser } from '@robinswood/auth';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { CreateNarrativeDto, createNarrativeSchema } from './dto/create-narrative.dto';
import { UpdateNarrativeDto, updateNarrativeSchema } from './dto/update-narrative.dto';
import { narrativeSuggestionSchema } from '../ai/dto/narrative-suggestion.dto';

@Controller('api')
export class NarrativeController {
  constructor(
    private readonly db: DatabaseService,
    private readonly aiService: AiService,
  ) {}

  /**
   * Get narrative entries for a session (GM only)
   * GET /api/sessions/:sessionId/narrative
   */
  @Get('sessions/:sessionId/narrative')
  @UseGuards(JwtAuthGuard)
  async getSessionNarrativeEntries(@Param('sessionId') sessionId: string, @User() user: IAuthUser) {
    try {
      const userId = await this.db.getUserIdByEmail(user.email);

      // Check if user is GM of the session
      const session = await this.db.getGameSession(sessionId);
      if (!session || session.gmId !== userId) {
        throw new HttpException('Only the GM can access narrative entries', HttpStatus.FORBIDDEN);
      }

      const entries = await this.db.getSessionNarrativeEntries(sessionId);
      return entries;
    } catch (error) {
      console.error('Error fetching narrative entries:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to fetch narrative entries', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Create new narrative entry (GM only)
   * POST /api/sessions/:sessionId/narrative
   */
  @Post('sessions/:sessionId/narrative')
  @UseGuards(JwtAuthGuard)
  async createNarrativeEntry(
    @Param('sessionId') sessionId: string,
    @Body(new ZodValidationPipe(createNarrativeSchema)) dto: CreateNarrativeDto,
    @User() user: IAuthUser,
  ) {
    try {
      const userId = await this.db.getUserIdByEmail(user.email);

      // Check if user is GM of the session
      const session = await this.db.getGameSession(sessionId);
      if (!session || session.gmId !== userId) {
        throw new HttpException('Only the GM can create narrative entries', HttpStatus.FORBIDDEN);
      }

      const entry = await this.db.createNarrativeEntry({
        sessionId,
        gmId: userId,
        content: dto.content,
        entryType: dto.entryType || 'note',
        isAiGenerated: dto.isAiGenerated || false,
      });

      return entry;
    } catch (error) {
      console.error('Error creating narrative entry:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to create narrative entry', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get AI narrative suggestion (GM only)
   * POST /api/sessions/:sessionId/narrative/ai-suggest
   */
  @Post('sessions/:sessionId/narrative/ai-suggest')
  @UseGuards(JwtAuthGuard)
  async getAiNarrativeSuggestion(
    @Param('sessionId') sessionId: string,
    @Body(new ZodValidationPipe(narrativeSuggestionSchema)) dto: { context: string },
    @User() user: IAuthUser,
  ) {
    try {
      const userId = await this.db.getUserIdByEmail(user.email);

      // Check if user is GM of the session
      const session = await this.db.getGameSession(sessionId);
      if (!session || session.gmId !== userId) {
        throw new HttpException('Only the GM can request AI suggestions', HttpStatus.FORBIDDEN);
      }

      const suggestion = await this.aiService.generateNarrativeSuggestion(dto.context);

      return { suggestion };
    } catch (error) {
      console.error('Error generating AI narrative suggestion:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to generate AI suggestion', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Update narrative entry (GM only)
   * PATCH /api/narrative/:id
   */
  @Patch('narrative/:id')
  @UseGuards(JwtAuthGuard)
  async updateNarrativeEntry(
    @Param('id') entryId: string,
    @Body(new ZodValidationPipe(updateNarrativeSchema)) dto: UpdateNarrativeDto,
    @User() user: IAuthUser,
  ) {
    try {
      const userId = await this.db.getUserIdByEmail(user.email);

      // Get entry to check ownership
      const entry = await this.db.getNarrativeEntry(entryId);
      if (!entry) {
        throw new HttpException('Narrative entry not found', HttpStatus.NOT_FOUND);
      }

      // Check if user is GM
      const session = await this.db.getGameSession(entry.sessionId);
      if (!session || session.gmId !== userId) {
        throw new HttpException('Only the GM can update narrative entries', HttpStatus.FORBIDDEN);
      }

      const updatedEntry = await this.db.updateNarrativeEntry(entryId, dto);
      return updatedEntry;
    } catch (error) {
      console.error('Error updating narrative entry:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to update narrative entry', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Delete narrative entry (GM only)
   * DELETE /api/narrative/:id
   */
  @Delete('narrative/:id')
  @UseGuards(JwtAuthGuard)
  async deleteNarrativeEntry(@Param('id') entryId: string, @User() user: IAuthUser) {
    try {
      const userId = await this.db.getUserIdByEmail(user.email);

      // Get entry to check ownership
      const entry = await this.db.getNarrativeEntry(entryId);
      if (!entry) {
        throw new HttpException('Narrative entry not found', HttpStatus.NOT_FOUND);
      }

      // Check if user is GM
      const session = await this.db.getGameSession(entry.sessionId);
      if (!session || session.gmId !== userId) {
        throw new HttpException('Only the GM can delete narrative entries', HttpStatus.FORBIDDEN);
      }

      await this.db.deleteNarrativeEntry(entryId);
      return { message: 'Narrative entry deleted successfully' };
    } catch (error) {
      console.error('Error deleting narrative entry:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to delete narrative entry', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Toggle narrative entry visibility to players (GM only)
   * PATCH /api/narrative/:id/toggle-visibility
   */
  @Patch('narrative/:id/toggle-visibility')
  @UseGuards(JwtAuthGuard)
  async toggleNarrativeVisibility(@Param('id') entryId: string, @User() user: IAuthUser) {
    try {
      const userId = await this.db.getUserIdByEmail(user.email);

      // Get entry to check ownership and current visibility
      const entry = await this.db.getNarrativeEntry(entryId);
      if (!entry) {
        throw new HttpException('Narrative entry not found', HttpStatus.NOT_FOUND);
      }

      // Check if user is GM
      const session = await this.db.getGameSession(entry.sessionId);
      if (!session || session.gmId !== userId) {
        throw new HttpException('Only the GM can toggle entry visibility', HttpStatus.FORBIDDEN);
      }

      // Toggle visibility (stored in metadata since schema doesn't have isVisibleToPlayers field)
      const currentMetadata = (entry.metadata as Record<string, unknown>) || {};
      const isCurrentlyVisible = currentMetadata.isVisibleToPlayers !== false; // default true

      const updatedEntry = await this.db.updateNarrativeEntry(entryId, {
        metadata: {
          ...currentMetadata,
          isVisibleToPlayers: !isCurrentlyVisible,
        },
      });

      return updatedEntry;
    } catch (error) {
      console.error('Error toggling narrative visibility:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to toggle visibility', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
