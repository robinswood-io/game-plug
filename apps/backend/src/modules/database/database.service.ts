import { Injectable, Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject('DATABASE_CONNECTION')
    public readonly db: NodePgDatabase<typeof schema>,
  ) {}
}
