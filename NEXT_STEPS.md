# Prochaines Étapes - Migration Gameboard

## À Faire Immédiatement

### 1. Tester la Route (5 min)
```bash
cd /opt/workspace/game-plug/app
npm run dev
# Naviguer vers: http://localhost:3004/gm/test-session-id/gameboard
```

Attendre le message:
```
✓ Ready in X.Xs
- Local: http://localhost:3004
```

Vérifier que:
- La page charge (HTML retourné)
- Pas d'erreurs TypeScript
- "Session introuvable" s'affiche (car session test n'existe pas)

### 2. Mettre à Jour la Navigation (15 min)

Trouver tous les endroits pointant vers gameboard:

```bash
grep -r "gameboard" /opt/workspace/game-plug/app --include="*.tsx" --include="*.ts"
```

Remplacer les chemins:
```diff
# Avant
- href="/gameboard"
- navigate("/gameboard")
- <Link to="/gameboard">

# Après
+ href={`/gm/${sessionId}/gameboard`}
+ router.push(`/gm/${sessionId}/gameboard`)
+ <Link href={`/gm/${sessionId}/gameboard`}>
```

**Fichiers probables à mettre à jour:**
- `/app/app/(authenticated)/session/[sessionId]/page.tsx` - Bouton "Play"
- `/app/app/(authenticated)/page.tsx` - Navigation sessions
- Composants avec liens gameboard

### 3. Test Complet (30 min)

1. **Créer une session de test:**
   ```bash
   curl -X POST http://localhost:8000/api/sessions \
     -H "Content-Type: application/json" \
     -d '{"name":"Test Session","gmId":"gm-1"}'
   # Récupérer le sessionId
   ```

2. **Accéder à gameboard:**
   - Naviguer vers `/gm/{sessionId}/gameboard`
   - Vérifier affichage liste personnages
   - Vérifier WebSocket connection (onglet Network → WS)

3. **Tester fonctionnalités:**
   - [ ] Afficher image projection
   - [ ] Plein écran (F11 ou bouton)
   - [ ] Toggle sidebar
   - [ ] WebSocket messages en temps réel
   - [ ] Responsive sur mobile

4. **Performance:**
   ```bash
   npm run dev -- --turbopack  # Pour tester avec Turbopack
   # Mesurer temps chargement
   ```

## Phase d'Intégration

### 4. Nettoyer l'Ancienne Route (Vite)

Une fois validé en staging, supprimer:
```bash
rm /opt/workspace/game-plug/client/src/pages/gameboard.tsx
```

Supprimer les imports:
```bash
grep -r "gameboard" /opt/workspace/game-plug/client --include="*.tsx"
# Vérifier aucune référence restante
```

### 5. Build Production

```bash
cd /opt/workspace/game-plug/app

# Vérifier TypeScript strictement
npx tsc --noEmit

# Build production
npm run build

# Vérifier output
ls -lah .next/

# Tester en production mode
npm run start
# Accéder à http://localhost:3000/gm/{sessionId}/gameboard
```

### 6. Déploiement

Suivre la procédure standard:

```bash
# Dans /opt/workspace/game-plug/
docker-compose build app

# Redémarrer containers
docker-compose up -d app

# Vérifier logs
docker logs game-plug-app -f
```

Vérifier:
- Container en état `running`
- Logs sans erreurs
- Route accessible via reverse proxy

## Fichiers À Mettre à Jour

### Routes/Navigation
- [ ] `/app/app/page.tsx` - Page d'accueil
- [ ] `/app/app/(authenticated)/page.tsx` - Tableau de bord
- [ ] `/app/app/(authenticated)/session/[sessionId]/page.tsx` - Page session
- [ ] Tous les liens vers "/gameboard"

### Documentation
- [ ] README.md - Section "Routes disponibles"
- [ ] CONTRIBUTING.md - Guide pour nouvelle page
- [ ] Architecture diagram si existe

### Tests
- [ ] E2E tests (Cypress/Playwright) si existent
- [ ] Tests d'intégration

## Validations Finales

### Checklist Avant Merge
- [ ] Route `/gm/[sessionId]/gameboard` fonctionne
- [ ] WebSocket connection établie
- [ ] Images DALL-E affichées
- [ ] Plein écran mode opérationnel
- [ ] Responsive design testé
- [ ] Performance acceptable (< 3s load)
- [ ] Aucune erreur console
- [ ] TypeScript strict compile
- [ ] Tous les tests passent
- [ ] Documentation mise à jour

### Performance Benchmarks
Avant migration:
```
Build time: 2.3s (Vite)
Dev startup: 3.2s
Page load: 800ms
```

Après migration (attendu):
```
Build time: 8-15s (Next.js full build)
Dev startup: 5.8s (observé)
Page load: 600-900ms
```

## Commandes Utiles

```bash
# Dev avec sourcemaps
cd /opt/workspace/game-plug/app && npm run dev

# Vérifier TypeScript
npx tsc --noEmit

# Vérifier imports
grep -r "from .*/gameboard" /opt/workspace/game-plug/app

# Test route directement
curl -s http://localhost:3004/gm/test-id/gameboard | grep -o '<title>.*</title>'

# Vérifier fichier créé
stat /opt/workspace/game-plug/app/app/'(public)'/gm/'[sessionId]'/gameboard/page.tsx
```

## Timeline Proposée

| Phase | Durée | Dates | Status |
|-------|-------|-------|--------|
| 1. Validation locale | 1h | 29 déc | 🟢 Done |
| 2. Tests staging | 4-8h | 29-30 déc | 🟡 Pending |
| 3. Mise à jour nav | 2h | 30 déc | 🔴 TODO |
| 4. Nettoyage Vite | 1h | 30 déc | 🔴 TODO |
| 5. Build prod | 1h | 30-31 déc | 🔴 TODO |
| 6. Déploiement | 30min | 31 déc | 🔴 TODO |

## Contacts & Escalade

En cas de problème:

1. **TypeScript errors:** Vérifier types dans `/app/hooks/useWebSocket.ts`
2. **WebSocket not connecting:** Vérifier `/game-ws` backend endpoint
3. **Images not loading:** Vérifier S3/GCS credentials
4. **Performance issues:** Profiler avec Chrome DevTools → Performance tab

## Rollback Plan

Si problèmes en prod:

```bash
# Revert à commit avant migration
git revert <commit-hash>

# Rebuild et redéployer Vite client
cd /opt/workspace/game-plug/client
npm run build
docker-compose up -d client

# Vérifier
curl http://localhost:3000/gameboard  # Vite path
```

---

**Start migration testing:** When ready (staging environment available)
**Estimated completion:** 48-72 hours
**Risk level:** Low (isolated route, no API changes)
