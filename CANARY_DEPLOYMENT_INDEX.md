# INDEX - DOCUMENTATION DÉPLOIEMENT CANARY

**Projet:** Game-Plug - Call of Cthulhu RPG Platform
**Date:** 2026-01-24
**Status:** ✅ Documentation complète créée

---

## 📚 DOCUMENTS CRÉÉS

### 1. **CANARY_DEPLOYMENT_PLAN.md** (Plan Stratégique)

**Contenu:**
- Objectif et situation actuelle
- Timeline complète (6 phases sur 2 semaines)
- Configuration Docker et Traefik détaillée
- Métriques de décision Go/No-Go
- Rollback triggers
- Checklist pré-déploiement
- Monitoring dashboards
- Équipe et responsabilités

**Usage:** Document de référence principal pour toute l'équipe

**Lien:** `/srv/workspace/game-plug/CANARY_DEPLOYMENT_PLAN.md`

---

### 2. **ROLLBACK_PROCEDURE.md** (Procédure d'Urgence)

**Contenu:**
- Triggers de rollback (automatiques et manuels)
- Procédures rollback par phase (< 5 min)
- Rollback critique urgence (< 3 min)
- Restauration base de données (< 30 min)
- Checklist post-rollback
- Commandes de diagnostic
- Escalade incidents
- Template incident report

**Usage:** Guide d'urgence en cas de problème (garder accessible 24/7)

**Lien:** `/srv/workspace/game-plug/ROLLBACK_PROCEDURE.md`

---

### 3. **MONITORING_DASHBOARD.md** (Guide Monitoring)

**Contenu:**
- Métriques clés par catégorie (6 catégories)
- Commandes monitoring temps réel
- Dashboards recommandés (3 dashboards)
- Alertes automatiques (Prometheus)
- Script monitoring automatisé
- Tests de charge
- Checklist monitoring quotidien
- Outils complémentaires (Grafana)

**Usage:** Guide opérationnel pour surveiller la migration

**Lien:** `/srv/workspace/game-plug/MONITORING_DASHBOARD.md`

---

### 4. **DEPLOYMENT_CHECKLIST.md** (Checklist Opérationnelle)

**Contenu:**
- Checklist étape par étape (6 phases)
- 150+ items vérifiables
- Commandes exactes à exécuter
- Responsabilités par rôle (DevOps, Backend, QA)
- Validation Go/No-Go par phase
- Procédures d'urgence
- Métriques de succès finales

**Usage:** Document de travail quotidien pendant les 2 semaines de déploiement

**Lien:** `/srv/workspace/game-plug/DEPLOYMENT_CHECKLIST.md`

---

## 🎯 STRATÉGIE RÉSUMÉE

### Timeline (2 semaines)

```
J-7 à J-1   │ Phase 0: Préparation Infrastructure
            │ - Docker + Traefik
            │ - Tests backend
            │ - Backup BDD
─────────────┼─────────────────────────────────────
J0 - J+2    │ Phase 1: Canary 10%
            │ - Activation routing 10%
            │ - Monitoring intensif
            │ - Validation 48h
─────────────┼─────────────────────────────────────
J+3 - J+5   │ Phase 2: Canary 25%
            │ - Tests de charge
            │ - Validation scalabilité
─────────────┼─────────────────────────────────────
J+6 - J+8   │ Phase 3: Canary 50%
            │ - Tests résilience (failover)
            │ - Suite E2E complète
─────────────┼─────────────────────────────────────
J+9 - J+11  │ Phase 4: Canary 75%
            │ - Charge majoritaire NestJS
            │ - Validation business
─────────────┼─────────────────────────────────────
J+12        │ Phase 5: Full Production 100%
            │ - Bascule complète
            │ - Monitoring 24h continu
─────────────┼─────────────────────────────────────
J+13 - J+19 │ Phase 6: Cleanup
            │ - Archivage Express
            │ - Post-mortem
            │ - Documentation
```

### Configuration Traefik (Weighted Routing)

**Phase 1 (10%):**
```yaml
- "traefik.http.services.game-plug-backend-svc.loadbalancer.server.weight=10"
- "traefik.http.services.game-plug-express-svc.loadbalancer.server.weight=90"
```

**Phase 2 (25%):** `weight=25` / `weight=75`
**Phase 3 (50%):** `weight=50` / `weight=50`
**Phase 4 (75%):** `weight=75` / `weight=25`
**Phase 5 (100%):** `weight=100` / `weight=0` (backup)

### Métriques Critiques Go/No-Go

