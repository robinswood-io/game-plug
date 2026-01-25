# Guide de Déploiement - Game Plug

Guide complet pour déployer Game Plug en production sur serveurs Linux, avec Docker Compose, HTTPS et monitoring.

## Table des Matières

- [Prérequis](#prérequis)
- [Architecture Production](#architecture-production)
- [Installation Initiale](#installation-initiale)
- [Configuration SSL/TLS](#configuration-ssltls)
- [Déploiement](#déploiement)
- [Mises à Jour](#mises-à-jour)
- [Monitoring & Logs](#monitoring--logs)
- [Backup & Restore](#backup--restore)
- [Troubleshooting](#troubleshooting)

---

## Prérequis

### Serveur Linux

- **OS**: Ubuntu 22.04 LTS ou Debian 12+
- **CPU**: 2+ cores
- **RAM**: 4GB minimum (8GB recommended)
- **Disk**: 50GB+ SSD
- **Network**: Static IP, ports 80, 443, SSH ouvert

### Logiciels

```bash
# Vérifier les pré-requis
uname -a                    # Linux x86_64
node --version              # v20.x
npm --version               # 10.x
docker --version            # 24.x+
docker compose --version    # 2.x+
```

### DNS & Domaine

- Domaine valide (ex: gameplug.dev)
- DNS pointing vers IP serveur
- Access SSH clé

### Compte OpenAI (optionnel)

Pour génération d'avatars IA, créez un compte sur https://openai.com/api

---

## Architecture Production

### Topologie Réseau

```
Internet
    ↓ (443/80)
┌─────────────────────────┐
│  Nginx Reverse Proxy    │
│  - SSL/TLS termination  │
│  - Load balancing       │
│  - Rate limiting        │
└──────────┬──────────────┘
           ↓ (5002, 5173)
┌──────────┴─────────────────────┐
│   Docker Compose Stack          │
├─────────────────────────────────┤
│ PostgreSQL 16                   │
│ Redis 7                         │
│ Backend NestJS (5002)           │
│ Frontend Next.js (5173)         │
└─────────────────────────────────┘
           ↓
    External APIs:
    - OpenAI (optional)
```

### Services Docker

| Service | Port | Healthcheck | Restart |
|---------|------|-------------|---------|
| postgres | 5432 | pg_isready | unless-stopped |
| redis | 6379 | redis-cli ping | unless-stopped |
| backend | 5002 | /api/health | unless-stopped |
| frontend | 5173 | HTTP 200 | unless-stopped |

---

## Installation Initiale

### 1. Préparer le Serveur

```bash
# Mettre à jour le système
sudo apt-get update && sudo apt-get upgrade -y

# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Installer Docker Compose
sudo apt-get install docker-compose-plugin

# Ajouter utilisateur au groupe docker
sudo usermod -aG docker $USER
newgrp docker

# Vérifier installation
docker --version && docker compose version
```

### 2. Cloner le Repository

```bash
# Créer dossier de production
sudo mkdir -p /opt/game-plug
sudo chown $USER:$USER /opt/game-plug
cd /opt/game-plug

# Cloner avec branche stable
git clone --branch main https://github.com/votre-org/game-plug.git .

# Ou si SSH est configuré:
git clone git@github.com:votre-org/game-plug.git .
```

### 3. Configurer Variables d'Environnement

```bash
# Copier template
cp .env.example .env

# Éditer avec vos valeurs
nano .env
```

**Variables production essentielles:**

```env
# Application
NODE_ENV=production
LOG_LEVEL=info

# Database (changez les mots de passe!)
POSTGRES_DB=game_plug
POSTGRES_USER=game_plug
POSTGRES_PASSWORD=<strong-random-password-32-chars>
DATABASE_URL=postgresql://game_plug:<password>@postgres:5432/game_plug

# Redis
REDIS_PASSWORD=<strong-random-password-32-chars>
REDIS_URL=redis://:password@redis:6379

# JWT (générer avec: openssl rand -hex 32)
JWT_SECRET=<strong-jwt-secret-64-chars>
SESSION_SECRET=<strong-session-secret-64-chars>
JWT_EXPIRATION=86400

# CORS (votre domaine)
CORS_ORIGIN=https://gameplug.dev,https://api.gameplug.dev

# Frontend
NEXT_PUBLIC_API_URL=https://api.gameplug.dev
NEXT_PUBLIC_WS_URL=wss://api.gameplug.dev

# OpenAI (optionnel)
OPENAI_API_KEY=sk-<votre-clé>
OPENAI_MODEL=gpt-4-turbo-preview

# Ports (derrière Nginx, ports internes)
BACKEND_PORT=5002
FRONTEND_PORT=5173
```

### 4. Générer les Secrets

```bash
# JWT Secret (32 bytes = 64 hex chars)
openssl rand -hex 32

# Session Secret
openssl rand -hex 32

# Database & Redis passwords
openssl rand -base64 32
```

### 5. Configurer Docker Compose

Vérifier `docker-compose.yml`:

```yaml
# volumes utilise les données persistantes
volumes:
  postgres_data:
    name: game-plug-postgres-data
  redis_data:
    name: game-plug-redis-data

# health checks activés
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U game_plug"]
  interval: 10s
  timeout: 5s
  retries: 5
```

---

## Configuration SSL/TLS

### 1. Installer Certbot

```bash
sudo apt-get install certbot python3-certbot-nginx

# ou pour manual cert:
sudo apt-get install certbot python3-certbot-dns-cloudflare
```

### 2. Créer Certificat Let's Encrypt

```bash
# Interactive
sudo certbot certonly --standalone -d gameplug.dev -d api.gameplug.dev

# Ou avec Nginx:
sudo certbot certonly --nginx -d gameplug.dev -d api.gameplug.dev
```

Certificats créés dans: `/etc/letsencrypt/live/gameplug.dev/`

### 3. Configurer Nginx

Créer `/opt/game-plug/nginx.conf`:

```nginx
# Redirect HTTP → HTTPS
server {
    listen 80;
    server_name gameplug.dev api.gameplug.dev;
    return 301 https://$server_name$request_uri;
}

# HTTPS - Frontend
server {
    listen 443 ssl http2;
    server_name gameplug.dev;

    ssl_certificate /etc/letsencrypt/live/gameplug.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/gameplug.dev/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# HTTPS - Backend API
server {
    listen 443 ssl http2;
    server_name api.gameplug.dev;

    ssl_certificate /etc/letsencrypt/live/gameplug.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/gameplug.dev/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;
    limit_req zone=api burst=20 nodelay;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Gzip compression
    gzip on;
    gzip_types application/json text/plain application/javascript;

    location / {
        proxy_pass http://localhost:5002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;

        # WebSocket support
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
    }

    location /ws {
        proxy_pass http://localhost:5002/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_buffering off;
    }
}
```

### 4. Installer Nginx

```bash
sudo apt-get install nginx
sudo cp nginx.conf /etc/nginx/sites-available/game-plug
sudo ln -s /etc/nginx/sites-available/game-plug /etc/nginx/sites-enabled/

# Valider config
sudo nginx -t

# Démarrer
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 5. Renouvellement Automatique Certbot

```bash
# Cron job (déjà installé avec certbot)
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Tester
sudo certbot renew --dry-run
```

---

## Déploiement

### 1. Démarrer les Services

```bash
cd /opt/game-plug

# Construire images (optionnel, docker compose pull sinon)
docker compose build

# Démarrer les services
docker compose up -d

# Vérifier statut
docker compose ps
# Tous les services doivent être "Up"

# Vérifier logs
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

### 2. Initialiser la Base de Données

```bash
# Vérifier connexion PostgreSQL
docker compose exec postgres pg_isready

# Pousser le schéma Drizzle
npm run db:push

# Vérifier données
docker compose exec postgres psql -U game_plug -d game_plug \
  -c "SELECT * FROM users LIMIT 1;"
```

### 3. Vérifier la Santé

```bash
# API health
curl -k https://api.gameplug.dev/api/health
# → {"status":"ok","timestamp":"2025-01-23T..."}

# Frontend
curl -k https://gameplug.dev
# → HTML page

# WebSocket
wscat -c wss://api.gameplug.dev/ws
# Connection établie
```

### 4. Tester Fonctionnalités

```bash
# 1. Login
curl -X POST https://api.gameplug.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 2. Créer personnage
curl -X POST https://api.gameplug.dev/api/characters \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","occupation":"Detective","age":35}'

# 3. Vérifier frontend
# Visiter https://gameplug.dev dans le navigateur
```

---

## Mises à Jour

### Processus de Déploiement Continu

```bash
cd /opt/game-plug

# 1. Pull latest code
git fetch origin
git checkout main
git pull origin main

# 2. Rebuild images
docker compose build

# 3. Stop old services (grace period 30s)
docker compose down --timeout=30

# 4. Start new services
docker compose up -d

# 5. Run migrations
npm run db:push

# 6. Health checks
docker compose ps
curl https://api.gameplug.dev/api/health

# 7. Smoke tests (optionnel)
npm run test:smoke
```

### Zero-Downtime Updates (Avec Load Balancer)

Si vous avez plusieurs instances backend:

```bash
# 1. Arrêter Instance 1
docker compose stop backend-1

# 2. Update code, rebuild, start
git pull
docker compose build backend-1
docker compose up -d backend-1

# 3. Health check
docker compose exec backend-1 curl localhost:5002/api/health

# 4. Arrêter Instance 2 et répéter
# Load balancer le route vers Instance 1 pendant ce temps
```

### Rollback d'Urgence

```bash
# Revenir à la dernière version stable
git checkout <commit-hash>
docker compose build
docker compose up -d

# Ou avec Git tags
git checkout v1.2.3
```

---

## Monitoring & Logs

### Logs en Temps Réel

```bash
# Tous les services
docker compose logs -f

# Service spécifique
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres

# Dernier N lignes
docker compose logs --tail=100 backend

# Avec timestamps
docker compose logs -f -t backend
```

### Persistance des Logs

Créer `/opt/game-plug/docker-compose.logging.yml`:

```yaml
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "5"
        labels: "app=game-plug"
```

Voir les logs:
```bash
docker logs game-plug-backend --since 1h
```

### Monitoring Health Checks

```bash
# Vérifier health endpoint régulièrement
watch -n 10 'curl -s https://api.gameplug.dev/api/health | jq .'

# Ou créer un script
#!/bin/bash
while true; do
  curl -f https://api.gameplug.dev/api/health || \
    echo "ERROR: API is down!"
  sleep 60
done
```

### Alertes Recommandées

Configurer alertes si:
- API retourne 500+ errors
- Response time > 5s
- Database connection errors
- Disk space < 10GB
- Docker service stopped

### Monitoring Optionnel - Prometheus + Grafana

Ajouter au `docker-compose.yml`:

```yaml
prometheus:
  image: prom/prometheus
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
  ports:
    - "9090:9090"

grafana:
  image: grafana/grafana
  ports:
    - "3000:3000"
  volumes:
    - grafana_data:/var/lib/grafana

volumes:
  grafana_data:
```

---

## Backup & Restore

### Backup PostgreSQL

```bash
# Dump complet
docker compose exec postgres pg_dump -U game_plug game_plug > backup.sql

# Compression
docker compose exec postgres pg_dump -U game_plug game_plug | gzip > backup.sql.gz

# Backup automatique (cron)
0 2 * * * cd /opt/game-plug && \
  docker compose exec -T postgres pg_dump -U game_plug game_plug | \
  gzip > /backups/game-plug-$(date +%Y%m%d-%H%M%S).sql.gz
```

### Backup Redis (Sessions)

```bash
# Copy RDB file
docker cp game-plug-redis:/data/dump.rdb ./redis-backup.rdb

# Ou backup automatique (configured in docker-compose.yml)
# appendonly yes → AOF file automatically saved
```

### Backup Complet du Système

```bash
#!/bin/bash
BACKUP_DIR="/backups/game-plug-$(date +%Y%m%d-%H%M%S)"
mkdir -p $BACKUP_DIR

# Database
docker compose exec -T postgres pg_dump -U game_plug game_plug | \
  gzip > $BACKUP_DIR/database.sql.gz

# Docker volumes
docker run --rm \
  -v game-plug-postgres-data:/data \
  -v $BACKUP_DIR:/backup \
  alpine tar czf /backup/postgres-volume.tar.gz -C /data .

# Application files
tar czf $BACKUP_DIR/app-files.tar.gz \
  docker-compose.yml \
  .env \
  nginx.conf \
  apps/

# Upload to S3 (optionnel)
aws s3 cp $BACKUP_DIR s3://backups/game-plug/ --recursive
```

### Restore PostgreSQL

```bash
# Depuis dump SQL
cat backup.sql | docker compose exec -T postgres psql -U game_plug game_plug

# Depuis gzip
gunzip < backup.sql.gz | docker compose exec -T postgres psql -U game_plug game_plug

# Depuis Docker volume backup
docker run --rm \
  -v game-plug-postgres-data:/data \
  -v .:/backup \
  alpine tar xzf /backup/postgres-volume.tar.gz -C /data
```

### Restore de Désastre Complet

```bash
# 1. Restaurer serveur + Docker
# ... (réinstaller OS, Docker, etc)

# 2. Restaurer application
cd /opt/game-plug
tar xzf app-files.tar.gz

# 3. Restaurer volumes
docker run --rm \
  -v game-plug-postgres-data:/data \
  -v backups:/backup \
  alpine tar xzf /backup/postgres-volume.tar.gz -C /data

# 4. Démarrer services
docker compose up -d

# 5. Vérifier
docker compose ps
curl https://api.gameplug.dev/api/health
```

---

## Troubleshooting

### Services ne démarrent pas

```bash
# Vérifier logs
docker compose logs backend

# Erreurs communes:
# "port already in use" → changer port dans .env
# "connection refused" → vérifier env variables
# "image not found" → docker compose build

# Redémarrer tout
docker compose down
docker compose up -d
```

### Base de données ne répond pas

```bash
# Vérifier connexion
docker compose exec postgres pg_isready -U game_plug

# Voir logs PostgreSQL
docker compose logs postgres

# Redémarrer
docker compose restart postgres

# Réinitialiser (perte de données!)
docker compose down
docker volume rm game-plug-postgres-data
docker compose up -d postgres
npm run db:push
```

### WebSocket ne se connecte pas

```bash
# Vérifier WS endpoint
curl -i -N \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  https://api.gameplug.dev/ws

# Vérifier Nginx config
sudo nginx -t

# Voir logs Nginx
sudo tail -f /var/log/nginx/error.log
```

### Certificat SSL expiré

```bash
# Renouveler
sudo certbot renew --force-renewal

# Vérifier expiration
openssl s_client -connect api.gameplug.dev:443 -showcerts | \
  openssl x509 -noout -dates
```

### Espace disque faible

```bash
# Vérifier utilisation
df -h

# Nettoyer Docker
docker system prune -a
docker volume prune

# Archiver et supprimer vieux logs
cd /opt/game-plug
tar czf backups/logs-archive-$(date +%Y%m%d).tar.gz *.log
rm *.log
```

### Performance dégradée

```bash
# Vérifier CPU/Memory
docker stats

# Vérifier PostgreSQL
docker compose exec postgres psql -U game_plug -d game_plug \
  -c "SELECT * FROM pg_stat_statements ORDER BY total_time DESC;"

# Augmenter ressources:
# - Éditer docker-compose.yml (ajouter deploy.resources.limits)
# - Redémarrer services
```

### Regénérer JWT secrets

```bash
# ATTENTION: Cela déconnecte tous les utilisateurs

# Générer nouveau JWT_SECRET
openssl rand -hex 32

# Éditer .env
nano .env
# Changer JWT_SECRET

# Redémarrer backend
docker compose restart backend

# Tous les tokens existants sont invalidés
# Les utilisateurs doivent se reconnecter
```

---

## Checklist Pré-Production

Avant de deployer:

- [ ] SSL/TLS installé et configuré
- [ ] Nginx en place et testé
- [ ] Environment variables configurées (secrets forts)
- [ ] Database backup automatisé
- [ ] Logs persistés et archivés
- [ ] Health checks validés
- [ ] Load testing fait (capacité > 2x traffic max)
- [ ] Security headers configurés
- [ ] CORS whitelist réglé
- [ ] Monitoring/alertes en place
- [ ] Procédure rollback testée
- [ ] Disaster recovery plan documenté

---

## Checklist Maintenance Régulière

**Hebdomadaire:**
- [ ] Vérifier logs erreurs
- [ ] Vérifier space disque
- [ ] Tester backup restore

**Mensuel:**
- [ ] Renouveler certificat (auto)
- [ ] Vérifier sécurité updates Docker
- [ ] Revoir performances logs
- [ ] Rotation des secrets

**Annuellement:**
- [ ] Security audit
- [ ] Disaster recovery drill
- [ ] Upgrade version major OS/Docker

---

## Ressources

- [Docker Compose Official Docs](https://docs.docker.com/compose/)
- [Nginx Reverse Proxy](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/docs/)
- [PostgreSQL Backup & Restore](https://www.postgresql.org/docs/current/backup.html)
- [NestJS Deployment](https://docs.nestjs.com/deployment)

---

**Dernière mise à jour: 23 Janvier 2025**

Pour support: support@gameplug.dev
