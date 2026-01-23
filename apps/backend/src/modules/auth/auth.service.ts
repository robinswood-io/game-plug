import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';

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

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, isGM: user.isGM };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
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
      const newPayload = { email: payload.email, sub: payload.sub, isGM: payload.isGM };
      return {
        access_token: this.jwtService.sign(newPayload),
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
