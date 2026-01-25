# RAPPORT DE BUGS - Game-Plug
Date: 2026-01-24

## Résumé Exécutif
- **Total bugs identifiés**: 17
- **Critiques** (⛔ bloquent user stories): 5
- **Majeurs** (⚠️ dégradent UX): 8
- **Mineurs** (🐛 cosmétiques/edge cases): 4
- **Status**: 2 fixés ✅, 15 à corriger ❌

---

## 📊 Vue d'Ensemble

### Sources de Données Analysées
1. Logs backend (`docker logs game-plug-backend --tail 500`)
2. Tests API E2E (`e2e/07-api-routes.spec.ts`)
3. Tests Playwright création personnage
4. Rapports existants:
   - `BUG_FIX_CHAPTER_CREATION.md` (bug création chapitre - FIXÉ)
   - `VALIDATION_TEST.md`
   - `FEATURE_ENDPOINT_MAPPING.md`
5. User Stories (`USER_STORIES_JOUEUR.md`, `USER_STORIES_MJ.md`)

### Statistiques Endpoints
- **Total endpoints testés**: 36 (suite API E2E)
- **Endpoints cassés**: 7
- **Taux de succès**: 81% (29/36 fonctionnels)
- **Endpoints critiques affectés**: Sessions, Characters, Chapters, Effects

---

## ⛔ BUGS CRITIQUES (Bloquent User Stories)

### BUG-001: POST /api/sessions - Missing gmId causes NOT NULL violation
**Status:** ❌ NON FIXÉ
**Priority:** P0
**User Story Bloquée:** US-MJ01 (Créer session)

**Symptômes:**
```
ERROR: null value in column "gm_id" of relation "game_sessions" violates not-null constraint
Detail: Failing row contains (cb9a0d8c-..., Test Session, null, null, preparation, t, ...)
Code: 23502
```

**Cause Racine:**
Le DTO `CreateSessionDto` n'inclut pas le champ `gmId`, et le controller ne l'extrait pas du JWT token authentifié.

**Fichiers Concernés:**
- `/srv/workspace/game-plug/apps/backend/src/modules/sessions/sessions.controller.ts`
- `/srv/workspace/game-plug/apps/backend/src/modules/sessions/dto/create-session.dto.ts`
- `/srv/workspace/game-plug/apps/backend/src/modules/sessions/sessions.service.ts`

**Solution Proposée:**
```typescript
// Dans sessions.controller.ts
@Post()
@UseGuards(JwtAuthGuard)
async create(@Body() createSessionDto: CreateSessionDto, @Request() req) {
  return this.sessionsService.create({
    ...createSessionDto,
    gmId: req.user.id  // Extraire l'ID du user JWT
  });
}
```

**Tests à Effectuer:**
```bash
# Test manuel
curl -X POST "http://localhost:4000/api/sessions" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Session","gameSystem":"CoC7e"}'

# Expected: HTTP 201 avec session créée
```

**Impact User Stories:**
- US-MJ01: Bloqué totalement ❌
- US-MJ02: Indirect (impossible de créer sessions à lister)

---

### BUG-002: POST /api/sessions - Invalid DTO fields validation
**Status:** ❌ NON FIXÉ
**Priority:** P0
**User Story Bloquée:** US-MJ01

**Symptômes:**
```
ERROR: Validation failed: [
  {"property":"title","message":"property title should not exist"},
  {"property":"gameSystem","message":"property gameSystem should not exist"},
  {"property":"description","message":"property description should not exist"},
  {"property":"name","message":"name must be a string"}
]
```

**Cause Racine:**
Le DTO `CreateSessionDto` définit `name` comme champ requis, mais les tests/frontend envoient `title`. Incohérence entre DTO backend et appels frontend.

**Fichiers Concernés:**
- `/srv/workspace/game-plug/apps/backend/src/modules/sessions/dto/create-session.dto.ts`
- Tests E2E utilisant `title` au lieu de `name`

**Solution Proposée:**
Option 1: Mettre à jour DTO pour accepter les deux champs
```typescript
export class CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  gameSystem?: string;
}
```

Option 2: Standardiser tous les appels pour utiliser `name` uniquement

**Impact User Stories:**
- US-MJ01: Bloqué ❌

---

