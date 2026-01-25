# GitHub Actions CI/CD - Index complet

## Vue d'ensemble

Cet index documente tous les workflows GitHub Actions et la configuration pour le projet Game-Plug.

**Dernière mise à jour:** 23 janvier 2026
**Total de fichiers créés:** 9 (7 workflows + 2 documentations)
**Total de lignes de code:** 2,476

---

## Fichiers créés

### 1. Workflows GitHub Actions (`.github/workflows/`)

| Fichier | Lignes | Déclenchement | Objectif |
|---------|--------|---------------|---------|
| `backend-ci.yml` | 167 | Push/PR | Tests et build backend (NestJS) |
| `frontend-ci.yml` | 128 | Push/PR | Tests et build frontend (Next.js) |
| `code-quality.yml` | 207 | Push/PR/Quotidien | Linting, audit, vérifications |
| `docker-build-test.yml` | 223 | Push Dockerfile | Build et test images Docker |
| `deploy.yml` | 292 | Push main | Déploiement en production |
| `release.yml` | 198 | Tag v*.*.* | Création releases et images versionnées |
| `dependencies.yml` | 261 | Hebdomadaire/PR | Audit et gestion dépendances |

### 2. Documentation (`.github/`)

| Fichier | Lignes | Contenu |
|---------|--------|---------|
| `WORKFLOWS.md` | 540 | Guide complet workflows + bonnes pratiques |
| `SETUP.md` | 460 | Configuration secrets + dépannage |
| `INDEX.md` | Ce fichier | Index et résumé |

---

## Architecture complète

```
.github/
├── workflows/
│   ├── backend-ci.yml           (Tests NestJS + PostgreSQL + Redis)
│   ├── frontend-ci.yml          (Tests Next.js + Playwright)
│   ├── code-quality.yml         (ESLint + audit + type-safety)
│   ├── docker-build-test.yml    (Docker compose stack test)
│   ├── deploy.yml               (Production deployment + rollback)
│   ├── release.yml              (Release management + versioning)
│   └── dependencies.yml         (Dependency audit + updates)
│
└── Documentation/
    ├── WORKFLOWS.md             (Guide détaillé)
    ├── SETUP.md                 (Configuration + secrets)
    └── INDEX.md                 (Ce fichier)
```

---

## Flux d'exécution complet

### 1. Développement (Feature Branch)

```
Developer créé feature branch
    ↓
git push origin feature/xyz
    ↓
GitHub Actions déclenche (automatiquement):
  ├─ backend-ci.yml         (~15 min)
  ├─ frontend-ci.yml        (~10 min)
  ├─ code-quality.yml       (~10 min)
  └─ docker-build-test.yml  (~25 min)
    ↓
PR créée avec status checks
    ↓
Reviewer regarde les résultats
  ├─ Tous les tests verts ✓
  ├─ Coverage reports ✓
  └─ Logs sans erreur ✓
    ↓
Merger la PR
```

### 2. Intégration (Main Branch)

```
PR merged à main
    ↓
git push origin main
    ↓
GitHub Actions déclenche:
  ├─ backend-ci.yml         (Passe)
  ├─ frontend-ci.yml        (Passe)
  ├─ code-quality.yml       (Passe)
  └─ docker-build-test.yml  (Passe)
    ↓
Si tous passent → deploy.yml déclenché
    ├─ build-and-push images (~20 min)
    │   ├─ Backend image tagée
    │   └─ Frontend image tagée
    │
    ├─ deploy sur serveur (~15 min)
    │   ├─ SSH connection
    │   ├─ Pull images
    │   ├─ Start services
    │   └─ Health checks
    │
    └─ Notification Slack
       └─ "✅ Deployment Successful"

Si échoue → rollback.yml déclenché
    └─ Revert + Notification
```

### 3. Release (Tags)

```
git tag -a v1.0.0
git push origin v1.0.0
    ↓
GitHub Actions déclenche release.yml:
  ├─ validate     (Tests complets)
  ├─ build-release (Images Docker v1.0.0)
  ├─ create-release (GitHub Release)
  └─ notify       (Slack)
```

### 4. Maintenance (Scheduled)

```
Tous les lundis à 2h UTC:
dependencies.yml déclenché
    ├─ dependency-audit
    ├─ update-check
    ├─ validate-lock-file
    └─ security-check
    ↓
Rapport généré
Artefacts disponibles
```

