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
  Req,
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
  async findByCharacter(@Query('characterId') characterId: string, @Req() req: any) {
    return this.sanityService.findByCharacterAuthorized(characterId, req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new sanity condition' })
  @ApiResponse({ status: 201, description: 'Sanity condition created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid sanity condition data' })
  async create(@Body() data: CreateSanityConditionDto, @Req() req: any) {
    return this.sanityService.create(data, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a sanity condition' })
  @ApiParam({ name: 'id', description: 'Sanity condition ID' })
  @ApiResponse({ status: 200, description: 'Sanity condition updated successfully' })
  @ApiResponse({ status: 404, description: 'Sanity condition not found' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateSanityConditionDto,
    @Req() req: any,
  ) {
    return this.sanityService.update(id, data, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a sanity condition' })
  @ApiParam({ name: 'id', description: 'Sanity condition ID' })
  @ApiResponse({ status: 200, description: 'Sanity condition deleted successfully' })
  @ApiResponse({ status: 404, description: 'Sanity condition not found' })
  async delete(@Param('id') id: string, @Req() req: any) {
    await this.sanityService.delete(id, req.user.id);
    return { success: true };
  }
}
