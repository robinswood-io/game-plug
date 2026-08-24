import { randomUUID } from 'crypto';
import { DemoTokenPolicyMiddleware } from './demo-token-policy.middleware';

function request(method: string, path: string) {
  return {
    method,
    originalUrl: path,
    headers: { authorization: 'Bearer demo-token' },
  } as any;
}

function response() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('DemoTokenPolicyMiddleware', () => {
  const jwtService = { verify: jest.fn() } as any;
  const middleware = new DemoTokenPolicyMiddleware(jwtService);

  beforeEach(() => jest.clearAllMocks());

  it('denies every demo mutation before routing, including effects', () => {
    jwtService.verify.mockReturnValue({ isDemo: true });
    const res = response();
    const next = jest.fn();
    const characterId = randomUUID();

    middleware.use(request('POST', `/api/characters/${characterId}/effects`), res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('denies demo refresh when the demo token is presented as bearer auth', () => {
    jwtService.verify.mockReturnValue({ isDemo: true });
    const res = response();
    const next = jest.fn();

    middleware.use(request('POST', '/api/auth/refresh'), res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('denies character routes by real UUID even for GET', () => {
    jwtService.verify.mockReturnValue({ isDemo: true });
    const res = response();
    const next = jest.fn();

    middleware.use(request('GET', `/api/characters/${randomUUID()}`), res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('allows only the exact demo read allowlist', () => {
    jwtService.verify.mockReturnValue({ isDemo: true });
    const res = response();
    const next = jest.fn();

    middleware.use(request('GET', '/api/characters'), res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('does not alter normal authenticated traffic', () => {
    jwtService.verify.mockReturnValue({ isDemo: false });
    const res = response();
    const next = jest.fn();

    middleware.use(request('PATCH', `/api/effects/${randomUUID()}`), res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
