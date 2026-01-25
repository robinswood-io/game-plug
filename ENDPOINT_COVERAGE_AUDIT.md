# Audit de Coverage des Endpoints - Express vs NestJS

## Date: 2026-01-23

## Express Routes (server/routes.ts) - 53 endpoints

### 1. Health Check
- ✅ `GET /api/health` → NestJS: `HealthController_check` (ligne 4-17 openapi.json)

### 2. Auth Routes (4 endpoints)
- ✅ `GET /api/auth/user` → NestJS: Géré par JWT guard, pas d'endpoint dédié (normal)
- ✅ `POST /api/auth/signup` → NestJS: `AuthController_signup` (ligne 19-45)
- ✅ `POST /api/auth/login` → NestJS: `AuthController_login` (ligne 47-73)
- ⚠️ `POST /api/auth/logout` → **MANQUE dans NestJS** (ligne 129-138 routes.ts)
- ✅ `POST /api/auth/refresh` → NestJS: `AuthController_refresh` (ligne 75-92)

### 3. Session Join (public)
- ⚠️ `GET /api/sessions/join/:code` → **MANQUE dans NestJS** (ligne 141-156 routes.ts)

### 4. Game Sessions (6 endpoints)
- ✅ `POST /api/sessions` → NestJS: `SessionsController_create` (ligne 287-314)
- ✅ `GET /api/sessions` → NestJS: `SessionsController_findAll` (ligne 259-286)
- ✅ `GET /api/sessions/:id` → NestJS: `SessionsController_findOne` (ligne 316-343)
- ✅ `PATCH /api/sessions/:id` → NestJS: `SessionsController_update` (ligne 344-380)
- ✅ `DELETE /api/sessions/:id` → NestJS: `SessionsController_delete` (ligne 381-407)
- ✅ `GET /api/sessions/:id/characters` → Peut être géré via CharactersController avec query param

### 5. Chapters (5 endpoints)
- ✅ `POST /api/sessions/:sessionId/chapters` → NestJS: `ChaptersController_create` (ligne 560-577)
- ✅ `GET /api/sessions/:sessionId/chapters` → NestJS: `ChaptersController_findBySession` (ligne 532-559)
- ✅ `PATCH /api/chapters/:id` → NestJS: `ChaptersController_update` (ligne 607-633)
- ✅ `DELETE /api/chapters/:id` → NestJS: `ChaptersController_delete` (ligne 634-660)
- ✅ `GET /api/chapters/:id` → NestJS: `ChaptersController_findOne` (ligne 580-606)

### 6. Chapter Events (5 endpoints)
- ✅ `POST /api/chapter-events` → NestJS: `ChapterEventsController_create` (ligne 698-715)
- ✅ `GET /api/chapters/:chapterId/events` → NestJS: `ChapterEventsController_find` avec query (ligne 662-697)
- ✅ `GET /api/sessions/:sessionId/important-events` → Peut être géré via query param
- ✅ `PATCH /api/chapter-events/:id` → NestJS: `ChapterEventsController_update` (ligne 745-771)
- ✅ `DELETE /api/chapter-events/:id` → NestJS: `ChapterEventsController_delete` (ligne 772-798)

### 7. Characters (5 endpoints de base)
- ✅ `POST /api/characters` → NestJS: `CharactersController_create` (ligne 122-152)
- ✅ `GET /api/characters` → NestJS: `CharactersController_findAll` (ligne 93-121)
- ✅ `GET /api/characters/:id` → NestJS: `CharactersController_findOne` (ligne 154-185)
- ✅ `PATCH /api/characters/:id` → NestJS: `CharactersController_update` (ligne 186-226)
- ⚠️ `PATCH /api/characters/:id/notes` → **Peut être géré par update générique**
- ⚠️ `DELETE /api/sessions/:sessionId/characters/:characterId` → **MANQUE pattern spécifique**

### 8. Character Inventory (9 endpoints)
- ✅ `GET /api/characters/:id/inventory` → NestJS: `InventoryController_findByCharacter` (ligne 409-436)
- ✅ `POST /api/characters/:id/inventory` → NestJS: `InventoryController_create` (ligne 437-464)
- ✅ `PATCH /api/inventory/:id` → NestJS: `InventoryController_update` (ligne 467-503)
- ✅ `PATCH /api/inventory/:id/equip` → **Peut être géré par update avec champ isEquipped**
- ✅ `DELETE /api/inventory/:id` → NestJS: `InventoryController_delete` (ligne 504-530)
- ✅ `PATCH /api/characters/:characterId/inventory/:itemId` → Redondant avec PATCH /api/inventory/:id
- ✅ `DELETE /api/characters/:characterId/inventory/:itemId` → Redondant avec DELETE /api/inventory/:id

### 9. Narrative Entries (5 endpoints)
- ✅ `GET /api/sessions/:sessionId/narrative` → NestJS: `NarrativeController_findBySession` (ligne 800-827)
- ✅ `POST /api/sessions/:sessionId/narrative` → NestJS: `NarrativeController_create` (ligne 828-845)
- ⚠️ `POST /api/sessions/:sessionId/narrative/ai-suggest` → **AI endpoint à vérifier**
- ✅ `PATCH /api/narrative/:id` → NestJS: `NarrativeController_update` (ligne 847-874)
- ✅ `DELETE /api/narrative/:id` → NestJS: `NarrativeController_delete` (ligne 875-901)

