import { Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { isObservable, lastValueFrom } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    // Otherwise, perform normal JWT validation
    try {
      const result = super.canActivate(context);
      const activated = result instanceof Promise
        ? await result
        : isObservable(result)
          ? await lastValueFrom(result)
          : result;

      if (activated && req.user?.isDemo) {
        const allowedReadPaths = new Set([
          '/api/auth/user',
          '/api/v1/auth/user',
          '/api/sessions',
          '/api/characters',
        ]);
        if (req.method !== 'GET' || !allowedReadPaths.has(req.path)) {
          throw new ForbiddenException('Demo tokens are read-only and route-limited');
        }
      }

      return Boolean(activated);
    } catch (err) {
      if (err instanceof ForbiddenException) throw err;
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
