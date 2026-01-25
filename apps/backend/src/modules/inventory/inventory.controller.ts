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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateInventoryDto,
  UpdateInventoryDto,
} from './dto';

@ApiTags('Inventory')
@ApiBearerAuth()
@Controller('api/inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get inventory for character' })
  @ApiResponse({ status: 200, description: 'Character inventory' })
  async findByCharacter(@Query('characterId') characterId: string) {
    return this.inventoryService.findByCharacter(characterId);
  }

  @Post()
  @ApiOperation({ summary: 'Create inventory item' })
  @ApiResponse({ status: 201, description: 'Inventory item created' })
  async create(@Body() data: CreateInventoryDto) {
    return this.inventoryService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update inventory item' })
  @ApiResponse({ status: 200, description: 'Inventory item updated' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateInventoryDto,
  ) {
    return this.inventoryService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete inventory item' })
  @ApiResponse({ status: 200, description: 'Inventory item deleted' })
  async delete(@Param('id') id: string) {
    await this.inventoryService.delete(id);
    return { success: true };
  }

  @Patch(':id/equip')
  @ApiOperation({ summary: 'Toggle equipment status of item' })
  @ApiParam({ name: 'id', description: 'Inventory item ID' })
  @ApiResponse({ status: 200, description: 'Equipment status toggled successfully' })
  @ApiResponse({ status: 404, description: 'Inventory item not found' })
  async toggleEquip(@Param('id') id: string) {
    return this.inventoryService.toggleEquipped(id);
  }

  @Patch('characters/:characterId/inventory/:itemId')
  @ApiOperation({ summary: 'Update inventory item for character' })
  @ApiParam({ name: 'characterId', description: 'Character ID' })
  @ApiParam({ name: 'itemId', description: 'Inventory item ID' })
  @ApiResponse({ status: 200, description: 'Inventory item updated successfully' })
  @ApiResponse({ status: 404, description: 'Inventory item not found' })
  async updateItem(
    @Param('characterId') characterId: string,
    @Param('itemId') itemId: string,
    @Body() data: UpdateInventoryDto,
  ) {
    return this.inventoryService.update(itemId, data);
  }

  @Delete('characters/:characterId/inventory/:itemId')
  @ApiOperation({ summary: 'Delete inventory item for character' })
  @ApiParam({ name: 'characterId', description: 'Character ID' })
  @ApiParam({ name: 'itemId', description: 'Inventory item ID' })
  @ApiResponse({ status: 200, description: 'Inventory item deleted successfully' })
  @ApiResponse({ status: 404, description: 'Inventory item not found' })
  async deleteItem(
    @Param('characterId') characterId: string,
    @Param('itemId') itemId: string,
  ) {
    await this.inventoryService.delete(itemId);
    return { success: true };
  }
}
