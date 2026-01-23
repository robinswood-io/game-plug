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
import { ChaptersService } from './chapters.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Chapters')
@ApiBearerAuth()
@Controller('api/chapters')
@UseGuards(JwtAuthGuard)
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Get()
  @ApiOperation({ summary: 'Get chapters for session' })
  @ApiResponse({ status: 200, description: 'List of chapters' })
  async findBySession(@Query('sessionId') sessionId: string) {
    return this.chaptersService.findBySession(sessionId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get chapter by ID' })
  @ApiResponse({ status: 200, description: 'Chapter details' })
  async findOne(@Param('id') id: string) {
    return this.chaptersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new chapter' })
  @ApiResponse({ status: 201, description: 'Chapter created' })
  async create(@Body() data: any) {
    return this.chaptersService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update chapter' })
  @ApiResponse({ status: 200, description: 'Chapter updated' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.chaptersService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete chapter' })
  @ApiResponse({ status: 200, description: 'Chapter deleted' })
  async delete(@Param('id') id: string) {
    await this.chaptersService.delete(id);
    return { success: true };
  }
}
