import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DiceService } from './dice.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DiceRollDto } from './dto';

/**
 * Controller alias for POST /api/rolls
 * Frontend calls /api/rolls instead of /api/dice/roll
 */
@ApiTags('Rolls')
@ApiBearerAuth()
@Controller('api/rolls')
@UseGuards(JwtAuthGuard)
export class RollsController {
  constructor(private readonly diceService: DiceService) {}

  @Post()
  @ApiOperation({ summary: 'Record a dice roll (alias)' })
  @ApiResponse({ status: 201, description: 'Roll recorded successfully' })
  async create(@Request() req: any, @Body() data: DiceRollDto) {
    return this.diceService.roll({
      ...data,
      userId: req.user?.id || req.user?.sub,
    });
  }
}
