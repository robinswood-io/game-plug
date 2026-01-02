import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionSerializer } from './session.serializer';

/**
 * Auth Module
 * Handles authentication with session-based strategy
 *
 * Features:
 * - GM signup (local auth)
 * - Local login with bcrypt
 * - Session management (reuses existing sessions table)
 * - Passport session serialization
 */
@Module({
  imports: [
    PassportModule.register({
      session: true,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, SessionSerializer],
  exports: [AuthService],
})
export class AuthModule {}
