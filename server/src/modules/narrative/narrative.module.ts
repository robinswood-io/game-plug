import { Module } from '@nestjs/common';
import { NarrativeController } from './narrative.controller';
import { DatabaseModule } from '../../common/database/database.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [DatabaseModule, AiModule], // Import AiModule for AI narrative suggestions
  controllers: [NarrativeController],
})
export class NarrativeModule {}
