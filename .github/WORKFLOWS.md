# GitHub Actions CI/CD Workflows

Cette documentation décrit tous les workflows GitHub Actions configurés pour le projet Game-Plug.

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Configuration requise](#configuration-requise)
3. [Workflows détaillés](#workflows-détaillés)
4. [Secrets GitHub](#secrets-github)
5. [Bonnes pratiques](#bonnes-pratiques)

---

## Vue d'ensemble

Le projet game-plug utilise 7 workflows GitHub Actions pour garantir la qualité, la sécurité et la fiabilité du code :

| Workflow | Déclenchement | Objectif |
|----------|---------------|---------|
| **backend-ci.yml** | Push/PR sur `main`, `develop` | Tests et build du backend |
| **frontend-ci.yml** | Push/PR sur `main`, `develop` | Tests et build du frontend |
| **code-quality.yml** | Push/PR sur `main`, `develop` | Linting et vérifications qualité |
| **docker-build-test.yml** | Push Dockerfile, PR | Build et test des images Docker |
| **deploy.yml** | Push sur `main` | Déploiement automatique en production |
| **release.yml** | Creation de tags `v*.*.*` | Création de releases et push d'images |
| **dependencies.yml** | Planifié (hebdo), PR | Audit et gestion des dépendances |

---

## Configuration requise

### 1. Dépendances Node.js

- **Node.js**: 20.x (LTS)
- **NPM**: 10.x ou supérieur
- **Bun**: Optionnel (runtime TypeScript)

### 2. Services externes

Les workflows utilisent les services suivants :

#### PostgreSQL 16
```yaml
Port: 5432
Credentials: Spécifiés en variables d'environnement
Database: game_plug_test (pour les tests)
```

#### Redis 7
```yaml
Port: 6379
Auth: Optionnelle (par défaut non protégée en test)
```

#### GitHub Container Registry (GHCR)
- Images Docker publiées automatiquement
- Authentification: Token GITHUB_TOKEN (fourni automatiquement)

### 3. Arborescence requise

```
game-plug/
├── .github/
│   └── workflows/         # Fichiers YAML des workflows
├── apps/
│   ├── backend/          # Application NestJS
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   └── frontend/         # Application Next.js
│       ├── src/
│       ├── Dockerfile
│       └── package.json
├── shared/               # Code partagé
├── docker-compose.yml    # Configuration Docker
├── package.json          # Dépendances racine
└── .env.example          # Variables d'environnement
```

---

## Workflows détaillés

### 1. backend-ci.yml

**Déclenchement:**
- Push sur `main` ou `develop` (chemins: `apps/backend/**`, `shared/**`)
- Pull Request sur `main` ou `develop`

**Étapes:**
1. Checkout du code
2. Installation de Node.js 20
3. Installation des dépendances
4. Vérification PostgreSQL
5. Configuration de la base de données test
6. Vérification TypeScript (`npx tsc --noEmit`)
7. Linting du code (`npm run lint`)
8. Tests unitaires avec coverage (`npm run test:cov`)
9. Tests e2e (`npm run test:e2e`)
10. Build (`npm run build`)
11. Upload du coverage vers Codecov
12. Commentaire PR avec résultats

**Durée: ~15-20 minutes**

**Variables d'environnement:**
```env
NODE_ENV=test
DATABASE_URL=postgresql://postgres:postgres_test@localhost:5432/game_plug_test
REDIS_URL=redis://localhost:6379
JWT_SECRET=test-jwt-secret-key
SESSION_SECRET=test-session-secret-key
```

### 2. frontend-ci.yml

**Déclenchement:**
- Push sur `main` ou `develop` (chemins: `apps/frontend/**`, `shared/**`)
- Pull Request sur `main` ou `develop`

**Étapes:**
1. Checkout du code
2. Installation de Node.js 20
3. Installation des dépendances
4. Vérification TypeScript (`npm run type-check`)
5. Linting (`npm run lint`)
6. Build Next.js (`npm run build`)
7. Tests Playwright (e2e)
8. Upload du rapport Playwright
9. Vérification des artefacts de build
10. Commentaire PR avec résultats

**Durée: ~10-15 minutes**

**Variables d'environnement:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5002
NODE_ENV=production
```

### 3. code-quality.yml

**Déclenchement:**
- Push sur `main` ou `develop`
- Pull Request sur `main` ou `develop`
- Planifié: Quotidien à 2h du matin UTC

**Étapes (parallèles):**

**Job 1: quality-checks**
- ESLint backend et frontend
- Détection de `console.log` et `console.debug`
- Détection de commentaires TODO/FIXME

**Job 2: security-audit**
- `npm audit --audit-level=moderate`
- Génération de rapport JSON
- Détection des vulnérabilités

**Job 3: dependency-check**
- Vérification des packages outdatés
- Analyse des licenses
- Analyse de la taille des packages

**Job 4: type-safety**
- Vérification stricte TypeScript
- Détection d'utilisation du type `any`

**Job 5: comment-pr**
- Commentaire PR avec résultats consolidés

**Durée: ~15 minutes**

### 4. docker-build-test.yml

**Déclenchement:**
- Push Dockerfile, docker-compose.yml
- Pull Request

**Étapes (parallèles):**

**Job 1: docker-build** (pour backend et frontend)
- Build images Docker
- Vérification avec `docker images`

**Job 2: docker-compose-test**
- Start stack Docker Compose
- Vérification de santé PostgreSQL
- Vérification de santé Redis
- Vérification de santé Backend
- Vérification de santé Frontend
- Test des endpoints API
- Vérification des logs pour erreurs
- Cleanup

**Job 3: security-scan**
- Scan Trivy pour vulnérabilités
- Upload vers CodeQL (GitHub Security)

**Durée: ~20-30 minutes**

### 5. deploy.yml

**Déclenchement:**
- Push sur `main` (après que backend-ci et frontend-ci passent)
- Workflow dispatch (manuel)

**Jobs:**

**build-and-push** (parallèle)
- Build images Docker
- Push vers GHCR
- Tagging automatique (branch, sha, latest)

**deploy**
- SSH sur serveur de production
- Pull images Docker
- Démarrage services
- Vérification de santé
- Notification Slack

**rollback** (si deploy échoue)
- Revert vers commit précédent
- Restart services
- Notification Slack

**Durée: ~30-45 minutes**

**Secrets requis:**
- `DEPLOY_HOST`: Hostname/IP du serveur
- `DEPLOY_USER`: Utilisateur SSH
- `DEPLOY_KEY`: Clé privée SSH
- `DEPLOY_PORT`: Port SSH (défaut: 22)
- `SLACK_WEBHOOK`: URL webhook Slack (optionnel)

### 6. release.yml

**Déclenchement:**
- Push de tag `v*.*.*`
- Workflow dispatch avec version

**Étapes:**

**validate**
- TypeScript check
- Tests
- Build complet

**build-release**
- Build images Docker
- Push avec tags version
- Labels OCI

**create-release**
- Génération release notes
- Création GitHub Release

**notify**
- Notification Slack

**Durée: ~45-60 minutes**

**Exemple d'utilisation:**
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### 7. dependencies.yml

**Déclenchement:**
- Planifié: Lundi à 2h UTC
- Workflow dispatch (manuel)
- PR avec changements `package.json`

**Jobs:**

**dependency-audit**
- `npm audit --json`
- Rapport des vulnérabilités
- Commentaire PR si critiques trouvées

**update-check**
- `npm outdated --json`
- Rapport des packages à jour
- Artifacts générés

**validate-lock-file**
- Vérification `package-lock.json`
- Check compatibilité Node version

**security-check**
- Patterns de sécurité
- Check secrets hardcodés
- Import de dev packages

**Durée: ~10-15 minutes**

---

## Secrets GitHub

### Configuration des secrets

1. Aller à: `Settings > Secrets and variables > Actions`
2. Cliquer sur "New repository secret"

### Secrets obligatoires

#### Pour le déploiement (deploy.yml)

```
DEPLOY_HOST        = hostname ou IP du serveur
DEPLOY_USER        = utilisateur SSH
DEPLOY_KEY         = clé privée SSH
DEPLOY_PORT        = port SSH (optionnel, défaut: 22)
```

#### Pour les notifications (deploy.yml, release.yml)

```
SLACK_WEBHOOK      = https://hooks.slack.com/services/...
```

#### Pour les artefacts

```
CODECOV_TOKEN      = Token Codecov (optionnel)
```

### Comment obtenir les secrets

#### Clé privée SSH
```bash
# Sur la machine de déploiement
cat ~/.ssh/id_rsa
# Copier le contenu complet incluant les lignes BEGIN/END
```

#### Webhook Slack
1. Aller à: https://api.slack.com/apps
2. Créer une nouvelle app
3. Activé "Incoming Webhooks"
4. Créer un nouveau webhook
5. Copier l'URL

---

## Variables d'environnement GitHub

Les variables (non-sensibles) peuvent être définies dans:
`Settings > Variables > Actions`

Recommandé:
```
API_URL             = https://api.yourdomain.com
DEPLOYMENT_URL      = https://yourdomain.com
REGISTRY            = ghcr.io
```

---

## Bonnes pratiques

### 1. Commits et Branches

```bash
# Créer feature branch
git checkout -b feature/my-feature

# Commits conventionnels
git commit -m "feat: add new feature"
git commit -m "fix: resolve issue"
git commit -m "refactor: improve code"

# Push pour déclencher workflows
git push origin feature/my-feature
```

### 2. Pull Requests

- Déclenche automatiquement tous les workflows CI
- Attendez la validation avant merge
- Vérifiez les commentaires PR avec résultats tests

```bash
# Après review et approbation
git checkout main
git merge feature/my-feature
git push origin main
```

### 3. Gestion des versions

```bash
# Créer une release
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# Cela déclenche:
# 1. release.yml (validate, build, create-release)
# 2. Build des images Docker tagées
# 3. Création de la release GitHub
# 4. Notification Slack
```

### 4. Dépannage

#### Backend CI échoue
```bash
cd apps/backend
npm ci
npx tsc --noEmit
npm run test
npm run build
```

#### Frontend CI échoue
```bash
cd apps/frontend
npm ci
npm run type-check
npm run lint
npm run build
```

#### Docker build échoue
```bash
# Vérifier Dockerfile
docker build ./apps/backend -f Dockerfile

# Vérifier dépendances
cd apps/backend
npm ci
```

#### Deploy échoue
1. Vérifier SSH keys
2. Vérifier DEPLOY_HOST, DEPLOY_USER
3. Vérifier space disque serveur
4. Vérifier logs: `docker compose logs`

### 5. Monitoring

- GitHub Actions: `Actions` tab dans le repo
- Slack notifications: Channel configurée
- Email: Notifs par défaut de GitHub
- Codecov: Coverage reports

---

## Architecture des workflows

```
PR/Push
  │
  ├─ backend-ci.yml          (Tests + build backend)
  ├─ frontend-ci.yml         (Tests + build frontend)
  ├─ code-quality.yml        (Linting + audit)
  ├─ docker-build-test.yml   (Docker build + test)
  │
  └─ (Si tous passent ET branche main)
    │
    └─ deploy.yml            (Build + deploy production)
       ├─ build-and-push     (Images Docker)
       └─ deploy             (SSH + restart)
         └─ rollback         (Si échoue)

Tag v*.*.*
  │
  └─ release.yml             (Release + images)
    ├─ validate              (Tests)
    ├─ build-release         (Images tagées)
    ├─ create-release        (GitHub release)
    └─ notify                (Slack)

Hebdo (lundi 2h)
  │
  └─ dependencies.yml        (Audit dépendances)
```

---

## Performance et coûts

### Durée moyenne par workflow

| Workflow | Durée | Fréquence |
|----------|-------|-----------|
| backend-ci | 15-20 min | Par commit |
| frontend-ci | 10-15 min | Par commit |
| code-quality | 5-10 min | Par commit |
| docker-build-test | 20-30 min | Lors changement Docker |
| deploy | 30-45 min | 1x par jour (main) |
| release | 45-60 min | À la demande |
| dependencies | 10-15 min | 1x par semaine |

### Optimisations appliquées

- Cache npm (Turbo cache)
- Docker layer caching
- Parallel jobs
- Conditional steps (only when needed)

---

## Support et contributions

Pour modifier les workflows:

1. Créer une branche feature
2. Modifier fichier `.github/workflows/*.yml`
3. Tester localement avec `act` (optionnel)
4. Créer PR et attendre validation
5. Merge après approbation

### Tester localement

```bash
# Installer act
brew install act  # macOS
# ou télécharger depuis https://github.com/nektos/act

# Lancer un workflow
act push --file .github/workflows/backend-ci.yml
```

---

## Checkliste d'intégration

- [ ] Ajouter secrets GitHub (DEPLOY_*, SLACK_*)
- [ ] Configurer branch protection rules
- [ ] Activer notifications Slack
- [ ] Tester un déploiement manuel
- [ ] Documenter serveur de déploiement
- [ ] Configurer rollback procedure
- [ ] Monitorer premiers déploiements
- [ ] Archiver workflows logs
