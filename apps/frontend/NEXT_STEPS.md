# Frontend - Next Steps & Action Items

**Analysis Complete:** January 23, 2026
**Migration Status:** ✅ Complete (Already on Next.js 16)
**Priority:** Production stabilization

---

## 🎯 Immediate Actions (This week)

### 1. Upgrade Zod v3 → v4
**Priority:** HIGH
**Effort:** 30 minutes
**Impact:** Rulebook compliance, Future compatibility

```bash
# In /srv/workspace/game-plug/apps/frontend/
npm install zod@^4.x
npm run type-check
npm test  # If tests exist
```

**Verification:**
```bash
grep "zod" package.json  # Should show ^4.x
```

**Files to check:**
- `app/(public)/gm-login/page.tsx` - Uses zodResolver
- `hooks/` - Any Zod schemas
- `lib/` - Any validation logic

---

### 2. Socket.io Security - Add Proxy

**Priority:** MEDIUM
**Effort:** 1-2 hours
**Impact:** Security hardening

**Current setup (vulnerable):**
```typescript
// lib/socket.ts
const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}/game-ws`);
// ❌ Exposes backend URL to client
```

**Recommended setup:**
```typescript
// lib/socket.ts
const socket = io('/api/socket.io', {
  path: '/api/socket.io'
});
```

**Update next.config.js:**
```javascript
async rewrites() {
  return [
    {
      source: '/api/socket.io/:path*',
      destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/game-ws/:path*`
    },
    {
      source: '/api/:path*',
      destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/:path*`
    }
  ];
}
```

**Verification:**
```bash
npm run dev
# Browser console should show Socket.io connecting to /api/socket.io
# Not direct backend URL
```

---

### 3. Add Monitoring (Sentry)

**Priority:** MEDIUM
**Effort:** 2-3 hours
**Impact:** Error tracking, performance monitoring

```bash
npm install @sentry/nextjs
```

**Setup:**
```typescript
// lib/sentry.ts (new file)
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

**Update app/layout.tsx:**
```typescript
import { ErrorBoundary } from "@sentry/nextjs";

export default function RootLayout() {
  return (
    <html>
      <body>
        <ErrorBoundary fallback={<div>Error occurred</div>}>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

**Environment:**
```env
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

---

## 📅 Short Term Actions (1-2 weeks)

### 4. Add Unit Tests

**Priority:** HIGH
**Effort:** 3-5 days
**Impact:** Code reliability, Refactor safety

**Setup Jest:**
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npx jest --init
```

**Test files to create:**
```
hooks/__tests__/
├── useAuth.test.ts
├── useWebSocket.test.ts
└── use-toast.test.ts

lib/__tests__/
├── utils.test.ts
├── dice.test.ts
└── trpc.test.ts

components/__tests__/
├── character-card.test.tsx
├── dice-roller.test.tsx
└── navigation.test.tsx
```

**Example test:**
```typescript
// hooks/__tests__/useAuth.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from '../useAuth';

