import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AvatarStorageService } from './services/avatar-storage.service';
import { DatabaseModule } from '../../common/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AiController],
  providers: [AiService, AvatarStorageService],
  exports: [AiService],
})
export class AiModule {}
