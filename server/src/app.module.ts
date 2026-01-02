import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './common/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { CharactersModule } from './modules/characters/characters.module';
import { AiModule } from './modules/ai/ai.module';
import { GameplayModule } from './modules/gameplay/gameplay.module';
import { NarrativeModule } from './modules/narrative/narrative.module';
import { ProjectionsModule } from './modules/projections/projections.module';
import { HealthController } from './health/health.controller';

/**
 * Root Application Module
 *
 * Architecture:
 * - DatabaseModule: Global, provides Drizzle ORM (reuses existing schema)
 * - Feature modules:
 *   - AuthModule ✅
 *   - SessionsModule (Socket.IO Gateway) ✅
 *   - CharactersModule ✅
 *   - AiModule (OpenAI DALL-E, GPT-4o) ✅
 *   - GameplayModule (CoC 7e mechanics, effects, rolls) ✅
 *   - NarrativeModule (GM narrative entries + AI suggestions) ✅
 *   - ProjectionsModule (GameBoard scene generation) ✅
 */
@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database (global)
    DatabaseModule,

    // Feature Modules
    AuthModule,
    SessionsModule,
    CharactersModule,
    AiModule,
    GameplayModule,
    NarrativeModule,
    ProjectionsModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
