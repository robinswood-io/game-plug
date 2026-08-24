import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let dbService: DatabaseService;
  let jwtService: JwtService;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    passwordHash: '$2a$10$hashedpassword',
    firstName: 'John',
    lastName: 'Doe',
    profileImageUrl: null,
    isGM: false,
    authType: 'local',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any;

  const mockUserGM = {
    id: 'user-2',
    email: 'gm@example.com',
    passwordHash: '$2a$10$hashedpassword',
    firstName: 'Jane',
    lastName: 'Smith',
    profileImageUrl: null,
    isGM: true,
    authType: 'local',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any;

  beforeEach(async () => {
    const jwtServiceMock = {
      sign: jest.fn().mockReturnValue('test-token'),
      verify: jest.fn().mockReturnValue({
        email: 'test@example.com',
        sub: 'user-1',
        isGM: false,
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: DatabaseService,
          useValue: {
            db: {
              query: {
                users: {
                  findFirst: jest.fn(),
                },
              },
              insert: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    dbService = module.get<DatabaseService>(DatabaseService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user without passwordHash when credentials are valid', async () => {
      jest.spyOn(dbService.db.query.users, 'findFirst').mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(result).toEqual({
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        profileImageUrl: null,
        isGM: false,
        authType: 'local',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(result.passwordHash).toBeUndefined();
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      jest.spyOn(dbService.db.query.users, 'findFirst').mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.validateUser('test@example.com', 'wrongpassword')).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.validateUser('test@example.com', 'wrongpassword')).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should throw UnauthorizedException when user not found', async () => {
      jest.spyOn(dbService.db.query.users, 'findFirst').mockResolvedValue(null as any);

      await expect(service.validateUser('nonexistent@example.com', 'password123')).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.validateUser('nonexistent@example.com', 'password123')).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should throw UnauthorizedException when user has no passwordHash', async () => {
      const userWithoutPassword = { ...mockUser, passwordHash: null };
      jest.spyOn(dbService.db.query.users, 'findFirst').mockResolvedValue(userWithoutPassword as any);

      await expect(service.validateUser('test@example.com', 'password123')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should handle GM users correctly', async () => {
      jest.spyOn(dbService.db.query.users, 'findFirst').mockResolvedValue(mockUserGM as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('gm@example.com', 'password123');

      expect(result.isGM).toBe(true);
      expect(result.passwordHash).toBeUndefined();
    });
  });

  describe('login', () => {
    it('should return access token and user', async () => {
      const loginResult = await service.login(mockUser);

      expect(loginResult).toEqual({
        access_token: 'test-token',
        user: mockUser,
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: 'test@example.com',
        sub: 'user-1',
        isGM: false,
        isDemo: false,
      });
    });

    it('should sign token with correct payload for GM', async () => {
      await service.login(mockUserGM);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: 'gm@example.com',
        sub: 'user-2',
        isGM: true,
        isDemo: false,
      });
    });

    it('should sign token with user email and id', async () => {
      await service.login(mockUser);

      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          email: mockUser.email,
          sub: mockUser.id,
        }),
      );
    });
  });

  describe('devLogin', () => {
    const demoUser = {
      ...mockUser,
      email: 'demo-e2e@game-plug.invalid',
      passwordHash: null,
      authType: 'dev-bypass',
      isGM: false,
    };

    beforeEach(() => {
      process.env.GAMEPLUG_DEMO_AUTH_ENABLED = 'true';
      process.env.GAMEPLUG_DEMO_AUTH_KEY = 'unit-test-demo-key';
      process.env.GAMEPLUG_DEMO_AUTH_EMAIL = demoUser.email;
    });

    afterEach(() => {
      delete process.env.GAMEPLUG_DEMO_AUTH_ENABLED;
      delete process.env.GAMEPLUG_DEMO_AUTH_KEY;
      delete process.env.GAMEPLUG_DEMO_AUTH_EMAIL;
    });

    it('fails closed when demo mode is disabled', async () => {
      process.env.GAMEPLUG_DEMO_AUTH_ENABLED = 'false';
      await expect(service.devLogin(demoUser.email, 'unit-test-demo-key')).rejects.toThrow(NotFoundException);
    });

    it('fails closed when the demo key is invalid', async () => {
      await expect(service.devLogin(demoUser.email, 'wrong-key')).rejects.toThrow(NotFoundException);
    });

    it('issues a non-GM demo claim only for the configured empty identity', async () => {
      jest.spyOn(dbService.db.query.users, 'findFirst').mockResolvedValue(demoUser as any);
      const result = await service.devLogin(demoUser.email, 'unit-test-demo-key');

      expect(result.user.isGM).toBe(false);
      expect(jwtService.sign).toHaveBeenCalledWith(expect.objectContaining({
        email: demoUser.email,
        isGM: false,
        isDemo: true,
      }));
    });

    it('rejects a privileged demo identity', async () => {
      jest.spyOn(dbService.db.query.users, 'findFirst').mockResolvedValue({ ...demoUser, isGM: true } as any);
      await expect(service.devLogin(demoUser.email, 'unit-test-demo-key')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('signup', () => {
    it('should create a new user and return access token', async () => {
      const signupData = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'Alice',
        lastName: 'Johnson',
      };

      const newUser = {
        ...mockUser,
        email: signupData.email,
        firstName: signupData.firstName,
        lastName: signupData.lastName,
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');

      const mockInsertChain = {
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([newUser]),
        }),
      };

      jest.spyOn(dbService.db, 'insert').mockReturnValue(mockInsertChain as any);
      jest.spyOn(jwtService, 'sign').mockReturnValue('new-token');

      const result = await service.signup(signupData);

      expect(result).toEqual({
        access_token: 'new-token',
        user: expect.objectContaining({
          email: signupData.email,
          firstName: signupData.firstName,
          lastName: signupData.lastName,
        }),
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    });

    it('should create user with isGM flag', async () => {
      const signupData = {
        email: 'gm@example.com',
        password: 'password123',
        firstName: 'Game',
        lastName: 'Master',
        isGM: true,
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');

      const mockInsertChain = {
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([mockUserGM]),
        }),
      };

      jest.spyOn(dbService.db, 'insert').mockReturnValue(mockInsertChain as any);

      await service.signup(signupData);

      expect(mockInsertChain.values).toHaveBeenCalledWith(
        expect.objectContaining({
          email: signupData.email,
          isGM: true,
          authType: 'local',
        }),
      );
    });

    it('should set isGM to false by default', async () => {
      const signupData = {
        email: 'user@example.com',
        password: 'password123',
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');

      const mockInsertChain = {
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([mockUser]),
        }),
      };

      jest.spyOn(dbService.db, 'insert').mockReturnValue(mockInsertChain as any);

      await service.signup(signupData);

      expect(mockInsertChain.values).toHaveBeenCalledWith(
        expect.objectContaining({
          isGM: false,
        }),
      );
    });

    it('should not return passwordHash in response', async () => {
      const signupData = {
        email: 'test@example.com',
        password: 'password123',
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');

      const mockInsertChain = {
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([mockUser]),
        }),
      };

      jest.spyOn(dbService.db, 'insert').mockReturnValue(mockInsertChain as any);

      const result = await service.signup(signupData);

      expect(result.user.passwordHash).toBeUndefined();
    });

    it('should handle database errors during signup', async () => {
      const signupData = {
        email: 'test@example.com',
        password: 'password123',
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');

      const mockInsertChain = {
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockRejectedValue(new Error('DB Error')),
        }),
      };

      jest.spyOn(dbService.db, 'insert').mockReturnValue(mockInsertChain as any);

      await expect(service.signup(signupData)).rejects.toThrow('DB Error');
    });
  });

  describe('refreshToken', () => {
    it('should return new access token when refresh token is valid', async () => {
      const refreshToken = 'valid-refresh-token';
      const payload = {
        email: 'test@example.com',
        sub: 'user-1',
        isGM: false,
        isDemo: false,
      };
      (jwtService.verify as jest.Mock).mockReturnValue(payload);

      const result = await service.refreshToken(refreshToken);

      expect(result).toEqual({
        access_token: 'test-token',
      });
      expect(jwtService.verify).toHaveBeenCalledWith(refreshToken);
      expect(jwtService.sign).toHaveBeenCalledWith(payload);
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      const refreshToken = 'invalid-token';
      // Reset the mock and set it to throw
      (jwtService.verify as jest.Mock).mockReset();
      (jwtService.verify as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshToken(refreshToken)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for expired token', async () => {
      const refreshToken = 'expired-token';
      // Reset the mock and set it to throw
      (jwtService.verify as jest.Mock).mockReset();
      (jwtService.verify as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Token expired');
      });

      await expect(service.refreshToken(refreshToken)).rejects.toThrow(UnauthorizedException);
    });

    it('should preserve user payload in new token', async () => {
      const userPayload = {
        email: 'gm@example.com',
        sub: 'user-2',
        isGM: true,
        isDemo: false,
      };
      (jwtService.verify as jest.Mock).mockReset();
      (jwtService.verify as jest.Mock).mockReturnValue(userPayload);

      await service.refreshToken('valid-token');

      expect(jwtService.sign).toHaveBeenCalledWith(userPayload);
    });
  });
});
