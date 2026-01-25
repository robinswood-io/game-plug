# Code Changes: Character Sort Order Fix

## File: `/srv/workspace/game-plug/apps/backend/src/modules/sessions/sessions.service.ts`

---

## Change 1: `getCharacters()` Method (Lines 291-319)

### BEFORE
```typescript
async getCharacters(sessionId: string) {
  // Get all characters in the session
  const sessionCharacters = await this.db.db.query.characters.findMany({
    where: eq(characters.sessionId, sessionId),
  });

  // Get sanity conditions and active effects for each character
  const charactersWithDetails = await Promise.all(
    sessionCharacters.map(async (character) => {
      const [conditions, effects] = await Promise.all([
        this.db.db.query.sanityConditions.findMany({
          where: eq(sanityConditions.characterId, character.id),
        }),
        this.db.db.query.activeEffects.findMany({
          where: eq(activeEffects.characterId, character.id),
        }),
      ]);

      return {
        ...character,
        sanityConditions: conditions,
        activeEffects: effects,
      };
    })
  );

  return charactersWithDetails;
}
```

### AFTER
```typescript
async getCharacters(sessionId: string) {
  // Get all characters in the session, sorted by creation date (stable sort)
  const sessionCharacters = await this.db.db.query.characters.findMany({
    where: eq(characters.sessionId, sessionId),
    orderBy: (chars, { asc }) => asc(chars.createdAt),
  });

  // Get sanity conditions and active effects for each character
  const charactersWithDetails = await Promise.all(
    sessionCharacters.map(async (character) => {
      const [conditions, effects] = await Promise.all([
        this.db.db.query.sanityConditions.findMany({
          where: eq(sanityConditions.characterId, character.id),
        }),
        this.db.db.query.activeEffects.findMany({
          where: eq(activeEffects.characterId, character.id),
        }),
      ]);

      return {
        ...character,
        sanityConditions: conditions,
        activeEffects: effects,
      };
    })
  );

  return charactersWithDetails;
}
```

### Changes Summary
| Item | Before | After |
|------|--------|-------|
| **Comment** | "Get all characters in the session" | "Get all characters in the session, sorted by creation date (stable sort)" |
| **orderBy clause** | ❌ None | ✅ `orderBy: (chars, { asc }) => asc(chars.createdAt)` |
| **Guarantee** | ❌ Non-deterministic order | ✅ Consistent creation order |
| **Lines changed** | 1 (line 291) | 2 (lines 292, 295) |

---

## Change 2: `getImportableCharacters()` Method (Lines 92-119)

### BEFORE
```typescript
async getImportableCharacters(sessionId: string, gmId: string) {
  // Verify GM owns this session
  const session = await this.findOne(sessionId);
  if (session.gmId !== gmId) {
    throw new ForbiddenException('Only the GM can import characters');
  }

  // Get all sessions owned by this GM
  const gmSessions = await this.findAll(gmId);

  // Get all characters from GM's other sessions
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

### AFTER
```typescript
async getImportableCharacters(sessionId: string, gmId: string) {
  // Verify GM owns this session
  const session = await this.findOne(sessionId);
  if (session.gmId !== gmId) {
    throw new ForbiddenException('Only the GM can import characters');
  }

  // Get all sessions owned by this GM
  const gmSessions = await this.findAll(gmId);

  // Get all characters from GM's other sessions, sorted by creation date
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

### Changes Summary
| Item | Before | After |
|------|--------|-------|
| **Comment** | "Get all characters from GM's other sessions" | "Get all characters from GM's other sessions, sorted by creation date" |
| **orderBy clause** | ❌ None | ✅ `orderBy: (chars, { asc }) => asc(chars.createdAt)` |
| **Guarantee** | ❌ Non-deterministic order | ✅ Consistent creation order |
| **Lines changed** | 1 (line 102) + 1 (line 107) | 2 (lines 102, 109) |

---

## Summary of Changes

### Files Modified
- ✅ `/srv/workspace/game-plug/apps/backend/src/modules/sessions/sessions.service.ts` (1 file)

### Total Changes
- **Lines added**: 2 (orderBy clauses)
- **Lines modified**: 2 (comments updated for clarity)
- **Lines removed**: 0
- **Breaking changes**: 0 (API contract unchanged)

### Drizzle ORM Syntax Used
```typescript
orderBy: (chars, { asc }) => asc(chars.createdAt)
```

This is the standard Drizzle ORM callback syntax for ordering PostgreSQL queries.

### Database Impact
- ✅ No schema changes needed
- ✅ Field `createdAt` already exists in characters table
- ✅ Uses existing indexes (optimized queries)
- ✅ No migrations required

### TypeScript Compilation
```bash
✅ npm run build
✅ npx tsc --noEmit
```

Both compile without errors.

---

## Verification Checklist

- [x] Only 2 methods changed
- [x] Only added `orderBy` clause (2 lines)
- [x] Comments updated for clarity
- [x] No breaking API changes
- [x] TypeScript compiles
- [x] Uses existing database fields
- [x] No database migrations needed
- [x] Backward compatible with existing data

---

## Affected API Endpoints

### Endpoint 1: Get Session Characters
**URL**: `GET /api/sessions/:sessionId/characters`
- **Before**: Response order was non-deterministic
- **After**: Response ordered by `createdAt` ascending
- **Breaking**: No (response schema unchanged)

### Endpoint 2: Get Importable Characters
**URL**: `GET /api/sessions/:sessionId/importable-characters`
- **Before**: Response order was non-deterministic
- **After**: Response ordered by `createdAt` ascending per session
- **Breaking**: No (response schema unchanged)

---

## Testing Recommendations

### Unit Test Addition
```typescript
describe('SessionsService', () => {
  // ... existing tests ...

  describe('getCharacters', () => {
    it('should return characters sorted by creation date', async () => {
      // Create mock characters with different timestamps
      const char1 = { id: '1', createdAt: new Date('2024-01-01') };
      const char2 = { id: '2', createdAt: new Date('2024-01-02') };
      const char3 = { id: '3', createdAt: new Date('2024-01-03') };

      // Mock db response with unsorted results
      jest.spyOn(db.query.characters, 'findMany')
        .mockResolvedValue([char3, char1, char2]); // Intentionally unsorted

      // Verify service returns sorted results
      const result = await service.getCharacters('session-id');

      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
      expect(result[2].id).toBe('3');
    });
  });
});
```

### Integration Test
```bash
1. Create session
2. Add character "Alice"
3. Add character "Bob"
4. Add character "Charlie"
5. Fetch characters → Verify order: Alice, Bob, Charlie
6. Modify Alice's HP
7. Fetch characters → Verify order unchanged: Alice, Bob, Charlie
8. Modify Charlie's SAN
9. Fetch characters → Verify order unchanged: Alice, Bob, Charlie
```

---

## Related Documentation

For more details:
- Full analysis: `/srv/workspace/game-plug/FIX_CHARACTER_SORT_ORDER.md`
- Testing guide: `/srv/workspace/game-plug/SORT_ORDER_TEST_GUIDE.md`
- Schema: `/srv/workspace/game-plug/shared/schema.ts` (createdAt field definition)
