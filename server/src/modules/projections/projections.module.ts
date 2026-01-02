import { Module } from '@nestjs/common';
import { ProjectionsController } from './projections.controller';
import { AiModule } from '../ai/ai.module';
import { DatabaseModule } from '../../common/database/database.module';

@Module({
  imports: [AiModule, DatabaseModule],
  controllers: [ProjectionsController],
})
export class ProjectionsModule {}
