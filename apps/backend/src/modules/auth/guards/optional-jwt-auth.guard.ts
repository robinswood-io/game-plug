import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { isObservable, lastValueFrom } from 'rxjs';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const result = super.canActivate(context);
      if (result instanceof Promise) {
        await result;
      } else if (isObservable(result)) {
        await lastValueFrom(result);
      }
    } catch {
      // Allow requests to proceed even if JWT validation fails.
      // The endpoint handler can check if user exists.
    }
    return true;
  }

  handleRequest(err: any, user: any, info: any) {
    // Allow requests to proceed even if JWT validation fails
    // The endpoint handler can check if user exists
    return user || null;
  }
}
