# CHECKLIST DÉPLOIEMENT CANARY - BACKEND NESTJS

**Projet:** Game-Plug - Call of Cthulhu RPG Platform
**Date:** 2026-01-24
**Type:** Checklist opérationnelle étape par étape

---

## 🎯 INSTRUCTIONS D'UTILISATION

Cette checklist accompagne le déploiement canary du backend NestJS sur 2 semaines (6 phases).

**Format:**
- ✅ Tâche complétée
- ⚠️ Tâche bloquante (stop si échec)
- 🔍 Tâche de validation
- 📝 Tâche de documentation

**Responsabilités:**
- **DevOps:** Configuration infrastructure
- **Backend Dev:** Tests et debugging
- **QA:** Validation fonctionnelle
- **On-Call:** Monitoring et incidents

---

## PHASE 0: PRÉPARATION INFRASTRUCTURE (J-7 à J-1)

### J-7: Configuration Docker & Traefik

#### Infrastructure (DevOps)

- [ ] ⚠️ **Backup BDD avant migration**
  ```bash
  docker exec dev_postgres pg_dump -U devuser game_plug > /srv/workspace/backups/game-plug/db-backup-$(date +%Y%m%d).sql
  # Vérifier taille: ls -lh /srv/workspace/backups/game-plug/
  ```

- [ ] ⚠️ **Créer service `game-plug-backend` dans docker-compose.apps.yml**
  - Copier configuration depuis `CANARY_DEPLOYMENT_PLAN.md` section "Configuration Docker Finale"
  - Port: 4000
  - Working dir: `/app/apps/backend`
  - Command: `npm install && npm run build && npm run start:prod`

- [ ] **Créer volume isolé `game_plug_backend_node_modules`**
  ```yaml
  volumes:
    game_plug_backend_node_modules:
      name: apps_game_plug_backend_node_modules
  ```

- [ ] **Configurer Traefik weighted routing (Phase 1: 10%)**
  ```yaml
  # game-plug-backend labels:
  - "traefik.http.services.game-plug-backend-svc.loadbalancer.server.weight=10"

  # game-plug (Express) labels:
  - "traefik.http.services.game-plug-express-svc.loadbalancer.server.weight=90"
  ```

- [ ] **Configurer health checks Traefik**
  ```yaml
  - "traefik.http.services.game-plug-backend-svc.loadbalancer.healthcheck.path=/api/health"
  - "traefik.http.services.game-plug-backend-svc.loadbalancer.healthcheck.interval=10s"
  ```

#### Variables d'environnement (Backend Dev)

- [ ] ⚠️ **Vérifier `.env` production dans `/srv/workspace/game-plug/.env`**
  - `NODE_ENV=production`
  - `PORT=4000`
  - `DATABASE_URL` (dev_postgres)
  - `REDIS_URL` (dev_redis)
  - `JWT_SECRET` (généré sécurisé)
  - `OPENAI_API_KEY` (valide)
  - `S3_ENDPOINT` (dev_minio)

- [ ] **Tester variables d'environnement localement**
  ```bash
  cd /srv/workspace/game-plug/apps/backend
  source ../../.env
  echo $DATABASE_URL  # Vérifier valeurs
  ```

---

### J-5: Tests Backend NestJS

#### Tests Unitaires (Backend Dev)

- [ ] ⚠️ **Lancer tests unitaires (≥ 50% coverage)**
  ```bash
  cd /srv/workspace/game-plug/apps/backend
  npm test
  # Vérifier: Tests passed
  ```

- [ ] **Vérifier coverage si disponible**
  ```bash
  npm run test:cov
  # Target: ≥ 50% statements
  ```

- [ ] 🔍 **Compilation TypeScript sans erreurs**
  ```bash
  npm run build
  # Doit afficher: "Nest CLI build successful"
  # Vérifier: dist/ contient fichiers compilés
  ```

#### Connexions Services (Backend Dev)

- [ ] ⚠️ **Tester connexion PostgreSQL**
  ```bash
  docker exec dev_postgres psql -U devuser -d game_plug -c "\dt"
  # Lister tables: users, sessions, characters, etc.
  ```

