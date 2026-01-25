# 401 Unauthorized Fix - POST /api/rolls

## Quick Summary

Fixed 401 Unauthorized errors when recording dice rolls. The issue was caused by duplicate RollsControllers with one requiring JWT authentication inappropriately.

## What Was Fixed

- POST /api/rolls: Now public endpoint (no authentication required)
- Dice rolls can be recorded with or without user authentication
- userId is captured if user is authenticated, optional otherwise

## Changes

1. **Deleted:** `/apps/backend/src/modules/dice/rolls.controller.ts` (duplicate)
2. **Modified:** `/apps/backend/src/modules/dice/dice.module.ts` (removed RollsController)
3. **Modified:** `/apps/backend/src/modules/rolls/rolls.controller.ts` (removed JWT guard)

## Before

```
POST /api/rolls → 401 Unauthorized (if no valid token)
```

## After

```
POST /api/rolls → 201 Created (always works)
```

## Verification

- Build: ✓ Complete
- Backend: ✓ Restarted
- Routes: ✓ Correctly mapped
- No auth guard on POST /api/rolls: ✓ Verified

## Deployment

```bash
npm run build
docker compose restart game-plug-backend
```

## Testing

1. Open game session
2. Click a dice roll button (1d20, 1d100, etc.)
3. Should see roll result with no 401 error
4. Roll should be recorded in history

## Git Commit

```
9804f81 fix: Remove JWT authentication requirement from POST /api/rolls endpoint
```

## Files

- Detailed technical analysis: `TECHNICAL_DETAILS_401_FIX.md`
- Full report: `ROLLFIX_REPORT.md`

---

**Status:** COMPLETE  
**Date:** 2026-01-25  
**Impact:** Dice rolls now work without authentication errors
