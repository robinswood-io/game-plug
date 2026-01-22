import { Injectable, Inject } from '@nestjs/common';
import type {
  IAuthStorageAdapter,
  IAuthUser,
  IRefreshToken,
  IPasswordResetToken,
} from '@robinswood/auth';
import { eq, and, gt, isNull } from 'drizzle-orm';
import { DRIZZLE_ORM } from '../../../common/database/database.constants';
import type { DrizzleDB } from '../../../common/database/database.types';
import { users, refreshTokens, passwordResetTokens } from '../../../shared/schema';

/**
 * Refresh token metadata for security tracking
 */
export interface IRefreshTokenMetadata {
  ip?: string;
  userAgent?: string;
}

/**
 * GamePlug Auth Storage Adapter
 * Implements IAuthStorageAdapter for @robinswood/auth@3.0.0
 *
 * Provides database operations for:
 * - User authentication (email/password)
 * - Refresh token management (RFC 6749 rotation)
 * - Password reset tokens
 * - RBAC permissions (admin, gamemaster, player)
 */
@Injectable()
export class GamePlugAuthAdapter implements IAuthStorageAdapter {
  constructor(@Inject(DRIZZLE_ORM) private readonly db: DrizzleDB) {}

  /**
   * Get user by email
   * Required for authentication
   */
  async getUserByEmail(email: string): Promise<IAuthUser | null> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) return null;

    return {
      email: user.email!,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      password: user.passwordHash || null,
      role: user.role || 'player',
      isActive: true,
      createdAt: user.createdAt || new Date(),
      updatedAt: user.updatedAt || new Date(),
    };
  }

  /**
   * Get user by ID (UUID)
   * Required for refresh token operations
   */
  async getUserById(userId: string): Promise<IAuthUser | null> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) return null;

    return {
      email: user.email!,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      password: user.passwordHash || null,
      role: user.role || 'player',
      isActive: true,
      createdAt: user.createdAt || new Date(),
      updatedAt: user.updatedAt || new Date(),
    };
  }

  /**
   * Update user password (for password reset)
   */
  async updatePassword(email: string, hashedPassword: string): Promise<void> {
    await this.db
      .update(users)
      .set({
        passwordHash: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.email, email));
  }

  /**
   * Get user permissions based on role (RBAC)
   */
  async getPermissions(email: string): Promise<string[]> {
    const user = await this.getUserByEmail(email);
    if (!user) return [];

    // RBAC permissions map for Call of Cthulhu RPG
    const rolePermissionsMap: Record<string, string[]> = {
      admin: [
        'admin:super',
        'sessions:create',
        'sessions:read',
        'sessions:write',
        'sessions:delete',
        'characters:create',
        'characters:read',
        'characters:write',
        'characters:delete',
        'gameplay:manage',
        'ai:generate',
        'projections:manage',
        'narrative:write',
      ],
      gamemaster: [
        'sessions:create',
        'sessions:read',
        'sessions:write',
        'sessions:delete',
        'characters:read',
        'characters:write',
        'gameplay:manage',
        'ai:generate',
        'projections:manage',
        'narrative:write',
      ],
      player: [
        'sessions:join',
        'sessions:read',
        'characters:create',
        'characters:read',
        'characters:write_own',
        'gameplay:roll',
      ],
    };

    return rolePermissionsMap[user.role] || [];
  }

  /**
   * Create refresh token (RFC 6749 rotation)
   */
  async createRefreshToken(
    userId: string,
    token: string,
    familyId: string,
    expiresAt: Date,
    metadata?: IRefreshTokenMetadata,
  ): Promise<void> {
    await this.db.insert(refreshTokens).values({
      token,
      userId,
      familyId,
      expiresAt,
      createdFromIp: metadata?.ip,
      createdByUserAgent: metadata?.userAgent,
    } as any);
  }

  /**
   * Get refresh token by token string
   */
  async getRefreshToken(token: string): Promise<IRefreshToken | null> {
    const [rt] = await this.db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.token, token))
      .limit(1);

    if (!rt) return null;

    return {
      id: rt.id,
      token: rt.token,
      userId: rt.userId,
      familyId: rt.familyId,
      expiresAt: rt.expiresAt,
      createdAt: rt.createdAt,
      isRevoked: rt.isRevoked,
      usedAt: rt.usedAt || undefined,
      replacedBy: rt.replacedBy || undefined,
    };
  }

  /**
   * Revoke single refresh token
   */
  async revokeRefreshToken(token: string): Promise<void> {
    await this.db
      .update(refreshTokens)
      .set({ isRevoked: true } as any)
      .where(eq(refreshTokens.token, token));
  }

  /**
   * Revoke entire token family (rotation attack detection)
   */
  async revokeRefreshTokenFamily(familyId: string): Promise<void> {
    await this.db
      .update(refreshTokens)
      .set({ isRevoked: true } as any)
      .where(eq(refreshTokens.familyId, familyId));
  }

  /**
   * Create password reset token
   */
  async createPasswordResetToken(
    data: Omit<IPasswordResetToken, 'usedAt'>,
  ): Promise<void> {
    await this.db.insert(passwordResetTokens).values({
      email: data.userEmail,
      token: data.token,
      expiresAt: data.expiresAt,
    } as any);
  }

  /**
   * Get password reset token (if valid and not used)
   */
  async getPasswordResetToken(token: string): Promise<IPasswordResetToken | null> {
    const [resetToken] = await this.db
      .select()
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.token, token),
          gt(passwordResetTokens.expiresAt, new Date()),
          isNull(passwordResetTokens.usedAt),
        ),
      )
      .limit(1);

    if (!resetToken) return null;

    return {
      token: resetToken.token,
      userEmail: resetToken.email || '',
      expiresAt: resetToken.expiresAt,
      usedAt: resetToken.usedAt || undefined,
    };
  }

  /**
   * Mark reset token as used (prevent reuse)
   */
  async markResetTokenUsed(token: string): Promise<void> {
    await this.db
      .update(passwordResetTokens)
      .set({ usedAt: new Date() } as any)
      .where(eq(passwordResetTokens.token, token));
  }
}