- [ ] ⚠️ **Tester connexion Redis**
  ```bash
  docker exec dev_redis redis-cli -a redis_dev_password PING
  # → PONG
  ```

- [ ] **Tester connexion MinIO (S3)**
  ```bash
  curl -I http://localhost:9000/minio/health/live
  # → HTTP 200 OK
  ```

#### Tests API Manuels (Backend Dev)

- [ ] 🔍 **Health check endpoint**
  ```bash
  # Démarrer backend localement
  cd /srv/workspace/game-plug/apps/backend
  npm run start:dev

  # Tester (terminal séparé)
  curl http://localhost:4000/api/health
  # → {"status":"ok","timestamp":"..."}
  ```

- [ ] **Endpoint auth login**
  ```bash
  curl -X POST http://localhost:4000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test123"}'
  # → {"access_token":"eyJ..."}
  ```

- [ ] **Endpoint sessions list**
  ```bash
  curl http://localhost:4000/api/sessions \
    -H "Authorization: Bearer <JWT_TOKEN>"
  # → [{"id":"...","title":"..."}]
  ```

- [ ] **OpenAPI documentation accessible**
  ```bash
  curl http://localhost:4000/api/docs
  # → Swagger UI HTML
  ```

---

### J-3: Tests E2E & Frontend

#### Tests Playwright (QA)

- [ ] ⚠️ **Configurer tests E2E vers backend NestJS**
  ```bash
  # Modifier playwright.config.ts
  # VITE_API_URL=http://localhost:4000

  cd /srv/workspace/game-plug
  npm run test:e2e
  # Vérifier: Tests passed
  ```

- [ ] 🔍 **Tests critiques passent:**
  - [ ] Login utilisateur
  - [ ] Créer session
  - [ ] Rejoindre session
  - [ ] Créer personnage
  - [ ] Lancer dés
  - [ ] Générer avatar IA

#### Adaptation Frontend (Backend Dev)

- [ ] **Adapter endpoint AI suggest narrative (si besoin)**
  ```diff
  # apps/frontend/src/api/ai.ts
  - POST /api/sessions/${sessionId}/narrative/ai-suggest
  + POST /api/ai/suggest-narrative
    Body: { sessionId, context }
  ```

- [ ] **Vérifier variables d'environnement frontend**
  ```bash
  # apps/frontend/.env.production
  VITE_API_URL=http://localhost:4000  # Localhost pour tests
  # En production: https://game-plug.rbw.ovh
  ```

- [ ] **Build frontend avec nouvelle API**
  ```bash
  cd /srv/workspace/game-plug/apps/frontend
  npm run build
  # Vérifier: dist/ créé sans erreurs
  ```

---

### J-1: Déploiement Backend NestJS (weight=0)

#### Build & Deploy (DevOps)

- [ ] ⚠️ **Build production backend**
  ```bash
  cd /srv/workspace/game-plug/apps/backend
  npm install --production
  npm run build
  # Vérifier: dist/ contient main.js
  ```

- [ ] ⚠️ **Démarrer service game-plug-backend (weight=0)**
  ```bash
  cd /srv/workspace
  docker compose -f docker-compose.apps.yml up -d game-plug-backend

  # Vérifier container running
  docker ps | grep game-plug-backend
  # → UP (healthy)
  ```

- [ ] 🔍 **Attendre health check OK (60s)**
  ```bash
  # Vérifier logs startup
  docker compose -f docker-compose.apps.yml logs -f game-plug-backend
  # → "Nest application successfully started"

  # Vérifier health check
  curl http://localhost:4000/api/health
  # → {"status":"ok"}
  ```

- [ ] **Vérifier aucun trafic routé (weight=0)**
  ```bash
  for i in {1..20}; do
    curl -s https://game-plug.rbw.ovh/api/health
  done | grep -c "nestjs"
  # → 0 (tout va vers Express)
  ```

#### Monitoring Setup (DevOps)

