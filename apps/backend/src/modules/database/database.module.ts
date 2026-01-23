import { Module, Global } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@shared/schema';
import { DatabaseService } from './database.service';

@Global()
@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: (): NodePgDatabase<typeof schema> => {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
          throw new Error('DATABASE_URL is not defined');
        }

        const pool = new Pool({ connectionString });
        return drizzle(pool, { schema });
      },
    },
    DatabaseService,
  ],
  exports: ['DATABASE_CONNECTION', DatabaseService],
})
export class DatabaseModule {}
