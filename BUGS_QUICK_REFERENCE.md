# BUGS QUICK REFERENCE - Game-Plug

**Version:** 1.0 | **Date:** 2026-01-24 | **Total Bugs:** 17

---

## 🚨 STATUT GLOBAL

```
┌─────────────────────────────────────────┐
│  BUGS PAR PRIORITÉ                      │
├─────────────────────────────────────────┤
│  ⛔ P0 - CRITIQUES:      5 bugs         │
│  ⚠️  P1 - MAJEURS:       8 bugs         │
│  🐛 P2-P3 - MINEURS:    4 bugs         │
│  ✅ RÉSOLUS:            2 bugs         │
├─────────────────────────────────────────┤
│  TOTAL À CORRIGER:     15 bugs         │
└─────────────────────────────────────────┘
```

---

## ⛔ P0 - BUGS CRITIQUES (BLOCAGE TOTAL)

### 🔥 BUG-001: Session creation fails - Missing gmId
**Endpoint:** `POST /api/sessions`
**Error:** `null value in column "gm_id" violates not-null constraint`
**Impact:** ❌ US-MJ01 BLOQUÉE (Créer session)
**Fix:** Extraire gmId depuis JWT token dans controller
**Temps:** 2h

---

### 🔥 BUG-002: Session DTO validation mismatch
**Endpoint:** `POST /api/sessions`
**Error:** `property "title" should not exist, "name" must be a string`
**Impact:** ❌ US-MJ01 BLOQUÉE
**Fix:** Standardiser DTO (accepter name + description)
**Temps:** 1h

---

### 🔥 BUG-003: Chapter creation fails - Missing name
**Endpoint:** `POST /api/chapters`
**Error:** `null value in column "name" violates not-null constraint`
**Impact:** ❌ US-MJ07 BLOQUÉE (Créer chapitre)
**Fix:** Renforcer validation DTO + @IsNotEmpty()
**Temps:** 2h

---

### 🔥 BUG-004: Chapter events fail - Missing eventType
**Endpoint:** `POST /api/chapter-events`
**Error:** `null value in column "event_type" violates not-null constraint`
**Impact:** ❌ US-MJ09 BLOQUÉE (Marquer événements)
**Fix:** Ajouter validation @IsNotEmpty() sur eventType
**Temps:** 1h

---

### 🔥 BUG-005: Effects fail - Invalid character foreign key
**Endpoint:** `POST /api/characters/{id}/effects`
**Error:** `violates foreign key constraint "active_effects_character_id_characters_id_fk"`
**Impact:** ⚠️ US-MJ12 DÉGRADÉE (Buffs/debuffs)
**Fix:** Valider existence character avant insert
**Temps:** 2h

---

## ⚠️ P1 - BUGS MAJEURS (UX DÉGRADÉE)

| Bug | Endpoint | Erreur | User Story | Temps Fix |
|-----|----------|--------|------------|-----------|
| **BUG-006** | `POST /api/characters` | Stats validation too strict (max 99) | US-J01 | 1h |
| **BUG-007** | `POST /api/characters` | Rejects "class" field | US-J01 | 1h |
| **BUG-008** | `POST /api/rolls` | diceFormula validation fails | US-J15-J20 | 3h |
| **BUG-009** | `PATCH /api/characters/{id}/notes` | Expects "title" not "notes" | US-J36 | 1h |
| **BUG-010** | `POST /api/chapters` | Invalid sessionId FK | US-MJ07 | 2h |
| **BUG-011** | `POST /api/sanity/conditions` | Missing validation | US-J23 | 2h |
| **BUG-012** | Character form | Occupation field inconsistency | US-J01 | 2h |
| **BUG-013** | Avatar generation | No error handling OpenAI | US-J01 | 3h |

**Total P1:** 15 heures développement

---

## 🐛 P2-P3 - BUGS MINEURS

| Bug | Description | Priorité | Temps Fix |
|-----|-------------|----------|-----------|
| **BUG-014** | HP négatifs autorisés (logique métier manquante) | P3 | 2h |
| **BUG-015** | Sessions: status "archived" non supporté | P3 | 3h |
| **BUG-016** | WebSocket: pas de reconnexion auto | P3 | 2h |
| **BUG-017** | Tests E2E flaky (random names) | P3 | 1h |

**Total P2-P3:** 8 heures développement

---

## 📊 IMPACT USER STORIES

### User Stories BLOQUÉES (7)

```
⛔ US-MJ01: Créer session                → BUG-001, BUG-002
⛔ US-MJ07: Créer chapitre               → BUG-003
⛔ US-MJ09: Marquer événements           → BUG-004
⛔ US-J36:  Notes personnelles           → BUG-009
```

