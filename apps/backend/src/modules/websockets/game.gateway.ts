import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { resolveAllowedOrigins } from '../../security-config';

@WebSocketGateway({
  cors: { origin: resolveAllowedOrigins(), credentials: true },
  path: '/game-ws',
  namespace: '/game',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(GameGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  broadcastToSession(sessionId: string, eventType: string, data: any) {
    const roomName = `session:${sessionId}`;
    this.server.to(roomName).emit(eventType, { type: eventType, data, timestamp: new Date() });
  }
}
