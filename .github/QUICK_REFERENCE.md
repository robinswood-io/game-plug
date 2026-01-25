# Quick Reference - GitHub Actions CI/CD

Référence rapide pour les workflows GitHub Actions du projet Game-Plug.

---

## Fichiers importants

```
.github/
├── workflows/
│   ├── backend-ci.yml         # Tests NestJS + PostgreSQL + Redis
│   ├── frontend-ci.yml        # Tests Next.js
│   ├── code-quality.yml       # Linting + Audit
│   ├── docker-build-test.yml  # Docker validation
│   ├── deploy.yml             # Production deployment
│   ├── release.yml            # Release management
│   └── dependencies.yml       # Dependency audit
├── README.md                  # Quick start
├── SETUP.md                   # Configuration guide
├── WORKFLOWS.md               # Complete documentation
├── INDEX.md                   # Architecture overview
└── VALIDATION.md              # Validation checklist
```

---

## Workflows à retenir

| Workflow | Trigger | Temps | Artefacts |
|----------|---------|-------|-----------|
| **backend-ci** | push/pr | 15-20m | coverage |
| **frontend-ci** | push/pr | 10-15m | reports |
| **code-quality** | push/pr | 5-10m | - |
| **docker-build-test** | dockerfile changes | 25-35m | - |
| **deploy** | push main | 30-45m | - |
| **release** | tag v*.*.* | 45-60m | images |
| **dependencies** | weekly | 10-15m | audit |

---

## Commandes courantes

### Git workflow

```bash
# Feature branch
git checkout -b feature/name
git commit -m "feat: description"
git push origin feature/name
# → PR créée, CI déclenché

# Merge et déploiement
git checkout main
git merge feature/name
git push origin main
# → Deploy.yml déclenché automatiquement

# Release
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
# → Release.yml déclenché
```

### Local testing

```bash
# Backend tests
cd apps/backend
npm ci
npx tsc --noEmit
npm run lint
npm run test
npm run build

# Frontend tests
cd apps/frontend
npm ci
npm run type-check
npm run lint
npm run build

# Docker test
docker compose -f docker-compose.yml up -d
docker compose -f docker-compose.yml exec backend curl http://localhost:5002/api/health
docker compose -f docker-compose.yml down
```

---

## Configuration GitHub

### 1. Secrets (Settings > Secrets and variables > Actions)

```
DEPLOY_HOST   = your-server.com
DEPLOY_USER   = ubuntu
DEPLOY_KEY    = -----BEGIN OPENSSH PRIVATE KEY-----
                ...full private key...
                -----END OPENSSH PRIVATE KEY-----
SLACK_WEBHOOK = https://hooks.slack.com/services/...
```

### 2. Variables (Settings > Variables > Actions)

```
REGISTRY      = ghcr.io
NODE_VERSION  = 20
```

### 3. Branch Protection (Settings > Branches)

Main branch:
- Require pull request
- Require status checks: backend-ci, frontend-ci, code-quality, docker-build-test
- Require code reviews: 1
- Dismiss stale reviews

---

## Serveur production setup

### SSH key generation

```bash
ssh-keygen -t ed25519 -f ~/.ssh/game-plug -N "" -C "game-plug-deploy"
cat ~/.ssh/game-plug                    # Copy to DEPLOY_KEY
cat ~/.ssh/game-plug.pub | ssh user@host "cat >> ~/.ssh/authorized_keys"
```

### Server folders

```bash
ssh user@host
mkdir -p /srv/workspace/game-plug
cd /srv/workspace/game-plug
# .env file needed
```

### Server .env template

```env
NODE_ENV=production
POSTGRES_PASSWORD=secure-password-here
REDIS_PASSWORD=secure-password-here
JWT_SECRET=$(openssl rand -hex 32)
SESSION_SECRET=$(openssl rand -hex 32)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

---

## Monitoring

### GitHub Actions tab
- View all workflow runs
- Check status checks on PRs
- Download artifacts

### Server monitoring
```bash
ssh user@host

# View containers
docker compose -f /srv/workspace/game-plug/docker-compose.yml ps

# View logs
docker compose -f /srv/workspace/game-plug/docker-compose.yml logs -f

# Restart services
docker compose -f /srv/workspace/game-plug/docker-compose.yml restart
```

---

## Troubleshooting

### Backend CI fails
```bash
cd apps/backend
npm ci
npx tsc --noEmit
npm run lint
npm run test
```

### Frontend CI fails
```bash
cd apps/frontend
npm ci
npm run type-check
npm run lint
npm run build
```

### Deploy fails
- Check DEPLOY_HOST, DEPLOY_USER, DEPLOY_KEY
- Check SSH: `ssh -i key user@host`
- Check server: `df -h`, `docker ps`
- Check .env on server

### Docker fails
```bash
docker compose -f docker-compose.yml logs
# Check DATABASE_URL, REDIS_URL, ports
```

---

## Important variables

### Database (test)
```env
DATABASE_URL = postgresql://postgres:postgres_test@localhost:5432/game_plug_test
REDIS_URL = redis://localhost:6379
```

### Database (production)
```env
DATABASE_URL = postgresql://user:password@postgres:5432/game_plug
REDIS_URL = redis://:password@redis:6379
```

### Application
```env
NODE_ENV = test|production
JWT_SECRET = use openssl rand -hex 32
SESSION_SECRET = use openssl rand -hex 32
```

---

## File locations (absolute paths)

### Workflows
```
/srv/workspace/game-plug/.github/workflows/backend-ci.yml
/srv/workspace/game-plug/.github/workflows/frontend-ci.yml
/srv/workspace/game-plug/.github/workflows/code-quality.yml
/srv/workspace/game-plug/.github/workflows/docker-build-test.yml
/srv/workspace/game-plug/.github/workflows/deploy.yml
/srv/workspace/game-plug/.github/workflows/release.yml
/srv/workspace/game-plug/.github/workflows/dependencies.yml
```

### Documentation
```
/srv/workspace/game-plug/.github/README.md
/srv/workspace/game-plug/.github/WORKFLOWS.md
/srv/workspace/game-plug/.github/SETUP.md
/srv/workspace/game-plug/.github/INDEX.md
/srv/workspace/game-plug/.github/VALIDATION.md
```

---

## Documentation quick links

| Need | Read |
|------|------|
| Get started | README.md |
| Configure secrets | SETUP.md (Étape 2) |
| Setup server | SETUP.md (Étape 4) |
| Understand workflows | WORKFLOWS.md |
| Architecture details | INDEX.md |
| Validate setup | VALIDATION.md |
| Troubleshoot | SETUP.md (Dépannage) |

---

## Performance expectations

- First run: 50-70 minutes (all CI jobs parallel + no cache)
- Subsequent runs: 40-50 minutes (with cache)
- Deploy: 30-45 minutes (build + deploy)
- Release: 45-60 minutes (full validation + build)

---

## Free tier limits (GitHub Actions)

- Unlimited for public repos
- 20 concurrent jobs
- 35 days artifact retention
- 500MB free storage

---

## Key Points

✓ All workflows are ready to use
✓ Configuration is production-ready
✓ Documentation is complete
✓ Security best practices applied
✓ Automatic deployments enabled
✓ Rollback capability included

---

**Status: Ready for production use**