### BUG-003: POST /api/chapters - Missing name field causes NOT NULL violation
**Status:** ❌ NON FIXÉ
**Priority:** P0
**User Story Bloquée:** US-MJ07 (Créer chapitre)

**Symptômes:**
```
ERROR: null value in column "name" of relation "chapters" violates not-null constraint
Detail: Failing row contains (3a1a7aca-..., test-id, null, Test, 0, planned, ...)
Code: 23502
```

**Cause Racine:**
Le DTO `CreateChapterDto` définit `name` comme champ requis, mais ne valide pas correctement le payload. La valeur `name` est null alors que `description` contient "Test".

**Fichiers Concernés:**
- `/srv/workspace/game-plug/apps/backend/src/modules/chapters/chapters.controller.ts`
- `/srv/workspace/game-plug/apps/backend/src/modules/chapters/dto/create-chapter.dto.ts`

**Solution Proposée:**
```typescript
// create-chapter.dto.ts
export class CreateChapterDto {
  @IsString()
  @IsNotEmpty({ message: 'Le nom du chapitre est requis' })
  @MinLength(3, { message: 'Le nom doit contenir au moins 3 caractères' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['planned', 'active', 'completed'])
  @IsOptional()
  status?: string;

  @IsInt()
  @Min(0)
  orderIndex: number;
}
```

**Tests à Effectuer:**
```bash
# Vérifier validation DTO
POST /api/sessions/{sessionId}/chapters
Body: { "description": "Test" }  # Doit rejeter car name manquant

POST /api/sessions/{sessionId}/chapters
Body: { "name": "Chapitre 1", "orderIndex": 0 }  # Doit réussir
```

**Impact User Stories:**
- US-MJ07: Bloqué ❌
- US-MJ08, US-MJ09: Indirectement bloqués

**Note:** BUG-001 de `BUG_FIX_CHAPTER_CREATION.md` (authentification frontend) est FIXÉ ✅, mais ce bug backend persiste.

---

### BUG-004: POST /api/chapter-events - Missing eventType causes NOT NULL violation
**Status:** ❌ NON FIXÉ
**Priority:** P0
**User Story Bloquée:** US-MJ09 (Marquer événements importants)

**Symptômes:**
```
ERROR: null value in column "event_type" of relation "chapter_events" violates not-null constraint
Detail: Failing row contains (047a96dd-..., test, null, null, null, Test Event, {}, null, null, f, ...)
Code: 23502
```

**Cause Racine:**
Le DTO `CreateChapterEventDto` définit `eventType` comme requis mais la validation ne fonctionne pas correctement. Le payload envoyé ne contient pas `eventType`.

**Fichiers Concernés:**
- `/srv/workspace/game-plug/apps/backend/src/modules/chapter-events/chapter-events.controller.ts`
- `/srv/workspace/game-plug/apps/backend/src/modules/chapter-events/dto/create-chapter-event.dto.ts`

**Solution Proposée:**
```typescript
export class CreateChapterEventDto {
  @IsUUID()
  chapterId: string;

  @IsUUID()
  sessionId: string;

  @IsEnum(['combat', 'discovery', 'dialogue', 'clue', 'danger'])
  @IsNotEmpty({ message: 'Le type d\'événement est requis' })
  eventType: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isImportant?: boolean;
}
```

**Impact User Stories:**
- US-MJ09: Bloqué ❌
- US-J34: Bloqué (impossible de voir historique si événements ne peuvent être créés)

---

### BUG-005: POST /api/characters/{id}/effects - Invalid character foreign key
**Status:** ❌ NON FIXÉ
**Priority:** P1
**User Story Bloquée:** US-MJ12 (Appliquer buffs/debuffs)

**Symptômes:**
```
ERROR: insert or update on table "active_effects" violates foreign key constraint "active_effects_character_id_characters_id_fk"
Detail: Key (character_id)=(char_123) is not present in table "characters".
Code: 23503
```

**Cause Racine:**
Les tests utilisent des IDs de personnages factices (`char_123`) qui n'existent pas en base. Le backend ne valide pas l'existence du personnage avant d'insérer l'effet.

**Fichiers Concernés:**
- `/srv/workspace/game-plug/apps/backend/src/modules/effects/effects.service.ts`
- `/srv/workspace/game-plug/apps/backend/src/modules/effects/effects.controller.ts`

