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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ChaptersService } from './chapters.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SessionsService } from '../sessions/sessions.service';
import { CreateChapterDto, UpdateChapterDto } from './dto';

@ApiTags('Chapters')
@ApiBearerAuth()
@Controller('api')
@UseGuards(JwtAuthGuard)
export class ChaptersController {
  constructor(
    private readonly chaptersService: ChaptersService,
    private readonly sessionsService: SessionsService,
  ) {}

  @Get('chapters')
  @ApiOperation({ summary: 'Get chapters for session' })
  @ApiResponse({ status: 200, description: 'List of chapters' })
  async findBySession(@Query('sessionId') sessionId: string) {
    return this.chaptersService.findBySession(sessionId);
  }

  @Get('sessions/:sessionId/chapters')
  @ApiOperation({ summary: 'Get chapters for a specific session' })
  @ApiParam({ name: 'sessionId', description: 'Session ID' })
  @ApiResponse({ status: 200, description: 'List of chapters for the session' })
  async getSessionChapters(@Param('sessionId') sessionId: string) {
    return this.chaptersService.findBySession(sessionId);
  }

  @Get('chapters/:id')
  @ApiOperation({ summary: 'Get chapter by ID' })
  @ApiResponse({ status: 200, description: 'Chapter details' })
  async findOne(@Param('id') id: string) {
    return this.chaptersService.findOne(id);
  }

  @Post('chapters')
  @ApiOperation({ summary: 'Create new chapter' })
  @ApiResponse({ status: 201, description: 'Chapter created' })
  @ApiResponse({ status: 400, description: 'Invalid chapter data' })
  async create(@Body() data: CreateChapterDto) {
    return this.chaptersService.create(data);
  }

  @Post('sessions/:sessionId/chapters')
  @ApiOperation({ summary: 'Create new chapter for a session (GM only)' })
  @ApiParam({ name: 'sessionId', description: 'Session ID' })
  @ApiResponse({ status: 201, description: 'Chapter created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid chapter data' })
  @ApiResponse({ status: 403, description: 'Only the GM can create chapters' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async createChapter(
    @Param('sessionId') sessionId: string,
    @Body() data: CreateChapterDto,
    @Req() req: unknown,
  ) {
    const userId = (req as { user: { id: string } }).user.id;

    // Check if user is GM of this session
    const session = await this.sessionsService.findOne(sessionId);
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    if (session.gmId !== userId) {
      throw new ForbiddenException('Only the GM can create chapters');
    }

    return this.chaptersService.create({ ...data, sessionId });
  }

  @Patch('chapters/:id')
  @ApiOperation({ summary: 'Update chapter' })
  @ApiResponse({ status: 200, description: 'Chapter updated' })
  @ApiResponse({ status: 404, description: 'Chapter not found' })
  async update(@Param('id') id: string, @Body() data: UpdateChapterDto) {
    return this.chaptersService.update(id, data);
  }

  @Delete('chapters/:id')
  @ApiOperation({ summary: 'Delete chapter' })
  @ApiResponse({ status: 200, description: 'Chapter deleted' })
  async delete(@Param('id') id: string) {
    await this.chaptersService.delete(id);
    return { success: true };
  }
}
