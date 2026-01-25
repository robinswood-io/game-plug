# ⚠️ SUPPRESSION BACKEND EXPRESS - BLOQUÉE

**Date:** 2026-01-23
**Statut:** ❌ **BLOQUÉ - NE PAS PROCÉDER**
**Raison:** Coverage incomplète (75% seulement)

---

## Résumé Exécutif

L'audit de coverage a révélé que **13 endpoints critiques** (25% du total) ne sont pas implémentés dans le backend NestJS. La suppression du backend Express legacy causerait une **régression fonctionnelle majeure**.

### Métriques
- **Total endpoints Express:** 53
- **Endpoints couverts NestJS:** 40 (75%)
- **Endpoints manquants:** 13 (25%)
- **Coverage requis pour suppression:** 100%

---

## Endpoints Manquants Critiques

### 1. Authentification (1 endpoint)
```
POST /api/auth/logout
```
**Impact:** Session cleanup impossible, risque de sessions zombies
**Priorité:** HAUTE

### 2. Session Join Public (1 endpoint)
```
GET /api/sessions/join/:code
```
**Impact:** Les joueurs ne peuvent pas rejoindre les sessions via code
**Priorité:** CRITIQUE

### 3. Character Management (3 endpoints)
```
DELETE /api/sessions/:sessionId/characters/:characterId
GET /api/sessions/:sessionId/importable-characters
POST /api/sessions/:sessionId/import-character
```
**Impact:**
- GM ne peut pas retirer un personnage d'une session
- Import de personnages entre sessions impossible
**Priorité:** HAUTE

### 4. Skill Points System (2 endpoints)
```
POST /api/characters/:id/skill-points        (GM grant)
POST /api/characters/:id/distribute-points   (Player distribute)
```
**Impact:** Progression de personnage bloquée
**Priorité:** CRITIQUE

### 5. Active Effects System (2 endpoints)
```
POST /api/characters/:id/effects
PATCH /api/effects/:id
```
**Impact:** Système de buffs/debuffs non fonctionnel
**Priorité:** CRITIQUE

### 6. Roll History (1 endpoint)
```
GET /api/sessions/:id/rolls
```
**Impact:** Historique des jets de dés inaccessible
**Priorité:** MOYENNE

### 7. Avatar Generation (3 endpoints)
```
POST /api/characters/:characterId/generate-avatar
POST /api/sessions/:sessionId/generate-all-avatars
POST /api/migrate-avatars
```
**Impact:** Génération d'avatars IA limitée
**Priorité:** MOYENNE (migrate-avatars peut être retiré après migration unique)

---

## Plan d'Action Recommandé

### Phase 1: Implémenter Endpoints Manquants (PRIORITÉ)

#### 1.1 AuthController
- [ ] Ajouter `POST /api/auth/logout`
- [ ] Test: Vérifier destruction session

#### 1.2 SessionsController
- [ ] Ajouter `GET /api/sessions/join/:code` (public endpoint)
- [ ] Test: Rejoindre session avec code valide/invalide

#### 1.3 CharactersController
- [ ] Ajouter `DELETE /api/sessions/:sessionId/characters/:characterId`
- [ ] Ajouter `GET /api/sessions/:sessionId/importable-characters`
- [ ] Ajouter `POST /api/sessions/:sessionId/import-character`
- [ ] Ajouter `POST /api/characters/:id/skill-points`
- [ ] Ajouter `POST /api/characters/:id/distribute-points`
- [ ] Test: Import workflow complet

#### 1.4 EffectsController (NOUVEAU MODULE)
- [ ] Créer `apps/backend/src/modules/effects/`
- [ ] Créer `effects.controller.ts`
- [ ] Créer `effects.service.ts`
- [ ] Créer DTOs (CreateEffectDto, UpdateEffectDto)
- [ ] Ajouter `POST /api/characters/:id/effects`
- [ ] Ajouter `PATCH /api/effects/:id`
- [ ] Test: Apply/update effects

#### 1.5 DiceController
- [ ] Ajouter `GET /api/sessions/:id/rolls`
- [ ] Test: Fetch roll history avec limit

#### 1.6 AiController
- [ ] Ajouter `POST /api/characters/:characterId/generate-avatar`
- [ ] Ajouter `POST /api/sessions/:sessionId/generate-all-avatars`
- [ ] Test: Avatar generation variantes

### Phase 2: Tests Complets
- [ ] Tests unitaires pour chaque nouvel endpoint
- [ ] Tests d'intégration E2E
- [ ] Validation OpenAPI spec
- [ ] Coverage = 100%

### Phase 3: Migration Frontend
- [ ] Mettre à jour client API généré
- [ ] Remplacer appels Express par NestJS
- [ ] Tests frontend E2E

### Phase 4: Suppression Express
- [ ] Re-vérifier coverage = 100%
- [ ] Archiver server/routes.ts
- [ ] Supprimer dépendances Express
- [ ] Tests déploiement

---

## Estimation Temporelle

| Phase | Tâches | Heures |
|-------|--------|--------|
| Phase 1 | Implémenter 13 endpoints | 6-8h |
| Phase 2 | Tests complets | 2-3h |
| Phase 3 | Migration frontend | 1-2h |
| Phase 4 | Cleanup Express | 1h |
| **TOTAL** | | **10-14h** |

---

## Risques si Suppression Immédiate

### Risques CRITIQUES
1. **Authentification cassée** - Logout impossible
2. **Onboarding joueurs bloqué** - Join par code non fonctionnel
3. **Progression personnages bloquée** - Skill points system absent
4. **Combat/gameplay cassé** - Active effects system absent

### Impact Business
- **100% des nouvelles parties** - Impossible de démarrer (join code manquant)
- **100% des parties existantes** - Progression bloquée (skill points)
- **Combats non fonctionnels** - Buffs/debuffs absents

---

## Décision

❌ **SUPPRESSION BLOQUÉE**

Le backend Express legacy **NE DOIT PAS** être supprimé tant que les 13 endpoints manquants ne sont pas implémentés dans NestJS.

**Prochaine étape:** Implémenter les endpoints manquants (Phase 1)

---

## Fichiers de Référence

- Audit complet: `/srv/workspace/game-plug/ENDPOINT_COVERAGE_AUDIT.md`
- Express routes: `/srv/workspace/game-plug/server/routes.ts`
- NestJS OpenAPI: `/srv/workspace/game-plug/apps/backend/openapi.json`

---

**Responsable:** Claude AI Agent
**Approuvé par:** ❌ ATTENTE VALIDATION
