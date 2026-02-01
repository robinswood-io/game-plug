import { Module, OnModuleInit } from '@nestjs/common';
import { AdminConfigService } from './admin-config.service';
import { AdminConfigController } from './admin-config.controller';
import { DatabaseModule } from '../database/database.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [DatabaseModule, CacheModule],
  providers: [AdminConfigService],
  controllers: [AdminConfigController],
  exports: [AdminConfigService],
})
export class AdminConfigModule implements OnModuleInit {
  constructor(private readonly configService: AdminConfigService) {}

  async onModuleInit() {
    // Initialize default configs on app startup
    await this.configService.initializeDefaults();
  }
}
