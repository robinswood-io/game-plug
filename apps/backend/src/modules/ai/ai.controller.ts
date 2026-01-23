import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  GenerateAvatarDto,
  GenerateSceneDto,
  SuggestNarrativeDto,
} from './dto';

@Controller('api/ai')
@ApiTags('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-avatar')
  @ApiOperation({
    summary: 'Generate an AI avatar image for a character',
    description: 'Uses AI to generate a character portrait based on physical description and attributes',
  })
  async generateAvatar(@Body() dto: GenerateAvatarDto) {
    return this.aiService.generateAvatar(dto);
  }

  @Post('generate-scene')
  @ApiOperation({
    summary: 'Generate an AI scene image',
    description: 'Creates an atmospheric scene image based on description, location, and mood',
  })
  async generateScene(@Body() dto: GenerateSceneDto) {
    return this.aiService.generateScene(dto);
  }

  @Post('suggest-narrative')
  @ApiOperation({
    summary: 'Get AI narrative suggestions',
    description: 'Generates narrative suggestions based on current game context and recent events',
  })
  async suggestNarrative(@Body() dto: SuggestNarrativeDto) {
    return this.aiService.suggestNarrative(dto);
  }
}
