import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { SessionsGateway } from './sessions.gateway';

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
 */
@Module({
  controllers: [SessionsController],
  providers: [SessionsService, SessionsGateway],
  exports: [SessionsService, SessionsGateway],
})
export class SessionsModule {}
