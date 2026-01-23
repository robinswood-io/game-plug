import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DiceService } from './dice.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DiceRollDto } from './dto';

@ApiTags('Dice')
@ApiBearerAuth()
@Controller('api/dice')
@UseGuards(JwtAuthGuard)
export class DiceController {
  constructor(private readonly diceService: DiceService) {}

  @Post('roll')
  @ApiOperation({ summary: 'Roll dice' })
  @ApiResponse({ status: 200, description: 'Dice roll result' })
  async roll(@Request() req: any, @Body() data: DiceRollDto) {
    return this.diceService.roll({
      ...data,
      userId: req.user?.id || req.user?.sub,
    });
  }
}
