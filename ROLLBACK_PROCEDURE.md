# PROCÉDURE DE ROLLBACK - BACKEND NESTJS

**Projet:** Game-Plug - Call of Cthulhu RPG Platform
**Date:** 2026-01-24
**Criticité:** HAUTE - Procédure d'urgence

---

## 🚨 OVERVIEW

Ce document décrit les procédures de rollback pour chaque phase du déploiement canary, avec temps de rétablissement estimés et commandes exactes à exécuter.

**Principe:** Toujours pouvoir revenir à l'état stable Express en moins de 5 minutes.

---

## 🎯 TRIGGERS DE ROLLBACK

### Automatiques (monitoring alerts)

**ROLLBACK IMMÉDIAT si:**
- ✋ **Taux erreur 5xx > 1%** pendant 5 minutes consécutives
- ✋ **Memory usage > 2.5GB** ou événement OOM kill détecté
- ✋ **Container restarts > 3** en moins de 1 heure
- ✋ **Latence p95 > Express baseline + 100%** pendant 10 minutes
- ✋ **Health check échoue** 3 fois consécutives (30s)

### Manuels (décision humaine)

**ROLLBACK PLANIFIÉ si:**
- ⚠️ Métriques business dégradées > 20% (ex: sessions créées/jour)
- ⚠️ Erreurs critiques utilisateurs (perte données, auth cassée)
- ⚠️ Problème sécurité détecté (fuite JWT, injection SQL)
- ⚠️ Performance insatisfaisante après 48h (pas d'amélioration)
- ⚠️ Instabilité chronique (erreurs intermittentes)

---

## 📋 ROLLBACK PAR PHASE

### Phase 1: Canary 10% → Express 100%

**Situation:** NestJS reçoit 10% trafic, problème détecté

#### Rollback Express (< 2 minutes)

```bash
# 1. SSH vers serveur
ssh ubuntu@game-plug.rbw.ovh  # Ou votre serveur

# 2. Modifier weights Traefik (100% Express)
cd /srv/workspace
vim docker-compose.apps.yml

# Modifier labels game-plug-backend:
# AVANT:
#   - "traefik.http.services.game-plug-backend-svc.loadbalancer.server.weight=10"
# APRÈS:
#   - "traefik.http.services.game-plug-backend-svc.loadbalancer.server.weight=0"

# Modifier labels game-plug (Express):
# AVANT:
#   - "traefik.http.services.game-plug-express-svc.loadbalancer.server.weight=90"
# APRÈS:
#   - "traefik.http.services.game-plug-express-svc.loadbalancer.server.weight=100"

# 3. Recharger Traefik (0 downtime)
docker compose -f docker-compose.apps.yml up -d game-plug game-plug-backend

# 4. Vérifier trafic redirigé
curl -I https://game-plug.rbw.ovh/api/health
# → Doit router vers Express uniquement

# 5. Monitorer logs Express (aucune erreur)
docker compose -f docker-compose.apps.yml logs -f game-plug --tail=100
```

**Temps:** < 2 minutes
**Impact utilisateur:** Aucun (failover transparent)
**Validation:** 100 requêtes test vers Express uniquement

---

### Phase 2-4: Canary 25%-75% → Express 100%

**Situation:** Charge partielle NestJS, dégradation détectée

#### Rollback Progressif (< 5 minutes)

**Option A: Rollback direct 100% Express**

```bash
# Même procédure que Phase 1
# Passer weight NestJS à 0, Express à 100
cd /srv/workspace
vim docker-compose.apps.yml  # Modifier weights
docker compose -f docker-compose.apps.yml up -d game-plug game-plug-backend

# Vérifier
curl https://game-plug.rbw.ovh/api/health -v 2>&1 | grep -i "express\|nest"
```

**Option B: Rollback graduel (si non critique)**

```bash
# Réduire progressivement NestJS: 75% → 50% → 25% → 0%
# À chaque étape, attendre 5 min et monitorer

cd /srv/workspace
vim docker-compose.apps.yml

# Étape 1: Réduire à 50/50
# game-plug-backend weight: 50
# game-plug weight: 50
docker compose -f docker-compose.apps.yml up -d game-plug game-plug-backend

# Attendre 5 min, vérifier métriques
docker stats game-plug-backend --no-stream

# Étape 2: Réduire à 25/75
# game-plug-backend weight: 25
# game-plug weight: 75
docker compose -f docker-compose.apps.yml up -d game-plug game-plug-backend

# Étape 3: Désactiver NestJS complètement
# game-plug-backend weight: 0
# game-plug weight: 100
docker compose -f docker-compose.apps.yml up -d game-plug game-plug-backend
```

**Temps:** 5-20 minutes (selon approche)
**Impact utilisateur:** Minimal (dégradation progressive)

---

### Phase 5: Full NestJS 100% → Express 100%

**Situation:** Production complète sur NestJS, incident critique

#### Rollback Urgence (< 5 minutes)

```bash
# 1. Démarrer Express si stoppé
docker compose -f docker-compose.apps.yml start game-plug

# 2. Attendre health check Express (10-20s)
docker compose -f docker-compose.apps.yml logs game-plug | grep "Server listening"

# 3. Modifier weights (100% Express, 0% NestJS)
cd /srv/workspace
vim docker-compose.apps.yml

# game-plug-backend weight: 0
# game-plug weight: 100

# 4. Recharger immédiatement
docker compose -f docker-compose.apps.yml up -d game-plug game-plug-backend

# 5. Vérifier bascule complète
for i in {1..20}; do
  curl -s https://game-plug.rbw.ovh/api/health | jq -r '.service // "express"'
  sleep 0.5
done
# → Toutes les réponses doivent venir de Express

# 6. Investiguer NestJS en parallèle (pas bloquant)
docker compose -f docker-compose.apps.yml logs game-plug-backend -n 500 > /tmp/nestjs-crash-$(date +%s).log
```

**Temps:** < 5 minutes
**Impact utilisateur:** 10-30s de latence accrue (pendant restart Express)
**Validation:** Tests API critiques manuels

---

## 🔥 ROLLBACK CRITIQUE (URGENCE ABSOLUE)

### Scénario: NestJS crashe en boucle, site inaccessible

**Symptômes:**
- HTTP 502 Bad Gateway
- Container `game-plug-backend` restart loop
- Logs: `Error: ECONNREFUSED` ou `FATAL ERROR`

#### Procédure Express-Only (< 3 minutes)

```bash
# 1. ARRÊTER NestJS immédiatement
docker compose -f docker-compose.apps.yml stop game-plug-backend

# 2. Vérifier Express running
docker ps | grep game-plug
# → game-plug doit être UP

# 3. Si Express stoppé, le redémarrer
docker compose -f docker-compose.apps.yml start game-plug

# 4. Désactiver routing NestJS dans Traefik
cd /srv/workspace
vim docker-compose.apps.yml

# Commenter TOUTES les labels Traefik de game-plug-backend:
# labels:
#   - "traefik.enable=false"  # ← Forcer false

# 5. Recharger config
docker compose -f docker-compose.apps.yml up -d game-plug

# 6. Vérifier site accessible
curl https://game-plug.rbw.ovh/api/health
# → {"status":"ok"} (Express)

# 7. Analyser crash NestJS post-incident
docker logs game-plug-backend > /tmp/crash-dump-$(date +%Y%m%d-%H%M%S).log
```

**Temps:** < 3 minutes
**Impact utilisateur:** 1-2 minutes d'indisponibilité totale
**Priorité:** Rétablir service d'abord, investiguer après

---

## 🗄️ ROLLBACK AVEC RESTAURATION BDD

### Scénario: Migration Drizzle corrompt données

**Symptômes:**
- Erreurs SQL: `column does not exist`
- Données manquantes en production
- Relations cassées (foreign keys)

#### Restauration Database (< 30 minutes)

```bash
# 1. ARRÊTER TOUS LES BACKENDS (éviter écritures)
docker compose -f docker-compose.apps.yml stop game-plug game-plug-backend

# 2. Restaurer backup BDD (créé en Phase 0)
# Chemin backup: /srv/workspace/backups/game-plug/db-backup-YYYYMMDD.sql

# Se connecter à PostgreSQL
docker exec -it dev_postgres psql -U devuser

# Droper BDD actuelle (DANGEREUX!)
DROP DATABASE game_plug;

# Recréer BDD vide
CREATE DATABASE game_plug OWNER devuser;

# Quitter psql
\q

# 3. Restaurer dump SQL
docker exec -i dev_postgres psql -U devuser -d game_plug < /srv/workspace/backups/game-plug/db-backup-20260124.sql

# 4. Vérifier données restaurées
docker exec -it dev_postgres psql -U devuser -d game_plug -c "
SELECT COUNT(*) as total_sessions FROM sessions;
SELECT COUNT(*) as total_users FROM users;
"
# → Comparer avec baseline pré-migration

# 5. Redémarrer Express uniquement (NestJS désactivé)
docker compose -f docker-compose.apps.yml start game-plug

# 6. Tester fonctionnalités critiques
curl -X POST https://game-plug.rbw.ovh/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Temps:** 10-30 minutes (selon taille BDD)
**Impact utilisateur:** Perte des données créées depuis backup (max 24h)
**Prérequis:** Backup BDD quotidien automatisé

---

## 📊 CHECKLIST POST-ROLLBACK

### Immédiatement après rollback

- [ ] ✅ Service accessible: `curl https://game-plug.rbw.ovh/api/health`
- [ ] ✅ Tests API critiques passent (login, sessions, dés)
- [ ] ✅ Logs Express propres (0 erreurs)
- [ ] ✅ Container stable (pas de restart)
- [ ] ✅ Métriques revenues à baseline (latence, throughput)

### Dans les 30 minutes

- [ ] 📝 Créer incident report (date, heure, trigger, actions)
- [ ] 📝 Capturer logs NestJS (dump complet pour analyse)
- [ ] 📝 Notifier équipe (Slack, email)
- [ ] 📝 Vérifier intégrité données (queries BDD)
- [ ] 📝 Analyser métriques pré-rollback (grafana, prometheus)

### Dans les 24 heures

- [ ] 🔍 Root cause analysis (RCA)
- [ ] 🔍 Identifier fix nécessaire (code, config, infra)
- [ ] 🔍 Tester fix en staging
- [ ] 🔍 Décider nouvelle tentative déploiement ou abandon
- [ ] 🔍 Post-mortem meeting (équipe complète)

---

## 🛠️ COMMANDES UTILES POST-ROLLBACK

### Diagnostic NestJS (après rollback)

```bash
# Vérifier pourquoi NestJS a échoué

# 1. Logs complets
docker logs game-plug-backend --tail=1000 > /tmp/nestjs-debug.log

# 2. Erreurs spécifiques
docker logs game-plug-backend 2>&1 | grep -i "error\|fatal\|exception" | head -50

# 3. Variables d'environnement
docker exec game-plug-backend env | grep -E "DATABASE|REDIS|JWT|OPENAI"

# 4. Connexions BDD
docker exec dev_postgres psql -U devuser -d game_plug -c "
SELECT pid, usename, application_name, state, query
FROM pg_stat_activity
WHERE datname='game_plug';
"

# 5. Test connexion Redis
docker exec dev_redis redis-cli -a redis_dev_password PING
# → PONG

# 6. Health check local
docker exec game-plug-backend wget -qO- http://localhost:4000/api/health
```

### Vérifier état Express (baseline)

```bash
# 1. Container running
docker ps | grep "game-plug " | grep -v backend
# → game-plug UP

# 2. Logs propres
docker logs game-plug --tail=100 | grep -i error
# → Aucune erreur

# 3. API fonctionnelle
curl https://game-plug.rbw.ovh/api/health | jq
# → {"status":"ok", ...}

# 4. Tests E2E
cd /srv/workspace/game-plug
npm run test:e2e -- --grep "critical"
# → Tests critiques passent
```

### Comparer performance Express vs NestJS

```bash
# Benchmarker Express (après rollback)
ab -n 1000 -c 10 https://game-plug.rbw.ovh/api/sessions
# Noter: Requests/sec, Time per request

# Comparer avec métriques NestJS pré-rollback
# (depuis logs Grafana ou Prometheus)
```

---

## 📞 ESCALADE

### Niveau 1: DevOps (résolution < 15 min)

**Actions:**
- Rollback automatique via playbook
- Vérification métriques baseline
- Tests smoke critiques

**Escalade vers Niveau 2 si:**
- Rollback échoue (Express aussi en erreur)
- Corruption données suspectée
- Incident sécurité (intrusion, leak)

### Niveau 2: Équipe technique complète

**Actions:**
- Restauration BDD depuis backup
- Analyse forensique logs
- Décision GO/NO-GO migration complète

**Escalade vers Niveau 3 si:**
- Perte données critique (> 24h)
- Downtime > 1 heure
- Impact business majeur

### Niveau 3: Management + Communication externe

**Actions:**
- Communication utilisateurs (status page)
- Post-mortem officiel
- Plan d'action correctif

---

## 🧪 TESTER LE ROLLBACK (AVANT PHASE 0)

### Simulation rollback en staging

```bash
# 1. Déployer NestJS en staging
cd /srv/workspace/game-plug
docker compose up -d backend  # Environment staging

# 2. Router 50% trafic vers NestJS (simuler Phase 3)
# (modifier docker-compose labels)

# 3. Simuler crash NestJS
docker compose stop backend

# 4. Vérifier failover automatique Traefik vers Express
curl http://localhost:5173/api/health
# → Express doit répondre (pas d'erreur 502)

# 5. Tester restauration NestJS
docker compose start backend
# → Service revient en < 10s

# 6. Chronométrer temps rollback complet
time {
  vim docker-compose.yml  # Passer weight NestJS à 0
  docker compose up -d
  curl http://localhost:5173/api/health
}
# → Doit être < 2 minutes
```

**Critère succès:** Rollback staging < 3 minutes, 0 erreurs utilisateur

---

## 📚 DOCUMENTATION ASSOCIÉE

- **Plan déploiement:** `CANARY_DEPLOYMENT_PLAN.md`
- **Monitoring:** `MONITORING_DASHBOARD.md`
- **Checklist:** `DEPLOYMENT_CHECKLIST.md`
- **Architecture:** `ARCHITECTURE.md`

---

## 📝 TEMPLATE INCIDENT REPORT

```markdown
# INCIDENT REPORT - ROLLBACK NESTJS

**Date:** YYYY-MM-DD HH:MM
**Phase déploiement:** Phase X (X% NestJS)
**Durée incident:** XX minutes
**Impact utilisateur:** [Aucun | Mineur | Majeur | Critique]

## Trigger rollback
- [ ] Automatique (alert monitoring)
- [ ] Manuel (décision équipe)

**Détails:** [Description précise du problème]

## Actions prises
1. [HH:MM] Détection incident
2. [HH:MM] Décision rollback
3. [HH:MM] Exécution rollback
4. [HH:MM] Service rétabli
5. [HH:MM] Validation fonctionnelle

## Métriques avant/après
| Métrique | Avant | Après rollback |
|----------|-------|----------------|
| Latence p95 | XXms | XXms |
| Taux erreur 5xx | X% | X% |
| Throughput | XX req/s | XX req/s |

## Root cause
[Analyse technique de la cause racine]

## Actions correctives
- [ ] Fix code: [Description]
- [ ] Fix config: [Description]
- [ ] Fix infra: [Description]
- [ ] Tests additionnels: [Description]

## Prochaine tentative
**Date:** [YYYY-MM-DD ou "Abandon migration"]
**Pré-requis:** [Conditions pour retry]

## Lessons learned
[Enseignements pour éviter incident similaire]
```

---

## ✅ RÉSUMÉ TEMPS ROLLBACK

| Phase | Scénario | Temps rollback | Impact utilisateur |
|-------|----------|----------------|-------------------|
| **Phase 1 (10%)** | Weight 10→0 | < 2 min | Aucun |
| **Phase 2-4 (25-75%)** | Weight X→0 | < 5 min | Minimal |
| **Phase 5 (100%)** | Restart Express | < 5 min | 10-30s latence |
| **Critique** | Crash complet | < 3 min | 1-2 min downtime |
| **BDD corrompu** | Restore backup | 10-30 min | Perte données 24h |

**Objectif:** Toujours < 5 minutes pour rollback standard, < 30 minutes pire cas.

---

**Auteur:** Claude Sonnet 4.5
**Date:** 2026-01-24
**Version:** 1.0
**Projet:** game-plug - Call of Cthulhu RPG Platform
