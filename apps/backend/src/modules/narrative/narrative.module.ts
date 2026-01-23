import { Module } from '@nestjs/common';
import { NarrativeService } from './narrative.service';
import { NarrativeController } from './narrative.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [NarrativeController],
  providers: [NarrativeService],
  exports: [NarrativeService],
})
export class NarrativeModule {}
