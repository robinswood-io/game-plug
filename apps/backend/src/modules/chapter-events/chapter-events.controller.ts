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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ChapterEventsService } from './chapter-events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateChapterEventDto, UpdateChapterEventDto } from './dto';

@ApiTags('Chapter Events')
@ApiBearerAuth()
@Controller('api')
@UseGuards(JwtAuthGuard)
export class ChapterEventsController {
  constructor(private readonly chapterEventsService: ChapterEventsService) {}

  @Get('chapter-events')
  @ApiOperation({ summary: 'Get chapter events' })
  @ApiResponse({ status: 200, description: 'List of chapter events' })
  async find(
    @Query('chapterId') chapterId?: string,
    @Query('sessionId') sessionId?: string,
    @Req() req?: any,
  ) {
    if (chapterId) {
      return this.chapterEventsService.findByChapterForGm(chapterId, req.user.id);
    }
    if (sessionId) {
      return this.chapterEventsService.findBySessionForGm(sessionId, req.user.id);
    }
    return [];
  }

  @Get('chapters/:chapterId/events')
  @ApiOperation({ summary: 'Get events for a specific chapter' })
  @ApiParam({ name: 'chapterId', description: 'Chapter ID' })
  @ApiQuery({ name: 'limit', required: false, description: 'Maximum number of events to return (default: 100)' })
  @ApiResponse({ status: 200, description: 'List of chapter events' })
  async getChapterEvents(
    @Param('chapterId') chapterId: string,
    @Query('limit') _limit?: string,
    @Req() req?: any,
  ) {
    return this.chapterEventsService.findByChapterForGm(chapterId, req.user.id);
  }

  @Get('sessions/:sessionId/important-events')
  @ApiOperation({ summary: 'Get important events for a session' })
  @ApiParam({ name: 'sessionId', description: 'Session ID' })
  @ApiResponse({ status: 200, description: 'List of important chapter events' })
  async getImportantEvents(@Param('sessionId') sessionId: string, @Req() req: any) {
    return this.chapterEventsService.findImportantBySessionForGm(sessionId, req.user.id);
  }

  @Get('chapter-events/:id')
  @ApiOperation({ summary: 'Get chapter event by ID' })
  @ApiResponse({ status: 200, description: 'Chapter event details' })
  async findOne(@Param('id') id: string, @Req() req: any) {
    return this.chapterEventsService.findOneForGm(id, req.user.id);
  }

  @Post('chapter-events')
  @ApiOperation({ summary: 'Create new chapter event' })
  @ApiResponse({ status: 201, description: 'Chapter event created' })
  @ApiResponse({ status: 400, description: 'Invalid event data - eventType and title are required' })
  async create(@Body() data: CreateChapterEventDto, @Req() req: any) {
    return this.chapterEventsService.create(data, req.user.id);
  }

  @Patch('chapter-events/:id')
  @ApiOperation({ summary: 'Update chapter event' })
  @ApiResponse({ status: 200, description: 'Chapter event updated' })
  @ApiResponse({ status: 404, description: 'Chapter event not found' })
  async update(@Param('id') id: string, @Body() data: UpdateChapterEventDto, @Req() req: any) {
    return this.chapterEventsService.update(id, data, req.user.id);
  }

  @Delete('chapter-events/:id')
  @ApiOperation({ summary: 'Delete chapter event' })
  @ApiResponse({ status: 200, description: 'Chapter event deleted' })
  async delete(@Param('id') id: string, @Req() req: any) {
    await this.chapterEventsService.delete(id, req.user.id);
    return { success: true };
  }
}