---

## Détails techniques

### Backend CI Pipeline

**Environnement:**
- Node.js 20.x
- PostgreSQL 16 (service)
- Redis 7 (service)

**Étapes principales:**
1. Installation dépendances
2. TypeScript check (`npx tsc --noEmit`)
3. Linting (`npm run lint`)
4. Tests unitaires (`npm run test:cov`)
5. Tests e2e (`npm run test:e2e`)
6. Build (`npm run build`)
7. Upload coverage Codecov

**Durée:** 15-20 minutes
**Artefacts:** Coverage reports

### Frontend CI Pipeline

**Environnement:**
- Node.js 20.x
- Next.js 16 avec Turbopack

**Étapes principales:**
1. Installation dépendances
2. TypeScript check (`npm run type-check`)
3. Linting (`npm run lint`)
4. Build (`npm run build`)
5. Tests e2e Playwright (optionnel)

**Durée:** 10-15 minutes
**Artefacts:** Playwright reports

### Code Quality Pipeline

**Vérifications parallèles:**
1. ESLint (backend + frontend)
2. Security audit (`npm audit`)
3. Dependency analysis
4. Type safety (TypeScript strict)
5. Pattern detection (console, TODO, etc.)

**Durée:** 10-15 minutes
**Fréquence:** À chaque push + quotidienne (2h UTC)

### Docker Build & Test Pipeline

**Étapes:**
1. Build images Docker
2. Start Docker Compose stack
3. Service health checks (PostgreSQL, Redis, Backend, Frontend)
4. API endpoint tests
5. Error detection dans logs
6. Trivy security scan
7. SARIF upload à CodeQL

**Durée:** 25-35 minutes
**Sécurité:** Scan automatique vulnérabilités

### Deployment Pipeline

**Sécurité:**
- SSH authentication
- Key-based, no passwords
- Health checks post-deployment

**Étapes:**
1. Build Docker images
2. Push vers GHCR
3. SSH sur serveur
4. Pull images
5. Restart services
6. Verify health
7. Slack notification

**Durée:** 30-45 minutes
**Rollback:** Automatique en cas d'erreur

### Release Pipeline

**Validation:**
- Full test suite
- Build complet
- Security checks

**Publication:**
- Docker images taggées (semantic versioning)
- GitHub Release créée
- Release notes générées
- Slack notification

**Durée:** 45-60 minutes

---

## Configurations requises

### GitHub Repository Settings

**Branch Protection (main):**
- ✓ Require PR before merge
- ✓ Require status checks:
  - backend-ci
  - frontend-ci
  - code-quality
  - docker-build-test
- ✓ Require code reviews
- ✓ Dismiss stale approvals

**Secrets à configurer:**
- `DEPLOY_HOST` - Hostname/IP serveur
- `DEPLOY_USER` - SSH user
- `DEPLOY_KEY` - Private SSH key
- `SLACK_WEBHOOK` - Slack webhook (optionnel)

**Variables à configurer:**
- `REGISTRY` - `ghcr.io`
- `NODE_VERSION` - `20`

### Serveur de déploiement

**Minimum requis:**
- SSH accessible
- Docker et Docker Compose installés
- /srv/workspace/game-plug créé
- .env configuré
- 20GB+ disk space

**Services lancés:**
- PostgreSQL 16
- Redis 7
- Backend NestJS (port 5002)
- Frontend Next.js (port 3000)

---

## Metriques et monitoring

### Temps d'exécution moyens

| Workflow | Temps | Notes |
|----------|-------|-------|
| backend-ci | 15-20 min | Avec tests et build |
| frontend-ci | 10-15 min | Avec build Turbopack |
| code-quality | 5-10 min | ESLint + audit |
| docker-build-test | 25-35 min | Services health checks |
| deploy | 30-45 min | Incl. health verification |
| release | 45-60 min | Incl. validation complete |
| dependencies | 10-15 min | Audit + scan |

### Coûts GitHub Actions

**Gratuit pour:**
- Public repositories
- Repositories avec runners hébergés

**À surveiller:**
- Nombre de concurrent jobs
- Durée totale par mois
- Storage artefacts (30j rétention)

---

## Bonnes pratiques mises en place

