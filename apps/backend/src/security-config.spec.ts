import { getRequiredJwtSecret, resolveAllowedOrigins } from './security-config';

describe('security config', () => {
  it('rejects wildcard CORS with credentialed requests', () => {
    expect(() => resolveAllowedOrigins({ CORS_ORIGIN: '*', NODE_ENV: 'production' })).toThrow(
      'CORS_ORIGIN cannot use "*"',
    );
  });

  it('uses explicit comma-separated CORS origins', () => {
    expect(
      resolveAllowedOrigins({
        CORS_ORIGIN: 'https://game-plug.rbw.ovh, https://game-plug.robinswood.io',
      }),
    ).toEqual(['https://game-plug.rbw.ovh', 'https://game-plug.robinswood.io']);
  });

  it('fails closed without a JWT secret', () => {
    expect(() => getRequiredJwtSecret({ NODE_ENV: 'production' })).toThrow('JWT_SECRET is required');
  });

  it('rejects short production JWT secrets', () => {
    expect(() =>
      getRequiredJwtSecret({ JWT_SECRET: 'short-secret', NODE_ENV: 'production' }),
    ).toThrow('JWT_SECRET must be at least 32 characters');
  });
});
