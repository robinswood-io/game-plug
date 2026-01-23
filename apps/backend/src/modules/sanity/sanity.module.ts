import { Module } from '@nestjs/common';
import { SanityService } from './sanity.service';
import { SanityController } from './sanity.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SanityController],
  providers: [SanityService],
  exports: [SanityService],
})
export class SanityModule {}
