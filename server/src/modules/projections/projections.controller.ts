import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { DatabaseService } from '../../common/database/database.service';
import { JwtAuthGuard, User } from '@robinswood/auth';
import type { IAuthUser } from '@robinswood/auth';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { generateSceneSchema } from '../ai/dto/generate-scene.dto';

@Controller('api')
export class ProjectionsController {
  constructor(
    private readonly aiService: AiService,
    private readonly db: DatabaseService,
  ) {}

  /**
   * Generate a scene image for GameBoard projection (GM only)
   * POST /api/gameboard/generate-scene
   *
   * This route is a wrapper around the AI service for scene generation,
   * specifically designed for GameBoard projection use.
   */
  @Post('gameboard/generate-scene')
  @UseGuards(JwtAuthGuard)
  async generateScene(
    @Body(new ZodValidationPipe(generateSceneSchema)) dto: { prompt: string; description?: string },
    @Body() body: { sessionId?: string },
    @User() user: IAuthUser,
  ) {
    try {
      const userId = await this.db.getUserIdByEmail(user.email);
      const { prompt } = dto;
      const { sessionId } = body;

      if (!prompt) {
        throw new HttpException('Prompt is required', HttpStatus.BAD_REQUEST);
      }

      // Verify GM access to session if sessionId provided
      if (sessionId) {
        const session = await this.db.getGameSession(sessionId);
        if (!session || session.gmId !== userId) {
          throw new HttpException('Permission denied', HttpStatus.FORBIDDEN);
        }
      }

      const { url } = await this.aiService.generateSceneImage(prompt);
      return { imageUrl: url };
    } catch (error) {
      console.error('Error generating scene:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to generate scene', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
