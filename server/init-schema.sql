-- Database schema initialization for game-plug
-- Call of Cthulhu 7e RPG Platform

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Session storage table (for session management)
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON sessions(expire);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  password_hash VARCHAR,
  auth_type VARCHAR DEFAULT 'replit',
  is_gm BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Game sessions
CREATE TABLE IF NOT EXISTS game_sessions (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  code VARCHAR(6) UNIQUE,
  gm_id VARCHAR NOT NULL REFERENCES users(id),
  status VARCHAR DEFAULT 'preparation',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Characters
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
  notes TEXT,
  money DECIMAL(10,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sanity conditions
CREATE TABLE IF NOT EXISTS sanity_conditions (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id VARCHAR NOT NULL REFERENCES characters(id),
  type VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  duration VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Active effects
CREATE TABLE IF NOT EXISTS active_effects (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id VARCHAR NOT NULL REFERENCES characters(id),
  applied_by VARCHAR REFERENCES users(id),
  type VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  description TEXT,
  value VARCHAR,
  is_active BOOLEAN DEFAULT true,
  duration INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Inventory
CREATE TABLE IF NOT EXISTS inventory (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id VARCHAR NOT NULL REFERENCES characters(id),
  name VARCHAR NOT NULL,
  description TEXT,
  category VARCHAR NOT NULL,
  quantity INTEGER DEFAULT 1,
  weight INTEGER DEFAULT 1,
  is_equipped BOOLEAN DEFAULT false,
  damage VARCHAR,
  armor INTEGER,
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Chapters
CREATE TABLE IF NOT EXISTS chapters (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR NOT NULL REFERENCES game_sessions(id),
  name VARCHAR NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  status VARCHAR DEFAULT 'planned',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Chapter events
CREATE TABLE IF NOT EXISTS chapter_events (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id VARCHAR NOT NULL REFERENCES chapters(id),
  session_id VARCHAR NOT NULL REFERENCES game_sessions(id),
  event_type VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  character_id VARCHAR REFERENCES characters(id),
  user_id VARCHAR REFERENCES users(id),
  is_important BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Roll history
CREATE TABLE IF NOT EXISTS roll_history (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id),
  character_id VARCHAR REFERENCES characters(id),
  session_id VARCHAR REFERENCES game_sessions(id),
  roll_type VARCHAR NOT NULL,
  skill_name VARCHAR,
  skill_value INTEGER,
  dice_formula VARCHAR NOT NULL,
  result INTEGER NOT NULL,
  outcome VARCHAR,
  is_gm_roll BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Narrative entries
CREATE TABLE IF NOT EXISTS narrative_entries (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR NOT NULL REFERENCES game_sessions(id),
  gm_id VARCHAR NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  entry_type VARCHAR DEFAULT 'note',
  is_ai_generated BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
