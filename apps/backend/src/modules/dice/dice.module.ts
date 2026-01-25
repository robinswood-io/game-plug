import { Module } from '@nestjs/common';
import { DiceService } from './dice.service';
import { DiceController } from './dice.controller';
import { RollsController } from './rolls.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DiceController, RollsController],
  providers: [DiceService],
  exports: [DiceService],
})
export class DiceModule {}
