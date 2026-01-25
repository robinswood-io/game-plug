# Configuration Docker pour Game-Plug

## Résumé

Configuration Docker Compose complète et prête pour la production pour le projet Game-Plug avec 4 services:
- PostgreSQL 16 (base de données)
- Redis 7 (cache et sessions)
- NestJS Backend (API REST)
- Next.js 16 Frontend (application web)

**Date**: 2026-01-23
**État**: ✓ COMPLET ET VALIDÉ

---

## Fichiers Créés (10 fichiers)

### 1. Configuration Principale
**`docker-compose.yml`** (5.9 KB)
- Configuration Docker Compose complète
- 4 services orchestrés
- Health checks sur tous les services
- Dépendances de démarrage
- Volumes et réseau définis
- **À exécuter**: `docker compose up -d`

### 2. Variables d'Environnement
**`.env.example`** (6.5 KB)
- Template pour variables d'environnement
- Toutes les variables documentées
- Valeurs par défaut fournies
- Recommandations de sécurité
- **Action**: Copier à `.env` et configurer

### 3. Dockerfiles (Multi-étapes)
**`apps/backend/Dockerfile`** (2.7 KB)
- Build NestJS optimisé
- 3 étapes (deps, builder, runner)
- Image Alpine minimal
- Utilisateur non-root
- Health check intégré

**`apps/frontend/Dockerfile`** (2.7 KB)
- Build Next.js optimisé
- 3 étapes (deps, builder, runner)
- Node.js 20 Alpine
- Utilisateur non-root
- Health check intégré

### 4. Documentation

**`README_DOCKER.md`** (7.9 KB) - COMMENCER ICI
- Guide de démarrage rapide
- Configuration simple
- Commandes courantes
- Dépannage basique

**`DOCKER_SETUP.md`** (9.4 KB)
- Guide complet d'utilisation
- Toutes les commandes Docker Compose
- Gestion de base de données
- Dépannage détaillé
- Déploiement production

**`DOCKER_CONFIGURATION.md`** (14 KB)
- Spécifications techniques
- Détails de chaque service
- Configuration des volumes
- Implémentation des health checks
- Checklist production

**`DOCKER_VALIDATION_REPORT.md`** (12 KB)
- Rapport de validation complet
- Statut de chaque composant
- Vérifications de sécurité
- Checklist production

**`DOCKER_INDEX.md`**
- Index et référence des fichiers
- Guide d'utilisation par cas

### 5. Script d'Aide
**`scripts/docker-setup.sh`** (11 KB)
- Automatisation des opérations
- 15+ commandes disponibles
- Validation et monitoring
- Accès aux shells
- **Exécutable**: Oui

---

## Démarrage Rapide (5 minutes)

### Étape 1: Configuration
```bash
cd /srv/workspace/game-plug
cp .env.example .env
nano .env  # Éditer les valeurs (au minimum les mots de passe)
```

**Variables essentielles à changer**:
```env
POSTGRES_PASSWORD=votre-mot-de-passe-secure
REDIS_PASSWORD=votre-mot-de-passe-secure
JWT_SECRET=votre-cle-secrete
```

### Étape 2: Démarrage
```bash
docker compose up -d

# Ou avec le script helper:
./scripts/docker-setup.sh start
```

### Étape 3: Vérification
```bash
docker compose ps

# Tous les services doivent afficher "Up (healthy)"
```

### Étape 4: Accès
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5002
- **API Health**: http://localhost:5002/api/health
- **Database**: localhost:5432
- **Cache**: localhost:6379

---

## Services Configurés

### PostgreSQL 16
```
Container: game-plug-postgres
Port: localhost:5432
Base de données: game_plug
Volume: postgres_data (persiste les données)
Health: pg_isready (10 secondes)
Redémarrage: automatique
```

### Redis 7
```
Container: game-plug-redis
Port: localhost:6379
Volume: redis_data (persiste les données)
Health: redis-cli PING (10 secondes)
Redémarrage: automatique
Persistance: AOF activée
```

### NestJS Backend
```
Container: game-plug-backend
Port: localhost:5002
Build: ./apps/backend/Dockerfile
Health: GET /api/health (30 secondes)
Dépend de: postgres (healthy) + redis (healthy)
Redémarrage: automatique
```

