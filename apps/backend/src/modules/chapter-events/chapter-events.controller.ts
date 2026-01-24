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
  ) {
    if (chapterId) {
      return this.chapterEventsService.findByChapter(chapterId);
    }
    if (sessionId) {
      return this.chapterEventsService.findBySession(sessionId);
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
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 100;
    return this.chapterEventsService.findByChapter(chapterId);
  }

  @Get('sessions/:sessionId/important-events')
  @ApiOperation({ summary: 'Get important events for a session' })
  @ApiParam({ name: 'sessionId', description: 'Session ID' })
  @ApiResponse({ status: 200, description: 'List of important chapter events' })
  async getImportantEvents(@Param('sessionId') sessionId: string) {
    return this.chapterEventsService.findImportantBySession(sessionId);
  }

  @Get('chapter-events/:id')
  @ApiOperation({ summary: 'Get chapter event by ID' })
  @ApiResponse({ status: 200, description: 'Chapter event details' })
  async findOne(@Param('id') id: string) {
    return this.chapterEventsService.findOne(id);
  }

  @Post('chapter-events')
  @ApiOperation({ summary: 'Create new chapter event' })
  @ApiResponse({ status: 201, description: 'Chapter event created' })
  @ApiResponse({ status: 400, description: 'Invalid event data - eventType and title are required' })
  async create(@Body() data: CreateChapterEventDto) {
    return this.chapterEventsService.create(data);
  }

  @Patch('chapter-events/:id')
  @ApiOperation({ summary: 'Update chapter event' })
  @ApiResponse({ status: 200, description: 'Chapter event updated' })
  @ApiResponse({ status: 404, description: 'Chapter event not found' })
  async update(@Param('id') id: string, @Body() data: UpdateChapterEventDto) {
    return this.chapterEventsService.update(id, data);
  }

  @Delete('chapter-events/:id')
  @ApiOperation({ summary: 'Delete chapter event' })
  @ApiResponse({ status: 200, description: 'Chapter event deleted' })
  async delete(@Param('id') id: string) {
    await this.chapterEventsService.delete(id);
    return { success: true };
  }
}
