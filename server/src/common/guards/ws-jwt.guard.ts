import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import type { Socket } from 'socket.io';

/**
 * WebSocket JWT Guard
 * Validates JWT token in WebSocket handshake
 *
 * Token sources (priority order):
 * 1. Query parameter: ?token=<jwt>
 * 2. Authorization header: Bearer <jwt>
 *
 * Attaches user to socket for downstream handlers:
 * - socket.user = { email, role }
 *
 * Pattern: Follow NestJS WebSocket authentication best practices
 * Ref: https://docs.nestjs.com/websockets/guards
 */
@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();

    // Extract token from handshake
    const token = this.extractToken(client);

    if (!token) {
      throw new WsException('No authentication token provided');
    }

    try {
      // Verify JWT token
      const payload = await this.jwtService.verifyAsync(token);

      // Attach user to socket (for downstream handlers)
      (client as any).user = {
        email: payload.sub, // JWT subject is user email
        role: payload.role,
      };

      return true;
    } catch (err) {
      throw new WsException('Invalid or expired token');
    }
  }

  /**
   * Extract JWT token from WebSocket handshake
   * Priority: query param > auth header
   */
  private extractToken(client: Socket): string | null {
    // 1. Try query parameter: ws://...?token=<jwt>
    const queryToken = client.handshake.query.token;
    if (queryToken && typeof queryToken === 'string') {
      return queryToken;
    }

    // 2. Try Authorization header: Bearer <jwt>
    const authHeader = client.handshake.headers.authorization;
    if (authHeader && typeof authHeader === 'string') {
      const parts = authHeader.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        return parts[1];
      }
    }

    return null;
  }
}
