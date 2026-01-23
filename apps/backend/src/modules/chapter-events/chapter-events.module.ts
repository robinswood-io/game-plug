import { Module } from '@nestjs/common';
import { ChapterEventsService } from './chapter-events.service';
import { ChapterEventsController } from './chapter-events.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ChapterEventsController],
  providers: [ChapterEventsService],
  exports: [ChapterEventsService],
})
export class ChapterEventsModule {}
