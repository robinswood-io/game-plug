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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CharactersService } from './characters.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InventoryService } from '../inventory/inventory.service';
import {
  CreateCharacterDto,
  UpdateCharacterDto,
  SkillPointsDto,
  DistributePointsDto,
  ApplyEffectDto,
  GenerateAvatarDto,
  UpdateNotesDto,
} from './dto';
import { CreateInventoryDto } from '../inventory/dto';

@ApiTags('Characters')
@ApiBearerAuth()
@Controller('api/characters')
@UseGuards(JwtAuthGuard)
export class CharactersController {
  constructor(
    private readonly charactersService: CharactersService,
    private readonly inventoryService: InventoryService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all characters' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiResponse({ status: 200, description: 'List of characters retrieved' })
  async findAll(@Req() req: any, @Query('userId') userId?: string) {
    return this.charactersService.findAll(userId || req.user.id);
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
  async create(@Body() data: CreateCharacterDto, @Req() req: any) {
    return this.charactersService.create(data, req.user.id);
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

  @Post(':id/skill-points')
  @ApiOperation({ summary: 'Give skill points to character (GM only)' })
  @ApiParam({ name: 'id', description: 'Character ID' })
  @ApiResponse({ status: 200, description: 'Skill points granted successfully' })
  @ApiResponse({ status: 404, description: 'Character not found' })
  @ApiResponse({ status: 403, description: 'Only GM can grant skill points' })
  async giveSkillPoints(
    @Param('id') id: string,
    @Body() dto: SkillPointsDto,
  ) {
    return this.charactersService.giveSkillPoints(id, dto.points);
  }

  @Post(':id/distribute-points')
  @ApiOperation({ summary: 'Distribute available skill points to skills' })
  @ApiParam({ name: 'id', description: 'Character ID' })
  @ApiResponse({ status: 200, description: 'Skill points distributed successfully' })
  @ApiResponse({ status: 404, description: 'Character not found' })
  @ApiResponse({ status: 400, description: 'Not enough skill points available' })
  async distributePoints(
    @Param('id') id: string,
    @Body() dto: DistributePointsDto,
  ) {
    return this.charactersService.distributeSkillPoints(id, dto.skillUpdates);
  }

  @Post(':id/effects')
  @ApiOperation({ summary: 'Apply effect/buff/debuff to character' })
  @ApiParam({ name: 'id', description: 'Character ID' })
  @ApiResponse({ status: 201, description: 'Effect applied successfully' })
  @ApiResponse({ status: 404, description: 'Character not found' })
  async applyEffect(
    @Param('id') id: string,
    @Body() dto: ApplyEffectDto,
  ) {
    return this.charactersService.applyEffect(id, dto);
  }

  @Post(':characterId/generate-avatar')
  @ApiOperation({ summary: 'Generate AI avatar for specific character' })
  @ApiParam({ name: 'characterId', description: 'Character ID' })
  @ApiResponse({ status: 200, description: 'Avatar generated successfully' })
  @ApiResponse({ status: 404, description: 'Character not found' })
  async generateAvatar(
    @Param('characterId') characterId: string,
    @Body() dto: GenerateAvatarDto,
  ) {
    return this.charactersService.generateAvatar(characterId, dto);
  }

  @Patch(':id/notes')
  @ApiOperation({ summary: 'Update character notes' })
  @ApiParam({ name: 'id', description: 'Character ID' })
  @ApiResponse({ status: 200, description: 'Character notes updated successfully' })
  @ApiResponse({ status: 404, description: 'Character not found' })
  async updateNotes(
    @Param('id') id: string,
    @Body() dto: UpdateNotesDto,
  ) {
    return this.charactersService.updateNotes(id, dto.notes || '');
  }

  @Get(':id/inventory')
  @ApiOperation({ summary: 'Get character inventory' })
  @ApiParam({ name: 'id', description: 'Character ID' })
  @ApiResponse({ status: 200, description: 'Character inventory retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Character not found' })
  async getInventory(@Param('id') characterId: string) {
    return this.inventoryService.findByCharacter(characterId);
  }

  @Post(':id/inventory')
  @ApiOperation({ summary: 'Add inventory item to character' })
  @ApiParam({ name: 'id', description: 'Character ID' })
  @ApiResponse({ status: 201, description: 'Inventory item created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid inventory item data' })
  @ApiResponse({ status: 403, description: 'Permission denied - user must own character or be GM' })
  @ApiResponse({ status: 404, description: 'Character not found' })
  async addInventoryItem(
    @Param('id') characterId: string,
    @Body() dto: CreateInventoryDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.charactersService.addInventoryItem(characterId, dto, userId);
  }
}
