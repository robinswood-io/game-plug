import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { DatabaseService } from '../../common/database/database.service';
import { JwtAuthGuard, User } from '@robinswood/auth';
import type { IAuthUser } from '@robinswood/auth';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { GenerateAvatarDto, generateAvatarSchema } from './dto/generate-avatar.dto';
import { GenerateSceneDto, generateSceneSchema } from './dto/generate-scene.dto';

@Controller('api')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly db: DatabaseService,
  ) {}

  /**
   * Generate a character avatar without saving (preview mode)
   * POST /api/generate-avatar
   */
  @Post('generate-avatar')
  @UseGuards(JwtAuthGuard)
  async generateAvatar(
    @Body(new ZodValidationPipe(generateAvatarSchema)) dto: GenerateAvatarDto,
  ) {
    try {
      const { url } = await this.aiService.generateCharacterAvatar(
        dto.description,
        dto.characterName,
        dto.occupation,
        dto.age,
      );

      return { avatarUrl: url };
    } catch (error) {
      console.error('Error generating avatar:', error);
      throw new HttpException('Failed to generate avatar', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Generate and save avatar for a specific character
   * POST /api/characters/:characterId/generate-avatar
   */
  @Post('characters/:characterId/generate-avatar')
  async generateCharacterAvatar(@Param('characterId') characterId: string) {
    try {
      // Get character data
      const character = await this.db.getCharacter(characterId);
      if (!character) {
        throw new HttpException('Character not found', HttpStatus.NOT_FOUND);
      }

      // Build description from character stats
      const description = this.aiService.buildAvatarDescription(character);

      // Generate avatar with permanent storage
      const { url } = await this.aiService.generateCharacterAvatar(
        description,
        character.name,
        character.occupation || undefined,
        character.age || undefined,
        character.id,
      );

      // Update character with avatar URL
      await this.db.updateCharacter(character.id, {
        avatarUrl: url,
        avatarPrompt: description,
      });

      return {
        message: 'Avatar generated successfully',
        avatarUrl: url,
        characterId: character.id,
        characterName: character.name,
      };
    } catch (error) {
      console.error('Error generating avatar:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to generate avatar', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Generate avatars for all characters in a session (GM only)
   * POST /api/sessions/:sessionId/generate-all-avatars
   */
  @Post('sessions/:sessionId/generate-all-avatars')
  @UseGuards(JwtAuthGuard)
  async generateSessionAvatars(
    @Param('sessionId') sessionId: string,
    @Body() body: { forceRegenerate?: boolean },
    @User() user: IAuthUser,
  ) {
    try {
      const userId = await this.db.getUserIdByEmail(user.email);
      const { forceRegenerate = false } = body;

      // Check if user is GM
      const session = await this.db.getGameSession(sessionId);
      if (!session || session.gmId !== userId) {
        throw new HttpException('Only the GM can generate avatars for all characters', HttpStatus.FORBIDDEN);
      }

      // Get all characters in the session
      const characters = await this.db.getCharactersBySession(sessionId);

      // Filter characters based on forceRegenerate option
      const charactersToGenerate = forceRegenerate ? characters : characters.filter((c: any) => !c.avatarUrl);

      if (charactersToGenerate.length === 0) {
        return {
          message: 'All characters already have avatars',
          generated: 0,
        };
      }

      const results = [];
      const errors = [];

      for (const character of charactersToGenerate) {
        try {
          // Build description based on character data
          const description = this.aiService.buildAvatarDescription(character);

          const { url } = await this.aiService.generateCharacterAvatar(
            description,
            character.name,
            character.occupation || undefined,
            character.age || undefined,
            character.id,
          );

          // Update character with avatar URL
          await this.db.updateCharacter(character.id, {
            avatarUrl: url,
            avatarPrompt: description,
          });

          results.push({
            characterId: character.id,
            characterName: character.name,
            avatarUrl: url,
          });

          // Add a small delay to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Failed to generate avatar for ${character.name}:`, error);
          errors.push({
            characterId: character.id,
            characterName: character.name,
            error: 'Failed to generate avatar',
          });
        }
      }

      return {
        message: `Generated ${results.length} avatars`,
        generated: results.length,
        failed: errors.length,
        results,
        errors,
      };
    } catch (error) {
      console.error('Error generating avatars:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to generate avatars', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Migrate existing avatars from external URLs to local storage
   * POST /api/migrate-avatars
   */
  @Post('migrate-avatars')
  @UseGuards(JwtAuthGuard)
  async migrateAvatars(@User() user: IAuthUser) {
    try {
      console.log(`Avatar migration triggered by user ${user.email}`);

      const result = await this.aiService.migrateExistingAvatars();

      return {
        message: 'Avatar migration completed',
        ...result,
      };
    } catch (error) {
      console.error('Error migrating avatars:', error);
      throw new HttpException('Failed to migrate avatars', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Generate a scene image for GameBoard projection (GM only)
   * POST /api/gameboard/generate-scene
   */
  @Post('gameboard/generate-scene')
  @UseGuards(JwtAuthGuard)
  async generateScene(
    @Body(new ZodValidationPipe(generateSceneSchema)) dto: GenerateSceneDto,
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
