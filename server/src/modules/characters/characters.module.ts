import { Module, forwardRef } from '@nestjs/common';
import {
  CharactersController,
  InventoryController,
  EffectsController,
} from './characters.controller';
import { CharactersService } from './characters.service';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [forwardRef(() => SessionsModule)],
  controllers: [CharactersController, InventoryController, EffectsController],
  providers: [CharactersService],
  exports: [CharactersService],
})
export class CharactersModule {}