1. **Caching**
   - npm dependencies en cache
   - Docker layer caching
   - Turbo cache pour builds

2. **Parallelisation**
   - Jobs indépendants en parallèle
   - Steps optimisés

3. **Security**
   - Secrets sans logs
   - SSH key-based auth
   - SARIF uploads
   - Npm audit automatique

4. **Reliability**
   - Health checks services
   - Rollback automatique
   - Error detection
   - Retries configurés

5. **Monitoring**
   - PR comments with results
   - Slack notifications
   - Codecov integration
   - Artefacts upload

6. **Maintenance**
   - Dependency audit hebdo
   - Security scan regular
   - Job summaries
   - Logs archivés

---

## Checklist intégration

### Avant premier déploiement

```
Infrastructure:
☐ Serveur de production accès SSH
☐ Docker et Docker Compose installés
☐ Dossier /srv/workspace/game-plug créé
☐ Permissions correctes (ubuntu:ubuntu)
☐ Space disque > 20GB

Secrets GitHub:
☐ DEPLOY_HOST configuré
☐ DEPLOY_USER configuré
☐ DEPLOY_KEY configuré
☐ Clé SSH ajoutée au serveur
☐ SSH connection testée

Configuration repo:
☐ Branch protection main activée
☐ Status checks configurés
☐ Variables GitHub ajoutées
☐ Webhook Slack (optionnel)

Tests locaux:
☐ Backend CI passe localement
☐ Frontend CI passe localement
☐ Code quality checks passent
☐ Docker Compose démarre correctement
```

### Après premier déploiement

```
Vérifications:
☐ API accessible (health check)
☐ Frontend accessible
☐ Databases connectées
☐ Redis opérationnel
☐ Logs sans erreur
☐ SSL/TLS configuré (if applicable)

Monitoring:
☐ Slack notifications reçues
☐ Codecov reports actifs
☐ GitHub Actions logs archivés
☐ Serveur monitoring en place

Rollback:
☐ Procédure testée
☐ Backups en place
☐ Secrets securisés
```

---

## Dépannage rapide

### Le workflow n'est pas déclenché

- Vérifier les `paths` du workflow
- Vérifier les branches (`main`, `develop`)
- Vérifier la validité du YAML (indentation)
- Voir onglet "Actions" pour les détails

### Les tests échouent

```bash
# Tester localement
cd apps/backend
npm ci
npm run test
npm run build
```

### Deploy échoue

- Vérifier DEPLOY_HOST/USER/KEY
- Vérifier SSH: `ssh -i key user@host`
- Vérifier serveur: `df -h`, `docker ps`
- Vérifier logs: `docker compose logs`

### Image Docker ne démarre pas

```bash
docker logs container-name
# Vérifier DATABASE_URL, REDIS_URL
# Vérifier fichier .env sur serveur
```

---

## Documentation complète

### Documents fournis

1. **WORKFLOWS.md** (540 lignes)
   - Vue d'ensemble complète
   - Description détaillée chaque workflow
   - Configuration requise
   - Secrets et variables
   - Bonnes pratiques
   - Dépannage

2. **SETUP.md** (460 lignes)
   - Configuration pas à pas
   - Générer secrets sécurisés
   - Configurer serveur
   - Tests de validation
   - Dépannage détaillé
   - Commandes utiles

3. **INDEX.md** (Ce fichier)
   - Vue d'ensemble
   - Architecture
   - Flux d'exécution
   - Checklist
   - Metriques

---

## Contacts et support

### Documentation

- **GitHub Docs:** https://docs.github.com/en/actions
- **Workflows:** Voir `.github/WORKFLOWS.md`
- **Setup:** Voir `.github/SETUP.md`

### Outils utiles

- **Act** (tester workflows localement): https://github.com/nektos/act
- **GitHub CLI** (manage repo): https://cli.github.com
- **Docker Compose**: https://docs.docker.com/compose

---

## Historique des modifications

| Date | Changement |
|------|-----------|
| 2026-01-23 | Création complète workflows CI/CD |

---

## License et disclaimer

Ces workflows sont fournis à titre de base de configuration. À adapter à votre infrastructure spécifique.

**Important:**
- Changer tous les secrets par défaut
- Adapter URLs et hostnames
- Tester en environnement de staging d'abord
- Maintenir backups réguliers