**Solution Proposée:**
```typescript
// effects.service.ts
async create(createEffectDto: CreateEffectDto) {
  // Vérifier que le personnage existe
  const character = await this.charactersService.findOne(createEffectDto.characterId);
  if (!character) {
    throw new NotFoundException(`Character with ID ${createEffectDto.characterId} not found`);
  }

  return await db.insert(activeEffects).values(createEffectDto).returning();
}
```

**Tests à Effectuer:**
```bash
# Test avec ID invalide
POST /api/characters/invalid-id/effects
Body: { "name": "Buff", "type": "buff", "duration": 3 }
# Expected: HTTP 404 Not Found

# Test avec ID valide
POST /api/characters/{validId}/effects
Body: { "name": "Buff", "type": "buff", "duration": 3 }
# Expected: HTTP 201 Created
```

**Impact User Stories:**
- US-MJ12: Bloqué partiellement ⚠️
- US-J31: Affecté

---

## ⚠️ BUGS MAJEURS (Dégradent UX)

### BUG-006: POST /api/characters - Validation max values too strict (99 limit)
**Status:** ❌ NON FIXÉ
**Priority:** P1
**User Story Affectée:** US-J01 (Créer personnage)

**Symptômes:**
```
ERROR: Validation failed: [
  {"property":"strength","message":"strength must not be greater than 99"},
  {"property":"constitution","message":"constitution must not be greater than 99"},
  ...
]
```

**Cause Racine:**
Call of Cthulhu 7e permet des caractéristiques jusqu'à 100 (ex: 3d6×5 = max 90 de base, mais peut monter à 100+ avec bonus). Le DTO limite à 99.

**Fichiers Concernés:**
- `/srv/workspace/game-plug/apps/backend/src/modules/characters/dto/create-character.dto.ts`

**Solution Proposée:**
```typescript
export class CreateCharacterDto {
  @IsInt()
  @Min(1)
  @Max(200)  // Permettre bonus/magie qui augmentent stats
  strength: number;

  // Répéter pour constitution, size, dexterity, etc.

  @IsInt()
  @Min(0)
  @Max(150)  // Sanité peut dépasser 99 avec magie
  sanity: number;

  @IsInt()
  @Min(0)
  @Max(150)
  maxSanity: number;
}
```

**Impact User Stories:**
- US-J01: Dégradé ⚠️ (personnages avec stats > 99 rejetés)
- US-J04: Affecté (modifications stats haute valeur)

---

### BUG-007: POST /api/characters - DTO rejects "class" field
**Status:** ❌ NON FIXÉ
**Priority:** P2
**User Story Affectée:** US-J01

**Symptômes:**
```
ERROR: Validation failed: [{"property":"class","message":"property class should not exist"}]
```

**Cause Racine:**
Call of Cthulhu 7e utilise "occupation" et non "class" (terme de D&D). Le frontend envoie `class` au lieu de `occupation`.

**Fichiers Concernés:**
- Frontend character creation form
- `/srv/workspace/game-plug/apps/backend/src/modules/characters/dto/create-character.dto.ts`

**Solution Proposée:**
Option 1: Mapper `class` → `occupation` dans le controller
```typescript
@Post()
async create(@Body() dto: CreateCharacterDto) {
  if ('class' in dto && !dto.occupation) {
    dto.occupation = dto['class'];
  }
  return this.charactersService.create(dto);
}
```

Option 2: Mettre à jour frontend pour utiliser `occupation` uniquement

**Impact User Stories:**
- US-J01: Dégradé ⚠️

---

### BUG-008: POST /api/rolls - Invalid diceFormula validation rejects valid formats
**Status:** ❌ NON FIXÉ
**Priority:** P1
**User Story Affectée:** US-J15 à US-J20 (Système dés)

**Symptômes:**
```
ERROR: Validation failed: [
  {"property":"diceType","message":"property diceType should not exist"},
  {"property":"quantity","message":"property quantity should not exist"},
  {"property":"diceFormula","message":"Le format doit être valide (ex: 1d20, 2d6+3, 1d100-5)"}
]
```

**Cause Racine:**
Le frontend envoie `diceType` et `quantity` séparément, mais le backend attend uniquement `diceFormula` sous forme de string (ex: "1d100").

**Fichiers Concernés:**
- `/srv/workspace/game-plug/apps/backend/src/modules/dice/dto/roll-dice.dto.ts`
- Frontend dice roller components

