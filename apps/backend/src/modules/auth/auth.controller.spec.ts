import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    profileImageUrl: null,
    isGM: false,
    authType: 'local',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAuthResponse = {
    access_token: 'jwt-token-123',
    user: mockUser,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn(),
            login: jest.fn(),
            refreshToken: jest.fn(),
            findById: jest.fn(),
            devLogin: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should create a new user and return access token', async () => {
      const signupDto = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
      };

      jest.spyOn(authService, 'signup').mockResolvedValue(mockAuthResponse);

      const result = await controller.signup(signupDto);

      expect(result).toEqual(mockAuthResponse);
      expect(authService.signup).toHaveBeenCalledWith(signupDto);
      expect(authService.signup).toHaveBeenCalledTimes(1);
    });

    it('should create user with isGM flag', async () => {
      const signupDto = {
        email: 'gm@example.com',
        password: 'password123',
        firstName: 'Game',
        lastName: 'Master',
        isGM: true,
      };

      const gmResponse = {
        ...mockAuthResponse,
        user: { ...mockUser, isGM: true },
      };

      jest.spyOn(authService, 'signup').mockResolvedValue(gmResponse);

      const result = await controller.signup(signupDto);

      expect(result.user.isGM).toBe(true);
      expect(authService.signup).toHaveBeenCalledWith(signupDto);
    });

    it('should handle signup errors', async () => {
      const signupDto = {
        email: 'test@test.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
      };

      jest.spyOn(authService, 'signup').mockRejectedValue(new Error('Email already exists'));

      await expect(controller.signup(signupDto)).rejects.toThrow('Email already exists');
    });
  });

  describe('login', () => {
    it('should login user and return access token', async () => {
      const mockRequest = { user: mockUser };

      jest.spyOn(authService, 'login').mockResolvedValue(mockAuthResponse);

      const result = await controller.login(mockRequest);

      expect(result).toEqual(mockAuthResponse);
      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(authService.login).toHaveBeenCalledTimes(1);
    });

    it('should login GM user', async () => {
      const gmUser = { ...mockUser, isGM: true };
      const mockRequest = { user: gmUser };
      const gmResponse = {
        ...mockAuthResponse,
        user: gmUser,
      };

      jest.spyOn(authService, 'login').mockResolvedValue(gmResponse);

      const result = await controller.login(mockRequest);

      expect(result.user.isGM).toBe(true);
      expect(authService.login).toHaveBeenCalledWith(gmUser);
    });

    it('should handle login errors', async () => {
      const mockRequest = { user: mockUser };

      jest.spyOn(authService, 'login').mockRejectedValue(new Error('Login failed'));

      await expect(controller.login(mockRequest)).rejects.toThrow('Login failed');
    });
  });

  describe('devLogin', () => {
    it('passes only the governed key and never an arbitrary identity', async () => {
      jest.spyOn(authService, 'devLogin').mockResolvedValue(mockAuthResponse);

      const result = await controller.devLogin('governed-key');

      expect(result).toEqual(mockAuthResponse);
      expect(authService.devLogin).toHaveBeenCalledWith('governed-key');
    });
  });

  describe('refresh', () => {
    it('should refresh token and return new access token', async () => {
      const refreshDto = { refreshToken: 'valid-refresh-token' };
      const refreshResponse = { access_token: 'new-jwt-token' };

      jest.spyOn(authService, 'refreshToken').mockResolvedValue(refreshResponse);

      const result = await controller.refresh(refreshDto);

      expect(result).toEqual(refreshResponse);
      expect(authService.refreshToken).toHaveBeenCalledWith('valid-refresh-token');
      expect(authService.refreshToken).toHaveBeenCalledTimes(1);
    });

    it('should handle invalid refresh token', async () => {
      const refreshDto = { refreshToken: 'invalid-token' };

      jest.spyOn(authService, 'refreshToken').mockRejectedValue(new Error('Invalid refresh token'));

      await expect(controller.refresh(refreshDto)).rejects.toThrow('Invalid refresh token');
    });

    it('should handle expired refresh token', async () => {
      const refreshDto = { refreshToken: 'expired-token' };

      jest.spyOn(authService, 'refreshToken').mockRejectedValue(new Error('Token expired'));

      await expect(controller.refresh(refreshDto)).rejects.toThrow('Token expired');
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      const mockRequest = { user: mockUser };

      const result = await controller.logout(mockRequest);

      expect(result).toEqual({ message: 'Logged out successfully' });
    });

    it('should logout GM user successfully', async () => {
      const gmUser = { ...mockUser, isGM: true };
      const mockRequest = { user: gmUser };

      const result = await controller.logout(mockRequest);

      expect(result).toEqual({ message: 'Logged out successfully' });
    });
  });

  describe('getCurrentUser', () => {
    it('should return current authenticated user', async () => {
      const mockRequest = { user: { id: 'user-1' } };

      jest.spyOn(authService, 'findById').mockResolvedValue(mockUser);

      const result = await controller.getCurrentUser(mockRequest);

      expect(result).toEqual(mockUser);
      expect(authService.findById).toHaveBeenCalledWith('user-1');
      expect(authService.findById).toHaveBeenCalledTimes(1);
    });

    it('should return GM user', async () => {
      const gmUser = { ...mockUser, isGM: true };
      const mockRequest = { user: { id: 'user-2' } };

      jest.spyOn(authService, 'findById').mockResolvedValue(gmUser);

      const result = await controller.getCurrentUser(mockRequest);

      expect(result.isGM).toBe(true);
      expect(authService.findById).toHaveBeenCalledWith('user-2');
    });

    it('should handle user not found', async () => {
      const mockRequest = { user: { id: 'nonexistent' } };

      jest.spyOn(authService, 'findById').mockRejectedValue(new Error('User not found'));

      await expect(controller.getCurrentUser(mockRequest)).rejects.toThrow('User not found');
    });
  });
});
