# Prochaines étapes après Test Session MJ

## Fixes appliqués

### Fix #1: Bug gmId dans SessionsController (APPLIQUÉ)

**Fichier**: `apps/backend/src/modules/sessions/sessions.controller.ts`
**Changement**: Lignes 74-79

```diff
- async create(@Body() data: CreateSessionDto) {
-   return this.sessionsService.create(data);
+ async create(@Body() data: CreateSessionDto, @Req() req: any) {
+   const gmId = req.user.id;
+   return this.sessionsService.create({ ...data, gmId });
}
```

**Commit**: `fix: Extract gmId from JWT in SessionsController.create()`

**Vérification**:
```bash
cd /srv/workspace/game-plug
npm run build
npm test  # S'il existe
```

---

## Tests à réexécuter

Une fois le fix appliqué et recompilé:

```bash
# Depuis le repo local
docker exec game-plug-backend node /tmp/test-correct.js

# Ou re-tester avec curl
TOKEN=$(docker exec game-plug-backend curl -s http://localhost:4000/api/auth/dev-login \
  -H "Content-Type: application/json" \
  -d '{"email":"gm@example.com"}' | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

docker exec game-plug-backend curl -s http://localhost:4000/api/sessions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Session"}'
```

---

## Endpoints manquants à impléter

### 1. Événements narratifs
**Route**: `POST /api/narrative` (tentative) ou `POST /api/sessions/:sessionId/narrative`
**Payload**:
```json
{
  "sessionId": "uuid",
  "content": "Une nuit sombre...",
  "entryType": "event" | "description" | "dialogue"
}
```

**Fichiers à vérifier**:
- `src/modules/narrative/` (si existe)
- Ou créer nouveau module

### 2. WebSocket
**Endpoint**: `/game-ws`
**Gateway existante?**: Vérifier `src/modules/websockets/game.gateway.ts`
**Events à supporter**:
- `join_session`: Joueur rejoint une session
- `leave_session`: Joueur quitte
- `event_broadcast`: Événement narratif
- `state_update`: Mise à jour état (santé, ressources)

### 3. GameBoard Projection
**Route**: `POST /api/gameboard/projection`
**Payload**:
```json
{
  "type": "image" | "video" | "text",
  "url": "https://...",
  "sessionId": "uuid"
}
```

**Broadcast**: WebSocket aux tous les joueurs de la session

---

## Tests E2E Playwright à ajouter

**Fichier**: `e2e/session-flow.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Session Management Flow', () => {
  test('MJ creates session and invites players', async ({ page }) => {
    // 1. Login
    // 2. Click "New Session"
    // 3. Fill "Test Session"
    // 4. Verify join code generated (6 chars)
    // 5. Create chapter
    // 6. Verify chapter appears
  });
  
  test('Players join session by code', async ({ browser }) => {
    // 1. Create session (MJ)
    // 2. Copy join code
    // 3. Open new player context
    // 4. Enter join code
    // 5. Verify connected to session
  });
});
```

---

## Checklist de déploiement

Avant merge dans main:

- [ ] Fix appliqué et compilé
- [ ] Tous les 8 tests API passent
- [ ] Tests Playwright réussissent
- [ ] Endpoints manquants implémentés
- [ ] WebSocket fonctionne
- [ ] Code review complété
- [ ] Performance OK (< 200ms par création session)
- [ ] Documentation mise à jour

---

## Fichiers de références

- **Test report**: `/srv/workspace/game-plug/TEST_SESSION_FLOW_RESULTS_FINAL.md`
- **Archive test scripts**: `/tmp/test-correct.js`
- **Bug issue**: #[TODO create issue]

---

## Timeline estimée

| Tâche | Durée | Priorité |
|-------|-------|----------|
| Recompiler fix gmId | 5 min | CRITIQUE |
| Re-tester 8 endpoints | 15 min | CRITIQUE |
| Implémenter narrative API | 2h | IMPORTANTE |
| Tests Playwright | 1.5h | IMPORTANTE |
| WebSocket broadcast | 1.5h | NORMALE |
| GameBoard projection | 1h | BASSE |

Total: ~6-7 heures pour 100% complet
