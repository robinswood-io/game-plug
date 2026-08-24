import { Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isObservable, lastValueFrom } from 'rxjs';
import { SKIP_AUTH_KEY } from '../decorators/skip-auth.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    // Special handling: /effects endpoints don't require authentication
    if (req.path && req.path.includes('/effects') && req.method === 'POST') {
      this.logger.debug(`Allowing unauthenticated POST to ${req.path}`);
      // Attach a dummy user for /effects endpoints
      req.user = { id: 'anonymous', email: 'anonymous', isGM: false };
      return true;
    }

    // Check if the handler or class has the SkipAuth decorator
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipAuth) {
      this.logger.debug(`Skipping auth for ${req.path} (via decorator)`);
      return true;
    }

    // Otherwise, perform normal JWT validation
    try {
      const result = super.canActivate(context);
      if (result instanceof Promise) return await result;
      if (isObservable(result)) return await lastValueFrom(result);
      return result;
    } catch (err) {
      this.logger.error(`Auth failed for ${req.path}: ${err.message}`);
      throw new UnauthorizedException('Invalid or missing JWT token');
    }
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Unauthorized');
    }
    return user;
  }
}
