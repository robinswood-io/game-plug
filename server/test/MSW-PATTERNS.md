# MSW 2.x Patterns for Game Plug Tests

## Overview

Mock Service Worker (MSW) intercepts HTTP requests at the network layer, allowing clean mocking without modifying application code.

## Basic Usage

### Simple GET Request

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { addMockHandler } from './setup'

describe('API Client', () => {
  it('should fetch user data', async () => {
    addMockHandler(
      http.get('https://api.example.com/users/:id', ({ params }) => {
        return HttpResponse.json({
          id: params.id,
          name: 'John Doe',
        })
      })
    )

    // Your test code here
  })
})
```

### POST with Request Body

```typescript
addMockHandler(
  http.post('https://api.example.com/login', async ({ request }) => {
    const body = await request.json()
    
    if (body.username === 'admin' && body.password === 'correct') {
      return HttpResponse.json(
        { token: 'valid-token' },
        { status: 200 }
      )
    }

    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  })
)
```

### Error Handling

```typescript
addMockHandler(
  http.get('https://api.example.com/error', () => {
    return HttpResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  })
)

addMockHandler(
  http.get('https://api.example.com/timeout', async () => {
    await new Promise(resolve => setTimeout(resolve, 5000))
    return HttpResponse.json({})
  })
)
```

### Request Matching

```typescript
// Match by URL pattern
http.get('/api/users/:id', ...)

// Match by query parameters
http.get('https://api.example.com/search', ({ request }) => {
  const url = new URL(request.url)
  const query = url.searchParams.get('q')
  // ...
})

// Match by headers
http.get('https://api.example.com/protected', ({ request }) => {
  const token = request.headers.get('Authorization')
  // ...
})
```

## NestJS-Specific Patterns

### Testing Controllers with HTTP Mocks

```typescript
import { Test } from '@nestjs/testing'
import { HttpModule } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { http, HttpResponse } from 'msw'
import { addMockHandler } from './setup'

describe('ExternalDataController', () => {
  let controller: ExternalDataController

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [ExternalDataController],
    }).compile()

    controller = module.get(ExternalDataController)
  })

  it('should call external API', async () => {
    addMockHandler(
      http.get('https://external-api.com/data', () => {
        return HttpResponse.json({ result: 'success' })
      })
    )

    const result = await controller.fetchData()
    expect(result).toEqual({ result: 'success' })
  })
})
```

### Testing Services with Dependencies

```typescript
describe('PaymentService', () => {
  let service: PaymentService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PaymentService],
    }).compile()

    service = module.get(PaymentService)
  })

  it('should process payment via external gateway', async () => {
    addMockHandler(
      http.post('https://payment-gateway.com/charge', async ({ request }) => {
        const body = await request.json()

        if (body.amount <= 0) {
          return HttpResponse.json(
            { error: 'Invalid amount' },
            { status: 400 }
          )
        }

        return HttpResponse.json({
          transactionId: 'tx-123',
          status: 'completed',
        })
      })
    )

    const result = await service.charge({ amount: 100 })
    expect(result.status).toBe('completed')
  })
})
```

## Advanced Patterns

### Multiple Requests in Sequence

```typescript
it('should handle API workflow', async () => {
  // First request
  addMockHandler(
    http.post('https://api.example.com/create', () => {
      return HttpResponse.json({ id: 'resource-123' })
    })
  )

  // Second request (depends on first)
  addMockHandler(
    http.get('https://api.example.com/resource/:id', ({ params }) => {
      return HttpResponse.json({ id: params.id, status: 'active' })
    })
  )

  // Test code that calls both endpoints in sequence
})
```

### State Management in Mocks

```typescript
let userCount = 0

describe('User Management', () => {
  beforeEach(() => {
    userCount = 0
  })

  it('should track created users', async () => {
    addMockHandler(
      http.post('https://api.example.com/users', async ({ request }) => {
        userCount++
        const body = await request.json()
        return HttpResponse.json({
          id: userCount,
          ...body,
        })
      })
    )

    // Your assertions
  })
})
```

### Conditional Responses

```typescript
addMockHandler(
  http.get('https://api.example.com/feature/:feature', ({ params }) => {
    const features: Record<string, boolean> = {
      'new-ui': true,
      'beta-api': false,
      'v2-endpoint': true,
    }

    const enabled = features[params.feature] ?? false

    return HttpResponse.json(
      { feature: params.feature, enabled },
      { status: 200 }
    )
  })
)
```

## WebSocket Mocking (Future)

For WebSocket testing, consider using vitest with `ws` library:

```typescript
import { WebSocket } from 'ws'

// Pattern for WebSocket tests (setup needed)
// This is not yet integrated but can be added if needed
```

## Performance Tips

1. **Reset handlers after tests** - Done automatically by setup.ts
2. **Use `addMockHandler()` instead of `mockServer.use()`** - Cleaner API
3. **Mock only what you need** - Don't mock internal calls
4. **Prefer specific paths** - Use `/api/users/:id` not `/api/*`

## Debugging

### Enable MSW Debugging

```typescript
import { server } from 'msw/node'

beforeEach(() => {
  // MSW logs intercepted requests
  server.listen({ onUnhandledRequest: 'warn' })
})
```

### Log Request Details

```typescript
addMockHandler(
  http.get('/api/test', ({ request }) => {
    console.log('Method:', request.method)
    console.log('URL:', request.url)
    console.log('Headers:', Object.fromEntries(request.headers))
    return HttpResponse.json({})
  })
)
```

## Common Issues

### "Unhandled Request" Errors

**Problem**: Test fails with "unhandled request to..."
**Solution**: Add handler with `addMockHandler()` or check URL/method

### Requests Not Being Intercepted

**Problem**: Real requests are made instead of mocked
**Solution**: Ensure `mockServer.listen()` is called in `beforeAll` (in setup.ts)

### State Leaking Between Tests

**Problem**: Mock data from one test affects others
**Solution**: Handlers are reset automatically by `afterEach` hook

## Resources

- [MSW Documentation](https://mswjs.io/)
- [Rest API Handlers](https://mswjs.io/docs/api/setup-server/use)
- [Request Matching](https://mswjs.io/docs/api/http#matching)
