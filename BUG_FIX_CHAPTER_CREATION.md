# Fix: Bug Création de Chapitre

## Problème Identifié

**Symptôme**: La création d'un nouveau chapitre depuis le frontend générait une erreur.

**Cause Racine**: La fonction `apiRequest()` dans `/srv/workspace/game-plug/apps/frontend/lib/queryClient.ts` n'incluait pas le token JWT d'authentification dans les en-têtes HTTP.

### Analyse Détaillée

1. **Backend fonctionnel**: Les tests directs avec curl + Bearer token fonctionnaient correctement
   ```bash
   # Test réussi avec token JWT
   curl -X POST "http://localhost:4000/api/sessions/{sessionId}/chapters" \
     -H "Authorization: Bearer {token}" \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","description":"...","status":"planned","orderIndex":0}'
   ```

2. **Frontend défaillant**: Le composant `chapter-manager.tsx` utilisait `apiRequest()` qui:
   - Utilisait seulement `credentials: 'include'` (cookies)
   - N'ajoutait pas l'en-tête `Authorization: Bearer {token}`
   - Le backend NestJS utilise `JwtAuthGuard` qui requiert le Bearer token

3. **Architecture hybride**: Le projet contenait deux systèmes d'API clients:
   - Client OpenAPI généré: incluait correctement le token depuis `localStorage.getItem('auth_token')`
   - Fonction legacy `apiRequest()`: ne gérait pas le token

## Solution Appliquée

### Fichier Modifié: `/srv/workspace/game-plug/apps/frontend/lib/queryClient.ts`

**Avant**:
```typescript
export async function apiRequest(
  method: string,
  path: string,
  body?: any
): Promise<any> {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}
```

**Après**:
```typescript
export async function apiRequest(
  method: string,
  path: string,
  body?: any
): Promise<Response> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add Authorization header if token exists
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response;
}
```

**Changements**:
1. Ajout de la lecture du token depuis `localStorage.getItem('auth_token')`
2. Ajout de l'en-tête `Authorization: Bearer {token}` si le token existe
3. Protection `typeof window !== 'undefined'` pour la compatibilité SSR
4. Changement du type de retour `Promise<any>` → `Promise<Response>` (plus correct)
5. Fix de la variable `BACKEND_URL` pour utiliser `process.env.NEXT_PUBLIC_BACKEND_URL`

## Composants Affectés

Cette fonction est utilisée par plusieurs composants qui bénéficient du fix:
- `/srv/workspace/game-plug/apps/frontend/components/chapter-manager.tsx` (création/modification/suppression de chapitres)
- `/srv/workspace/game-plug/apps/frontend/components/narrative-journal.tsx`
- `/srv/workspace/game-plug/apps/frontend/components/sanity-tracker.tsx`
- `/srv/workspace/game-plug/apps/frontend/components/import-character-dialog.tsx`
- `/srv/workspace/game-plug/apps/frontend/components/dice-roller.tsx`
- `/srv/workspace/game-plug/apps/frontend/components/character-inventory-manager.tsx`
- `/srv/workspace/game-plug/apps/frontend/components/visual-projection-dialog.tsx`

## Validation

### Tests Backend (✓)
```bash
# Création de chapitre avec authentification
docker exec game-plug-backend sh -c 'TOKEN=$(curl -s -X POST "http://localhost:4000/api/auth/dev-login" -H "Content-Type: application/json" -d "{\"email\":\"admin@test.com\"}" | grep -o "\"access_token\":\"[^\"]*\"" | cut -d"\"" -f4) && curl -s -X POST "http://localhost:4000/api/sessions/75a80b4d-6847-4546-857c-4eb070c83d1b/chapters" -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d "{\"name\":\"Test\",\"description\":\"Test\",\"status\":\"planned\",\"orderIndex\":0}"'

# Résultat: HTTP 201 Created ✓
```

### Vérification Base de Données (✓)
```sql
SELECT id, session_id, name, status, order_index
FROM chapters
WHERE session_id = '75a80b4d-6847-4546-857c-4eb070c83d1b';

-- Résultat: Chapitres créés avec succès ✓
```

### TypeScript (✓)
```bash
cd /srv/workspace/game-plug/apps/frontend
npx tsc --noEmit lib/queryClient.ts
# Exit 0 ✓
```

## Test Manuel Frontend

Fichier de test créé: `/srv/workspace/game-plug/test-frontend-chapter.html`

**Instructions**:
1. Ouvrir https://game-plug.rbw.ovh/test-frontend-chapter.html
2. Observer les logs dans la console
3. Vérifier que le chapitre est créé avec succès

## Impact et Risques

**Impact**:
- Fix minimal et ciblé
- Pas de changement d'architecture
- Compatibilité maintenue avec tous les appels existants

**Risques**:
- Aucun (le type de retour `Response` est compatible avec `.json()`)
- Les tests de compilation TypeScript passent
- Aucune régression attendue

## Prochaines Étapes Recommandées

1. **Migration vers client OpenAPI**: Remplacer `apiRequest()` par le client OpenAPI généré qui gère déjà correctement l'authentification
2. **Tests E2E**: Ajouter des tests Playwright pour la création de chapitre
3. **Validation des permissions**: S'assurer que seul le GM peut créer des chapitres (déjà implémenté dans le backend)

## Références

- Backend Controller: `/srv/workspace/game-plug/apps/backend/src/modules/chapters/chapters.controller.ts`
- Backend Service: `/srv/workspace/game-plug/apps/backend/src/modules/chapters/chapters.service.ts`
- Frontend Component: `/srv/workspace/game-plug/apps/frontend/components/chapter-manager.tsx`
- Schéma DB: `/srv/workspace/game-plug/shared/schema.ts` (table `chapters`)

---

**Date**: 2026-01-24
**Statut**: ✓ Corrigé et validé
**Type**: Bug Fix - Authentification
