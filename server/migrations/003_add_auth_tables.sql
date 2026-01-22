-- Migration: Add @robinswood/auth tables and RBAC role support
-- Date: 2026-01-16
-- Purpose: Support JWT + Refresh Tokens + Password Reset + RBAC

-- Refresh tokens table (RFC 6749 token rotation)
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  token VARCHAR(128) UNIQUE NOT NULL,
  user_id VARCHAR REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  family_id VARCHAR NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_from_ip VARCHAR(45),
  created_by_user_agent TEXT,
  is_revoked BOOLEAN DEFAULT false NOT NULL,
  used_at TIMESTAMP,
  replaced_by VARCHAR(128),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_family_id ON refresh_tokens(family_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_is_revoked ON refresh_tokens(is_revoked);

-- Password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT REFERENCES users(email) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email ON password_reset_tokens(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- Add role column to users table (RBAC support)
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR DEFAULT 'player' NOT NULL;

-- Migrate existing isGM to role
UPDATE users SET role = 'gamemaster' WHERE is_gm = true;
UPDATE users SET role = 'player' WHERE is_gm = false OR is_gm IS NULL;

-- Create index on role for performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Verify migration
SELECT
  'Migration completed' as status,
  (SELECT COUNT(*) FROM refresh_tokens) as refresh_tokens_count,
  (SELECT COUNT(*) FROM password_reset_tokens) as password_reset_tokens_count,
  (SELECT COUNT(*) FROM users WHERE role IS NOT NULL) as users_with_role_count;
