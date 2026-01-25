# Game-Plug E2E Test Strategy

## Overview

This document describes the comprehensive End-to-End testing strategy for Game-Plug, a Call of Cthulhu 7th Edition tabletop RPG management platform.

## Test Coverage Summary

| Test Suite | File | Tests | Coverage Area |
|------------|------|-------|---------------|
| Authentication | `01-auth.spec.ts` | 5 | Signup, Login, Logout, Session validation |
| Character Creation | `02-character-creation.spec.ts` | 4 | Character generation, stats, editing, avatars |
| Game Sessions | `03-game-session.spec.ts` | 6 | Session CRUD, invitations, activation, joining |
| GM Dashboard | `04-gm-dashboard.spec.ts` | ~8 | GM controls, session management, player view |
| Dice Rolling | `05-dice-rolling.spec.ts` | 9 | All dice types, skill checks, roll history |
| Sanity Management | `06-sanity-management.spec.ts` | 9 | Sanity points, madness, phobias, restoration |
| API Routes | `07-api-routes.spec.ts` | ~15 | Backend API endpoint validation |
| Inventory System | `08-inventory-management.spec.ts` | 9 | Add/Edit/Delete items, equipment, categories |
| Effects System | `09-effects-system.spec.ts` | 10 | Buffs/Debuffs, status conditions, damage/healing |
| Complete Workflows | `10-complete-workflows.spec.ts` | 6 | Full gameplay scenarios end-to-end |

**Total: 10 Test Suites, 81+ Individual Tests**

## Architecture

### Test Framework
- **Playwright** v1.57.0
- **Browsers**: Chromium (primary), Firefox & Webkit (optional)
- **Base URL**: `http://localhost:5002`
- **Timeout**: 30s per test
- **Retries**: 2 (in CI), 0 (local)

### Configuration (`playwright.config.ts`)
```typescript
{
  testDir: './e2e',
  fullyParallel: false,      // Sequential execution (database state)
  workers: 1,                // Single worker (session isolation)
  retries: process.env.CI ? 2 : 0,
  reporter: ['html', 'list'],
  use: {
    baseURL: 'http://localhost:5002',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  }
}
```

## Test Patterns

### 1. Authentication Tests
**File**: `01-auth.spec.ts`

Tests user authentication flows:
- Landing page display
- GM signup with validation
- Login with credentials
- Invalid credential rejection
- Logout and session cleanup

### 2. Character Creation Tests
**File**: `02-character-creation.spec.ts`

Validates Call of Cthulhu 7e character generation:
- Random characteristic generation (3d6×5)
- Occupation selection
- Derived attributes (HP, SAN, MP)
- Character editing
- Avatar generation (OpenAI integration)

### 3. Game Session Tests
**File**: `03-game-session.spec.ts`

Session lifecycle management:
- Session creation by GM
- Invitation code generation
- Session activation/deactivation
- Player joining via code
- Session archival and deletion

### 4. Dice Rolling Tests
**File**: `05-dice-rolling.spec.ts`

Comprehensive dice mechanics:
- Standard dice (1d6, 2d6, etc.)
- Percentile dice (1d100)
- Custom dice notation (2d6+3)
- Skill checks with success/failure
- Sanity rolls
- Luck rolls
- Roll history tracking
- GM secret rolls

### 5. Sanity Management Tests
**File**: `06-sanity-management.spec.ts`

CoC7e sanity system:
- Display current/max sanity
- Apply sanity loss
- Trigger insanity at critical levels
- Add phobias and manias
- Restore sanity points
- Mental condition tracking
- Maximum sanity calculation (99 - Cthulhu Mythos)

### 6. Inventory Tests (NEW)
**File**: `08-inventory-management.spec.ts`

Item and equipment management:
- Open inventory interface
- Add items with properties
- Equip/unequip items
- Modify item quantities
- Delete items from inventory
- Display weight and encumbrance
- Item categorization (weapon, armor, consumable)
- Filter by category
- Calculate total inventory value

### 7. Effects System Tests (NEW)
**File**: `09-effects-system.spec.ts`

Status effects and modifiers:
- Display active effects
- Apply buff effects (+bonus)
- Apply debuff effects (-penalty)
- Deal damage to HP
- Heal character HP
- Status conditions (stunned, unconscious)
- Remove expired effects
- Effect duration tracking
- Stack multiple effects
- Effect impact on skill rolls

### 8. Complete Workflows Tests (NEW)
**File**: `10-complete-workflows.spec.ts`

Full gameplay scenarios:
- **GM Complete Workflow**: Signup → Create Session → Add Character → Roll Dice
- **Player Workflow**: Join Session → Select Character → View Sheet
- **Combat Workflow**: Initiative → Attack → Damage → Healing
- **Investigation Workflow**: Skill Check → Sanity Loss → Gain Clue
- **Character Progression**: Gain XP → Improve Skill → Level Up
- **Session Lifecycle**: Create → Activate → Play → Archive

## Data Management

