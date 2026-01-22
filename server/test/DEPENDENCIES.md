# Vitest Migration - Dependencies Reference

## Added Dependencies

### Core Testing

| Package | Version | Purpose | Notes |
|---------|---------|---------|-------|
| `vitest` | ^4.0.0 | Test runner | Replaces Jest |
| `@vitest/coverage-v8` | ^4.0.0 | Coverage reporting | Uses V8 engine |
| `unplugin-swc` | ^1.4.4 | TypeScript transpiler | Handles NestJS decorators |
| `msw` | ^2.12.0 | HTTP mocking | Node.js compatible |

### Rationale

**Vitest** → Faster than Jest, better TypeScript support, Vite-native
**@vitest/coverage-v8** → More accurate coverage, faster than Istanbul
**unplugin-swc** → SWC transpiler faster than ts-jest, supports decorators
**msw** → Industry standard for HTTP mocking, works at network layer

## Removed Dependencies

| Package | Version | Reason |
|---------|---------|--------|
| `jest` | ^29.5.0 | Replaced by vitest |
| `ts-jest` | ^29.1.0 | Replaced by unplugin-swc |
| `@types/jest` | ^29.5.2 | Vitest provides own types |
| `supertest` | ^6.3.3 | Replaced by MSW (optional - can keep for E2E) |

### Notes

- `@types/jest` removal safe - import types from `vitest` instead
- `supertest` can be kept if doing real HTTP server testing (E2E)
- `nock` or similar HTTP mocks no longer needed with MSW

## TypeScript Configuration

### tsconfig.json Changes Required

No changes needed! Existing tsconfig.json compatible with Vitest.

Key settings already present:
```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "esModuleInterop": true
  }
}
```

## Installation Steps

```bash
# 1. Remove old dependencies
npm uninstall jest ts-jest @types/jest

# 2. Install new dependencies
npm install --save-dev \
  vitest@^4.0.0 \
  @vitest/coverage-v8@^4.0.0 \
  unplugin-swc@^1.4.4 \
  msw@^2.12.0

# 3. Verify installation
npm ls vitest @vitest/coverage-v8 unplugin-swc msw
```

## Breaking Changes from Jest

### 1. Import Changes

**Jest:**
```typescript
import { describe, it, expect } from '@jest/globals'
import { jest } from '@jest/globals'
```

**Vitest:**
```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
// No need for separate @jest/globals
```

### 2. Mock API

**Jest:**
```typescript
jest.fn()
jest.spyOn()
jest.mock()
jest.unmock()
```

**Vitest:**
```typescript
vi.fn()
vi.spyOn()
vi.mock()
vi.unmock()
```

### 3. Async Handling

Both work the same, but Vitest has better error messages:

```typescript
// Both work
it('should work', async () => {
  const result = await asyncFn()
  expect(result).toBe('value')
})
```

### 4. Module Mocking

**Jest:**
```typescript
jest.mock('./module', () => ({
  default: { value: 'mocked' }
}))
```

**Vitest:**
```typescript
vi.mock('./module', () => ({
  default: { value: 'mocked' }
}))
```

## Performance Comparison

| Metric | Jest | Vitest |
|--------|------|--------|
| Initial startup | ~3-5s | ~0.5-1s |
| Watch mode | ~2-3s per change | ~0.5s per change |
| Coverage generation | ~5-10s | ~2-3s |
| Memory usage | Higher | Lower |

## Configuration Files

### vitest.config.ts
- Path aliases support (`@`, `@shared`)
- SWC transpiler for TypeScript
- MSW setup via `setupFiles`
- Coverage thresholds (70%)
- Thread pool for parallelization

### test/setup.ts
- MSW mock server initialization
- Global beforeAll, afterEach, afterAll hooks
- Helper functions for mock management
- Error handling configuration

## Compatibility Matrix

```
Node.js Versions:
- 18.x ✅ (fully supported)
- 20.x ✅ (recommended)
- 22.x ✅ (supported)

NestJS Versions:
- 10.x ✅ (compatible)
- 11.x ✅ (recommended - in use)

TypeScript:
- 5.0+ ✅ (5.1.3 in use)
```

## Dependency Tree Summary

```
vitest@4.0.0
├── typescript@5.1.3
├── @vitest/coverage-v8
│   └── v8 (built-in Node module)
└── node (built-in APIs)

unplugin-swc@1.4.4
├── @swc/core (native binary)
└── typescript@5.1.3

msw@2.12.0
├── node (built-in APIs)
└── undici (HTTP client for Node)

@nestjs/testing@11.0.0
├── @nestjs/common
└── typescript
```

## Optional: Keep Supertest for E2E

If you want to keep integration/E2E tests with real HTTP:

```bash
npm install --save-dev supertest@^6.3.3
```

Usage pattern:

```typescript
import request from 'supertest'
import { NestFactory } from '@nestjs/core'

describe('E2E Tests', () => {
  let app: INestApplication

  beforeAll(async () => {
    app = await NestFactory.create(AppModule)
    await app.init()
  })

  it('GET /api/users', () => {
    return request(app.getHttpServer())
      .get('/api/users')
      .expect(200)
  })
})
```

## Monitoring & Debugging

### Enable Verbose Output

```bash
npm run test -- --reporter=verbose
```

### Filter Tests

```bash
npm run test -- --grep "UserService"
npm run test -- src/users/users.service.spec.ts
```

### Debug Single Test

```bash
node --inspect-brk ./node_modules/.bin/vitest run src/users/users.service.spec.ts
```

Then open `chrome://inspect` in Chrome DevTools.

## Future Migrations

### Potential Upgrades
- Vitest 5.x when released (faster, more features)
- MSW 3.x when stable (new API)
- SWC plugins for additional optimization

### Watch for Breaking Changes
- Monitor vitest changelog
- Test coverage before upgrading minor versions
- Keep unplugin-swc aligned with Vitest version
