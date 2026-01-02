import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  JoinSessionData,
  RollData,
  EffectData,
  ProjectionData,
  NarrationData,
  AmbianceData,
  ExtendedSocket,
  BroadcastMessage,
} from './sessions.types';

@WebSocketGateway({
  path: '/game-ws',
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
})
export class SessionsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: ExtendedSocket) {
    console.log(`New WebSocket connection: ${client.id}`);
    client.emit('message', {
      type: 'connected',
      data: 'Connected to Call of Cthulhu game server',
      timestamp: new Date(),
    });
  }

  handleDisconnect(client: ExtendedSocket) {
    console.log(`WebSocket disconnected: ${client.id}`);
    if (client.sessionId) {
      this.handleLeaveSessionInternal(client);
    }
  }

  @SubscribeMessage('join_session')
  handleJoinSession(
    @ConnectedSocket() client: ExtendedSocket,
    @MessageBody() data: JoinSessionData,
  ) {
    client.sessionId = data.sessionId;
    client.userId = data.userId;

    console.log(
      `Socket ${client.id} joined session ${data.sessionId} with userId: ${data.userId || 'guest'}, role: ${data.role || 'player'}`,
    );

    client.join(`session:${data.sessionId}`);

    if (data.userId) {
      client.to(`session:${data.sessionId}`).emit('message', {
        type: 'user_joined',
        data: { userId: data.userId },
        timestamp: new Date(),
      });
    }

    client.emit('message', {
      type: 'joined_session',
      data: { sessionId: data.sessionId },
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('leave_session')
  handleLeaveSession(@ConnectedSocket() client: ExtendedSocket) {
    this.handleLeaveSessionInternal(client);
  }

  private handleLeaveSessionInternal(client: ExtendedSocket) {
    if (client.sessionId) {
      if (client.userId) {
        client.to(`session:${client.sessionId}`).emit('message', {
          type: 'user_left',
          data: { userId: client.userId },
          timestamp: new Date(),
        });
      }
      client.leave(`session:${client.sessionId}`);
    }
    client.sessionId = undefined;
    client.userId = undefined;
  }

  @SubscribeMessage('gm_roll')
  handleGMRoll(@ConnectedSocket() client: ExtendedSocket, @MessageBody() data: RollData) {
    if (!client.sessionId) return;
    client.to(`session:${client.sessionId}`).emit('message', {
      type: 'gm_roll',
      data,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('player_roll')
  handlePlayerRoll(@ConnectedSocket() client: ExtendedSocket, @MessageBody() data: RollData) {
    if (!client.sessionId) return;
    this.server.to(`session:${client.sessionId}`).emit('message', {
      type: 'player_roll',
      data: { ...data, userId: client.userId },
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('ambiance')
  handleAmbiance(@ConnectedSocket() client: ExtendedSocket, @MessageBody() data: AmbianceData) {
    if (!client.sessionId) return;
    client.to(`session:${client.sessionId}`).emit('message', {
      type: 'ambiance',
      data,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('narration')
  handleNarration(@ConnectedSocket() client: ExtendedSocket, @MessageBody() data: NarrationData) {
    if (!client.sessionId) return;
    client.to(`session:${client.sessionId}`).emit('message', {
      type: 'narration',
      data,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('effect_applied')
  handleEffectApplied(@ConnectedSocket() client: ExtendedSocket, @MessageBody() data: EffectData) {
    if (!client.sessionId) return;
    this.server.to(`session:${client.sessionId}`).emit('message', {
      type: 'effect_applied',
      data,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('projection_update')
  handleProjectionUpdate(
    @ConnectedSocket() client: ExtendedSocket,
    @MessageBody() data: ProjectionData,
  ) {
    if (!client.sessionId) return;
    client.to(`session:${client.sessionId}`).emit('message', {
      type: 'projection_update',
      data,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    client.emit('message', { type: 'pong', timestamp: new Date() });
  }

  broadcastToSession(sessionId: string, data: Record<string, unknown>) {
    this.server.to(`session:${sessionId}`).emit('message', {
      ...data,
      timestamp: new Date(),
    });
  }

  // New methods for specific character updates
  @SubscribeMessage('character_update')
  handleCharacterUpdate(
    @ConnectedSocket() client: ExtendedSocket,
    @MessageBody() data: any,
  ) {
    if (!client.sessionId) return;
    this.server.to(`session:${client.sessionId}`).emit('message', {
      type: 'character_updated',
      data,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('sanity_update')
  handleSanityUpdate(
    @ConnectedSocket() client: ExtendedSocket,
    @MessageBody() data: any,
  ) {
    if (!client.sessionId) return;
    this.server.to(`session:${client.sessionId}`).emit('message', {
      type: 'sanity_updated',
      data,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('inventory_update')
  handleInventoryUpdate(
    @ConnectedSocket() client: ExtendedSocket,
    @MessageBody() data: any,
  ) {
    if (!client.sessionId) return;
    this.server.to(`session:${client.sessionId}`).emit('message', {
      type: 'inventory_updated',
      data,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('skill_update')
  handleSkillUpdate(
    @ConnectedSocket() client: ExtendedSocket,
    @MessageBody() data: any,
  ) {
    if (!client.sessionId) return;
    this.server.to(`session:${client.sessionId}`).emit('message', {
      type: 'skill_updated',
      data,
      timestamp: new Date(),
    });
  }
}