- [ ] **Créer dashboard monitoring (voir MONITORING_DASHBOARD.md)**
  - Panel latence
  - Panel taux erreurs
  - Panel ressources CPU/Memory
  - Panel distribution trafic

- [ ] **Configurer alertes (Slack/Email)**
  - Alert taux erreur 5xx > 1%
  - Alert memory usage > 1.5GB
  - Alert container restart

- [ ] **Tester script monitoring automatisé**
  ```bash
  bash /srv/workspace/scripts/monitor-canary.sh
  # Vérifier output toutes les 30s
  ```

#### Documentation (Backend Dev)

- [ ] 📝 **Documenter architecture déployée**
  - Services actifs (Express + NestJS)
  - Ports (Express: 5000, NestJS: 4000)
  - URLs (https://game-plug.rbw.ovh)

- [ ] 📝 **Briefer équipe on-call**
  - Plan déploiement (6 phases)
  - Procédure rollback (< 5 min)
  - Contacts urgence

---

## PHASE 1: CANARY 10% (J0 - J+2)

### J0 - Matin (08:00): Activation 10%

#### Déploiement (DevOps)

- [ ] ⚠️ **Modifier weights Traefik (10% NestJS)**
  ```bash
  cd /srv/workspace
  vim docker-compose.apps.yml

  # game-plug-backend weight: 10
  # game-plug weight: 90

  docker compose -f docker-compose.apps.yml up -d game-plug game-plug-backend
  ```

- [ ] 🔍 **Vérifier distribution trafic**
  ```bash
  for i in {1..100}; do
    curl -s https://game-plug.rbw.ovh/api/health
    sleep 0.1
  done | grep -c "nestjs"
  # → ~10
  ```

#### Monitoring Immédiat (DevOps + Backend Dev)

- [ ] **Vérifier logs NestJS (0 erreurs)**
  ```bash
  docker compose -f docker-compose.apps.yml logs -f game-plug-backend --tail=100
  # Attendre 5 min, surveiller erreurs
  ```

- [ ] **Vérifier métriques baseline (08:15)**
  ```bash
  docker stats game-plug-backend --no-stream
  # CPU: ~20-40%, Memory: ~500-800MB
  ```

- [ ] **Vérifier taux erreur < 0.1%**
  ```bash
  docker logs traefik --tail=500 | grep game-plug | awk '{
    total++
    if ($0 ~ /5[0-9]{2}/) errors++
  }
  END {printf "Error rate: %.2f%%\n", (errors/total)*100}'
  # → < 0.1%
  ```

---

### J0 - Midi (12:00): Review 4h

#### Métriques (QA)

- [ ] 🔍 **Latence p95 ≤ Express baseline + 20%**
  ```bash
  # Comparer logs Traefik Express vs NestJS
  # Baseline Express: ~150ms
  # Target NestJS: ≤ 180ms
  ```

- [ ] 🔍 **Throughput stable (≥ baseline)**
  ```bash
  # Vérifier RPS
  docker logs traefik --since 1h | grep game-plug | wc -l | awk '{print $1/3600 " req/s"}'
  # → ≥ 20 req/s (baseline)
  ```

- [ ] 🔍 **Connexions BDD ≤ 20**
  ```bash
  docker exec dev_postgres psql -U devuser -d game_plug -c "
  SELECT COUNT(*) FROM pg_stat_activity WHERE application_name LIKE '%nest%';"
  # → 5-15 connexions
  ```

#### Tests Fonctionnels (QA)

- [ ] **Scénario utilisateur complet:**
  - [ ] Login
  - [ ] Créer session
  - [ ] Créer personnage
  - [ ] Lancer dés
  - [ ] Générer avatar IA

- [ ] **Aucune erreur utilisateur visible**
  - Pas de 502 Bad Gateway
  - Pas de timeout
  - Données cohérentes

---

### J0 - Soir (18:00): Review 10h

#### Validation GO/NO-GO Phase 2 (DevOps + Backend Dev)

- [ ] ✅ **Taux erreur 5xx < 0.1%** (10h consécutives)
- [ ] ✅ **Latence p95 ≤ Express + 20%** (10h consécutives)
- [ ] ✅ **0 crashs container** (uptime stable)
- [ ] ✅ **Memory stable** (pas de leak, < 1GB)
- [ ] ✅ **Métriques business stables** (sessions, users)

#### Actions

- [ ] **Si tous ✅ → Planifier Phase 2 (J+3)**
  ```bash
  # Programmer changement weight 10% → 25%
  ```

- [ ] **Si échec → ROLLBACK** (voir ROLLBACK_PROCEDURE.md)
  ```bash
  # Passer weight NestJS à 0
  # Investiguer logs
  ```

---

### J+1 et J+2: Monitoring Continu

#### Quotidien (Matin 09:00)

- [ ] **Vérifier uptime services**
  ```bash
  docker ps | grep game-plug
  # → game-plug UP, game-plug-backend UP
  ```

- [ ] **Vérifier logs erreurs 24h**
  ```bash
  docker logs game-plug-backend --since 24h | grep -i "error\|fatal" | wc -l
  # → < 10 erreurs non critiques
  ```

- [ ] **Vérifier métriques ressources**
  ```bash
  docker stats game-plug-backend --no-stream
  ```

#### Quotidien (Soir 18:00)

- [ ] **Vérifier métriques business**
  ```bash
  # Sessions créées aujourd'hui
  docker exec dev_postgres psql -U devuser -d game_plug -c "
  SELECT COUNT(*) FROM sessions WHERE created_at > CURRENT_DATE;"
  # → ≥ 50 (baseline)
  ```

- [ ] **Update dashboard monitoring**
  - Capturer screenshots métriques
  - Documenter anomalies (si any)

---

## PHASE 2: CANARY 25% (J+3 - J+5)

### J+3 - Matin (08:00): Activation 25%

#### Déploiement (DevOps)

- [ ] ⚠️ **Modifier weights (25% NestJS)**
  ```bash
  vim docker-compose.apps.yml
  # game-plug-backend weight: 25
  # game-plug weight: 75
  docker compose -f docker-compose.apps.yml up -d game-plug game-plug-backend
  ```

- [ ] 🔍 **Vérifier distribution (sur 100 requêtes)**
  ```bash
  for i in {1..100}; do curl -s https://game-plug.rbw.ovh/api/health; done | grep -c "nestjs"
  # → ~25
  ```

#### Tests de Charge (QA)

- [ ] **Lancer tests charge moyenne (2x baseline)**
  ```bash
  ab -n 5000 -c 25 https://game-plug.rbw.ovh/api/sessions
  # Vérifier: Failed requests: 0
  # Vérifier: Requests per second ≥ baseline
  ```

- [ ] **Monitorer ressources pendant charge**
  ```bash
  docker stats game-plug-backend --no-stream
  # CPU: ≤ 80%, Memory: ≤ 1.5GB
  ```

---

### J+3 à J+5: Monitoring Intensif

#### Toutes les 4h (DevOps)

- [ ] **Vérifier métriques clés:**
  - Latence p95
  - Taux erreur 5xx
  - CPU/Memory usage
  - Throughput RPS

- [ ] **Vérifier aucune dégradation > 10%**

#### Validation GO/NO-GO Phase 3 (J+5 Soir)

- [ ] ✅ **Métriques Phase 1 maintenues** (48h)
- [ ] ✅ **Tests charge OK** (throughput ≥ baseline)
- [ ] ✅ **0 incidents critiques**

---

## PHASE 3: CANARY 50% (J+6 - J+8)

### J+6 - Matin (08:00): Activation 50%

#### Déploiement (DevOps)

- [ ] ⚠️ **Modifier weights (50/50)**
  ```bash
  vim docker-compose.apps.yml
  # game-plug-backend weight: 50
  # game-plug weight: 50
  docker compose -f docker-compose.apps.yml up -d game-plug game-plug-backend
  ```

- [ ] 🔍 **Vérifier distribution équilibrée**
  ```bash
  for i in {1..100}; do curl -s https://game-plug.rbw.ovh/api/health; done | grep -c "nestjs"
  # → ~50
  ```

#### Test Résilience (DevOps + QA)

- [ ] **Simuler restart backend (failover)**
  ```bash
  # Générer trafic continu (terminal 1)
  while true; do curl -s https://game-plug.rbw.ovh/api/health; sleep 0.5; done

  # Restart backend (terminal 2)
  docker compose -f docker-compose.apps.yml restart game-plug-backend

  # Vérifier aucune erreur 502 dans terminal 1
  # Traefik doit router vers Express automatiquement
  ```

- [ ] **Vérifier temps restart < 10s**
  ```bash
  docker logs game-plug-backend | grep "Nest application successfully started"
  # Timestamp < 10s après restart
  ```

---

### J+6 à J+8: Tests Fonctionnels Complets

#### Suite E2E Complète (QA)

- [ ] ⚠️ **Lancer Playwright full suite**
  ```bash
  cd /srv/workspace/game-plug
  npm run test:e2e
  # Vérifier: 100% tests passed
  ```

- [ ] **Tests régression:**
  - [ ] Auth (login, register, logout)
  - [ ] Sessions (create, join, leave, delete)
  - [ ] Characters (create, update, delete)
  - [ ] Dice rolls (standard, advantage, disadvantage)
  - [ ] AI features (avatar, narrative)
  - [ ] Inventory (add, remove, update items)

#### Validation GO/NO-GO Phase 4 (J+8 Soir)

- [ ] ✅ **Failover automatique testé**
- [ ] ✅ **Suite E2E 100% passed**
- [ ] ✅ **Métriques stables 48h**

---

## PHASE 4: CANARY 75% (J+9 - J+11)

### J+9 - Matin (08:00): Activation 75%

#### Déploiement (DevOps)

- [ ] ⚠️ **Modifier weights (75% NestJS)**
  ```bash
  vim docker-compose.apps.yml
  # game-plug-backend weight: 75
  # game-plug weight: 25
  docker compose -f docker-compose.apps.yml up -d game-plug game-plug-backend
  ```

- [ ] 🔍 **Vérifier majorité trafic NestJS**
  ```bash
  for i in {1..100}; do curl -s https://game-plug.rbw.ovh/api/health; done | grep -c "nestjs"
  # → ~75
  ```

#### Monitoring Production-Ready (DevOps)

- [ ] **Vérifier métriques business:**
  - Sessions créées/jour ≥ baseline
  - Utilisateurs actifs ≥ baseline
  - Taux connexion réussie ≥ 99%

- [ ] **Analyser logs utilisateurs (feedback)**
  - Aucune plainte erreur
  - Performance satisfaisante

---

### J+9 à J+11: Validation Finale

#### Tests de Stress (QA)

- [ ] **Charge haute (stress test)**
  ```bash
  ab -n 10000 -c 50 https://game-plug.rbw.ovh/api/sessions
  # Vérifier: Aucun timeout, erreurs < 1%
  ```

- [ ] **Monitoring 24h continu**
  ```bash
  # Lancer script monitoring
  screen -dmS monitor bash /srv/workspace/scripts/monitor-canary.sh
  # Vérifier logs après 24h
  ```

#### Validation GO/NO-GO Phase 5 (J+11 Soir)

- [ ] ✅ **Métriques business ≥ baseline** (48h)
- [ ] ✅ **Tests stress OK**
- [ ] ✅ **Aucune régression fonctionnelle**
- [ ] ✅ **Équipe consensus GO production**

---

## PHASE 5: FULL PRODUCTION 100% (J+12)

### J+12 - Matin (08:00): Bascule Complète

#### Déploiement Final (DevOps)

- [ ] ⚠️ **Modifier weights (100% NestJS)**
  ```bash
  vim docker-compose.apps.yml
  # game-plug-backend weight: 100
  # game-plug weight: 0  # Backup
  docker compose -f docker-compose.apps.yml up -d game-plug game-plug-backend
  ```

- [ ] 🔍 **Vérifier 100% trafic NestJS**
  ```bash
  for i in {1..100}; do
    curl -s https://game-plug.rbw.ovh/api/health
  done | grep -c "nestjs"
  # → 100
  ```

- [ ] **Vérifier Express en backup (stoppé ou weight=0)**
  ```bash
  docker ps | grep "game-plug " | grep -v backend
  # → Peut être UP (backup) ou stoppé
  ```

#### Monitoring Intensif 24h (DevOps + On-Call)

- [ ] **Logs temps réel (08:00 - 18:00)**
  ```bash
  docker compose -f docker-compose.apps.yml logs -f game-plug-backend
  # Surveiller erreurs
  ```

- [ ] **Dashboard métriques (toutes les heures)**
  - Latence p95
  - Taux erreur 5xx
  - CPU/Memory
  - Throughput

- [ ] **Tests API critiques (toutes les 2h)**
  ```bash
  # Login
  curl -X POST https://game-plug.rbw.ovh/api/auth/login -d '...'

  # Sessions
  curl https://game-plug.rbw.ovh/api/sessions -H "Authorization: ..."

  # Health
  curl https://game-plug.rbw.ovh/api/health
  ```

---

### J+12 - Soir (20:00): Review 12h

#### Validation (DevOps + Backend Dev + QA)

- [ ] ✅ **0 incidents majeurs** (12h production)
- [ ] ✅ **Métriques stables**
- [ ] ✅ **Aucune plainte utilisateur**
- [ ] ✅ **Tests API manuels OK**

#### Actions

- [ ] **Si OK → Continuer monitoring 7 jours**
- [ ] **Si problème → ROLLBACK urgence** (< 5 min)

---

### J+13 à J+19: Monitoring Léger

#### Quotidien (09:00)

- [ ] **Vérifier uptime NestJS**
  ```bash
  docker ps | grep game-plug-backend
  # → UP (healthy)
  ```

- [ ] **Vérifier logs erreurs**
  ```bash
  docker logs game-plug-backend --since 24h | grep -i "error\|fatal" | wc -l
  # → < 5
  ```

#### Hebdomadaire (Vendredi)

- [ ] **Review métriques semaine**
  - Latence moyenne
  - Taux erreur moyen
  - Uptime %
  - Incidents count

---

## PHASE 6: CLEANUP (J+13 - J+19)

### J+16: Archivage Express

#### Archivage Code (Backend Dev)

- [ ] 📝 **Archiver serveur Express**
  ```bash
  cd /srv/workspace/game-plug
  tar -czf server-express-backup-$(date +%Y%m%d).tar.gz server/
  mv server-express-backup-*.tar.gz /srv/workspace/backups/game-plug/
  ```

- [ ] 📝 **Déplacer vers archive finale**
  ```bash
  # Déjà fait: server-legacy-archive-final/
  # Vérifier présence fichiers
  ls -la server-legacy-archive-final/
  ```

---

### J+17: Suppression Service Express

#### Cleanup Docker (DevOps)

- [ ] **Stopper container Express**
  ```bash
  docker compose -f docker-compose.apps.yml stop game-plug
  ```

- [ ] **Supprimer service du docker-compose.apps.yml**
  ```bash
  vim docker-compose.apps.yml
  # Supprimer section complète service "game-plug"
  ```

- [ ] **Supprimer volume Express**
  ```bash
  docker volume rm apps_game_plug_node_modules
  ```

- [ ] **Nettoyer images orphelines**
  ```bash
  docker image prune -a --filter "label=project=game-plug"
  ```

---

### J+18: Validation Finale

#### Tests Production (QA)

- [ ] ⚠️ **Suite E2E complète (dernière fois)**
  ```bash
  cd /srv/workspace/game-plug
  npm run test:e2e
  # → 100% passed
  ```

- [ ] **Tests API production**
  ```bash
  curl https://game-plug.rbw.ovh/api/health
  # → NestJS health check OK
  ```

- [ ] **Vérifier OpenAPI docs publiques**
  ```bash
  curl https://game-plug.rbw.ovh/api/docs
  # → Swagger UI accessible
  ```

---

### J+19: Documentation & Post-Mortem

#### Documentation Finale (Backend Dev + DevOps)

- [ ] 📝 **Créer migration report final**
  ```markdown
  # MIGRATION_REPORT_FINAL.md

  ## Timeline
  - J-7: Préparation
  - J0-J+2: Canary 10%
  - J+3-J+5: Canary 25%
  - J+6-J+8: Canary 50%
  - J+9-J+11: Canary 75%
  - J+12: Full 100%
  - J+13-J+19: Monitoring + Cleanup

  ## Métriques Finales
  - Latence moyenne: [X ms]
  - Taux erreur: [X%]
  - Uptime: [X%]
  - Incidents: [X]

  ## Lessons Learned
  - [Points positifs]
  - [Points d'amélioration]
  - [Recommandations futures]
  ```

- [ ] 📝 **Mettre à jour ARCHITECTURE.md**
  - Backend: NestJS uniquement
  - Supprimer références Express

- [ ] 📝 **Mettre à jour README.md**
  - Commandes démarrage NestJS
  - Supprimer anciennes commandes Express

#### Post-Mortem Meeting (Toute l'équipe)

- [ ] **Organiser réunion 1h (tous participants)**
  - DevOps Lead
  - Backend Dev
  - QA Tester
  - On-Call

- [ ] **Agenda:**
  - Review timeline (respectée?)
  - Incidents rencontrés (si any)
  - Métriques finales vs objectifs
  - Retours équipe
  - Améliorations process déploiement

- [ ] 📝 **Documenter lessons learned**
  - Ce qui a bien fonctionné
  - Ce qui pourrait être amélioré
  - Recommandations prochaines migrations

---

## 🚨 PROCÉDURES D'URGENCE

### En cas de problème critique à TOUT moment

1. **STOP déploiement immédiatement**
2. **Exécuter ROLLBACK** (voir `ROLLBACK_PROCEDURE.md`)
3. **Capturer logs** (dump complet)
4. **Notifier équipe** (Slack/Email)
5. **Analyser root cause**
6. **Décider GO/NO-GO continuer migration**

### Contacts Urgence

| Rôle | Contact | Disponibilité |
|------|---------|---------------|
| DevOps Lead | [À définir] | 9h-18h (J0-J+12) |
| Backend Dev | [À définir] | On-call (J0-J+5) |
| On-Call | [Rotation] | 24/7 (J0-J+19) |

---

## 📊 MÉTRIQUES DE SUCCÈS

### Objectifs Finaux (J+19)

- [ ] ✅ **Uptime ≥ 99.9%** (migration complète)
- [ ] ✅ **Latence p95 ≤ Express baseline + 10%**
- [ ] ✅ **Taux erreur 5xx < 0.05%**
- [ ] ✅ **0 perte données**
- [ ] ✅ **0 incidents critiques**
- [ ] ✅ **Métriques business ≥ baseline**
- [ ] ✅ **Migration terminée en ≤ 20 jours**

### KPIs Migration

| KPI | Target | Résultat |
|-----|--------|----------|
| **Durée totale** | ≤ 20 jours | [À remplir] |
| **Downtime total** | < 5 minutes | [À remplir] |
| **Incidents majeurs** | 0 | [À remplir] |
| **Rollbacks** | 0 | [À remplir] |
| **Latence finale** | ≤ Express + 10% | [À remplir] |
| **Taux erreur final** | < 0.05% | [À remplir] |

---

## ✅ VALIDATION COMPLÈTE

**La migration est RÉUSSIE si:**

1. ✅ Backend NestJS 100% production stable 7+ jours
2. ✅ Express complètement désactivé et archivé
3. ✅ Tous tests E2E passent
4. ✅ Métriques ≥ baseline Express
5. ✅ Aucun incident critique
6. ✅ Documentation à jour
7. ✅ Équipe formée nouveaux outils

**Date signature migration complète:** _______________

**Signatures:**
- DevOps Lead: _______________
- Backend Dev: _______________
- QA Lead: _______________

---

**Auteur:** Claude Sonnet 4.5
**Date:** 2026-01-24
**Version:** 1.0
**Projet:** game-plug - Call of Cthulhu RPG Platform
