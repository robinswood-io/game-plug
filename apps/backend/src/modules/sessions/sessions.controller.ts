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
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateSessionDto,
  UpdateSessionDto,
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

  @Get(':id')
  @ApiOperation({ summary: 'Get session by ID' })
  @ApiResponse({ status: 200, description: 'Session details' })
  async findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new session' })
  @ApiResponse({ status: 201, description: 'Session created' })
  async create(@Body() data: CreateSessionDto) {
    return this.sessionsService.create(data);
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
}
