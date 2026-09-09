type RuntimeEnv = Record<string, string | undefined>;

const PRODUCTION_ORIGINS = ['https://game-plug.rbw.ovh', 'https://game-plug.robinswood.io'];
const DEVELOPMENT_ORIGINS = ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5000'];

export function resolveAllowedOrigins(env: RuntimeEnv = process.env): string[] {
  const configuredOrigins = (env.CORS_ORIGIN ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  if (configuredOrigins.includes('*')) {
    throw new Error('CORS_ORIGIN cannot use "*" when credentialed requests are enabled');
  }

  if (configuredOrigins.length > 0) {
    return configuredOrigins;
  }

  if (env.NODE_ENV === 'production') {
    return PRODUCTION_ORIGINS;
  }

  return [...PRODUCTION_ORIGINS, ...DEVELOPMENT_ORIGINS];
}

export function getRequiredJwtSecret(env: RuntimeEnv = process.env): string {
  const secret = env.JWT_SECRET?.trim();

  if (!secret) {
    throw new Error('JWT_SECRET is required');
  }

  if (env.NODE_ENV === 'production' && secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters in production');
  }

  return secret;
}
