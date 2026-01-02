import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SessionAuthGuard } from '../../common/guards/session-auth.guard';
import { signupSchema, type SignupDto } from './dto/signup.dto';
import { loginSchema, type LoginDto } from './dto/login.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import type { User } from '../../shared/schema';

/**
 * Auth Controller
 * Replicates auth routes from Express backend:
 * - POST /api/auth/signup
 * - POST /api/auth/login
 * - POST /api/auth/logout
 * - GET /api/auth/user
 */
@Controller('api/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  /**
   * Local GM signup route
   * POST /api/auth/signup
   */
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body(new ZodValidationPipe(signupSchema)) signupData: SignupDto,
    @Req() req: Request,
  ) {
    const user = await this.authService.signupGM(signupData);

    // Create session for the new user (same as Express backend)
    (req.session as any).user = {
      id: user.id,
      email: user.email,
      authType: 'local',
    };

    // Also set req.user for consistency with Passport
    (req as any).user = user;

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isGM: user.isGM,
        authType: user.authType,
      },
    };
  }

  /**
   * Local login route
   * POST /api/auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new ZodValidationPipe(loginSchema)) loginData: LoginDto,
    @Req() req: Request,
  ) {
    try {
      const user = await this.authService.authenticateLocal(loginData);

      // Create session for the authenticated user (same as Express backend)
      (req.session as any).user = {
        id: user.id,
        email: user.email,
        authType: 'local',
      };

      // Also set req.user for consistency with Passport
      (req as any).user = user;

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isGM: user.isGM,
          authType: user.authType,
        },
      };
    } catch (error) {
      // Re-throw UnauthorizedException from service
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      // Log unexpected errors but still return 401
      this.logger.error('Login error:', error);
      throw new UnauthorizedException('Authentication failed');
    }
  }

  /**
   * Logout route
   * POST /api/auth/logout
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request, @Res() res: Response) {
    // Clear user from session (same as Express backend)
    (req.session as any).user = null;

    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ message: 'Erreur lors de la déconnexion' });
      }
      res.json({ message: 'Déconnecté avec succès' });
    });
  }

  /**
   * Get current user
   * GET /api/auth/user
   * Requires authentication
   */
  @Get('user')
  @UseGuards(SessionAuthGuard)
  async getUser(@Req() req: Request) {
    const user = (req as any).user as User;

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isGM: user.isGM,
      authType: user.authType,
    };
  }
}