### Next.js 16 Frontend
```
Container: game-plug-frontend
Port: localhost:5173 (port interne 3000)
Build: ./apps/frontend/Dockerfile
Health: GET / (30 secondes)
Dépend de: backend (healthy)
Redémarrage: automatique
```

---

## Commandes Essentielles

### Gestion des Services
```bash
docker compose up -d          # Démarrer
docker compose stop           # Arrêter (garde les données)
docker compose restart        # Redémarrer
docker compose down           # Arrêter et nettoyer
docker compose down -v        # Arrêter et effacer volumes (ATTENTION: perd les données)
```

### Monitoring et Logs
```bash
docker compose ps             # Statut des services
docker compose logs -f        # Logs de tous les services
docker compose logs -f backend # Logs du backend uniquement
docker compose stats          # Usage CPU/RAM/Réseau
```

### Accès aux Services
```bash
docker compose exec backend sh          # Shell backend
docker compose exec postgres psql ...   # PostgreSQL
docker compose exec redis redis-cli     # Redis CLI
```

### Rebuild
```bash
docker compose build          # Rebuild tout
docker compose build backend   # Rebuild backend seulement
```

---

## Script Helper (Recommandé)

```bash
./scripts/docker-setup.sh [commande]
```

### Commandes Disponibles
```
setup     - Configuration initiale
validate  - Valider Docker et configuration
health    - Vérifier la santé de tous les services
start     - Démarrer tous les services
stop      - Arrêter tous les services
restart   - Redémarrer tous les services
status    - Afficher le statut des services
logs      - Afficher les logs
rebuild   - Rebuilder les images Docker
shell     - Ouvrir un shell dans un conteneur
dbshell   - Shell PostgreSQL
redis     - CLI Redis
migrate   - Exécuter les migrations BD
clean     - Supprimer conteneurs (et optionnellement volumes)
```

### Exemples
```bash
./scripts/docker-setup.sh health      # Vérifier la santé
./scripts/docker-setup.sh logs backend # Voir logs du backend
./scripts/docker-setup.sh dbshell     # Accéder à PostgreSQL
./scripts/docker-setup.sh restart     # Redémarrer tout
```

---

## Variables d'Environnement

### Obligatoires
```env
POSTGRES_PASSWORD    # Mot de passe PostgreSQL
REDIS_PASSWORD       # Mot de passe Redis
JWT_SECRET          # Clé secrète JWT
```

### Optionnels (avec défauts)
```env
NODE_ENV=production           # Environnement
POSTGRES_DB=game_plug         # Nom base de données
POSTGRES_USER=game_plug       # Utilisateur BD
DATABASE_URL=...              # Chaîne connexion (auto-construite)
REDIS_URL=...                 # URL Redis (auto-construite)
NEXT_PUBLIC_API_URL=...       # URL API pour le frontend
API_PREFIX=/api               # Préfixe API
LOG_LEVEL=info               # Niveau de log
CORS_ORIGIN=...              # Origines CORS autorisées
```

Voir `.env.example` pour la liste complète avec explications.

---

## Documentation

### Lire Selon Votre Besoin

**Je suis nouveau - Où commencer?**
→ Lire: `README_DOCKER.md`

**Je veux comprendre le système**
→ Lire: `DOCKER_CONFIGURATION.md`

**J'ai un problème, comment le résoudre?**
→ Lire: `DOCKER_SETUP.md` section "Troubleshooting"
→ Exécuter: `./scripts/docker-setup.sh health`

**Je prépare la production**
→ Lire: `DOCKER_CONFIGURATION.md` section "Production Considerations"
→ Vérifier: `DOCKER_VALIDATION_REPORT.md`

**Je veux une référence complète**
→ Lire: `DOCKER_INDEX.md`

---

## Dépannage Rapide

### Les services ne démarrent pas
```bash
docker compose logs          # Voir les erreurs
# Vérifier:
# - Variables dans .env correctes
# - Ports disponibles (pas déjà utilisés)
# - Docker daemon en exécution
```

### Impossible de se connecter aux services
```bash
./scripts/docker-setup.sh health  # Vérifier la santé
docker compose ps                  # Vérifier le statut

# Les services doivent tous afficher "Up (healthy)"
```

