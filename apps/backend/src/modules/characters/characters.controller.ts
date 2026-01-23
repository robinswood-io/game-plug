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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CharactersService } from './characters.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateCharacterDto,
  UpdateCharacterDto,
} from './dto';

@ApiTags('Characters')
@ApiBearerAuth()
@Controller('api/characters')
@UseGuards(JwtAuthGuard)
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all characters' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiResponse({ status: 200, description: 'List of characters retrieved' })
  async findAll(@Query('userId') userId?: string) {
    return this.charactersService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get character by ID' })
  @ApiParam({ name: 'id', description: 'Character ID' })
  @ApiResponse({ status: 200, description: 'Character retrieved' })
  @ApiResponse({ status: 404, description: 'Character not found' })
  async findOne(@Param('id') id: string) {
    return this.charactersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new character' })
  @ApiResponse({ status: 201, description: 'Character created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid character data' })
  async create(@Body() data: CreateCharacterDto) {
    return this.charactersService.create(data, data.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update character' })
  @ApiParam({ name: 'id', description: 'Character ID' })
  @ApiResponse({ status: 200, description: 'Character updated successfully' })
  @ApiResponse({ status: 404, description: 'Character not found' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateCharacterDto,
  ) {
    return this.charactersService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete character' })
  @ApiParam({ name: 'id', description: 'Character ID' })
  @ApiResponse({ status: 200, description: 'Character deleted successfully' })
  @ApiResponse({ status: 404, description: 'Character not found' })
  async delete(@Param('id') id: string) {
    await this.charactersService.delete(id);
    return { success: true };
  }
}
