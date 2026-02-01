import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CacheService } from '../cache/cache.service';
import * as schema from '@shared/schema';
import { eq } from 'drizzle-orm';

const CONFIG_CACHE_PREFIX = 'system_config:';
const CONFIG_ALL_CACHE_KEY = 'system_config:all';

@Injectable()
export class AdminConfigService {
  private readonly logger = new Logger(AdminConfigService.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly cache: CacheService,
  ) {}

  /**
   * Get a single config value by key with cache
   */
  async get(key: string): Promise<schema.SystemConfig | null> {
    try {
      // Try cache first
      const cached = await this.cache.get<schema.SystemConfig>(
        `${CONFIG_CACHE_PREFIX}${key}`,
      );
      if (cached) {
        return cached;
      }

      // Query database
      const result = await this.db.db
        .select()
        .from(schema.systemConfig)
        .where(eq(schema.systemConfig.key, key))
        .limit(1);

      if (result.length === 0) {
        return null;
      }

      const config = result[0];

      // Cache the result (1 hour)
      await this.cache.set(
        `${CONFIG_CACHE_PREFIX}${key}`,
        config,
        3600000, // 1 hour in ms
      );

      return config;
    } catch (error) {
      this.logger.error(`Failed to get config key: ${key}`, error);
      throw error;
    }
  }

  /**
   * Get all system configs with cache
   */
  async getAll(): Promise<schema.SystemConfig[]> {
    try {
      // Try cache first
      const cached = await this.cache.get<schema.SystemConfig[]>(
        CONFIG_ALL_CACHE_KEY,
      );
      if (cached) {
        return cached;
      }

      // Query database
      const configs = await this.db.db.select().from(schema.systemConfig);

      // Cache the result (1 hour)
      await this.cache.set(CONFIG_ALL_CACHE_KEY, configs, 3600000);

      return configs;
    } catch (error) {
      this.logger.error('Failed to get all configs', error);
      throw error;
    }
  }

  /**
   * Set or update a config value with cache invalidation
   */
  async set(
    key: string,
    value: any,
    description?: string,
    updatedBy?: string,
  ): Promise<schema.SystemConfig> {
    try {
      if (!key || key.trim() === '') {
        throw new BadRequestException('Config key cannot be empty');
      }

      // Check if config exists
      const existing = await this.db.db
        .select()
        .from(schema.systemConfig)
        .where(eq(schema.systemConfig.key, key))
        .limit(1);

      const config =
        existing.length > 0
          ? // Update existing
            (
              await this.db.db
                .update(schema.systemConfig)
                .set({
                  value,
                  description: description ?? existing[0].description,
                  updatedBy,
                  updatedAt: new Date(),
                })
                .where(eq(schema.systemConfig.key, key))
                .returning()
            )[0]
          : // Insert new
            (
              await this.db.db
                .insert(schema.systemConfig)
                .values({
                  key,
                  value,
                  description,
                  updatedBy,
                  updatedAt: new Date(),
                })
                .returning()
            )[0];

      // Invalidate caches
      await this.invalidateCache(key);

      this.logger.log(
        `Config updated: ${key} by ${updatedBy || 'system'}`,
      );

      return config;
    } catch (error) {
      this.logger.error(`Failed to set config key: ${key}`, error);
      throw error;
    }
  }

  /**
   * Delete a config by key
   */
  async delete(key: string): Promise<boolean> {
    try {
      await this.db.db
        .delete(schema.systemConfig)
        .where(eq(schema.systemConfig.key, key));

      // Invalidate cache
      await this.invalidateCache(key);

      this.logger.log(`Config deleted: ${key}`);

      return true;
    } catch (error) {
      this.logger.error(`Failed to delete config key: ${key}`, error);
      throw error;
    }
  }

  /**
   * Invalidate cache for a specific key and all keys
   */
  private async invalidateCache(key: string): Promise<void> {
    await this.cache.del(`${CONFIG_CACHE_PREFIX}${key}`);
    await this.cache.del(CONFIG_ALL_CACHE_KEY);
  }

  /**
   * Initialize default system configs if they don't exist
   */
  async initializeDefaults(): Promise<void> {
    const defaults = [
      {
        key: 'api.timeout',
        value: 30000,
        description: 'API request timeout in milliseconds',
      },
      {
        key: 'upload.maxSize',
        value: '50MB',
        description: 'Maximum upload file size',
      },
      {
        key: 'features.aiEnabled',
        value: true,
        description: 'Enable AI features in the application',
      },
      {
        key: 'limits.maxProjects',
        value: 1000,
        description: 'Maximum number of projects per session',
      },
    ];

    for (const config of defaults) {
      const existing = await this.get(config.key);
      if (!existing) {
        await this.set(config.key, config.value, config.description);
      }
    }

    this.logger.log('System config defaults initialized');
  }
}
