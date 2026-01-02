import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import type { SignupDto } from './dto/signup.dto';
import type { LoginDto } from './dto/login.dto';
import type { User, UpsertUser } from '../../shared/schema';

/**
 * Auth Service
 * Replicates the logic from Express backend's AuthService
 * Uses bcrypt for password hashing (12 salt rounds)
 */
@Injectable()
export class AuthService {
  private static readonly SALT_ROUNDS = 12;

  constructor(private readonly db: DatabaseService) {}

  /**
   * Hash a password
   */
  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, AuthService.SALT_ROUNDS);
  }

  /**
   * Verify a password against its hash
   */
  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Create a new GM account
   */
  async signupGM(data: SignupDto): Promise<User> {
    const { email, password, firstName, lastName } = data;

    // Check if user already exists
    const existingUsers = await this.db.client
      .select()
      .from(this.db.schema.users)
      .where(eq(this.db.schema.users.email, email));

    if (existingUsers.length > 0) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Create user data
    const userData: UpsertUser = {
      email,
      firstName,
      lastName,
      passwordHash,
      authType: 'local',
      isGM: true,
    };

    // Insert user
    const [newUser] = await this.db.client
      .insert(this.db.schema.users)
      .values(userData)
      .returning();

    return newUser;
  }

  /**
   * Authenticate local user
   */
  async authenticateLocal(data: LoginDto): Promise<User> {
    const { email, password } = data;

    // Find user by email
    const users = await this.db.client
      .select()
      .from(this.db.schema.users)
      .where(eq(this.db.schema.users.email, email));

    const user = users.find((u) => u.authType === 'local');

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Verify password
    const isValid = await this.verifyPassword(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    return user;
  }

  /**
   * Find user by ID
   * Used by Passport session strategy
   */
  async findUserById(id: string): Promise<User | null> {
    const [user] = await this.db.client
      .select()
      .from(this.db.schema.users)
      .where(eq(this.db.schema.users.id, id));

    return user || null;
  }
}
