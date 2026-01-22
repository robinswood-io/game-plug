import type { Config } from 'drizzle-kit';

export default {
  schema: '../shared/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/game_plug',
  },
} satisfies Config;
