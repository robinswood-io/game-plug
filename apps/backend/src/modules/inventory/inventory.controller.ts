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
  async findByCharacter(@Query('characterId') characterId: string, @Req() req: any) {
    return this.inventoryService.findByCharacterAuthorized(characterId, req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create inventory item' })
  @ApiResponse({ status: 201, description: 'Inventory item created' })
  async create(@Body() data: CreateInventoryDto, @Req() req: any) {
    return this.inventoryService.create(data, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update inventory item' })
  @ApiResponse({ status: 200, description: 'Inventory item updated' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateInventoryDto,
    @Req() req: any,
  ) {
    return this.inventoryService.update(id, data, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete inventory item' })
  @ApiResponse({ status: 200, description: 'Inventory item deleted' })
  async delete(@Param('id') id: string, @Req() req: any) {
    await this.inventoryService.delete(id, req.user.id);
    return { success: true };
  }

  @Patch(':id/equip')
  @ApiOperation({ summary: 'Toggle equipment status of item' })
  @ApiParam({ name: 'id', description: 'Inventory item ID' })
  @ApiResponse({ status: 200, description: 'Equipment status toggled successfully' })
  @ApiResponse({ status: 404, description: 'Inventory item not found' })
  async toggleEquip(@Param('id') id: string, @Req() req: any) {
    return this.inventoryService.toggleEquipped(id, req.user.id);
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
    @Req() req: any,
  ) {
    return this.inventoryService.update(itemId, data, req.user.id, characterId);
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
    @Req() req: any,
  ) {
    await this.inventoryService.delete(itemId, req.user.id, characterId);
    return { success: true };
  }
}