| Métrique | Baseline Express | Target NestJS | Rollback |
|----------|------------------|---------------|----------|
| **Latence p95** | ~150ms | ≤ 180ms | > 225ms |
| **Taux erreur 5xx** | < 0.05% | < 0.1% | > 1% |
| **Memory usage** | 500-800MB | ≤ 1.5GB | > 2GB |
| **Throughput** | ~20 req/s | ≥ 20 req/s | < 15 req/s |

### Rollback Times

| Scénario | Temps | Procédure |
|----------|-------|-----------|
| **Phase 1-4** | < 2 min | Changer weights Traefik |
| **Phase 5** | < 5 min | Restart Express + routing |
| **Critique** | < 3 min | Stop NestJS, Express-only |
| **BDD corrompu** | < 30 min | Restore backup PostgreSQL |

---

## 🚀 QUICK START

### Avant de commencer (J-7)

1. **Lire dans l'ordre:**
   - `CANARY_DEPLOYMENT_PLAN.md` (vue d'ensemble)
   - `DEPLOYMENT_CHECKLIST.md` (actions concrètes)
   - `ROLLBACK_PROCEDURE.md` (plan B)
   - `MONITORING_DASHBOARD.md` (surveillance)

2. **Préparer:**
   - [ ] Backup BDD
   - [ ] Configuration Docker
   - [ ] Tests backend
   - [ ] Dashboards monitoring

3. **Tester rollback:**
   - Simuler en staging
   - Chronométrer temps
   - Valider procédure

### Jour J (Activation 10%)

1. **08:00 - Déploiement:**
   ```bash
   cd /srv/workspace
   vim docker-compose.apps.yml  # weight=10
   docker compose -f docker-compose.apps.yml up -d game-plug-backend
   ```

2. **08:05 - Vérification:**
   ```bash
   # Distribution trafic
   for i in {1..100}; do curl -s https://game-plug.rbw.ovh/api/health; done | grep -c "nestjs"
   # → ~10
   ```

3. **08:15 - Monitoring:**
   ```bash
   # Logs temps réel
   docker compose -f docker-compose.apps.yml logs -f game-plug-backend

   # Métriques
   docker stats game-plug-backend
   ```

4. **12:00 & 18:00 - Reviews:**
   - Vérifier métriques Go/No-Go
   - Décision continuer ou rollback

---

## 📊 MÉTRIQUES À SURVEILLER

### Top 5 Critiques (toutes les 4h)

1. **Latence p95** (< Express + 20%)
   ```bash
   docker logs traefik --tail=500 | grep game-plug | awk '{print $NF}'
   ```

2. **Taux erreur 5xx** (< 0.1%)
   ```bash
   docker logs traefik --tail=500 | grep "5[0-9]{2}" | wc -l
   ```

3. **Memory usage** (< 1.5GB)
   ```bash
   docker stats game-plug-backend --no-stream
   ```

4. **Connexions BDD** (< 20)
   ```bash
   docker exec dev_postgres psql -U devuser -d game_plug -c "SELECT COUNT(*) FROM pg_stat_activity WHERE application_name LIKE '%nest%';"
   ```

5. **Sessions créées/jour** (≥ 50)
   ```bash
   docker exec dev_postgres psql -U devuser -d game_plug -c "SELECT COUNT(*) FROM sessions WHERE created_at > NOW() - INTERVAL '24 hours';"
   ```

---

## 🚨 CONTACTS URGENCE

### Escalade

**Niveau 1:** DevOps (rollback automatique < 15 min)
**Niveau 2:** Équipe technique complète (restauration BDD)
**Niveau 3:** Management (communication externe)

### Hotline (pendant migration J0-J+12)

| Rôle | Disponibilité | Action |
|------|---------------|--------|
| **DevOps Lead** | 9h-18h | Rollback, monitoring |
| **Backend Dev** | On-call | Debug, fix code |
| **QA** | 9h-18h | Tests, validation |
| **On-Call** | 24/7 | Incidents critiques |

---

## ✅ CRITÈRES DE SUCCÈS FINAL

**Migration réussie si (J+19):**

- ✅ NestJS 100% production stable 7+ jours
- ✅ Express complètement archivé
- ✅ Uptime ≥ 99.9%
- ✅ Latence p95 ≤ Express baseline + 10%
- ✅ Taux erreur 5xx < 0.05%
- ✅ 0 perte données
- ✅ 0 incidents critiques
- ✅ Tests E2E 100% passed
- ✅ Métriques business ≥ baseline
- ✅ Documentation à jour
- ✅ Post-mortem complété

---

## 📝 TEMPLATES

### Daily Report Template

```markdown
# DAILY REPORT - Migration Canary - JXX

**Date:** YYYY-MM-DD
**Phase:** Phase X (X% NestJS)

## Status
- [ ] Services UP
- [ ] Métriques OK
- [ ] Tests passent

## Métriques 24h
- Latence p95: XX ms (Express: XX ms)
- Taux erreur: X.XX%
- Memory: XXX MB
- Throughput: XX req/s
- Sessions créées: XX

## Incidents
- [Aucun | Description incidents]

## Actions J+1
- [Liste actions prévues]

## Risques identifiés
- [Liste risques potentiels]
```

### Incident Report Template

```markdown
# INCIDENT REPORT - YYYYMMDD-HHMM

**Phase:** Phase X (X% NestJS)
**Durée:** XX minutes
**Impact:** [Aucun | Mineur | Majeur | Critique]

## Trigger
- [Description problème]

## Actions
1. [HH:MM] Détection
2. [HH:MM] Rollback
3. [HH:MM] Service rétabli

## Root Cause
- [Analyse technique]

## Actions Correctives
- [ ] Fix code
- [ ] Fix config
- [ ] Tests additionnels

## Lessons Learned
- [Enseignements]
```

---

## 🔗 LIENS UTILES

### Documentation Projet

- **Architecture:** `ARCHITECTURE.md`
- **Migration Plan:** `MIGRATION_COMPLETE.md`
- **Testing Guide:** `TESTING.md`
- **Deployment (actuel):** `DEPLOYMENT_PLAN.md`

### URLs Production

- **Frontend:** https://game-plug.rbw.ovh
- **API:** https://game-plug.rbw.ovh/api
- **Health Check:** https://game-plug.rbw.ovh/api/health
- **OpenAPI Docs:** https://game-plug.rbw.ovh/api/docs

### Commandes Fréquentes

```bash
# Logs backend
docker compose -f docker-compose.apps.yml logs -f game-plug-backend

# Métriques
docker stats game-plug-backend --no-stream

# Health check
curl https://game-plug.rbw.ovh/api/health

# Rollback (weight 0)
vim docker-compose.apps.yml  # weight=0
docker compose -f docker-compose.apps.yml up -d game-plug-backend
```

---

## 📅 CALENDRIER RÉCAPITULATIF

| Date | Phase | Actions Clés | Durée |
|------|-------|--------------|-------|
| **J-7** | Préparation | Config Docker, tests | 2 jours |
| **J-5** | Préparation | Tests E2E, frontend | 2 jours |
| **J-3** | Préparation | Deploy weight=0 | 2 jours |
| **J0** | Phase 1 | Activation 10% | 3 jours |
| **J+3** | Phase 2 | Activation 25% | 3 jours |
| **J+6** | Phase 3 | Activation 50% | 3 jours |
| **J+9** | Phase 4 | Activation 75% | 3 jours |
| **J+12** | Phase 5 | Full 100% | 1 jour |
| **J+13** | Phase 6 | Cleanup | 7 jours |

**Durée totale:** 20 jours (J-7 à J+19)

---

## 🎓 PRINCIPES CLÉS

### 1. Sécurité d'abord
- Toujours pouvoir rollback en < 5 min
- Backup BDD avant chaque phase
- Tests complets avant augmentation charge

### 2. Monitoring continu
- Vérifier métriques toutes les 4h (Phases 1-4)
- Alertes automatiques configurées
- Logs centralisés accessibles

### 3. Décision basée données
- Go/No-Go avec métriques objectives
- Pas d'augmentation charge si dégradation
- Rollback sans hésitation si seuils dépassés

### 4. Communication transparente
- Daily reports (Phases actives)
- Incidents documentés immédiatement
- Post-mortem partagé (fin migration)

### 5. Documentation vivante
- Mettre à jour docs en temps réel
- Capturer lessons learned
- Partager best practices

---

## ✅ PRÊT À DÉMARRER?

### Checklist finale avant J-7

- [ ] ✅ 4 documents lus et compris
- [ ] ✅ Équipe briefée (roles assignés)
- [ ] ✅ Infrastructure Docker prête
- [ ] ✅ Tests backend passent
- [ ] ✅ Monitoring configuré
- [ ] ✅ Rollback testé en staging
- [ ] ✅ Backup BDD automatisé
- [ ] ✅ Contacts urgence définis
- [ ] ✅ Calendrier communiqué
- [ ] ✅ Go/No-Go criteria validés

**Si tous ✅ → Lancer Phase 0 (J-7)**

---

**Bonne migration! 🚀**

---

**Auteur:** Claude Sonnet 4.5
**Date:** 2026-01-24
**Version:** 1.0
**Projet:** game-plug - Call of Cthulhu RPG Platform
