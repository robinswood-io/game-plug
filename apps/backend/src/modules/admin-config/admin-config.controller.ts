import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Logger,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AdminConfigService } from './admin-config.service';
import * as schema from '@shared/schema';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/admin/config')
@UseGuards(AuthGuard('jwt'))
export class AdminConfigController {
  private readonly logger = new Logger(AdminConfigController.name);

  constructor(private readonly configService: AdminConfigService) {}

  /**
   * GET /api/admin/config - Get all system configs
   */
  @Get()
  async getAll(): Promise<schema.SystemConfig[]> {
    return this.configService.getAll();
  }

  /**
   * GET /api/admin/config/:key - Get a specific config by key
   */
  @Get(':key')
  async get(@Param('key') key: string): Promise<schema.SystemConfig | null> {
    if (!key || key.trim() === '') {
      throw new BadRequestException('Config key is required');
    }
    return this.configService.get(key);
  }

  /**
   * PATCH /api/admin/config/:key - Update a config
   */
  @Patch(':key')
  async update(
    @Param('key') key: string,
    @Body() updateDto: schema.UpdateSystemConfig,
  ): Promise<schema.SystemConfig> {
    if (!key || key.trim() === '') {
      throw new BadRequestException('Config key is required');
    }

    if (!('value' in updateDto)) {
      throw new BadRequestException('Config value is required');
    }

    return this.configService.set(
      key,
      updateDto.value,
      updateDto.description,
      updateDto.updatedBy,
    );
  }

  /**
   * DELETE /api/admin/config/:key - Delete a config
   */
  @Delete(':key')
  async delete(@Param('key') key: string): Promise<{ success: boolean }> {
    if (!key || key.trim() === '') {
      throw new BadRequestException('Config key is required');
    }

    await this.configService.delete(key);
    return { success: true };
  }
}
