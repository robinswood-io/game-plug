import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  GenerateAvatarDto,
  GenerateSceneDto,
  SuggestNarrativeDto,
  GenerateCharacterAvatarDto,
  GenerateSessionAvatarsDto,
  MigrateAvatarsDto,
} from './dto';

@Controller('api/ai')
@ApiTags('ai')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-avatar')
  @ApiOperation({
    summary: 'Generate an AI avatar image for a character',
    description: 'Uses AI to generate a character portrait based on physical description and attributes',
  })
  @ApiResponse({ status: 201, description: 'Avatar generated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid avatar generation parameters' })
  @ApiResponse({ status: 403, description: 'Permission denied or quota exceeded' })
  async generateAvatar(@Body() dto: GenerateAvatarDto) {
    return this.aiService.generateAvatar(dto);
  }

  @Post('generate-scene')
  @ApiOperation({
    summary: 'Generate an AI scene image',
    description: 'Creates an atmospheric scene image based on description, location, and mood',
  })
  @ApiResponse({ status: 201, description: 'Scene generated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid scene generation parameters' })
  async generateScene(@Body() dto: GenerateSceneDto) {
    return this.aiService.generateScene(dto);
  }

  @Post('suggest-narrative')
  @ApiOperation({
    summary: 'Get AI narrative suggestions',
    description: 'Generates narrative suggestions based on current game context and recent events',
  })
  @ApiResponse({ status: 200, description: 'Narrative suggestions generated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid narrative generation parameters' })
  async suggestNarrative(@Body() dto: SuggestNarrativeDto) {
    return this.aiService.suggestNarrative(dto);
  }

  @Post('characters/:characterId/generate-avatar')
  @ApiOperation({
    summary: 'Generate avatar for a specific character',
    description:
      'Generates an AI avatar for a character based on their attributes and occupation',
  })
  @ApiParam({ name: 'characterId', description: 'Character ID' })
  @ApiResponse({ status: 200, description: 'Character avatar generated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid character avatar parameters' })
  async generateCharacterAvatar(
    @Param('characterId') characterId: string,
    @Body() dto: GenerateCharacterAvatarDto,
  ) {
    return this.aiService.generateCharacterAvatar(characterId, dto);
  }

  @Post('sessions/:sessionId/generate-all-avatars')
  @ApiOperation({
    summary: 'Batch generate avatars for all characters in a session',
    description:
      'Generates AI avatars for all characters in a session (GM only)',
  })
  @ApiParam({ name: 'sessionId', description: 'Game session ID' })
  @ApiResponse({ status: 200, description: 'Session avatars generated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid session avatar parameters' })
  async generateSessionAvatars(
    @Request() req: any,
    @Param('sessionId') sessionId: string,
    @Body() dto: GenerateSessionAvatarsDto,
  ) {
    return this.aiService.generateSessionAvatars(sessionId, dto, req.user?.id || req.user?.sub);
  }

  @Post('migrate-avatars')
  @ApiOperation({
    summary: 'Migrate avatars from external URLs to local storage',
    description:
      'Utility endpoint to migrate existing avatar references to local storage system',
  })
  @ApiResponse({ status: 200, description: 'Avatars migrated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid migration parameters' })
  async migrateAvatars(@Body() dto: MigrateAvatarsDto) {
    return this.aiService.migrateAvatars(dto);
  }
}
