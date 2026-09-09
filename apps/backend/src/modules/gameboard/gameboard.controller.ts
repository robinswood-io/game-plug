import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { GameboardService } from './gameboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateGameboardDto,
  UpdateGameboardDto,
  CreateProjectionDto,
  UpdateProjectionDto,
} from './dto';

@Controller('api/gameboards')
@ApiTags('gameboards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class GameboardController {
  constructor(private readonly gameboardService: GameboardService) {}

  @Get(':sessionId')
  @ApiOperation({
    summary: 'Get gameboard for a session',
    description: 'Retrieves the complete gameboard state including characters, chapters, and events',
  })
  @ApiParam({ name: 'sessionId', description: 'Game session ID' })
  @ApiResponse({ status: 200, description: 'Gameboard retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Gameboard not found' })
  async getGameboard(@Param('sessionId') sessionId: string, @Req() req: any) {
    return this.gameboardService.getGameboard(sessionId, req.user.id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new gameboard',
    description: 'Initializes a gameboard for a game session',
  })
  @ApiResponse({ status: 201, description: 'Gameboard created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid gameboard data' })
  async create(@Body() dto: CreateGameboardDto, @Req() req: any) {
    return this.gameboardService.create(dto, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update gameboard state',
    description: 'Updates the gameboard configuration or state',
  })
  @ApiParam({ name: 'id', description: 'Gameboard ID' })
  @ApiResponse({ status: 200, description: 'Gameboard updated successfully' })
  @ApiResponse({ status: 404, description: 'Gameboard not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateGameboardDto,
    @Req() req: any,
  ) {
    return this.gameboardService.update(id, dto, req.user.id);
  }

  @Post('projection')
  @ApiOperation({
    summary: 'Create a projection view of the gameboard',
    description: 'Creates a projection/display view for GM or players',
  })
  @ApiResponse({ status: 201, description: 'Projection created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid projection data' })
  @ApiResponse({ status: 404, description: 'Session or character not found' })
  async createProjection(@Body() dto: CreateProjectionDto, @Req() req: any) {
    return this.gameboardService.createProjection(dto, req.user.id);
  }

  @Get('projection/:sessionId')
  @ApiOperation({
    summary: 'Get projection view for a session',
    description: 'Retrieves the projection data for display',
  })
  @ApiParam({ name: 'sessionId', description: 'Game session ID' })
  @ApiResponse({ status: 200, description: 'Projection retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async getProjection(@Param('sessionId') sessionId: string, @Req() req: any) {
    return this.gameboardService.getProjection(sessionId, req.user.id);
  }

  @Patch('projection/:id')
  @ApiOperation({
    summary: 'Update projection view',
    description: 'Updates projection configuration or state',
  })
  @ApiParam({ name: 'id', description: 'Projection ID' })
  @ApiResponse({ status: 200, description: 'Projection updated successfully' })
  @ApiResponse({ status: 404, description: 'Projection not found' })
  async updateProjection(
    @Param('id') id: string,
    @Body() dto: UpdateProjectionDto,
    @Req() req: any,
  ) {
    return this.gameboardService.updateProjection(id, dto, req.user.id);
  }
}
