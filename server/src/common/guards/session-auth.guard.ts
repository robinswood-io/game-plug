import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

/**
 * Session Auth Guard
 * Equivalent to isAuthenticated middleware in Express backend
 * Checks if user is authenticated via session
 */
@Injectable()
export class SessionAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Check if user exists in session (same as Express: req.user)
    if (!request.user) {
      throw new UnauthorizedException('Authentication required');
    }

    return true;
  }
}
