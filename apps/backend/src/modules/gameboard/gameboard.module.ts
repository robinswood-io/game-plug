import { Module } from '@nestjs/common';
import { GameboardService } from './gameboard.service';
import { GameboardController } from './gameboard.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [GameboardController],
  providers: [GameboardService],
  exports: [GameboardService],
})
export class GameboardModule {}
