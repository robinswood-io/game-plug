import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
import { timingSafeEqual } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.db.db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  async login(user: any, options: { isDemo?: boolean } = {}) {
    const payload = {
      email: user.email,
      sub: user.id,
      isGM: user.isGM,
      isDemo: options.isDemo === true,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async devLogin(demoKey?: string) {
    const enabled = process.env.GAMEPLUG_DEMO_AUTH_ENABLED === 'true';
    const expectedKey = process.env.GAMEPLUG_DEMO_AUTH_KEY;
    const allowedEmail = process.env.GAMEPLUG_DEMO_AUTH_EMAIL;

    if (!enabled || !expectedKey || !allowedEmail || !demoKey) {
      throw new NotFoundException();
    }

    const expected = Buffer.from(expectedKey);
    const presented = Buffer.from(demoKey);
    if (expected.length !== presented.length || !timingSafeEqual(expected, presented)) {
      throw new NotFoundException();
    }


    const user = await this.db.db.query.users.findFirst({
      where: eq(users.email, allowedEmail),
    });
    if (!user || user.authType !== 'dev-bypass' || user.isGM) {
      throw new ForbiddenException('Demo identity is not safely configured');
    }

    const { passwordHash, ...result } = user;
    return this.login(result, { isDemo: true });
  }

  async signup(data: { email: string; password: string; firstName?: string; lastName?: string; isGM?: boolean }) {
    const passwordHash = await bcrypt.hash(data.password, 10);
    const [user] = await this.db.db
      .insert(users)
      .values({
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        isGM: data.isGM || false,
        authType: 'local',
      })
      .returning();

    const { passwordHash: _, ...result } = user;
    return this.login(result);
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const newPayload = {
        email: payload.email,
        sub: payload.sub,
        isGM: payload.isGM,
        isDemo: payload.isDemo === true,
      };
      return {
        access_token: this.jwtService.sign(newPayload),
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async findById(userId: string) {
    const user = await this.db.db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { passwordHash, ...result } = user;
    return result;
  }
}
