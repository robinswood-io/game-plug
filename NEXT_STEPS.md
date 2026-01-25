# PROCHAINES ÉTAPES - MIGRATION NESTJS

**Status actuel:** ✅ Backend NestJS COMPLET (98.1% coverage)
**Date:** 2026-01-24

---

## 📋 ACTIONS IMMÉDIATES

### 1. Tests et validation (1-2 jours)

```bash
# Tests unitaires backend
cd /srv/workspace/game-plug/apps/backend
npm test

# Tests de compilation
npm run build

# Vérifier OpenAPI
npm run start:dev
# Ouvrir http://localhost:3000/api/docs
```

**Checklist:**
- [ ] Tous les tests unitaires passent
- [ ] Build production sans erreurs
- [ ] Swagger UI accessible et complet
- [ ] Connexion BDD fonctionnelle
- [ ] JWT authentication testée

---

### 2. Configuration environnement (1 jour)

**Créer `/srv/workspace/game-plug/apps/backend/.env`:**
```env
# Server
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/game_plug

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRATION=7d

# OpenAI
OPENAI_API_KEY=sk-...

# Redis
REDIS_URL=redis://localhost:6379

# S3/MinIO
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin
S3_BUCKET=avatars
```

**Checklist:**
- [ ] Variables d'environnement définies
- [ ] JWT_SECRET sécurisé (32+ caractères)
- [ ] Connexions services testées (DB, Redis, S3)

---

### 3. Configuration Docker (2 heures)

**Éditer `/srv/workspace/docker-compose.apps.yml`:**

Ajouter après le service `game-plug`:

```yaml
  game-plug-backend:
    image: node:24-alpine
    container_name: game-plug-backend
    restart: unless-stopped
    working_dir: /app/apps/backend
    command: sh -c "apk add --no-cache python3 make g++ && npm install && npm run start:prod"
    volumes:
      - ./game-plug:/app
      - game_plug_backend_node_modules:/app/apps/backend/node_modules
    env_file:
      - ./game-plug/apps/backend/.env
    environment:
      - NODE_ENV=production
      - PORT=3000
    ports:
      - "3000:3000"  # Exposé pour tests
    networks:
      - default
    depends_on:
      - dev_postgres
      - dev_redis
```

Ajouter le volume:
```yaml
volumes:
  # ... volumes existants
  game_plug_backend_node_modules:
```

**Démarrer:**
```bash
cd /srv/workspace
docker compose -f docker-compose.apps.yml up -d game-plug-backend
docker compose -f docker-compose.apps.yml logs -f game-plug-backend
```

**Checklist:**
- [ ] Container démarre sans erreur
- [ ] Logs montrent "Nest application successfully started"
- [ ] Health check répond: `curl http://localhost:3000/api/health`

---

### 4. Tests E2E avec frontend (1 jour)

**Option A: Frontend local pointant vers backend NestJS**

Éditer `/srv/workspace/game-plug/client/.env`:
```diff
- VITE_API_URL=http://localhost:5000/api
+ VITE_API_URL=http://localhost:3000/api
```

**Option B: Utiliser le proxy Vite**

