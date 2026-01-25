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
@Controller('api/sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all sessions for the authenticated GM' })
  @ApiResponse({ status: 200, description: 'List of sessions belonging to the GM' })
  async findAll(@Req() req: any) {
    // Always filter by the authenticated user's ID for security
    const gmId = req.user.id;
    return this.sessionsService.findAll(gmId);
  }

  @Get('join/:code')
  @ApiOperation({ summary: 'Join session by code (public endpoint)' })
  @ApiParam({ name: 'code', description: 'Session join code (6 characters)' })
  @ApiResponse({ status: 200, description: 'Session found' })
  @ApiResponse({ status: 404, description: 'Session not found or inactive' })
  async joinByCode(@Param('code') code: string) {
    return this.sessionsService.findByJoinCode(code);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get session by ID' })
  @ApiResponse({ status: 200, description: 'Session details' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async findOne(@Param('id') id: string, @Req() req: any) {
    const gmId = req.user.id;
    return this.sessionsService.findOneForGm(id, gmId);
  }

  @Get(':id/characters')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all characters in session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({ status: 200, description: 'List of characters with sanity conditions and active effects' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async getSessionCharacters(@Param('id') id: string, @Req() req: any) {
    const gmId = req.user.id;
    return this.sessionsService.getCharactersForGm(id, gmId);
  }

  @Get(':sessionId/importable-characters')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new session' })
  @ApiResponse({ status: 201, description: 'Session created' })
  async create(@Body() data: CreateSessionDto, @Req() req: any) {
    const gmId = req.user.id;
    return this.sessionsService.create({ ...data, gmId });
  }

  @Post(':sessionId/import-character')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update session' })
  @ApiResponse({ status: 200, description: 'Session updated' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateSessionDto,
  ) {
    return this.sessionsService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete session' })
  @ApiResponse({ status: 200, description: 'Session deleted' })
  async delete(@Param('id') id: string) {
    await this.sessionsService.delete(id);
    return { success: true };
  }

  @Delete(':sessionId/characters/:characterId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
