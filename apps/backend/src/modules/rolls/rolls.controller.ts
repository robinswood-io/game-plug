import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DiceService } from '../dice/dice.service';
import { CreateRollDto } from './dto/create-roll.dto';

@ApiTags('Rolls')
@Controller('api/rolls')
export class RollsController {
  constructor(private readonly diceService: DiceService) {}

  @Post()
  @ApiOperation({ summary: 'Record a dice roll (public endpoint)' })
  @ApiResponse({ status: 201, description: 'Roll recorded successfully' })
  async create(@Request() req: any, @Body() data: CreateRollDto) {
    // Enregistrer le roll dans l'historique
    // L'utilisateur est optionnel - les rolls anonymes sont acceptés
    return this.diceService.roll({
      ...data,
      userId: req.user?.id || req.user?.sub,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get roll history for a session' })
  @ApiResponse({
    status: 200,
    description: 'List of dice rolls',
  })
  async findAll(
    @Query('sessionId') sessionId: string,
    @Query('limit') limit?: string,
  ) {
    if (!sessionId) {
      return { error: 'sessionId query parameter is required' };
    }
    const limitNumber = limit ? parseInt(limit, 10) : 50;
    return this.diceService.getSessionRollHistory(sessionId, limitNumber);
  }
}
