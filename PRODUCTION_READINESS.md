# Guide de Préparation Production - game-plug

**Date:** 2025-12-30
**Projet:** game-plug (Rôle Plug - Call of Cthulhu 7e)
**Version:** 2.0.0 (NestJS 11 + Next.js 15)

---

## ✅ Checklist Pré-Production

### Infrastructure

- [ ] **Serveur production provisionné**
  - CPU: Minimum 2 cores (recommandé 4)
  - RAM: Minimum 4GB (recommandé 8GB)
  - Disk: Minimum 50GB SSD
  - OS: Ubuntu 22.04 LTS ou similaire

- [ ] **Docker installé**
  - Docker Engine 24.x+
  - Docker Compose v2.x+

- [ ] **Domaine configuré**
  - DNS pointant vers serveur production
  - SSL/TLS certificat (Let's Encrypt recommandé)

- [ ] **Firewall configuré**
  - Port 80 (HTTP) ouvert
  - Port 443 (HTTPS) ouvert
  - Port 5432 (PostgreSQL) fermé (interne uniquement)
  - SSH port changé (recommandé)

### Base de Données

- [ ] **PostgreSQL production**
  - Version 15+
  - Backups automatiques configurés (daily minimum)
  - Réplication configurée (optionnel mais recommandé)
  - Connexions limitées (max_connections ajusté)

- [ ] **Migration données**
  - Script de migration testé en staging
  - Backup base actuelle créé
  - Plan de rollback documenté

### Variables d'Environnement

- [ ] **Secrets sécurisés**
  - `SESSION_SECRET` généré (minimum 32 caractères aléatoires)
  - `DATABASE_URL` avec credentials production
  - `OPENAI_API_KEY` valide et avec crédits suffisants

- [ ] **URLs production**
  - `FRONTEND_URL` configuré (https://votre-domaine.com)
  - `NEXT_PUBLIC_API_URL` configuré
  - `NEXT_PUBLIC_WS_URL` configuré (wss://)

### Monitoring

- [ ] **Logs centralisés**
  - Loki + Grafana (recommandé)
  - Ou solution alternative (ELK, CloudWatch, etc.)

- [ ] **Alertes configurées**
  - Healthcheck failures
  - Error rate > seuil
  - Disk space < 20%
  - Memory usage > 90%

- [ ] **Error tracking**
  - Sentry ou GlitchTip configuré
  - Source maps uploadés (frontend)

### Sécurité

- [ ] **SSL/TLS**
  - Certificat installé
  - Redirection HTTP → HTTPS
  - HSTS headers configurés

- [ ] **Headers sécurité**
  - CORS configuré correctement
  - CSP headers
  - X-Frame-Options
  - X-Content-Type-Options

- [ ] **Rate limiting**
  - Endpoints auth rate-limités (recommandé)
  - WebSocket connexions limitées

- [ ] **Secrets management**
  - Pas de secrets en clair dans code
  - `.env` gitignored
  - Variables env injectées au runtime

---

## 🚀 Déploiement Production

### 1. Préparation

```bash
# Connexion serveur production
ssh user@production-server

# Créer dossier application
sudo mkdir -p /opt/game-plug
sudo chown $USER:$USER /opt/game-plug
cd /opt/game-plug

# Cloner repository (ou copier fichiers)
git clone <repository-url> .
# OU
scp -r /opt/workspace/game-plug/* user@production:/opt/game-plug/
```

### 2. Configuration

```bash
# Créer fichier .env production
cat > .env << 'EOF'
# Database
DATABASE_URL=postgresql://postgres:SECURE_PASSWORD@db:5432/game_plug

# Auth
SESSION_SECRET=GENERATE_RANDOM_32_CHARS_HERE

# OpenAI
OPENAI_API_KEY=sk-YOUR_PRODUCTION_KEY

# App
PORT=5001
FRONTEND_URL=https://votre-domaine.com

# Next.js (dans .env.local pour frontend)
NEXT_PUBLIC_API_URL=https://votre-domaine.com/api
NEXT_PUBLIC_WS_URL=wss://votre-domaine.com
EOF

# Sécuriser permissions
chmod 600 .env
```

### 3. Docker Production

```bash
# Créer docker-compose.prod.yml
cat > docker-compose.prod.yml << 'EOF'
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    container_name: game-plug-db-prod
    environment:
      POSTGRES_DB: game_plug
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data_prod:/var/lib/postgresql/data
    networks:
      - game-plug-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: game-plug-backend-prod
    environment:
      DATABASE_URL: ${DATABASE_URL}
      SESSION_SECRET: ${SESSION_SECRET}
      PORT: 5001
      FRONTEND_URL: ${FRONTEND_URL}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      NODE_ENV: production
    depends_on:
      db:
        condition: service_healthy
    networks:
      - game-plug-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:5001/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.game-plug-api.rule=Host(`votre-domaine.com`) && PathPrefix(`/api`)"
      - "traefik.http.routers.game-plug-api.entrypoints=websecure"
      - "traefik.http.routers.game-plug-api.tls.certresolver=letsencrypt"
      - "traefik.http.services.game-plug-api.loadbalancer.server.port=5001"

  frontend:
    build:
      context: ./app
      dockerfile: Dockerfile
    container_name: game-plug-frontend-prod
    environment:
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
      NEXT_PUBLIC_WS_URL: ${NEXT_PUBLIC_WS_URL}
      NODE_ENV: production
    depends_on:
      - backend
    networks:
      - game-plug-network
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.game-plug-front.rule=Host(`votre-domaine.com`)"
      - "traefik.http.routers.game-plug-front.entrypoints=websecure"
      - "traefik.http.routers.game-plug-front.tls.certresolver=letsencrypt"
      - "traefik.http.services.game-plug-front.loadbalancer.server.port=3000"

networks:
  game-plug-network:
    driver: bridge

volumes:
  postgres_data_prod:
    name: game-plug-postgres-prod
EOF
```

### 4. Build et Déploiement

```bash
# Build images
docker compose -f docker-compose.prod.yml build

# Démarrer services
docker compose -f docker-compose.prod.yml up -d

# Vérifier status
docker compose -f docker-compose.prod.yml ps

# Vérifier logs
docker compose -f docker-compose.prod.yml logs -f
```

### 5. Vérification

```bash
# Health checks
curl https://votre-domaine.com/api/health

# Frontend
curl https://votre-domaine.com

# WebSocket (depuis navigateur)
# Ouvrir console développeur et tester connexion WS
```

---

## 🔄 Plan de Rollback

### Scénario: Problème après déploiement

#### Option 1: Rollback containers

```bash
# Stop new version
docker compose -f docker-compose.prod.yml down

# Démarrer ancienne version
docker compose -f docker-compose.prod.OLD.yml up -d

# Vérifier
docker ps
curl https://votre-domaine.com/api/health
```

#### Option 2: Rollback database

```bash
# Restaurer backup
docker exec game-plug-db-prod pg_restore -U postgres -d game_plug /backups/backup_YYYYMMDD.sql

# OU avec dump
cat backup.sql | docker exec -i game-plug-db-prod psql -U postgres -d game_plug
```

#### Option 3: Rollback complet

```bash
# 1. Stop tous containers
docker compose -f docker-compose.prod.yml down

# 2. Restaurer ancienne version code
git checkout <previous-commit>

# 3. Rebuild
docker compose -f docker-compose.prod.yml up --build -d

# 4. Restaurer DB si nécessaire
# (voir Option 2)
```

### Temps de Rollback Estimé

- **Rollback containers:** 2-5 minutes
- **Rollback database:** 5-15 minutes (dépend de la taille)
- **Rollback complet:** 10-20 minutes

---

## 📊 Monitoring Production

### Health Checks

```bash
# Script de monitoring (à ajouter au cron)
#!/bin/bash
# /opt/game-plug/scripts/health-check.sh

HEALTH_URL="https://votre-domaine.com/api/health"

# Check API health
response=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ "$response" != "200" ]; then
  echo "❌ Health check FAILED (HTTP $response)"
  # Envoyer alerte (email, Slack, etc.)
  exit 1
else
  echo "✅ Health check OK"
  exit 0
fi
```

### Logs

```bash
# Rotation logs Docker
cat > /etc/docker/daemon.json << 'EOF'
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

systemctl restart docker
```

### Métriques

```bash
# Prometheus metrics (optionnel)
# Ajouter dans server/src/main.ts
import * as promBundle from 'express-prom-bundle';

const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  customLabels: { service: 'game-plug-backend' },
  promClient: { collectDefaultMetrics: {} }
});

app.use(metricsMiddleware);
```

---

## 🔐 Sécurité Production

### 1. Génération Secrets

```bash
# SESSION_SECRET (32 chars aléatoires)
openssl rand -base64 32

# DB Password
openssl rand -base64 24
```

### 2. Firewall

```bash
# UFW (Ubuntu)
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 3. Fail2ban

```bash
# Installer fail2ban
sudo apt install fail2ban

# Configurer pour SSH
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Éditer jail.local
[sshd]
enabled = true
maxretry = 3
bantime = 3600
```

### 4. Rate Limiting (NestJS)

```typescript
// server/src/main.ts
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
});

app.use('/api/auth', limiter);
```

---

## 📦 Backups

### Database Backup

```bash
#!/bin/bash
# /opt/game-plug/scripts/backup-db.sh

BACKUP_DIR="/opt/game-plug/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql"

# Créer dossier backups
mkdir -p $BACKUP_DIR

# Backup
docker exec game-plug-db-prod pg_dump -U postgres game_plug > $BACKUP_FILE

# Compresser
gzip $BACKUP_FILE

# Garder seulement 7 derniers backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "✅ Backup created: $BACKUP_FILE.gz"
```

### Cron Backup

```bash
# Ajouter au crontab
crontab -e

# Backup daily at 2am
0 2 * * * /opt/game-plug/scripts/backup-db.sh >> /var/log/game-plug-backup.log 2>&1
```

### Backup Offsite

```bash
# Sync vers cloud storage (exemple avec AWS S3)
#!/bin/bash
aws s3 sync /opt/game-plug/backups s3://your-bucket/game-plug-backups/ \
  --delete \
  --storage-class STANDARD_IA
```

---

## 🧪 Tests Post-Déploiement

### Checklist Immédiate

Après déploiement, vérifier **dans les 5 premières minutes:**

```bash
# 1. Containers running
docker ps --filter "name=game-plug"

# 2. Health checks
curl https://votre-domaine.com/api/health
# Expected: {"status":"ok",...}

# 3. Frontend accessible
curl https://votre-domaine.com
# Expected: HTML page with "Rôle Plug"

# 4. Auth endpoint
curl https://votre-domaine.com/api/auth/user
# Expected: 401 Unauthorized (normal sans session)

# 5. Logs sans erreurs
docker logs game-plug-backend-prod --tail 50
docker logs game-plug-frontend-prod --tail 50
```

### Tests Fonctionnels (1h post-déploiement)

- [ ] Signup GM fonctionne
- [ ] Login GM fonctionne
- [ ] Créer session fonctionne
- [ ] Code session généré (6 chars)
- [ ] Rejoindre session fonctionne
- [ ] Créer personnage fonctionne
- [ ] Avatar DALL-E fonctionne (si API key configurée)
- [ ] Dice rolls fonctionnent
- [ ] WebSocket temps réel fonctionne
- [ ] Projection gameboard fonctionne

### Tests Performance (24h post-déploiement)

- [ ] Response time API < 500ms (p95)
- [ ] Frontend load time < 3s
- [ ] WebSocket latency < 100ms
- [ ] Memory usage stable (pas de leak)
- [ ] CPU usage < 70% en moyenne

---

## 📞 Support & Troubleshooting

### Problèmes Courants

#### Backend ne démarre pas

```bash
# Vérifier logs
docker logs game-plug-backend-prod

# Vérifier variables env
docker exec game-plug-backend-prod env | grep -E "DATABASE_URL|SESSION_SECRET"

# Vérifier connexion DB
docker exec game-plug-backend-prod ping db
```

#### Frontend 502 Bad Gateway

```bash
# Vérifier backend accessible
curl http://localhost:5001/api/health

# Vérifier Traefik logs
docker logs traefik

# Vérifier labels Docker
docker inspect game-plug-backend-prod | grep -A 10 Labels
```

#### WebSocket ne connecte pas

```bash
# Vérifier NEXT_PUBLIC_WS_URL
echo $NEXT_PUBLIC_WS_URL
# Doit être wss:// en production (pas ws://)

# Vérifier CORS
curl -H "Origin: https://votre-domaine.com" \
  https://votre-domaine.com/api/health -v
```

#### Base de données lente

```bash
# Vérifier connexions
docker exec game-plug-db-prod psql -U postgres -d game_plug \
  -c "SELECT count(*) FROM pg_stat_activity;"

# Vérifier slow queries
docker exec game-plug-db-prod psql -U postgres -d game_plug \
  -c "SELECT query, calls, total_time FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"
```

### Contacts Support

- **Documentation:** `/opt/game-plug/MIGRATION_COMPLETE.md`
- **Logs:** `/var/log/game-plug-backup.log`
- **Monitoring:** https://votre-monitoring.com

---

## ✅ Go/No-Go Checklist Finale

### Avant de passer en production

- [ ] Tous tests staging passent
- [ ] Backups configurés et testés
- [ ] Rollback plan testé
- [ ] Monitoring opérationnel
- [ ] Alertes configurées
- [ ] SSL/TLS configuré
- [ ] Firewall configuré
- [ ] Secrets sécurisés
- [ ] Documentation à jour
- [ ] Équipe support formée

### Si UN seul item non coché → NO-GO

**Ne pas déployer en production sans avoir tout vérifié.**

---

**Document de préparation production - game-plug v2.0.0**

Dernière mise à jour: 2025-12-30
