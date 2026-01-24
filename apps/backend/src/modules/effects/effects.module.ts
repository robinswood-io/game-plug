import { Module, forwardRef } from '@nestjs/common';
import { EffectsController } from './effects.controller';
import { EffectsService } from './effects.service';
import { DatabaseModule } from '../database/database.module';
import { CharactersModule } from '../characters/characters.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => CharactersModule)],
  controllers: [EffectsController],
  providers: [EffectsService],
  exports: [EffectsService],
})
export class EffectsModule {}
