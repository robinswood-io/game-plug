import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/**
 * JWT Strategy for Passport
 *
 * Validates JWT tokens and extracts user information.
 * Required by JwtAuthGuard from @robinswood/auth.
 *
 * Pattern: Similar to jlm-app JWT strategy
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'gameplug-dev-secret-CHANGE-IN-PRODUCTION',
    });
  }

  /**
   * Validate JWT payload and return user object
   *
   * This method is called automatically by Passport after JWT verification.
   * The returned object is attached to request as req.user.
   *
   * @param payload JWT payload (decoded token)
   * @returns User object for request
   */
  async validate(payload: any) {
    return {
      email: payload.sub,
      role: payload.role || 'player',
      firstName: payload.firstName,
      lastName: payload.lastName,
    };
  }
}
