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
import { NarrativeService } from './narrative.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Narrative')
@ApiBearerAuth()
@Controller('api/narrative')
@UseGuards(JwtAuthGuard)
export class NarrativeController {
  constructor(private readonly narrativeService: NarrativeService) {}

  @Get()
  @ApiOperation({ summary: 'Get narrative elements for session' })
  @ApiResponse({ status: 200, description: 'Narrative elements' })
  async findBySession(@Query('sessionId') sessionId: string) {
    return this.narrativeService.findBySession(sessionId);
  }

  @Post()
  @ApiOperation({ summary: 'Create narrative element' })
  @ApiResponse({ status: 201, description: 'Narrative element created' })
  async create(@Body() data: any) {
    return this.narrativeService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update narrative element' })
  @ApiResponse({ status: 200, description: 'Narrative element updated' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.narrativeService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete narrative element' })
  @ApiResponse({ status: 200, description: 'Narrative element deleted' })
  async delete(@Param('id') id: string) {
    await this.narrativeService.delete(id);
    return { success: true };
  }
}
