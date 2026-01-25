import { Module, Global, Logger } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';
import { redisStore } from 'cache-manager-redis-yet';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      useFactory: async () => {
        const logger = new Logger('CacheModule');
        const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

        try {
          const store = await redisStore({
            url: redisUrl,
            ttl: 3600000,
          });
          logger.log('Redis cache connected successfully');
          return {
            store,
            ttl: 3600000,
          };
        } catch (error) {
          logger.warn(`Redis connection failed: ${error.message}. Using in-memory cache fallback.`);
          return {
            ttl: 3600000,
          };
        }
      },
    }),
  ],
  providers: [CacheService],
  exports: [CacheService, NestCacheModule],
})
export class CacheModule {}
