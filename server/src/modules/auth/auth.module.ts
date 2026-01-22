import { Global, Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PasswordService, JwtAuthGuard } from '@robinswood/auth';
import { DatabaseModule } from '../../common/database/database.module';
import { DatabaseService } from '../../common/database/database.service';
import { GamePlugAuthAdapter } from './adapters/gameplug-auth.adapter';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

/**
 * Authentication Module for game-plug
 * Integrates @robinswood/auth@3.0.0 with custom GamePlug adapter
 *
 * Features:
 * - JWT authentication (15min access tokens)
 * - Refresh tokens with rotation (RFC 6749)
 * - Password reset flow
 * - RBAC permissions (admin, gamemaster, player)
 * - Drizzle ORM integration
 *
 * Strategy:
 * - Access tokens: Short-lived JWT (15min)
 * - Refresh tokens: HttpOnly cookies (30 days)
 * - Token rotation: Prevents replay attacks
 * - Family tracking: Detects token theft
 */
@Global()
@Module({})
export class AuthModule {
  static forRoot(): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        ConfigModule,
        DatabaseModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
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
      controllers: [AuthController],
      providers: [
        AuthService,
        GamePlugAuthAdapter,
        PasswordService,
        JwtAuthGuard,
        JwtStrategy, // ✅ Required for JwtAuthGuard to work
      ],
      exports: [AuthService, JwtAuthGuard, JwtStrategy],
    };
  }
}
