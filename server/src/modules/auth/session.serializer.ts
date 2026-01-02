import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from './auth.service';
import type { User } from '../../shared/schema';

/**
 * Session Serializer
 * Handles serialization/deserialization of user to/from session
 *
 * Compatible with Express backend session format:
 * req.session.user = { id, email, authType: 'local' }
 */
@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  /**
   * Serialize user into session
   * Stores only minimal data (id, email, authType)
   */
  serializeUser(user: User, done: (err: Error | null, user: any) => void): void {
    done(null, {
      id: user.id,
      email: user.email,
      authType: user.authType,
    });
  }

  /**
   * Deserialize user from session
   * Retrieves full user from database using ID
   */
  async deserializeUser(
    payload: { id: string; email: string; authType: string },
    done: (err: Error | null, user: User | null) => void,
  ): Promise<void> {
    try {
      const user = await this.authService.findUserById(payload.id);
      done(null, user);
    } catch (error) {
      done(error as Error, null);
    }
  }
}