### Test Isolation
Each test suite uses unique email addresses:
```typescript
const testEmail = `gm-test-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`;
```

### beforeEach Hooks
Common setup patterns:
1. Create unique user account
2. Login automatically
3. Create session/character if needed
4. Extract IDs from URLs for navigation

### Cleanup Strategy
- Tests are isolated by unique identifiers
- Database state is NOT reset between tests
- Production uses PostgreSQL with proper constraints
- Failed tests leave artifacts for debugging

## Locator Strategy

### Preferred Selectors (Priority Order)
1. **data-testid** attributes (most reliable)
   ```typescript
   page.locator('[data-testid="button-create-session"]')
   ```

2. **Role-based** selectors (accessibility)
   ```typescript
   page.getByRole('button', { name: /créer.*compte/i })
   ```

3. **Text content** (for verification)
   ```typescript
   page.getByText(/dashboard|investigateur/i)
   ```

4. **Input names** (forms)
   ```typescript
   page.locator('input[name="email"]')
   ```

### Avoid
- CSS class selectors (brittle with Tailwind)
- Complex XPath expressions
- Hardcoded IDs (except data-testid)

## Running Tests

### Local Development
```bash
cd /srv/workspace/game-plug

# Run all tests
npx playwright test

# Run specific suite
npx playwright test e2e/01-auth.spec.ts

# Interactive UI mode
npx playwright test --ui

# Debug mode (headed browser)
npx playwright test --headed --debug

# Run with specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### CI/CD Pipeline
```bash
# Run with retries and video recording
CI=1 npx playwright test

# Generate HTML report
npx playwright show-report
```

## Debugging

### Screenshots on Failure
Automatically captured in `test-results/`:
```
test-results/
  01-auth-should-successfully-login-chromium/
    test-failed-1.png
```

### Video Recording
- Mode: `on-first-retry`
- Only recorded when tests fail and retry
- Saved in `test-results/`

### Trace Viewer
```bash
npx playwright show-trace test-results/trace.zip
```

### Console Logs
Enable in `playwright.config.ts`:
```typescript
use: {
  video: 'on',
  trace: 'on',
}
```

## Performance Considerations

### Timeouts
- Default test timeout: 30s
- Network timeout: 30s
- Navigation timeout: 30s

### Wait Strategies
```typescript
// ✅ GOOD: Wait for URL pattern
await page.waitForURL(/\/gm\//, { timeout: 10000 });

// ✅ GOOD: Wait for visibility
await expect(element).toBeVisible({ timeout: 5000 });

// ⚠️ USE SPARINGLY: Fixed timeout
await page.waitForTimeout(1000); // Only for async operations
```

### Parallel Execution
- **Disabled** (`fullyParallel: false`)
- Reason: Shared database state
- Consider enabling with isolated test databases

## Critical Paths

### Must-Pass Tests (Production Readiness)
1. ✅ Authentication (login/logout)
2. ✅ Character creation
3. ✅ Session creation and joining
4. ✅ Dice rolling mechanics
5. ✅ Sanity system
6. ✅ Inventory management (NEW)
7. ✅ Effects and damage (NEW)
8. ✅ Complete GM workflow (NEW)

### Nice-to-Have Tests
- Avatar generation (OpenAI dependency)
- Advanced filters
- Edge case validations
- Performance benchmarks

## Known Limitations

1. **OpenAI Integration**: Avatar generation tests may fail if API is unavailable
2. **Timing Issues**: Some tests use `waitForTimeout()` due to async mutations
3. **Session State**: Tests are not fully isolated (shared database)
4. **WebSocket Tests**: Real-time features not fully covered

## Future Enhancements

### Phase 2
- [ ] WebSocket real-time updates testing
- [ ] Multi-player concurrent session tests
- [ ] Mobile responsive testing
- [ ] Accessibility (a11y) audit
- [ ] Performance benchmarking (Lighthouse)

### Phase 3
- [ ] Visual regression testing (Percy/Chromatic)
- [ ] API contract testing (Pact)
- [ ] Load testing (k6)
- [ ] Security testing (OWASP ZAP)

## Test Maintenance

### Adding New Tests
1. Create file in `e2e/` with naming pattern `NN-feature-name.spec.ts`
2. Use existing test as template
3. Add `data-testid` attributes to new UI components
4. Update this documentation

### Updating Tests
- Review failed tests in CI
- Check for UI changes requiring locator updates
- Validate test data patterns
- Ensure proper cleanup

### Deprecation
- Mark obsolete tests with `.skip()`
- Document reason in test description
- Remove after 2 sprints if confirmed unnecessary

## Reporting

### HTML Report
```bash
npx playwright show-report
```

### CI Integration
- GitHub Actions: Upload artifacts
- GitLab CI: Store test-results/
- Jenkins: Publish HTML reports

### Metrics
- Test execution time
- Flakiness rate
- Coverage percentage
- Pass/fail trends

---

**Last Updated**: 2026-01-24
**Maintainer**: Development Team
**Version**: 1.0