### Erreurs de permissions
```bash
# Vérifier les droits du volume:
ls -la /var/lib/docker/volumes/
```

### Problèmes de performance
```bash
docker compose stats         # Voir CPU/RAM/Réseau
docker system df            # Voir l'usage disque
docker system prune         # Nettoyer les ressources inutilisées
```

---

## Structure des Fichiers

```
game-plug/
├── docker-compose.yml               # Configuration principale (EXÉCUTER CECI)
├── .env.example                     # Template variables (copier à .env)
├── README_DOCKER.md                 # Démarrage rapide
├── DOCKER_SETUP.md                  # Guide complet
├── DOCKER_CONFIGURATION.md          # Spécifications techniques
├── DOCKER_VALIDATION_REPORT.md      # Rapport de validation
├── DOCKER_INDEX.md                  # Index complet
├── CONFIGURATION_DOCKER_FR.md       # Ce fichier
│
├── apps/
│   ├── backend/
│   │   ├── Dockerfile               # Build NestJS
│   │   ├── src/                     # Code source
│   │   └── ...
│   │
│   └── frontend/
│       ├── Dockerfile               # Build Next.js
│       ├── app/                     # Code source
│       └── ...
│
├── scripts/
│   └── docker-setup.sh              # Script helper (exécutable)
│
└── init-db.sql                      # Initialisation base de données
```

---

## Sécurité

### ✓ Implemented
- Non-root users dans les conteneurs
- Gestion des signaux (dumb-init)
- Ports limités à 127.0.0.1 (localhost uniquement)
- Volumes read-only où applicable
- Mots de passe protégés
- Support JWT pour authentification
- Configuration CORS

### À Faire pour Production
- Générer des mots de passe forts: `openssl rand -hex 32`
- NE PAS committer `.env` en version control
- Utiliser un vault de secrets en production
- Configurer un reverse proxy (Nginx, Traefik) pour SSL/TLS
- Sauvegarder régulièrement la base de données

---

## Informations Utiles

### Health Checks (Monitorage Automatique)
Chaque service a un health check automatique:
- Si un service est unhealthy → redémarrage automatique
- Vérifier avec: `docker compose ps`

### Volumes (Persistance des Données)
- `postgres_data`: Données PostgreSQL (survit à `docker compose stop`)
- `redis_data`: Données Redis
- Attention: `docker compose down -v` **efface** les volumes

### Réseau
- Tous les services sur `game-plug-network`
- Communication par nom de service (DNS Docker)
- Services isolés du reste des applications Docker

### Logs
```bash
docker compose logs -f --timestamps    # Tous les logs avec timestamps
docker compose logs -f backend         # Logs du backend seulement
docker logs game-plug-backend          # Logs directs du conteneur
```

---

## Checklist Démarrage

- [ ] Docker et Docker Compose installés
- [ ] `.env` créé et configuré (mots de passe changés)
- [ ] Ports 5432, 6379, 5002, 5173 disponibles
- [ ] Disque libre disponible (base de données)
- [ ] Services démarrés: `docker compose up -d`
- [ ] Tous services "healthy": `docker compose ps`
- [ ] Frontend accessible: http://localhost:5173
- [ ] Backend accessible: http://localhost:5002/api/health

---

## Commandes Fréquentes

```bash
# Démarrage
docker compose up -d

# Monitoring
docker compose ps
docker compose logs -f

# Gestion BD
docker compose exec postgres psql -U game_plug -d game_plug

# Gestion Cache
docker compose exec redis redis-cli

# Nettoyage
docker compose down
docker system prune
```

---

## Ressources

- **Docker**: https://docs.docker.com/
- **Docker Compose**: https://docs.docker.com/compose/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Redis**: https://redis.io/docs/
- **NestJS**: https://docs.nestjs.com/
- **Next.js**: https://nextjs.org/docs

---

## Support

Pour l'aide:
1. Lire la documentation appropriée (voir section ci-dessus)
2. Exécuter: `./scripts/docker-setup.sh health`
3. Vérifier les logs: `docker compose logs`
4. Consulter `DOCKER_SETUP.md` pour le dépannage

---

**État**: ✓ COMPLET ET PRÊT
**Validé**: Oui
**Production Ready**: Oui
**Date**: 2026-01-23