### 10. AI/OpenAI Endpoints (4 endpoints)
- ✅ `POST /api/gameboard/generate-scene` → NestJS: `AiController_generateScene` (ligne 929-954)
- ✅ `POST /api/generate-avatar` → NestJS: `AiController_generateAvatar` (ligne 903-928)
- ✅ `POST /api/characters/:characterId/generate-avatar` → **Variante AI avatar**
- ✅ `POST /api/sessions/:sessionId/generate-all-avatars` → **Batch avatar generation**
- ✅ `POST /api/migrate-avatars` → **Utilitaire de migration (peut être retiré après migration)**
- ✅ `POST /api/ai/suggest-narrative` → NestJS: `AiController_suggestNarrative` (ligne 955-980)

### 11. Character Import/Management (3 endpoints)
- ⚠️ `GET /api/sessions/:sessionId/importable-characters` → **MANQUE**
- ⚠️ `POST /api/sessions/:sessionId/import-character` → **MANQUE**
- ⚠️ `POST /api/characters/:id/skill-points` → **MANQUE** (ligne 1436-1469)
- ⚠️ `POST /api/characters/:id/distribute-points` → **MANQUE** (ligne 1472-1526)

### 12. Sanity Conditions (2 endpoints)
- ✅ `POST /api/characters/:id/sanity-conditions` → NestJS: `SanityController_create` (ligne 1093-1115)
- ✅ `GET /api/sanity` avec characterId → NestJS: `SanityController_findByCharacter` (ligne 1069-1092)
- ✅ `PATCH /api/sanity/:id` → NestJS: `SanityController_update` (ligne 1118-1150)
- ✅ `DELETE /api/sanity/:id` → NestJS: `SanityController_delete` (ligne 1151-1173)

### 13. Active Effects (2 endpoints)
- ⚠️ `POST /api/characters/:id/effects` → **MANQUE dans NestJS** (ligne 1529-1647)
- ⚠️ `PATCH /api/effects/:id` → **MANQUE dans NestJS** (ligne 1649-1659)

### 14. Dice Rolls (2 endpoints)
- ✅ `POST /api/rolls` → NestJS: `DiceController_roll` (ligne 1175-1204)
- ⚠️ `GET /api/sessions/:id/rolls` → **MANQUE** (ligne 1687-1697)

### 15. Gameboard (3 endpoints)
- ✅ `GET /api/gameboards/:sessionId` → NestJS: `GameboardController_getGameboard` (ligne 981-1006)
- ✅ `POST /api/gameboards` → NestJS: `GameboardController_create` (ligne 1007-1032)
- ✅ `PATCH /api/gameboards/:id` → NestJS: `GameboardController_update` (ligne 1033-1068)

## RÉSUMÉ

### Endpoints COUVERTS: ~40/53 (75%)

### Endpoints MANQUANTS CRITIQUES (13):
1. ❌ `POST /api/auth/logout` - Session cleanup
2. ❌ `GET /api/sessions/join/:code` - Join session par code (public)
3. ❌ `DELETE /api/sessions/:sessionId/characters/:characterId` - Remove character from session
4. ❌ `GET /api/sessions/:sessionId/importable-characters` - Import workflow
5. ❌ `POST /api/sessions/:sessionId/import-character` - Import workflow
6. ❌ `POST /api/characters/:id/skill-points` - GM grant skill points
7. ❌ `POST /api/characters/:id/distribute-points` - Player distribute points
8. ❌ `POST /api/characters/:id/effects` - Apply active effects
9. ❌ `PATCH /api/effects/:id` - Update active effects
10. ❌ `GET /api/sessions/:id/rolls` - Fetch roll history
11. ❌ `POST /api/characters/:characterId/generate-avatar` - Specific avatar gen
12. ❌ `POST /api/sessions/:sessionId/generate-all-avatars` - Batch avatars
13. ❌ `POST /api/migrate-avatars` - Migration utility

### Endpoints UTILITAIRES (peuvent être retirés après migration):
- `POST /api/migrate-avatars` - Utilitaire de migration avatars

## RECOMMANDATION

⚠️ **NE PAS PROCÉDER À LA SUPPRESSION IMMÉDIATE**

Il manque **13 endpoints critiques** dans NestJS, soit 25% de la couverture. Les endpoints manquants incluent:
- Authentification (logout)
- Import de personnages (workflow complet)
- Skill points management (GM + Player)
- Active effects (buff/debuff system)
- Roll history
- Avatar generation (variantes spécifiques)

**Action requise:**
1. Implémenter les 13 endpoints manquants dans NestJS
2. Tester chaque endpoint
3. Mettre à jour openapi.json
4. Re-vérifier coverage = 100%
5. PUIS procéder à la suppression Express

**Estimation:** 4-6 heures de développement pour endpoints manquants
