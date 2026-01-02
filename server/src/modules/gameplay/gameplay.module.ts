import { Module } from '@nestjs/common';
import { GameplayController } from './gameplay.controller';
import { GameplayService } from './gameplay.service';
import { StatusEffectsService } from './services/status-effects.service';
import { BuffsService } from './services/buffs.service';
import { TreatmentService } from './services/treatment.service';
import { EffectsProcessorService } from './services/effects-processor.service';
import { DatabaseModule } from '../../common/database/database.module';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [DatabaseModule, SessionsModule],
  controllers: [GameplayController],
  providers: [
    GameplayService,
    StatusEffectsService,
    BuffsService,
    TreatmentService,
    EffectsProcessorService,
  ],
  exports: [GameplayService],
})
export class GameplayModule {}
