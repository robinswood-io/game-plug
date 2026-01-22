import { Injectable, Inject, UnauthorizedException, BadRequestException } from '@nestjs/common';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';
import { GamePlugAuthAdapter } from './adapters/gameplug-auth.adapter';
import { DatabaseService } from '../../common/database/database.service';
import { PasswordService } from '@robinswood/auth';
import type { IAuthUser } from '@robinswood/auth';
import * as schema from '../../shared/schema';

/**
 * Auth Service for game-plug
 * Simple authentication service using JWT + Refresh Tokens
 *
 * Responsibilities:
 * - User signup and login
 * - JWT access token generation
 * - Refresh token management
 * - Password hashing and validation
 *
 * Pattern: Direct implementation (simplified from @robinswood/auth)
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adapter: GamePlugAuthAdapter,
    private readonly db: DatabaseService,
    private readonly passwordService: PasswordService,
  ) {}

  /**
   * Register new user (GM or Player)
   * Automatically assigns role based on input or defaults to 'player'
   */
  async signup(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }): Promise<IAuthUser> {
    // Check if user already exists
    const existingUser = await this.adapter.getUserByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Hash password
    const hashedPassword = await this.passwordService.hashPassword(data.password);

    // Create user in database
    const [newUser] = await this.db.client.insert(schema.users).values({
      email: data.email,
      passwordHash: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role || 'player',
      isGM: data.role === 'gamemaster' || data.role === 'admin',
    }).returning();

    return {
      email: newUser.email!,
      firstName: newUser.firstName || '',
      lastName: newUser.lastName || '',
      password: null, // Never return hashed password
      role: newUser.role || 'player',
      isActive: true,
      createdAt: newUser.createdAt || new Date(),
      updatedAt: newUser.updatedAt || new Date(),
    };
  }

  /**
   * Login with email + password
   * Creates access token (15min) + refresh token (30 days)
   * Tracks IP and User-Agent for security monitoring
   */
  async login(
    loginDto: { email: string; password: string },
    req: Request,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: IAuthUser;
  }> {
    // Validate user credentials
    const user = await this.adapter.getUserByEmail(loginDto.email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.passwordService.verifyPassword(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT access token
    const accessToken = await this.jwtService.signAsync({
      sub: user.email,
      role: user.role,
    });

    // Generate refresh token
    const refreshTokenValue = this.generateRefreshToken();
    const familyId = this.generateFamilyId();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const ip = req.ip || (req.headers['x-forwarded-for'] as string) || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Get user ID from database (needed for refresh token foreign key)
    const [dbUser] = await this.db.client
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.email, user.email))
      .limit(1);

    if (!dbUser) {
      throw new UnauthorizedException('User not found in database');
    }

    // Store refresh token in database with user ID
    await this.adapter.createRefreshToken(
      dbUser.id,
      refreshTokenValue,
      familyId,
      expiresAt,
      { ip, userAgent },
    );

    return {
      accessToken,
      refreshToken: refreshTokenValue,
      user: {
        ...user,
        password: null, // Never return password
      },
    };
  }

  private generateRefreshToken(): string {
    return require('crypto').randomBytes(64).toString('hex');
  }

  private generateFamilyId(): string {
    return require('crypto').randomBytes(16).toString('hex');
  }

  /**
   * Refresh access token
   * Rotates refresh token (RFC 6749 - prevents replay attacks)
   * If refresh token is reused, entire token family is revoked
   */
  async refreshToken(
    refreshToken: string,
    req: Request,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    // Get existing refresh token
    const existingToken = await this.adapter.getRefreshToken(refreshToken);
    if (!existingToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if token is expired
    if (existingToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    // Check if token is revoked
    if (existingToken.isRevoked) {
      throw new UnauthorizedException('Refresh token revoked');
    }

    // Check if token was already used (rotation attack)
    if (existingToken.usedAt) {
      // Revoke entire token family
      await this.adapter.revokeRefreshTokenFamily(existingToken.familyId);
      throw new UnauthorizedException('Refresh token reuse detected - family revoked');
    }

    // Get user by ID (userId is UUID, not email)
    const user = await this.adapter.getUserById(existingToken.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate new access token
    const accessToken = await this.jwtService.signAsync({
      sub: user.email,
      role: user.role,
    });

    // Generate new refresh token (rotation)
    const newRefreshTokenValue = this.generateRefreshToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const ip = req.ip || (req.headers['x-forwarded-for'] as string) || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Create new refresh token with same family ID (use userId UUID, not email)
    await this.adapter.createRefreshToken(
      existingToken.userId, // UUID from existing token
      newRefreshTokenValue,
      existingToken.familyId, // Keep same family
      expiresAt,
      { ip, userAgent },
    );

    // Mark old token as used (stored in database for audit)
    await this.adapter.revokeRefreshToken(refreshToken);

    return {
      accessToken,
      refreshToken: newRefreshTokenValue,
    };
  }

  /**
   * Logout - Revoke refresh token
   * Prevents token reuse after logout
   */
  async logout(userEmail: string, refreshToken: string): Promise<{ success: boolean }> {
    if (refreshToken) {
      await this.adapter.revokeRefreshToken(refreshToken);
    }
    return { success: true };
  }

  /**
   * Request password reset
   * Generates secure reset token (60min expiry)
   * TODO: Send email with reset link
   */
  async requestPasswordReset(email: string): Promise<{ message: string; token?: string }> {
    // Check if user exists
    const user = await this.adapter.getUserByEmail(email);
    if (!user) {
      // Return same message for security (don't reveal if email exists)
      return { message: 'If this email exists, a reset link has been sent' };
    }

    // Generate reset token
    const resetToken = require('crypto').randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes

    await this.adapter.createPasswordResetToken({
      token: resetToken,
      userEmail: email,
      expiresAt,
    });

    // TODO: Integrate email service (Listmonk or SMTP)
    // await this.emailService.sendPasswordReset(email, resetToken);

    return {
      message: 'If this email exists, a reset link has been sent',
      // SECURITY: Remove token from response in production
      token: process.env.NODE_ENV === 'development' ? resetToken : undefined,
    };
  }

  /**
   * Reset password with token
   * Validates token and updates user password
   */
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean }> {
    // Validate reset token
    const resetToken = await this.adapter.getPasswordResetToken(token);
    if (!resetToken) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await this.passwordService.hashPassword(newPassword);

    // Update user password
    await this.adapter.updatePassword(resetToken.userEmail, hashedPassword);

    // Mark token as used
    await this.adapter.markResetTokenUsed(token);

    return { success: true };
  }
}