describe('useAuth', () => {
  it('should return authenticated user', async () => {
    const { result } = renderHook(() => useAuth());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

---

### 5. Add E2E Tests

**Priority:** HIGH
**Effort:** 3-5 days
**Impact:** Feature coverage, Regression prevention

**Setup Playwright:**
```bash
npm install --save-dev @playwright/test
npx playwright install
```

**Test files to create:**
```
e2e/
├── auth.spec.ts      # Login/Signup
├── characters.spec.ts # Character CRUD
├── dashboard.spec.ts  # Dashboard flows
└── sessions.spec.ts   # Session management
```

**Example test:**
```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('User can login', async ({ page }) => {
  await page.goto('http://localhost:3001/gm-login');
  
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('http://localhost:3001/dashboard');
});
```

**Update package.json:**
```json
{
  "scripts": {
    "test": "jest",
    "test:e2e": "playwright test",
    "test:all": "npm test && npm run test:e2e"
  }
}
```

---

### 6. Code Splitting & Performance

**Priority:** MEDIUM
**Effort:** 2-3 days
**Impact:** Faster page loads, Better UX

**Identify heavy components:**
```bash
npm install --save-dev @next/bundle-analyzer
```

**Update next.config.js:**
```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
```

**Run analysis:**
```bash
ANALYZE=true npm run build
```

**Apply lazy loading:**
```typescript
// Before
import CharacterCard from '@/components/character-card';

// After
import dynamic from 'next/dynamic';
const CharacterCard = dynamic(() => import('@/components/character-card'), {
  loading: () => <CharacterCardSkeleton />,
  ssr: false
});
```

---

## 🔧 Medium Term Actions (1 month)

### 7. Image Optimization

**Priority:** MEDIUM
**Effort:** 1-2 days
**Impact:** Bandwidth reduction, LCP improvement

**Update avatar display:**
```typescript
// Before
<img src={avatar} alt="Avatar" />

// After
import Image from 'next/image';
<Image 
  src={avatar} 
  alt="Avatar"
  width={100}
  height={100}
  priority={false}
/>
```

**Files to update:**
- `components/character-card.tsx`
- `components/enhanced-character-card.tsx`
- `components/avatar.tsx`

---

### 8. Documentation & Storybook

**Priority:** LOW
**Effort:** 3-5 days
**Impact:** Developer experience, Component reusability

```bash
npx storybook@latest init --type next
```

**Create stories:**
```
components/__stories__/
├── button.stories.tsx
├── card.stories.tsx
├── character-card.stories.tsx
└── dice-roller.stories.tsx
```

---

### 9. Performance Monitoring

**Priority:** MEDIUM
**Effort:** 2-3 days
**Impact:** User experience metrics, Optimization target

**Setup Web Vitals:**
```typescript
// app/layout.tsx
import { useReportWebVitals } from 'next/web-vitals';

useReportWebVitals((metric) => {
  console.log('Web Vital:', metric);
  // Send to analytics
});
```

**Integrate with Sentry:**
```typescript
import { captureException } from '@sentry/nextjs';

export function reportWebVitals(metric) {
  if (metric.value > threshold) {
    captureException(new Error(`${metric.name}: ${metric.value}`));
  }
}
```

---

## 🚀 Production Deployment Checklist

- [ ] Zod upgraded to v4
- [ ] Socket.io proxy configured
- [ ] Sentry monitoring setup
- [ ] Unit tests added (>80% coverage)
- [ ] E2E tests added (critical paths)
- [ ] Environment variables configured
- [ ] Build succeeds: `npm run build`
- [ ] Type check passes: `npm run type-check`
- [ ] Lint passes: `npm run lint`
- [ ] Dependency audit clean: `npm audit`
- [ ] Performance tested (Lighthouse >90)
- [ ] Security headers configured
- [ ] Error pages tested (404, 500)
- [ ] SEO configured (metadata, sitemap)
- [ ] Analytics integrated
- [ ] Backup/recovery plan ready

---

## 📊 Metrics to Track

After each task completion:

```bash
# TypeScript
npm run type-check

# Lint
npm run lint

# Build size
npm run build
du -sh .next

# Test coverage (when added)
npm test -- --coverage

# Lighthouse
npm run build && npm start
# Then run: lighthouse http://localhost:3000
```

---

## 🎓 Resources

- [Next.js 16 Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Testing Library](https://testing-library.com)
- [Playwright](https://playwright.dev)
- [Sentry Docs](https://docs.sentry.io)

---

## 📝 Notes

- All changes should pass TypeScript strict mode
- No `any` types allowed
- Follow existing code patterns
- Update documentation when adding features
- Add tests for new code
- Review rulebook for architecture decisions

**Last Updated:** January 23, 2026
**Owner:** Development Team
**Status:** In Progress
