import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { sql } from 'drizzle-orm';
import { Pool } from 'pg';
import * as schema from './src/shared/schema.js';

async function initDatabase() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/game_plug';

  console.log('Connecting to database...');
  const pool = new Pool({ connectionString });
  const db = drizzle(pool, { schema });

  try {
    console.log('Creating tables from schema...');

    // Create all tables by executing the schema definitions
    // This will use Drizzle's built-in table creation
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR UNIQUE NOT NULL,
        password VARCHAR NOT NULL,
        full_name VARCHAR,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS game_sessions (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        gm_id VARCHAR NOT NULL REFERENCES users(id),
        name VARCHAR NOT NULL,
        description TEXT,
        setting VARCHAR,
        code VARCHAR(6) UNIQUE NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS chapters (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id VARCHAR NOT NULL REFERENCES game_sessions(id),
        title VARCHAR NOT NULL,
        description TEXT,
        chapter_number INTEGER NOT NULL,
        is_current BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS characters (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR REFERENCES users(id),
        session_id VARCHAR NOT NULL REFERENCES game_sessions(id),
        name VARCHAR NOT NULL,
        occupation VARCHAR NOT NULL,
        age INTEGER,
        birthplace VARCHAR,
        residence VARCHAR,
        gender VARCHAR,
        height VARCHAR,
        build VARCHAR,
        hair_color VARCHAR,
        eye_color VARCHAR,
        strength INTEGER NOT NULL,
        constitution INTEGER NOT NULL,
        size INTEGER NOT NULL,
        dexterity INTEGER NOT NULL,
        appearance INTEGER NOT NULL,
        intelligence INTEGER NOT NULL,
        power INTEGER NOT NULL,
        education INTEGER NOT NULL,
        luck INTEGER NOT NULL,
        hit_points INTEGER NOT NULL,
        max_hit_points INTEGER NOT NULL,
        sanity INTEGER NOT NULL,
        max_sanity INTEGER NOT NULL,
        magic_points INTEGER NOT NULL,
        max_magic_points INTEGER NOT NULL,
        avatar_url VARCHAR,
        avatar_prompt TEXT,
        skills JSONB NOT NULL DEFAULT '{}',
        skills_locked BOOLEAN DEFAULT false,
        available_skill_points INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS inventory (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        character_id VARCHAR NOT NULL REFERENCES characters(id),
        name VARCHAR NOT NULL,
        description TEXT,
        quantity INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS active_effects (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        character_id VARCHAR NOT NULL REFERENCES characters(id),
        name VARCHAR NOT NULL,
        description TEXT,
        modifier INTEGER,
        duration_rounds INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS sanity_conditions (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        character_id VARCHAR NOT NULL REFERENCES characters(id),
        name VARCHAR NOT NULL,
        description TEXT,
        severity VARCHAR,
        is_indefinite BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS roll_history (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        character_id VARCHAR NOT NULL REFERENCES characters(id),
        session_id VARCHAR NOT NULL REFERENCES game_sessions(id),
        skill_name VARCHAR NOT NULL,
        skill_value INTEGER NOT NULL,
        roll_result INTEGER NOT NULL,
        difficulty VARCHAR NOT NULL,
        success_level VARCHAR NOT NULL,
        is_pushed BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS chapter_events (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        chapter_id VARCHAR NOT NULL REFERENCES chapters(id),
        session_id VARCHAR NOT NULL REFERENCES game_sessions(id),
        character_id VARCHAR REFERENCES characters(id),
        event_type VARCHAR NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS narrative_entries (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id VARCHAR NOT NULL REFERENCES game_sessions(id),
        chapter_id VARCHAR REFERENCES chapters(id),
        character_id VARCHAR REFERENCES characters(id),
        entry_type VARCHAR NOT NULL,
        content TEXT NOT NULL,
        is_gm_only BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS sessions (
        sid VARCHAR PRIMARY KEY,
        sess JSON NOT NULL,
        expire TIMESTAMP(6) NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions (expire);
    `);

    console.log('✅ All tables created successfully!');

  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

initDatabase()
  .then(() => {
    console.log('Database initialization complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database initialization failed:', error);
    process.exit(1);
  });
