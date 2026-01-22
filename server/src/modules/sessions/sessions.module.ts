import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { SessionsGateway } from './sessions.gateway';
import { WsJwtGuard } from '../../common/guards/ws-jwt.guard';

/**
 * Sessions Module
 * Handles game sessions and chapters CRUD + WebSocket
 *
 * Features:
 * - Create, read, update, delete sessions
 * - Session join by code (6-char code)
 * - GM ownership validation
 * - Chapters management (linked to sessions)
 * - Session characters listing
 * - WebSocket Gateway (Socket.IO) for real-time communication
 * - JWT authentication for WebSocket connections
 */
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'gameplug-dev-secret-CHANGE-IN-PRODUCTION',
        signOptions: {
          expiresIn: (config.get<string>('ACCESS_TOKEN_TTL') || '15m') as any,
        },
      }),
    }),
  ],
  controllers: [SessionsController],
  providers: [SessionsService, SessionsGateway, WsJwtGuard],
  exports: [SessionsService, SessionsGateway],
})
export class SessionsModule {}
