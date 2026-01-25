import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { DatabaseModule } from '../database/database.module';
import { AiOpenAiService } from './services';

@Module({
  imports: [DatabaseModule],
  controllers: [AiController],
  providers: [AiService, AiOpenAiService],
  exports: [AiService, AiOpenAiService],
})
export class AiModule {}
