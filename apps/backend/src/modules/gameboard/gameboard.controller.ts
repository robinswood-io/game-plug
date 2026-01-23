import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { GameboardService } from './gameboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateGameboardDto,
  UpdateGameboardDto,
} from './dto';

@Controller('api/gameboards')
@ApiTags('gameboards')
@UseGuards(JwtAuthGuard)
export class GameboardController {
  constructor(private readonly gameboardService: GameboardService) {}

  @Get(':sessionId')
  @ApiOperation({
    summary: 'Get gameboard for a session',
    description: 'Retrieves the complete gameboard state including characters, chapters, and events',
  })
  @ApiParam({ name: 'sessionId', description: 'Game session ID' })
  async getGameboard(@Param('sessionId') sessionId: string) {
    return this.gameboardService.getGameboard(sessionId);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new gameboard',
    description: 'Initializes a gameboard for a game session',
  })
  async create(@Body() dto: CreateGameboardDto) {
    return this.gameboardService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update gameboard state',
    description: 'Updates the gameboard configuration or state',
  })
  @ApiParam({ name: 'id', description: 'Gameboard ID' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateGameboardDto,
  ) {
    return this.gameboardService.update(id, dto);
  }
}
