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
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { NarrativeService } from './narrative.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SessionsService } from '../sessions/sessions.service';

@ApiTags('Narrative')
@ApiBearerAuth()
@Controller('api')
@UseGuards(JwtAuthGuard)
export class NarrativeController {
  constructor(
    private readonly narrativeService: NarrativeService,
    private readonly sessionsService: SessionsService,
  ) {}

  @Get('narrative')
  @ApiOperation({ summary: 'Get narrative elements for session' })
  @ApiResponse({ status: 200, description: 'Narrative elements' })
  async findBySession(@Query('sessionId') sessionId: string) {
    return this.narrativeService.findBySession(sessionId);
  }

  @Get('sessions/:sessionId/narrative')
  @ApiOperation({ summary: 'Get narrative entries for a session (GM only)' })
  @ApiParam({ name: 'sessionId', description: 'Session ID' })
  @ApiResponse({ status: 200, description: 'List of narrative entries' })
  @ApiResponse({ status: 403, description: 'Only the GM can access narrative entries' })
  async getSessionNarrative(
    @Param('sessionId') sessionId: string,
    @Req() req: any,
  ) {
    const userId = req.user.id;

    // Check if user is GM of this session
    const session = await this.sessionsService.findOne(sessionId);
    if (!session || session.gmId !== userId) {
      throw new ForbiddenException('Only the GM can access narrative entries');
    }

    return this.narrativeService.findBySession(sessionId);
  }

  @Post('narrative')
  @ApiOperation({ summary: 'Create narrative element' })
  @ApiResponse({ status: 201, description: 'Narrative element created' })
  async create(@Body() data: any) {
    return this.narrativeService.create(data);
  }

  @Post('sessions/:sessionId/narrative')
  @ApiOperation({ summary: 'Create new narrative entry for a session (GM only)' })
  @ApiParam({ name: 'sessionId', description: 'Session ID' })
  @ApiResponse({ status: 201, description: 'Narrative entry created successfully' })
  @ApiResponse({ status: 400, description: 'Content is required' })
  @ApiResponse({ status: 403, description: 'Only the GM can create narrative entries' })
  async createNarrativeEntry(
    @Param('sessionId') sessionId: string,
    @Body() data: { content: string; entryType?: string },
    @Req() req: any,
  ) {
    const userId = req.user.id;

    // Check if user is GM of this session
    const session = await this.sessionsService.findOne(sessionId);
    if (!session || session.gmId !== userId) {
      throw new ForbiddenException('Only the GM can create narrative entries');
    }

    if (!data.content || !data.content.trim()) {
      throw new BadRequestException('Content is required');
    }

    return this.narrativeService.create({
      sessionId,
      gmId: userId,
      content: data.content.trim(),
      entryType: data.entryType || 'note',
      isAiGenerated: false,
    });
  }

  @Patch('narrative/:id')
  @ApiOperation({ summary: 'Update narrative element' })
  @ApiResponse({ status: 200, description: 'Narrative element updated' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.narrativeService.update(id, data);
  }

  @Delete('narrative/:id')
  @ApiOperation({ summary: 'Delete narrative element' })
  @ApiResponse({ status: 200, description: 'Narrative element deleted' })
  async delete(@Param('id') id: string) {
    await this.narrativeService.delete(id);
    return { success: true };
  }
}
