import { Module } from '@nestjs/common';
import { DiceService } from './dice.service';
import { DiceController } from './dice.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DiceController],
  providers: [DiceService],
  exports: [DiceService],
})
export class DiceModule {}
