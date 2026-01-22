import * as schema from '../../shared/schema';

/**
 * Drizzle DB type for game-plug
 * Used for type-safe database operations
 */
export type DrizzleDB = ReturnType<typeof import('drizzle-orm/node-postgres').drizzle<typeof schema>>;