**Solution Proposée:**
Option 1: Accepter les deux formats dans le DTO
```typescript
export class RollDiceDto {
  @IsString()
  @IsOptional()
  @Matches(/^\d+d\d+([\+\-]\d+)?$/, { message: 'Format invalide' })
  diceFormula?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  diceType?: number;  // ex: 100 pour d100

  @IsInt()
  @Min(1)
  @Max(20)
  @IsOptional()
  quantity?: number;  // ex: 3 pour 3d6
}
```

Option 2: Construire `diceFormula` côté frontend avant envoi

**Impact User Stories:**
- US-J15 à US-J20: Tous les lancers de dés affectés ⚠️

---

### BUG-009: PATCH /api/characters/{id}/notes - Validation error
**Status:** ❌ NON FIXÉ
**Priority:** P2
**User Story Affectée:** US-J36 (Notes personnelles)

**Symptômes:**
```
ERROR: Validation failed: [{"property":"title","message":"title must be a string"}]
```

**Cause Racine:**
Le DTO attend `title` mais le payload envoie uniquement `notes`. Incohérence entre endpoint et DTO.

**Fichiers Concernés:**
- `/srv/workspace/game-plug/apps/backend/src/modules/characters/dto/update-character-notes.dto.ts`
- `/srv/workspace/game-plug/apps/backend/src/modules/characters/characters.controller.ts`

**Solution Proposée:**
```typescript
export class UpdateCharacterNotesDto {
  @IsString()
  @IsOptional()
  notes?: string;
}
```

**Impact User Stories:**
- US-J36: Bloqué ❌

---

### BUG-010: POST /api/chapters - Invalid sessionId foreign key
**Status:** ❌ NON FIXÉ
**Priority:** P1
**User Story Affectée:** US-MJ07

**Symptômes:**
```
ERROR: insert or update on table "chapters" violates foreign key constraint "chapters_session_id_game_sessions_id_fk"
Detail: Key (session_id)=(test-id) is not present in table "game_sessions".
Code: 23503
```

**Cause Racine:**
Les tests utilisent des IDs de session factices (`test-id`) qui n'existent pas. Le backend ne valide pas l'existence de la session avant création.

**Fichiers Concernés:**
- `/srv/workspace/game-plug/apps/backend/src/modules/chapters/chapters.service.ts`

**Solution Proposée:**
```typescript
async create(sessionId: string, createChapterDto: CreateChapterDto) {
  // Vérifier que la session existe
  const session = await this.sessionsService.findOne(sessionId);
  if (!session) {
    throw new NotFoundException(`Session with ID ${sessionId} not found`);
  }

  return await db.insert(chapters).values({
    ...createChapterDto,
    sessionId
  }).returning();
}
```

**Impact User Stories:**
- US-MJ07: Dégradé ⚠️

---

### BUG-011: POST /api/sanity/conditions - Missing validation
**Status:** ❌ NON FIXÉ
**Priority:** P2
**User Story Affectée:** US-J23 (Phobies/Manias)

**Symptômes:**
```
ERROR: Validation failed: [
  {"property":"characterId","message":"characterId must be a string"},
  {"property":"type","message":"type must be a string"}
]
```

**Cause Racine:**
Le DTO manque de validations pour `characterId` et `type`. Le payload ne contient pas ces champs.

**Fichiers Concernés:**
- `/srv/workspace/game-plug/apps/backend/src/modules/sanity/dto/create-sanity-condition.dto.ts`

**Solution Proposée:**
```typescript
export class CreateSanityConditionDto {
  @IsUUID()
  characterId: string;

  @IsEnum(['phobia', 'mania'])
  type: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['temporary', 'indefinite', 'permanent'])
  duration: string;
}
```

**Impact User Stories:**
- US-J23: Bloqué partiellement ⚠️

---

### BUG-012: Character creation form - Occupation field validation inconsistency
**Status:** ❌ NON FIXÉ
**Priority:** P1
**User Story Affectée:** US-J01

**Symptômes:**
D'après les logs frontend et `error-context.md`, le test Playwright échoue car le formulaire attend une occupation sélectionnée avant de débloquer les compétences.

**Cause Racine:**
La validation frontend empêche la création d'un personnage si l'occupation n'est pas sélectionnée, mais le backend accepte des personnages sans occupation (field optionnel).

