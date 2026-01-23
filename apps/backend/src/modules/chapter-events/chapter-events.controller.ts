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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ChapterEventsService } from './chapter-events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Chapter Events')
@ApiBearerAuth()
@Controller('api/chapter-events')
@UseGuards(JwtAuthGuard)
export class ChapterEventsController {
  constructor(private readonly chapterEventsService: ChapterEventsService) {}

  @Get()
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

  @Get(':id')
  @ApiOperation({ summary: 'Get chapter event by ID' })
  @ApiResponse({ status: 200, description: 'Chapter event details' })
  async findOne(@Param('id') id: string) {
    return this.chapterEventsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new chapter event' })
  @ApiResponse({ status: 201, description: 'Chapter event created' })
  async create(@Body() data: any) {
    return this.chapterEventsService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update chapter event' })
  @ApiResponse({ status: 200, description: 'Chapter event updated' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.chapterEventsService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete chapter event' })
  @ApiResponse({ status: 200, description: 'Chapter event deleted' })
  async delete(@Param('id') id: string) {
    await this.chapterEventsService.delete(id);
    return { success: true };
  }
}
