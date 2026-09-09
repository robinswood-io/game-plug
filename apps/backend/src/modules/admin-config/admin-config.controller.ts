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
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { AdminConfigService } from './admin-config.service';
import * as schema from '@shared/schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/admin/config')
@UseGuards(JwtAuthGuard)
export class AdminConfigController {
  private readonly logger = new Logger(AdminConfigController.name);

  constructor(private readonly configService: AdminConfigService) {}

  private assertGm(req: { user?: { id?: string; isGM?: boolean } }): string {
    if (!req.user?.id || req.user.isGM !== true) {
      throw new ForbiddenException('GM privileges are required');
    }

    return req.user.id;
  }

  /**
   * GET /api/admin/config - Get all system configs
   */
  @Get()
  async getAll(@Req() req: { user?: { id?: string; isGM?: boolean } }): Promise<schema.SystemConfig[]> {
    this.assertGm(req);
    return this.configService.getAll();
  }

  /**
   * GET /api/admin/config/:key - Get a specific config by key
   */
  @Get(':key')
  async get(
    @Param('key') key: string,
    @Req() req: { user?: { id?: string; isGM?: boolean } },
  ): Promise<schema.SystemConfig | null> {
    this.assertGm(req);
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
    @Req() req: { user?: { id?: string; isGM?: boolean } },
  ): Promise<schema.SystemConfig> {
    const userId = this.assertGm(req);
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
      userId,
    );
  }

  /**
   * DELETE /api/admin/config/:key - Delete a config
   */
  @Delete(':key')
  async delete(
    @Param('key') key: string,
    @Req() req: { user?: { id?: string; isGM?: boolean } },
  ): Promise<{ success: boolean }> {
    this.assertGm(req);
    if (!key || key.trim() === '') {
      throw new BadRequestException('Config key is required');
    }

    await this.configService.delete(key);
    return { success: true };
  }
}