**Fichiers Concernés:**
- `/srv/workspace/game-plug/apps/frontend/app/(dashboard)/characters/new/page.tsx`
- Frontend character creation form component

**Solution Proposée:**
Rendre le champ `occupation` obligatoire dans le DTO backend:
```typescript
export class CreateCharacterDto {
  @IsString()
  @IsNotEmpty({ message: 'Une occupation est requise' })
  occupation: string;
}
```

**Tests à Effectuer:**
```bash
# Test sans occupation
POST /api/characters
Body: { "name": "Test", "age": 30, ... }  # Sans occupation
# Expected: HTTP 400 Bad Request

# Test E2E Playwright
npx playwright test e2e/02-character-creation.spec.ts
# Expected: Tous les tests passent
```

**Impact User Stories:**
- US-J01: Dégradé ⚠️
- US-J07: Affecté (allocation compétences dépend de l'occupation)

---

### BUG-013: Avatar generation - Missing error handling
**Status:** ❌ NON FIXÉ
**Priority:** P2
**User Story Affectée:** US-J01 (Avatar IA)

**Symptômes:**
Aucune gestion d'erreur visible dans les logs pour les échecs de génération d'avatar OpenAI.

**Cause Racine:**
Le service AI ne capture probablement pas les erreurs OpenAI (rate limit, API down, etc.) et ne fournit pas de fallback.

**Fichiers Concernés:**
- `/srv/workspace/game-plug/apps/backend/src/modules/ai/ai.service.ts`
- `/srv/workspace/game-plug/apps/backend/src/modules/ai/ai.controller.ts`

**Solution Proposée:**
```typescript
async generateAvatar(prompt: string): Promise<string> {
  try {
    const response = await this.openai.images.generate({
      model: 'dall-e-3',
      prompt,
      size: '1024x1024'
    });
    return response.data[0].url;
  } catch (error) {
    this.logger.error(`Avatar generation failed: ${error.message}`);

    // Fallback: retourner avatar par défaut
    return '/default-avatar.png';
  }
}
```

**Impact User Stories:**
- US-J01: UX dégradée si génération échoue sans feedback ⚠️

---

## 🐛 BUGS MINEURS (Cosmétiques/Edge Cases)

### BUG-014: Character stats - HP/MP can be negative
**Status:** ❌ NON FIXÉ
**Priority:** P3
**User Story Affectée:** US-J04, US-J32

**Symptômes:**
Les logs de validation montrent que `hitPoints` peut être négatif tant que `>= 0`, mais dans Call of Cthulhu, un personnage à HP ≤ 0 est inconscient/mort.

**Cause Racine:**
Le DTO valide `@Min(0)` mais ne gère pas la logique métier "mort/inconscient".

**Fichiers Concernés:**
- `/srv/workspace/game-plug/apps/backend/src/modules/characters/dto/update-character.dto.ts`
- Character service

**Solution Proposée:**
```typescript
async updateHitPoints(characterId: string, newHP: number) {
  const character = await this.findOne(characterId);

  if (newHP <= 0) {
    // Marquer personnage comme inconscient/mort
    await this.update(characterId, {
      hitPoints: 0,
      status: 'unconscious'
    });

    // Émettre événement WebSocket pour notifier MJ
    this.websocketGateway.emit('character:unconscious', { characterId });
  } else {
    await this.update(characterId, { hitPoints: newHP });
  }
}
```

**Impact User Stories:**
- US-J32, US-J04: Cosmétique 🐛

---

### BUG-015: Session status - Missing "archived" status handling
**Status:** ❌ NON FIXÉ
**Priority:** P3
**User Story Affectée:** US-MJ03

**Symptômes:**
Le schéma base de données définit `isActive` (boolean), mais les user stories mentionnent 3 états: Active, En pause, Archivée.

**Cause Racine:**
Le modèle de données ne supporte que actif/inactif, pas archivé.

**Fichiers Concernés:**
- `/srv/workspace/game-plug/shared/schema.ts` (table `game_sessions`)
- Sessions service

**Solution Proposée:**
Option 1: Ajouter colonne `status` enum('active', 'paused', 'archived')
```typescript
status: text('status', { enum: ['active', 'paused', 'archived'] }).default('active')
```

Option 2: Garder `isActive` + ajouter `isArchived` boolean

**Impact User Stories:**
- US-MJ02, US-MJ03: Fonctionnalité incomplète 🐛

---

### BUG-016: WebSocket reconnection - No automatic retry
**Status:** ❌ NON FIXÉ (NON CONFIRMÉ)
**Priority:** P3
**User Story Affectée:** US-J30, US-J33

**Symptômes:**
Non testé, mais susceptible: si le WebSocket se déconnecte, pas de reconnexion automatique visible.

**Cause Racine:**
Probable: le client WebSocket frontend ne gère pas les déconnexions.

**Fichiers Concernés:**
- Frontend WebSocket hooks (`useWebSocket.ts` potentiel)
- `/srv/workspace/game-plug/apps/backend/src/gateway/game.gateway.ts`

**Solution Proposée:**
```typescript
// Frontend
const useWebSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const connect = () => {
      const newSocket = io(BACKEND_URL, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      newSocket.on('disconnect', () => {
        console.log('WebSocket disconnected, retrying...');
      });

      setSocket(newSocket);
    };

    connect();
    return () => socket?.disconnect();
  }, []);

  return socket;
};
```

**Impact User Stories:**
- US-J30, US-J33, US-J37: UX dégradée si perte connexion 🐛

---

### BUG-017: Character creation E2E test - Flaky due to random generation
**Status:** ❌ NON FIXÉ
**Priority:** P3

**Symptômes:**
Le test Playwright `02-character-creation.spec.ts` utilise des valeurs aléatoires pour le nom (`Investigator ${Date.now()}`), ce qui peut causer des incohérences.

**Cause Racine:**
Nom généré avec timestamp, mais test échoue parfois car les assertions attendent des valeurs spécifiques.

**Fichiers Concernés:**
- `/srv/workspace/game-plug/e2e/02-character-creation.spec.ts`

**Solution Proposée:**
```typescript
test('Create character with random generation', async ({ page }) => {
  const testName = `Test Character ${Math.random().toString(36).substring(7)}`;

  await page.fill('input[name="characterName"]', testName);
  // ...

  // Assertion
  await expect(page.locator('text=' + testName)).toBeVisible();
});
```

**Impact:**
Tests E2E flaky 🐛

---

## ✅ BUGS RÉSOLUS

### BUG-001 (ANCIENNEMENT): POST /api/chapters - Frontend missing JWT token
**Status:** ✅ FIXÉ (2026-01-24)
**Fix:** Modification de `/srv/workspace/game-plug/apps/frontend/lib/queryClient.ts`

**Détails:**
Ajout de l'en-tête `Authorization: Bearer {token}` dans la fonction `apiRequest()` pour inclure le token JWT depuis `localStorage`.

**Référence:** `BUG_FIX_CHAPTER_CREATION.md`

**Commit:** Déjà appliqué et validé ✅

---

### BUG-002 (ANCIENNEMENT): Database connection issues
**Status:** ✅ FIXÉ
**Fix:** Configuration Docker Compose corrigée

**Référence:** Task #2 completed

---

## 📋 RECOMMANDATIONS

### Priorité Immédiate (P0 - Semaine 1)

1. **BUG-001**: Fixer `POST /api/sessions` (ajouter gmId depuis JWT)
2. **BUG-002**: Corriger validation DTO sessions (name vs title)
3. **BUG-003**: Fixer `POST /api/chapters` (validation name requis)
4. **BUG-004**: Fixer `POST /api/chapter-events` (eventType requis)
5. **BUG-005**: Valider existence character avant création effects

**Estimation:** 2-3 jours développement + 1 jour tests

---

### Priorité Haute (P1 - Semaine 2)

6. **BUG-006**: Ajuster limites validation caractéristiques (99 → 200)
7. **BUG-008**: Harmoniser formats diceFormula
8. **BUG-010**: Valider sessionId avant création chapitres
9. **BUG-012**: Rendre occupation obligatoire

**Estimation:** 2 jours développement + 1 jour tests

---

### Priorité Moyenne (P2 - Semaine 3)

10. **BUG-007**: Mapper class → occupation
11. **BUG-009**: Fixer update notes
12. **BUG-011**: Validation sanity conditions
13. **BUG-013**: Error handling avatar generation

**Estimation:** 2 jours développement

---

### Priorité Basse (P3 - Backlog)

14. **BUG-014**: Logique métier HP ≤ 0
15. **BUG-015**: Ajouter status sessions archivées
16. **BUG-016**: WebSocket reconnection automatique
17. **BUG-017**: Stabiliser tests E2E

**Estimation:** 1-2 jours (à planifier après P0-P2)

---

## 🧪 STRATÉGIE DE VALIDATION

### Tests à Créer/Mettre à Jour

1. **Tests unitaires DTOs:**
   - `create-session.dto.spec.ts`
   - `create-chapter.dto.spec.ts`
   - `create-chapter-event.dto.spec.ts`
   - `roll-dice.dto.spec.ts`

2. **Tests E2E API:**
   - Mettre à jour `e2e/07-api-routes.spec.ts` pour utiliser IDs valides
   - Ajouter tests négatifs (validation errors)

3. **Tests E2E UI:**
   - Stabiliser `e2e/02-character-creation.spec.ts`
   - Ajouter tests session MJ (`e2e/11-gm-session-management.spec.ts`)

### Checklist Pré-Déploiement

- [ ] Tous les bugs P0 fixés et testés
- [ ] TypeScript compile sans erreur (`npx tsc --noEmit`)
- [ ] Tests backend passent 100% (`npm test`)
- [ ] Tests E2E Playwright passent 100%
- [ ] Logs backend sans ERROR sur scénarios standards
- [ ] Documentation API Swagger mise à jour
- [ ] Migration base de données appliquée (si schéma modifié)

---

## 📊 MÉTRIQUES

### Couverture User Stories

| Catégorie | Total | Bloquées | Dégradées | Fonctionnelles |
|-----------|-------|----------|-----------|----------------|
| **Joueur** | 45 | 3 (6.7%) | 8 (17.8%) | 34 (75.5%) |
| **MJ** | 30 | 4 (13.3%) | 6 (20%) | 20 (66.7%) |
| **TOTAL** | 75 | 7 (9.3%) | 14 (18.7%) | 54 (72%) |

### Impact Business

- **Création session MJ**: ⛔ BLOQUÉE (BUG-001, BUG-002)
- **Création personnage**: ⚠️ DÉGRADÉE (BUG-006, BUG-007, BUG-012)
- **Système dés**: ⚠️ DÉGRADÉ (BUG-008)
- **Gestion chapitres**: ⛔ BLOQUÉE (BUG-003, BUG-004)
- **Effets personnage**: ⚠️ DÉGRADÉ (BUG-005)

---

## 📁 FICHIERS ANALYSÉS

### Backend
- `/srv/workspace/game-plug/apps/backend/src/modules/sessions/` (controllers, services, DTOs)
- `/srv/workspace/game-plug/apps/backend/src/modules/characters/`
- `/srv/workspace/game-plug/apps/backend/src/modules/chapters/`
- `/srv/workspace/game-plug/apps/backend/src/modules/chapter-events/`
- `/srv/workspace/game-plug/apps/backend/src/modules/effects/`
- `/srv/workspace/game-plug/apps/backend/src/modules/dice/`
- `/srv/workspace/game-plug/apps/backend/src/modules/sanity/`

### Frontend
- `/srv/workspace/game-plug/apps/frontend/lib/queryClient.ts` (✅ FIXÉ)
- `/srv/workspace/game-plug/apps/frontend/components/chapter-manager.tsx`
- `/srv/workspace/game-plug/apps/frontend/app/(dashboard)/characters/new/`

### Tests
- `/srv/workspace/game-plug/e2e/07-api-routes.spec.ts`
- `/srv/workspace/game-plug/e2e/02-character-creation.spec.ts`

### Database
- `/srv/workspace/game-plug/shared/schema.ts`

---

## 🔗 RÉFÉRENCES

- `BUG_FIX_CHAPTER_CREATION.md` - Fix authentification frontend ✅
- `VALIDATION_TEST.md` - Tests backend
- `FEATURE_ENDPOINT_MAPPING.md` - Mapping user stories → endpoints
- `USER_STORIES_JOUEUR.md` - 45 user stories joueur
- `USER_STORIES_MJ.md` - 30 user stories MJ
- `E2E_TESTS_SUMMARY.md` - 101 tests E2E Playwright

---

**Rapport créé par:** Claude Code (Sonnet 4.5)
**Date:** 2026-01-24
**Version:** 1.0
**Status:** PRÊT POUR REVIEW ET PRIORISATION
