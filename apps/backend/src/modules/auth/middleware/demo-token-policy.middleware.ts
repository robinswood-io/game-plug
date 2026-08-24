import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class DemoTokenPolicyMiddleware implements NestMiddleware {
  private readonly allowedReads = new Set([
    '/api/auth/user',
    '/api/v1/auth/user',
    '/api/sessions',
    '/api/characters',
  ]);

  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;
    if (!authorization?.startsWith('Bearer ')) return next();

    const token = authorization.slice('Bearer '.length);
    let payload: { isDemo?: boolean };
    try {
      payload = this.jwtService.verify(token);
    } catch {
      return next();
    }

    if (payload.isDemo !== true) return next();

    const path = req.originalUrl.split('?')[0];
    const isRead = req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS';
    if (!isRead || !this.allowedReads.has(path)) {
      return res.status(403).json({
        statusCode: 403,
        message: 'Demo tokens are read-only and route-limited',
        error: 'Forbidden',
      });
    }

    return next();
  }
}