### User Stories DÉGRADÉES (14)

```
⚠️ US-J01:  Créer personnage            → BUG-006, BUG-007, BUG-012
⚠️ US-J15-J20: Système dés              → BUG-008
⚠️ US-MJ12: Appliquer buffs/debuffs     → BUG-005
⚠️ US-J23:  Phobies/Manias              → BUG-011
⚠️ US-J04:  Modifier stats              → BUG-014
```

### User Stories FONCTIONNELLES (54)

```
✅ 72% des user stories fonctionnent correctement
```

---

## 🎯 PLAN DE CORRECTION

### Semaine 1 (5 bugs P0)

**Jour 1-2:**
- [x] BUG-001: Session gmId *(2h)*
- [x] BUG-002: Session DTO *(1h)*
- [x] BUG-003: Chapter name *(2h)*

**Jour 3:**
- [x] BUG-004: Chapter event eventType *(1h)*
- [x] BUG-005: Effects character FK *(2h)*

**Validation:** Tests E2E API doivent passer 100%

---

### Semaine 2 (8 bugs P1)

**Jour 1:**
- [x] BUG-006: Character stats limits *(1h)*
- [x] BUG-007: Class → occupation mapping *(1h)*
- [x] BUG-010: Chapter sessionId validation *(2h)*

**Jour 2:**
- [x] BUG-008: Dice formula formats *(3h)*
- [x] BUG-011: Sanity validation *(2h)*

**Jour 3:**
- [x] BUG-009: Notes update *(1h)*
- [x] BUG-012: Occupation required *(2h)*
- [x] BUG-013: Avatar error handling *(3h)*

**Validation:** Tests Playwright création personnage + session MJ passent

---

### Semaine 3 (4 bugs P2-P3 - Optionnel)

**À prioriser selon feedback utilisateur**

---

## 🛠️ COMMANDES UTILES

### Vérifier Logs Erreurs
```bash
cd /srv/workspace/game-plug
docker logs game-plug-backend --tail 200 2>&1 | grep -i error
```

### Exécuter Tests API
```bash
npx playwright test e2e/07-api-routes.spec.ts
```

### Exécuter Tests Création Personnage
```bash
npx playwright test e2e/02-character-creation.spec.ts
```

### TypeScript Check
```bash
cd apps/backend && npx tsc --noEmit
cd apps/frontend && npx tsc --noEmit
```

### Tests Backend Unitaires
```bash
cd apps/backend && npm test
```

---

## 📋 CHECKLIST VALIDATION

### Pré-Fix
- [ ] Lire BUG REPORT complet (`BUGS_REPORT.md`)
- [ ] Reproduire bug localement
- [ ] Identifier fichiers concernés
- [ ] Analyser logs backend

### Pendant Fix
- [ ] Créer branche `fix/bug-XXX`
- [ ] Modifier DTO/Controller/Service
- [ ] Ajouter validation appropriée
- [ ] TypeScript compile sans erreur

### Post-Fix
- [ ] Test unitaire DTO créé/mis à jour
- [ ] Test E2E API passe
- [ ] Logs backend sans ERROR
- [ ] Commit + push
- [ ] Update ce document (marquer ✅)

---

## 🔗 FICHIERS CLÉS

### Backend DTOs (Validation)
```
/apps/backend/src/modules/sessions/dto/create-session.dto.ts
/apps/backend/src/modules/chapters/dto/create-chapter.dto.ts
/apps/backend/src/modules/chapter-events/dto/create-chapter-event.dto.ts
/apps/backend/src/modules/characters/dto/create-character.dto.ts
/apps/backend/src/modules/dice/dto/roll-dice.dto.ts
/apps/backend/src/modules/sanity/dto/create-sanity-condition.dto.ts
```

### Backend Controllers
```
/apps/backend/src/modules/sessions/sessions.controller.ts
/apps/backend/src/modules/chapters/chapters.controller.ts
/apps/backend/src/modules/characters/characters.controller.ts
/apps/backend/src/modules/effects/effects.controller.ts
```

### Tests
```
/e2e/07-api-routes.spec.ts
/e2e/02-character-creation.spec.ts
```

---

## 📞 SUPPORT

**Documentation Complète:** `/srv/workspace/game-plug/BUGS_REPORT.md`

**User Stories:**
- Joueur: `USER_STORIES_JOUEUR.md`
- MJ: `USER_STORIES_MJ.md`

**Mapping Endpoints:** `FEATURE_ENDPOINT_MAPPING.md`

---

**Créé par:** Claude Code (Sonnet 4.5)
**Dernière mise à jour:** 2026-01-24
**Version:** 1.0
