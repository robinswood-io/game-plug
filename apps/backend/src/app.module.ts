import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database/database.module';
import { CacheModule } from './modules/cache/cache.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { WebSocketsModule } from './modules/websockets/websockets.module';
import { CharactersModule } from './modules/characters/characters.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { ChaptersModule } from './modules/chapters/chapters.module';
import { ChapterEventsModule } from './modules/chapter-events/chapter-events.module';
import { NarrativeModule } from './modules/narrative/narrative.module';
import { AiModule } from './modules/ai/ai.module';
import { GameboardModule } from './modules/gameboard/gameboard.module';
import { SanityModule } from './modules/sanity/sanity.module';
import { DiceModule } from './modules/dice/dice.module';
import { EffectsModule } from './modules/effects/effects.module';
import { RollsModule } from './modules/rolls/rolls.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    DatabaseModule,
    CacheModule,
    HealthModule,
    AuthModule,
    WebSocketsModule,
    CharactersModule,
    SessionsModule,
    InventoryModule,
    ChaptersModule,
    ChapterEventsModule,
    NarrativeModule,
    AiModule,
    GameboardModule,
    SanityModule,
    DiceModule,
    EffectsModule,
    RollsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
