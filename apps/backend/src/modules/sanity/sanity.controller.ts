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
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { SanityService } from './sanity.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateSanityConditionDto,
  UpdateSanityConditionDto,
} from './dto';

@Controller('api/sanity')
@ApiTags('sanity')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class SanityController {
  constructor(private readonly sanityService: SanityService) {}

  @Get()
  @ApiOperation({ summary: 'Get all sanity conditions for a character' })
  @ApiQuery({ name: 'characterId', required: true, description: 'Character ID' })
  @ApiResponse({ status: 200, description: 'Sanity conditions retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Character not found' })
  async findByCharacter(@Query('characterId') characterId: string) {
    return this.sanityService.findByCharacter(characterId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new sanity condition' })
  @ApiResponse({ status: 201, description: 'Sanity condition created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid sanity condition data' })
  async create(@Body() data: CreateSanityConditionDto) {
    return this.sanityService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a sanity condition' })
  @ApiParam({ name: 'id', description: 'Sanity condition ID' })
  @ApiResponse({ status: 200, description: 'Sanity condition updated successfully' })
  @ApiResponse({ status: 404, description: 'Sanity condition not found' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateSanityConditionDto,
  ) {
    return this.sanityService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a sanity condition' })
  @ApiParam({ name: 'id', description: 'Sanity condition ID' })
  @ApiResponse({ status: 200, description: 'Sanity condition deleted successfully' })
  @ApiResponse({ status: 404, description: 'Sanity condition not found' })
  async delete(@Param('id') id: string) {
    await this.sanityService.delete(id);
    return { success: true };
  }
}
