import { Module } from '@nestjs/common';
import { RollsController } from './rolls.controller';
import { DiceModule } from '../dice/dice.module';

@Module({
  imports: [DiceModule],
  controllers: [RollsController],
})
export class RollsModule {}
