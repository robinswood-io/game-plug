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
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { NarrativeService } from './narrative.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Narrative')
@ApiBearerAuth()
@Controller('api')
@UseGuards(JwtAuthGuard)
export class NarrativeController {
  constructor(private readonly narrativeService: NarrativeService) {}

  @Get('narrative')
  @ApiOperation({ summary: 'Get narrative elements for session' })
  @ApiResponse({ status: 200, description: 'Narrative elements' })
  async findBySession(@Query('sessionId') sessionId: string, @Req() req: any) {
    return this.narrativeService.findBySessionForGm(sessionId, req.user.id);
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
    return this.narrativeService.findBySessionForGm(sessionId, req.user.id);
  }

  @Post('narrative')
  @ApiOperation({ summary: 'Create narrative element' })
  @ApiResponse({ status: 201, description: 'Narrative element created' })
  async create(@Body() data: any, @Req() req: any) {
    return this.narrativeService.create(data, req.user.id);
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
    if (!data.content || !data.content.trim()) {
      throw new BadRequestException('Content is required');
    }

    return this.narrativeService.create({
      sessionId,
      content: data.content.trim(),
      entryType: data.entryType || 'note',
      isAiGenerated: false,
    }, req.user.id);
  }

  @Patch('narrative/:id')
  @ApiOperation({ summary: 'Update narrative element' })
  @ApiResponse({ status: 200, description: 'Narrative element updated' })
  async update(@Param('id') id: string, @Body() data: any, @Req() req: any) {
    return this.narrativeService.update(id, data, req.user.id);
  }

  @Delete('narrative/:id')
  @ApiOperation({ summary: 'Delete narrative element' })
  @ApiResponse({ status: 200, description: 'Narrative element deleted' })
  async delete(@Param('id') id: string, @Req() req: any) {
    await this.narrativeService.delete(id, req.user.id);
    return { success: true };
  }
}
