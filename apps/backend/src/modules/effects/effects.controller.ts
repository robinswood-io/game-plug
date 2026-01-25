import {
  Controller,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { EffectsService } from './effects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateEffectDto, UpdateEffectDto } from './dto';

@ApiTags('Effects')
@ApiBearerAuth()
@Controller('api/effects')
@UseGuards(JwtAuthGuard)
export class EffectsController {
  constructor(private readonly effectsService: EffectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create active effect' })
  @ApiResponse({ status: 201, description: 'Effect created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid effect data' })
  async create(@Body() dto: CreateEffectDto) {
    return this.effectsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update active effect' })
  @ApiParam({ name: 'id', description: 'Effect ID' })
  @ApiResponse({ status: 200, description: 'Effect updated successfully' })
  @ApiResponse({ status: 404, description: 'Effect not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEffectDto,
  ) {
    return this.effectsService.update(id, dto);
  }
}
