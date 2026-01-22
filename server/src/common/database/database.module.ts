import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../../shared/schema';
import { DatabaseService } from './database.service';
import { DRIZZLE_ORM, DATABASE_CONNECTION } from './database.constants';

/**
 * Global Database Module
 * IMPORTANT: Réutilise exactement le même schéma Drizzle que l'Express backend
 * Garantit zéro modification de la base de données existante
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: (configService: ConfigService) => {
        const connectionString = configService.get<string>('DATABASE_URL');

        if (!connectionString) {
          throw new Error('DATABASE_URL environment variable is required');
        }

        // Même configuration Pool que Express backend
        // NOTE: connectionTimeoutMillis removed - was causing auth failures (28P01)
        return new Pool({
          connectionString,
          max: 20,
          idleTimeoutMillis: 30000,
        });
      },
      inject: [ConfigService],
    },
    {
      provide: DRIZZLE_ORM,
      useFactory: (pool: Pool) => {
        // Drizzle avec le schéma partagé - EXACTEMENT le même que Express
        return drizzle(pool, { schema });
      },
      inject: [DATABASE_CONNECTION],
    },
    DatabaseService,
  ],
  exports: [DatabaseService, DRIZZLE_ORM, DATABASE_CONNECTION],
})
export class DatabaseModule {}
