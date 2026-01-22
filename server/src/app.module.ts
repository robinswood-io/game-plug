import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './common/database/database.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { CharactersModule } from './modules/characters/characters.module';
import { AiModule } from './modules/ai/ai.module';
import { GameplayModule } from './modules/gameplay/gameplay.module';
import { NarrativeModule } from './modules/narrative/narrative.module';
import { ProjectionsModule } from './modules/projections/projections.module';
import { AuthModule } from './modules/auth/auth.module';

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
    AuthModule.forRoot(), // @robinswood/auth integration
    SessionsModule,
    CharactersModule,
    AiModule,
    GameplayModule,
    NarrativeModule,
    ProjectionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