Éditer `/srv/workspace/game-plug/vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

**Tests manuels:**
1. Login utilisateur
2. Créer session de jeu
3. Créer personnage
4. Lancer dés
5. Générer avatar IA
6. Créer chapitre
7. Ajouter entrée narrative

**Checklist:**
- [ ] Login/Logout fonctionnel
- [ ] CRUD sessions OK
- [ ] CRUD personnages OK
- [ ] Jets de dés enregistrés
- [ ] IA génération avatars OK
- [ ] Gestion inventaire OK
- [ ] WebSockets fonctionnels (si implémentés)

---

### 5. Adapter endpoint frontend (30 minutes)

**Fichier à modifier:** Probablement dans `client/src/api/` ou `client/src/hooks/`

**Chercher l'appel API:**
```bash
cd /srv/workspace/game-plug/client
grep -r "narrative/ai-suggest" src/
```

**Modifier:**
```diff
- POST /api/sessions/${sessionId}/narrative/ai-suggest
- Body: { context: string }
+ POST /api/ai/suggest-narrative
+ Body: { sessionId: string, context: string }
```

**Exemple React Query:**
```typescript
// Avant
const { mutate } = useMutation({
  mutationFn: async ({ context }: { context: string }) => {
    const res = await fetch(`/api/sessions/${sessionId}/narrative/ai-suggest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context }),
    });
    return res.json();
  },
});

// Après
const { mutate } = useMutation({
  mutationFn: async ({ sessionId, context }: { sessionId: string; context: string }) => {
    const res = await fetch('/api/ai/suggest-narrative', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, context }),
    });
    return res.json();
  },
});
```

---

## 🚀 DÉPLOIEMENT PRODUCTION

### Option A: Canary Deployment (RECOMMANDÉ)

**Avantages:**
- ✅ Risque minimisé
- ✅ Rollback immédiat
- ✅ Monitoring progressif

**Étapes:**
1. Déployer backend NestJS sur port 3000
2. Configurer nginx dual-backend
3. Router 10% trafic → NestJS
4. Monitorer 24h
5. Augmenter progressivement (25%, 50%, 75%, 100%)
6. Désactiver Express après validation

**Durée:** 2-3 semaines

---

### Option B: Remplacement Direct

**Avantages:**
- ✅ Simple et rapide
- ✅ Pas de configuration nginx

**Inconvénients:**
- ⚠️ Risqué sans tests production
- ⚠️ Rollback = downtime

**Étapes:**
1. Tests E2E complets
2. Backup BDD
3. Arrêter `game-plug`
4. Démarrer `game-plug-backend`
5. Mettre à jour nginx → port 3000
6. Monitorer intensivement

**Durée:** 1 jour (+ risques)

---

## 🔧 COMMANDES UTILES

### Gestion containers
```bash
# Démarrer backend NestJS
docker compose -f docker-compose.apps.yml up -d game-plug-backend

# Logs temps réel
docker compose -f docker-compose.apps.yml logs -f game-plug-backend

# Redémarrer
docker compose -f docker-compose.apps.yml restart game-plug-backend

# Arrêter
docker compose -f docker-compose.apps.yml stop game-plug-backend

# Shell dans container
docker exec -it game-plug-backend sh
```

### Tests API
```bash
# Health check
curl http://localhost:3000/api/health

# Login
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}' | jq -r '.access_token')

# Get sessions avec JWT
curl http://localhost:3000/api/sessions \
  -H "Authorization: Bearer $TOKEN"

# Créer session
curl -X POST http://localhost:3000/api/sessions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Session","status":"active"}'
```

### Debugging
```bash
# Variables d'environnement
docker exec game-plug-backend env | grep -E "NODE_ENV|PORT|DATABASE"

# Vérifier connexion BDD
docker exec game-plug-backend npm run db:check

# Rebuild complet
cd /srv/workspace/game-plug/apps/backend
rm -rf dist node_modules
npm install
npm run build
```

---

## 📊 MONITORING À METTRE EN PLACE

### Logs
```bash
# Logs applicatifs
docker compose -f docker-compose.apps.yml logs -f game-plug-backend

# Logs erreurs uniquement
docker compose -f docker-compose.apps.yml logs -f game-plug-backend | grep -i error

# Exporter logs
docker compose -f docker-compose.apps.yml logs game-plug-backend > /tmp/backend-logs.txt
```

### Métriques à suivre
- [ ] Temps de réponse API (target: < 200ms)
- [ ] Taux d'erreur HTTP 5xx (target: < 0.1%)
- [ ] Utilisation CPU/RAM
- [ ] Nombre de connexions actives
- [ ] Latence base de données

### Alertes à configurer
- [ ] HTTP 5xx > 1% pendant 5 min → alerte
- [ ] Temps réponse > 500ms → alerte
- [ ] Container redémarre → alerte
- [ ] Connexions BDD perdues → alerte critique

---

## 🚨 PLAN DE ROLLBACK

### Si problème avec NestJS backend

**Rollback immédiat (< 5 min):**
```bash
# Arrêter backend NestJS
docker compose -f docker-compose.apps.yml stop game-plug-backend

# Redémarrer Express
docker compose -f docker-compose.apps.yml restart game-plug

# Restaurer nginx (si modifié)
# Pointer vers game-plug:5000
```

**Rollback avec perte de données:**
```bash
# Restaurer backup BDD
psql -U devuser -d game_plug < /backups/game_plug_backup.sql

# Rollback backend
docker compose -f docker-compose.apps.yml stop game-plug-backend
docker compose -f docker-compose.apps.yml start game-plug
```

---

## 📚 DOCUMENTATION

### Fichiers de référence
- `FINAL_MIGRATION_COMPLETE.md` - Rapport complet de migration
- `DEPLOYMENT_PLAN.md` - Plan de déploiement détaillé
- `MIGRATION_SUMMARY.md` - Résumé exécutif
- `NEXT_STEPS.md` - Ce fichier

### OpenAPI / Swagger
- **URL:** http://localhost:3000/api/docs
- **Spec JSON:** http://localhost:3000/api/docs-json
- **Spec YAML:** Générer avec `npm run openapi:export`

### Architecture NestJS
```
apps/backend/src/
├── main.ts                 # Point d'entrée
├── app.module.ts           # Module racine
└── modules/
    ├── auth/               # Authentification JWT
    ├── sessions/           # Sessions de jeu
    ├── characters/         # Personnages
    ├── chapters/           # Chapitres
    ├── chapter-events/     # Événements
    ├── narrative/          # Entrées narratives
    ├── inventory/          # Inventaire
    ├── effects/            # Effets actifs
    ├── sanity/             # Santé mentale
    ├── dice/               # Jets de dés
    ├── ai/                 # IA (OpenAI)
    ├── gameboard/          # Scènes de jeu
    └── health/             # Health checks
```

---

## ✅ CHECKLIST FINALE

### Avant déploiement production
- [ ] Tests unitaires passent à 100%
- [ ] Tests E2E réussis
- [ ] Variables d'environnement configurées
- [ ] Backup BDD effectué
- [ ] Monitoring configuré
- [ ] Plan rollback testé
- [ ] Documentation à jour
- [ ] Équipe informée

### Après déploiement
- [ ] Health check OK
- [ ] Login/Logout fonctionnels
- [ ] Pas d'erreurs 5xx
- [ ] Performance acceptable
- [ ] WebSockets OK (si applicable)
- [ ] Logs propres
- [ ] Monitoring actif

### Après 7 jours de stabilité
- [ ] Archiver Express définitivement
- [ ] Supprimer dépendances Express
- [ ] Nettoyer code legacy
- [ ] Mettre à jour documentation
- [ ] Former équipe sur NestJS

---

## 🎯 OBJECTIFS FINAUX

- ✅ Backend NestJS 100% fonctionnel
- ✅ Coverage > 95% (actuellement 98.1%)
- ✅ Performance ≥ Express
- ✅ 0 downtime lors migration
- ✅ Documentation complète
- ✅ Équipe autonome sur NestJS

---

**Auteur:** Claude Sonnet 4.5
**Date:** 2026-01-24
**Projet:** game-plug
