import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { JwtAuthGuard, User, Public } from '@robinswood/auth';
import type { IAuthUser } from '@robinswood/auth';

/**
 * Authentication Controller for game-plug
 * Endpoints for JWT authentication with refresh token rotation
 *
 * Strategy:
 * - Access tokens: JWT in response body (15min)
 * - Refresh tokens: HttpOnly cookies (30 days)
 * - Public routes: @Public() decorator
 * - Protected routes: @UseGuards(JwtAuthGuard) + @User() decorator
 * - Rate limiting: @Throttle() on auth endpoints
 *
 * Pattern: Follow jlm-app auth controller
 * Ref: /srv/workspace/jlm-app/server/src/modules/auth/auth.controller.ts
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/signup
   * Register new user (GM or Player)
   * Auto-login after successful registration
   */
  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 5, ttl: 900000 } }) // 5 requests per 15min
  async signup(
    @Body()
    signupDto: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      role?: string;
    },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string; user: IAuthUser }> {
    // Create user
    await this.authService.signup(signupDto);

    // Auto-login after signup
    const loginResult = await this.authService.login(
      { email: signupDto.email, password: signupDto.password },
      req,
    );

    // Set refresh token in HttpOnly cookie
    res.cookie('refreshToken', loginResult.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return {
      accessToken: loginResult.accessToken,
      user: loginResult.user,
    };
  }

  /**
   * POST /auth/login
   * Authenticate with email + password
   * Returns access token + sets refresh token cookie
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 900000 } }) // 10 requests per 15min
  async login(
    @Body() loginDto: { email: string; password: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string; user: IAuthUser }> {
    const result = await this.authService.login(loginDto, req);

    // Set refresh token in HttpOnly cookie (XSS protection)
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  /**
   * POST /auth/refresh
   * Refresh access token using refresh token cookie
   * Rotates refresh token (RFC 6749)
   */
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const result = await this.authService.refreshToken(refreshToken, req);

    // Update refresh token cookie (rotation)
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return { accessToken: result.accessToken };
  }

  /**
   * GET /auth/me
   * Get authenticated user profile
   * Requires valid JWT in Authorization header
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@User() user: IAuthUser): Promise<IAuthUser> {
    return user;
  }

  /**
   * POST /auth/logout
   * Logout user and revoke refresh token
   * Clears refresh token cookie
   */
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @User() user: IAuthUser,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ success: boolean }> {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await this.authService.logout(user.email, refreshToken);
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    return { success: true };
  }

  /**
   * POST /auth/password-reset/request
   * Request password reset email
   * Rate limited to prevent abuse
   */
  @Public()
  @Post('password-reset/request')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 900000 } }) // 3 requests per 15min
  async requestPasswordReset(
    @Body() { email }: { email: string },
  ): Promise<{ message: string; token?: string }> {
    return this.authService.requestPasswordReset(email);
  }

  /**
   * POST /auth/password-reset/confirm
   * Reset password with token
   * Token expires after 60 minutes
   */
  @Public()
  @Post('password-reset/confirm')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() { token, newPassword }: { token: string; newPassword: string },
  ): Promise<{ success: boolean }> {
    return this.authService.resetPassword(token, newPassword);
  }
}
