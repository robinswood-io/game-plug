# Configuration des workflows GitHub Actions

Guide complet pour configurer les secrets et variables d'environnement nécessaires aux workflows CI/CD.

---

## Étape 1: Accéder aux paramètres des secrets

1. Aller à votre repository GitHub
2. Cliquer sur `Settings` (onglet)
3. Dans le menu gauche, aller à `Secrets and variables` > `Actions`

---

## Étape 2: Ajouter les secrets

### Secrets obligatoires

#### 1. DEPLOY_HOST
```
Nom: DEPLOY_HOST
Valeur: votre-serveur.com ou 192.168.1.100
Description: Hostname ou IP du serveur de production
```

#### 2. DEPLOY_USER
```
Nom: DEPLOY_USER
Valeur: ubuntu (ou votre utilisateur SSH)
Description: Utilisateur SSH sur le serveur
```

#### 3. DEPLOY_KEY
```
Nom: DEPLOY_KEY
Valeur: -----BEGIN OPENSSH PRIVATE KEY-----
        [contenu complet de la clé]
        -----END OPENSSH PRIVATE KEY-----
Description: Clé privée SSH (avec BEGIN et END)
```

Comment obtenir la clé SSH:
```bash
# Sur votre machine locale (génération si nécessaire)
ssh-keygen -t ed25519 -f ~/.ssh/game-plug -C "game-plug-deploy"

# Afficher la clé privée
cat ~/.ssh/game-plug

# Copier COMPLÈTEMENT le contenu, du BEGIN à END
# Coller dans le secret DEPLOY_KEY

# Ajouter la clé publique sur le serveur
cat ~/.ssh/game-plug.pub | ssh user@host "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

#### 4. SLACK_WEBHOOK (Optionnel)
```
Nom: SLACK_WEBHOOK
Valeur: https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
Description: Webhook Slack pour notifications
```

Comment obtenir le Slack webhook:
```
1. Aller à https://api.slack.com/apps
2. Créer une nouvelle app
3. Aller à "Incoming Webhooks"
4. Cliquer "Add New Webhook to Workspace"
5. Sélectionner le channel (#deployments par exemple)
6. Copier l'URL du webhook
```

### Secrets optionnels

#### DEPLOY_PORT
```
Nom: DEPLOY_PORT
Valeur: 22 (défaut) ou votre port SSH
Description: Port SSH personnalisé
```

#### CODECOV_TOKEN
```
Nom: CODECOV_TOKEN
Valeur: votre-token-codecov
Description: Token pour Codecov (coverage reports)
```

#### API_URL
```
Nom: API_URL
Valeur: https://api.yourdomain.com
Description: URL API en production
```

---

## Étape 3: Ajouter les variables d'environnement

1. Dans `Settings` > `Secrets and variables` > `Actions`
2. Cliquer sur l'onglet `Variables`
3. Ajouter les variables suivantes:

### Variables publiques

```yaml
REGISTRY: ghcr.io
DEPLOYMENT_URL: https://yourdomain.com
NODE_VERSION: '20'
```

---

## Étape 4: Configurer le serveur de déploiement

### Sur le serveur (SSH)

```bash
# 1. Créer l'utilisateur (si nécessaire)
sudo useradd -m -s /bin/bash ubuntu
sudo usermod -aG docker ubuntu

# 2. Créer dossier projet
sudo mkdir -p /srv/workspace/game-plug
sudo chown ubuntu:ubuntu /srv/workspace/game-plug

# 3. Cloner le repository
cd /srv/workspace/game-plug
git clone https://github.com/yourorg/game-plug.git .

# 4. Configurer les permissions SSH
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 5. Ajouter la clé publique déployment
echo "ssh-ed25519 AAAA... comment" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### Créer la clé SSH pour le déploiement

```bash
# Sur votre machine locale ou serveur CI
ssh-keygen -t ed25519 -f ~/.ssh/game-plug-deploy -N "" -C "game-plug-github-actions"

# Afficher et copier la clé PRIVÉE
cat ~/.ssh/game-plug-deploy

# Ajouter la clé PUBLIQUE sur le serveur
cat ~/.ssh/game-plug-deploy.pub | ssh ubuntu@your-server "cat >> ~/.ssh/authorized_keys"

# Tester la connexion
ssh -i ~/.ssh/game-plug-deploy ubuntu@your-server 'echo "Connection successful"'
```

### Structure du serveur

```
/srv/workspace/game-plug/
├── .git/
├── apps/
│   ├── backend/
│   └── frontend/
├── docker-compose.yml
├── .env                 # À créer manuellement
└── ...
```

### Fichier .env sur le serveur

```bash
# SSH sur le serveur
ssh ubuntu@your-server

# Créer .env
cat > /srv/workspace/game-plug/.env << 'EOF'
# Application
NODE_ENV=production
LOG_LEVEL=info

# PostgreSQL
POSTGRES_DB=game_plug
POSTGRES_USER=game_plug
POSTGRES_PASSWORD=votre-mot-de-passe-securise
POSTGRES_PORT=5432

# Redis
REDIS_PASSWORD=votre-mot-de-passe-redis
REDIS_PORT=6379

# Backend
BACKEND_PORT=5002
API_HOST=0.0.0.0
API_PREFIX=/api

# JWT & Security
JWT_SECRET=votre-cle-jwt-securisee
SESSION_SECRET=votre-session-secret-securisee

# CORS
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# Frontend
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
EOF

# Sécuriser le fichier
chmod 600 /srv/workspace/game-plug/.env
```

Générer des secrets sécurisés:
```bash
# Sur macOS/Linux
openssl rand -hex 32  # JWT_SECRET
openssl rand -hex 32  # SESSION_SECRET
openssl rand -hex 32  # POSTGRES_PASSWORD
openssl rand -hex 32  # REDIS_PASSWORD
```

---

## Étape 5: Configurer les branch protection rules

1. `Settings` > `Branches`
2. Cliquer sur `Add rule`
3. Pattern: `main`
4. Cocher les options suivantes:

```
✓ Require a pull request before merging
✓ Require status checks to pass before merging
  - backend-ci
  - frontend-ci
  - code-quality
  - docker-build-test
✓ Require branches to be up to date before merging
✓ Require code reviews before merging (1 approval)
✓ Dismiss stale pull request approvals
```

---

## Étape 6: Tester la configuration

### Test 1: Backend CI

```bash
# Créer une branche test
git checkout -b test/workflows

# Modifier un fichier backend
echo "// test" >> apps/backend/src/main.ts

# Commit et push
git add .
git commit -m "test: workflow validation"
git push origin test/workflows

# Créer une PR
# Vérifier que le workflow backend-ci se déclenche
# Attendre ~15 minutes
# Vérifier le résultat en vert
```

### Test 2: Frontend CI

```bash
# Modifier un fichier frontend
echo "// test" >> apps/frontend/src/app.tsx

# Commit et push
git add .
git commit -m "test: frontend workflow"
git push origin test/workflows

# Attendre ~10 minutes et vérifier le résultat
```

### Test 3: Déploiement

```bash
# Merger la branche test dans main
git checkout main
git merge test/workflows
git push origin main

# Cela déclenche:
# 1. Tous les workflows CI
# 2. Si tous passent: deploy.yml se déclenche
# 3. Vérifier dans l'onglet "Actions" du repo
# 4. Attendre ~30-45 minutes
# 5. Vérifier la notification Slack
# 6. Vérifier le serveur
```

### Test 4: Vérifier le déploiement

```bash
# SSH sur le serveur
ssh ubuntu@your-server

# Vérifier les containers
docker ps | grep game-plug

# Vérifier les logs
docker compose -f /srv/workspace/game-plug/docker-compose.yml logs -f backend

# Tester l'API
curl http://localhost:5002/api/health
```

---

## Dépannage

### Problème: Backend CI échoue

```bash
# Vérifier localement
cd apps/backend
npm ci
npx tsc --noEmit
npm run lint
npm run test
npm run build
```

**Solutions courantes:**
- Manque de dépendances: `npm ci --prefer-offline`
- Erreurs TypeScript: `npx tsc --noEmit --pretty`
- Tests échouent: Vérifier `.env` en local

### Problème: Deploy échoue

**Vérifier SSH:**
```bash
ssh -i ~/.ssh/game-plug-deploy ubuntu@your-server 'echo "OK"'
```

**Vérifier disk space:**
```bash
ssh ubuntu@your-server 'df -h'
```

**Vérifier Docker:**
```bash
ssh ubuntu@your-server 'docker ps'
```

### Problème: Slack notification non reçue

```
1. Vérifier le secret SLACK_WEBHOOK
2. Vérifier l'URL du webhook (commençant par https://hooks.slack.com)
3. Vérifier le channel Slack existe
4. Tester manuellement:
   curl -X POST -H 'Content-type: application/json' \
   --data '{"text":"test"}' \
   YOUR_WEBHOOK_URL
```

### Problème: Container ne démarre pas

```bash
# Sur le serveur
docker compose -f /srv/workspace/game-plug/docker-compose.yml logs backend

# Chercher les erreurs dans:
# - DATABASE_URL
# - REDIS_URL
# - JWT_SECRET
# - Permissions fichiers
```

---

## Vérification checklist

### Avant le premier déploiement

- [ ] Secrets GitHub configurés (DEPLOY_HOST, DEPLOY_USER, DEPLOY_KEY)
- [ ] Variables GitHub configurées (REGISTRY, NODE_VERSION)
- [ ] Clé SSH généré et ajoutée au serveur
- [ ] Fichier .env créé sur le serveur
- [ ] Docker Compose configuré sur le serveur
- [ ] Webhook Slack configuré (optionnel)
- [ ] Branch protection rules actifs
- [ ] Tests locaux passant

### Après le premier déploiement

- [ ] API accessible: `curl https://yourdomain.com/api/health`
- [ ] Frontend accessible: `https://yourdomain.com`
- [ ] Database connectée
- [ ] Redis fonctionnel
- [ ] Logs sans erreur
- [ ] SSL/TLS configuré (if applicable)
- [ ] Backups automatisés en place
- [ ] Monitoring configuré

---

## Commandes utiles

### Génération de secrets sécurisés

```bash
# JWT Secret
openssl rand -hex 32

# Passwords
python3 -c 'import secrets; print(secrets.token_urlsafe(32))'

# Ed25519 SSH Key
ssh-keygen -t ed25519 -f ~/.ssh/key -N ""
```

### Tester les workflows localement

```bash
# Installer act
brew install act

# Lancer un workflow
act push -f .github/workflows/backend-ci.yml

# Lancer avec secrets
act push -f .github/workflows/deploy.yml \
  -s DEPLOY_HOST=myserver.com \
  -s DEPLOY_USER=ubuntu \
  -s DEPLOY_KEY="$(cat ~/.ssh/id_ed25519)"
```

### Monitorer les déploiements

```bash
# SSH sur le serveur
ssh ubuntu@your-server

# Voir les logs en temps réel
docker compose -f /srv/workspace/game-plug/docker-compose.yml logs -f

# Redémarrer les services
docker compose -f /srv/workspace/game-plug/docker-compose.yml restart

# Voir l'état des containers
docker compose -f /srv/workspace/game-plug/docker-compose.yml ps
```

---

## Support

Pour des questions ou problèmes:

1. Vérifier les logs GitHub Actions (onglet "Actions" du repo)
2. Consulter la documentation: `.github/WORKFLOWS.md`
3. Vérifier les logs du serveur: `docker logs <container>`
4. Tester manuellement les commandes localement
