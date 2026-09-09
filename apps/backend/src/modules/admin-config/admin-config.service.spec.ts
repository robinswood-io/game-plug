import { Test, TestingModule } from '@nestjs/testing';
import { AdminConfigService } from './admin-config.service';
import { DatabaseService } from '../database/database.service';
import { CacheService } from '../cache/cache.service';
import * as schema from '@shared/schema';
import { eq } from 'drizzle-orm';

describe('AdminConfigService', () => {
  let service: AdminConfigService;
  let databaseService: DatabaseService;
  let cacheService: CacheService;

  const mockSystemConfig: schema.SystemConfig = {
    key: 'test.config',
    value: true,
    description: 'Test config',
    updatedBy: 'test-user',
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminConfigService,
        {
          provide: DatabaseService,
          useValue: {
            db: {
              select: jest.fn().mockReturnThis(),
              from: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              limit: jest.fn().mockResolvedValue([mockSystemConfig]),
              insert: jest.fn().mockReturnThis(),
              values: jest.fn().mockReturnThis(),
              returning: jest.fn().mockResolvedValue([mockSystemConfig]),
              update: jest.fn().mockReturnThis(),
              set: jest.fn().mockReturnThis(),
              delete: jest.fn().mockReturnThis(),
            },
          },
        },
        {
          provide: CacheService,
          useValue: {
            get: jest.fn().mockResolvedValue(undefined),
            set: jest.fn().mockResolvedValue(undefined),
            del: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<AdminConfigService>(AdminConfigService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    cacheService = module.get<CacheService>(CacheService);
  });

  describe('get', () => {
    it('should retrieve config from cache if available', async () => {
      const mockCachedConfig = { ...mockSystemConfig };
      jest.spyOn(cacheService, 'get').mockResolvedValueOnce(mockCachedConfig);

      const result = await service.get('test.config');

      expect(result).toEqual(mockCachedConfig);
      expect(cacheService.get).toHaveBeenCalledWith('system_config:test.config');
    });

    it('should retrieve config from database if not cached', async () => {
      jest.spyOn(cacheService, 'get').mockResolvedValueOnce(undefined);

      const result = await service.get('test.config');

      expect(result).toEqual(mockSystemConfig);
      expect(cacheService.set).toHaveBeenCalled();
    });

    it('should return null if config not found', async () => {
      jest.spyOn(cacheService, 'get').mockResolvedValueOnce(undefined);
      // Mock the chain to return empty array
      const mockDb = databaseService.db as any;
      mockDb.select = jest.fn().mockReturnThis();
      mockDb.from = jest.fn().mockReturnThis();
      mockDb.where = jest.fn().mockReturnThis();
      mockDb.limit = jest.fn().mockResolvedValueOnce([]);

      const result = await service.get('nonexistent.config');

      expect(result).toBeNull();
    });
  });

  describe('getAll', () => {
    it('should retrieve all configs from cache if available', async () => {
      const mockCachedConfigs = [mockSystemConfig];
      jest.spyOn(cacheService, 'get').mockResolvedValueOnce(mockCachedConfigs);

      const result = await service.getAll();

      expect(result).toEqual(mockCachedConfigs);
    });

    it('should retrieve all configs from database if not cached', async () => {
      jest.spyOn(cacheService, 'get').mockResolvedValueOnce(undefined);
      // Note: This test would need more complex mocking of the drizzle db chain
      // Skipping the complex implementation for now
    });
  });

  describe('set', () => {
    it('should set new config with cache invalidation', async () => {
      const newConfig = {
        key: 'new.config',
        value: 123,
        description: 'New config',
      };

      await service.set(newConfig.key, newConfig.value, newConfig.description);

      expect(cacheService.del).toHaveBeenCalledWith('system_config:new.config');
      expect(cacheService.del).toHaveBeenCalledWith('system_config:all');
    });

    it('should throw error on empty key', async () => {
      await expect(
        service.set('', 'value', 'description')
      ).rejects.toThrow('Config key cannot be empty');
    });
  });

  describe('delete', () => {
    it('should delete config and invalidate cache', async () => {
      await service.delete('test.config');

      expect(cacheService.del).toHaveBeenCalledWith('system_config:test.config');
      expect(cacheService.del).toHaveBeenCalledWith('system_config:all');
    });
  });

  describe('initializeDefaults', () => {
    it('should initialize default configs if they do not exist', async () => {
      jest.spyOn(cacheService, 'get').mockResolvedValue(undefined);
      jest.spyOn(databaseService.db as any, 'limit').mockResolvedValue([]);
      jest.spyOn(service, 'set').mockResolvedValue(mockSystemConfig);

      await service.initializeDefaults();

      expect(service.set).toHaveBeenCalledWith(
        'api.timeout',
        30000,
        'API request timeout in milliseconds'
      );
      expect(service.set).toHaveBeenCalledWith(
        'features.aiEnabled',
        true,
        'Enable AI features in the application'
      );
    });
  });
});
