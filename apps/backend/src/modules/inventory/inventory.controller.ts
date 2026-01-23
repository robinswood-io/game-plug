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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
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
}
