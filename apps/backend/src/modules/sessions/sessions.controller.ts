import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateSessionDto,
  UpdateSessionDto,
  ImportCharacterDto,
} from './dto';

@ApiTags('Sessions')
@ApiBearerAuth()
@Controller('api/sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all sessions' })
  @ApiResponse({ status: 200, description: 'List of sessions' })
  async findAll(@Query('gmId') gmId?: string) {
    return this.sessionsService.findAll(gmId);
  }

  @Get('join/:code')
  @ApiOperation({ summary: 'Join session by code' })
  @ApiParam({ name: 'code', description: 'Session join code (6 characters)' })
  @ApiResponse({ status: 200, description: 'Session found' })
  @ApiResponse({ status: 404, description: 'Session not found or inactive' })
  async joinByCode(@Param('code') code: string) {
    return this.sessionsService.findByJoinCode(code);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get session by ID' })
  @ApiResponse({ status: 200, description: 'Session details' })
  async findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(id);
  }

  @Get(':id/characters')
  @ApiOperation({ summary: 'Get all characters in session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({ status: 200, description: 'List of characters with sanity conditions and active effects' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async getSessionCharacters(@Param('id') id: string) {
    return this.sessionsService.getCharacters(id);
  }

  @Get(':sessionId/importable-characters')
  @ApiOperation({ summary: 'Get importable characters from GM\'s other sessions' })
  @ApiParam({ name: 'sessionId', description: 'Target session ID' })
  @ApiResponse({ status: 200, description: 'List of importable characters' })
  @ApiResponse({ status: 403, description: 'Only the GM can import characters' })
  async getImportableCharacters(
    @Param('sessionId') sessionId: string,
    @Req() req: any,
  ) {
    const gmId = req.user.id;
    return this.sessionsService.getImportableCharacters(sessionId, gmId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new session' })
  @ApiResponse({ status: 201, description: 'Session created' })
  async create(@Body() data: CreateSessionDto, @Req() req: any) {
    const gmId = req.user.id;
    return this.sessionsService.create({ ...data, gmId });
  }

  @Post(':sessionId/import-character')
  @ApiOperation({ summary: 'Import character into session (creates a copy)' })
  @ApiParam({ name: 'sessionId', description: 'Target session ID' })
  @ApiResponse({ status: 200, description: 'Character imported successfully' })
  @ApiResponse({ status: 400, description: 'Invalid character ID' })
  @ApiResponse({ status: 403, description: 'Only the GM can import characters' })
  @ApiResponse({ status: 404, description: 'Source character not found' })
  async importCharacter(
    @Param('sessionId') sessionId: string,
    @Body() data: ImportCharacterDto,
    @Req() req: any,
  ) {
    const gmId = req.user.id;
    return this.sessionsService.importCharacter(
      sessionId,
      data.characterId,
      gmId,
      data.resetState ?? true,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update session' })
  @ApiResponse({ status: 200, description: 'Session updated' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateSessionDto,
  ) {
    return this.sessionsService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete session' })
  @ApiResponse({ status: 200, description: 'Session deleted' })
  async delete(@Param('id') id: string) {
    await this.sessionsService.delete(id);
    return { success: true };
  }

  @Delete(':sessionId/characters/:characterId')
  @ApiOperation({ summary: 'Remove character from session (GM only)' })
  @ApiParam({ name: 'sessionId', description: 'Session ID' })
  @ApiParam({ name: 'characterId', description: 'Character ID to remove' })
  @ApiResponse({ status: 200, description: 'Character removed successfully' })
  @ApiResponse({ status: 400, description: 'Character does not belong to this session' })
  @ApiResponse({ status: 403, description: 'Only the GM can remove players' })
  @ApiResponse({ status: 404, description: 'Session or character not found' })
  async removeCharacter(
    @Param('sessionId') sessionId: string,
    @Param('characterId') characterId: string,
    @Req() req: any,
  ) {
    const gmId = req.user.id;
    return this.sessionsService.removeCharacter(sessionId, characterId, gmId);
  }
}
