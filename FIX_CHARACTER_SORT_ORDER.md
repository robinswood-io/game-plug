# Fix: Stable Character Sort Order on HP/Sanity Modification

## Problem Analysis

When a Game Master modified character HP (PV) or Sanity (SAN), the order of characters in the session list would change unexpectedly. This occurred because:

1. **Root Cause**: The `getCharacters()` method in the backend service was fetching characters without any `ORDER BY` clause
2. **Database Behavior**: Drizzle ORM and PostgreSQL don't guarantee result ordering without explicit `ORDER BY`
3. **Frontend Impact**: When React Query invalidated and refetched character data, the order could differ, causing visual instability

## Files Modified

### Backend Service: `/srv/workspace/game-plug/apps/backend/src/modules/sessions/sessions.service.ts`

**Method 1: `getCharacters()` (lines 291-319)**

**Before:**
```typescript
async getCharacters(sessionId: string) {
  // Get all characters in the session
  const sessionCharacters = await this.db.db.query.characters.findMany({
    where: eq(characters.sessionId, sessionId),
  });
  // ... rest of method
}
```

**After:**
```typescript
async getCharacters(sessionId: string) {
  // Get all characters in the session, sorted by creation date (stable sort)
  const sessionCharacters = await this.db.db.query.characters.findMany({
    where: eq(characters.sessionId, sessionId),
    orderBy: (chars, { asc }) => asc(chars.createdAt),
  });
  // ... rest of method
}
```

**Change**: Added `orderBy: (chars, { asc }) => asc(chars.createdAt)` to ensure consistent ordering by creation date.

---

**Method 2: `getImportableCharacters()` (lines 92-119)**

**Before:**
```typescript
async getImportableCharacters(sessionId: string, gmId: string) {
  // ... auth checks ...
  const charactersFromOtherSessions = await Promise.all(
    gmSessions
      .filter(s => s.id !== sessionId)
      .map(async (s) => {
        const chars = await this.db.db.query.characters.findMany({
          where: eq(characters.sessionId, s.id as any),
        });
        return chars.map(char => ({
          ...char,
          sessionName: s.name,
        }));
      })
  );
  return charactersFromOtherSessions.flat();
}
```

**After:**
```typescript
async getImportableCharacters(sessionId: string, gmId: string) {
  // ... auth checks ...
  const charactersFromOtherSessions = await Promise.all(
    gmSessions
      .filter(s => s.id !== sessionId)
      .map(async (s) => {
        const chars = await this.db.db.query.characters.findMany({
          where: eq(characters.sessionId, s.id as any),
          orderBy: (chars, { asc }) => asc(chars.createdAt),
        });
        return chars.map(char => ({
          ...char,
          sessionName: s.name,
        }));
      })
  );
  return charactersFromOtherSessions.flat();
}
```

**Change**: Added `orderBy: (chars, { asc }) => asc(chars.createdAt)` to ensure consistent ordering when importing characters.

---

## Why Order by `createdAt`?

1. **Logical UX**: Characters are displayed in the order they were added to the session
2. **Stable and Predictable**: Creation date never changes, ensuring permanent consistency
3. **Database Efficient**: `createdAt` is already indexed in most production databases
4. **User Expectation**: GMs expect characters to maintain their creation order

## Verification

### TypeScript Compilation
```bash
cd /srv/workspace/game-plug/apps/backend
npx tsc --noEmit
# No errors
```

### API Contract
- Endpoint: `GET /api/sessions/:id/characters`
- Returns: Array of characters sorted by `createdAt` ascending (oldest first)
- No changes to API response schema

## Testing Recommendations

1. **Manual Test**:
   - Create 3 characters in a session (should see them in creation order)
   - Modify HP of middle character (order should remain unchanged)
   - Modify SAN of first character (order should remain unchanged)

2. **Automated Test** (add to `sessions.service.spec.ts`):
```typescript
it('should return characters sorted by creation date', async () => {
  // Create mock characters with different creation times
  // Fetch and verify order is preserved
});
```

## Impact Assessment

- ✅ No breaking changes to API contract
- ✅ No database schema changes needed (`createdAt` already exists)
- ✅ TypeScript compilation: PASS
- ✅ Backward compatible with existing data
- ✅ Improves UX stability

## Affected Features

- ✅ GM Session Dashboard (character list display)
- ✅ Character Import Dialog (importable characters list)
- ✅ Any other features fetching session characters
