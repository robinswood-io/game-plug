# Docker Compose Setup Guide

## Overview

This guide explains how to set up and run the Game-Plug application using Docker Compose. The configuration includes:

- **Backend**: NestJS application on port 5002
- **Frontend**: Next.js 16 application on port 5173
- **PostgreSQL**: Database on port 5432
- **Redis**: Cache and session store on port 6379

## Prerequisites

- Docker (version 20.10+)
- Docker Compose (version 1.29+)
- Git

## Quick Start

### 1. Clone and Setup

```bash
cd /srv/workspace/game-plug
```

### 2. Configure Environment

```bash
# Copy the example env file
cp .env.example .env

# Edit with your values (especially secrets)
nano .env
```

**Important environment variables:**

```env
# Change these in production:
POSTGRES_PASSWORD=your-secure-password
REDIS_PASSWORD=your-secure-password
JWT_SECRET=your-secret-key-here

# For Docker internal communication:
NEXT_PUBLIC_API_URL=http://backend:5002
DATABASE_URL=postgresql://game_plug:password@postgres:5432/game_plug
REDIS_URL=redis://:password@redis:6379
```

### 3. Start Services

```bash
# Start all services in detached mode
docker compose up -d

# Or with logs visible
docker compose up

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f frontend
```

### 4. Verify Health

```bash
# Check service status
docker compose ps

# Expected output:
# NAME                   STATUS              PORTS
# game-plug-postgres     Up (healthy)        127.0.0.1:5432->5432/tcp
# game-plug-redis        Up (healthy)        127.0.0.1:6379->6379/tcp
# game-plug-backend      Up (healthy)        127.0.0.1:5002->5002/tcp
# game-plug-frontend     Up (healthy)        127.0.0.1:5173->3000/tcp
```

### 5. Access Services

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5002
- **Backend Health**: http://localhost:5002/api/health
- **Database**: `localhost:5432` (use psql or GUI tool)
- **Redis**: `localhost:6379` (use redis-cli)

## Service Details

### PostgreSQL

- **Image**: postgres:16-alpine
- **Container**: game-plug-postgres
- **Port**: 5432 (localhost only)
- **Volume**: `postgres_data` → `/var/lib/postgresql/data`
- **Health Check**: `pg_isready` every 10s
- **Initialization**: Runs `init-db.sql` on first start

### Redis

- **Image**: redis:7-alpine
- **Container**: game-plug-redis
- **Port**: 6379 (localhost only)
- **Volume**: `redis_data` → `/data`
- **Health Check**: `redis-cli PING` every 10s
- **AOF Persistence**: Enabled by default

### Backend (NestJS)

- **Build Context**: `./apps/backend`
- **Dockerfile**: Multi-stage, optimized for production
- **Container**: game-plug-backend
- **Port**: 5002
- **Dependencies**: Postgres (healthy), Redis (healthy)
- **Health Check**: HTTP GET `/api/health` every 30s
- **Environment**: Injected from `.env` file
- **Volumes**:
  - `./apps/backend/src` (read-only) - source code
  - `./apps/backend/dist` - build output

**Environment variables for backend:**

```env
NODE_ENV=production
PORT=5002
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
API_PREFIX=/api
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### Frontend (Next.js 16)

- **Build Context**: `./apps/frontend`
- **Dockerfile**: Multi-stage, optimized for production
- **Container**: game-plug-frontend
- **Port**: 3000 (mapped to 5173)
- **Dependencies**: Backend (healthy)
- **Health Check**: HTTP GET `/` every 30s
- **Volumes**:
  - `./.next` - Next.js build cache
  - `./public` (read-only) - static assets

**Environment variables for frontend:**

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://backend:5002
NEXT_TELEMETRY_DISABLED=1
```

## Common Commands

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
docker compose logs -f redis

# Last N lines
docker compose logs --tail 100 backend
```

### Start/Stop/Restart

```bash
# Stop all services (keeps data in volumes)
docker compose stop

# Start stopped services
docker compose start

# Restart a service
docker compose restart backend

# Restart all
docker compose restart

# Complete teardown (removes containers, networks, but keeps volumes)
docker compose down

# Teardown and remove volumes (WARNING: deletes data)
docker compose down -v
```

### Rebuild Images

```bash
# Rebuild backend image
docker compose build backend

# Rebuild all images
docker compose build

# Build and start
docker compose up -d --build
```

### Access Container Shells

```bash
# Backend shell
docker compose exec backend sh

# Frontend shell
docker compose exec frontend sh

# Database shell (psql)
docker compose exec postgres psql -U game_plug -d game_plug

# Redis CLI
docker compose exec redis redis-cli
```

## Database Management

### Connect via psql

```bash
# From host machine
psql postgresql://game_plug:password@localhost:5432/game_plug

# From Docker
docker compose exec postgres psql -U game_plug -d game_plug

# Common commands:
# \dt - list tables
# \di - list indexes
# \q - quit
```

### Run Migrations

```bash
# Backend container
docker compose exec backend bun run migrate

# Or with npm
docker compose exec backend npm run migrate
```

### Backup Database

```bash
# Create backup
docker compose exec postgres pg_dump -U game_plug game_plug > backup.sql

# Restore from backup
docker compose exec -T postgres psql -U game_plug game_plug < backup.sql
```

## Redis Management

### Access Redis CLI

```bash
# Interactive Redis CLI
docker compose exec redis redis-cli

# Execute command directly
docker compose exec redis redis-cli PING
docker compose exec redis redis-cli KEYS "*"
docker compose exec redis redis-cli FLUSHALL  # ⚠️ Clears all data
```

## Health Checks

Docker Compose automatically monitors service health:

```bash
# View health status
docker compose ps

# Service will restart if unhealthy
# Check logs for health check failures
docker compose logs postgres | grep -i health
```

### Manual Health Verification

```bash
# Backend API
curl http://localhost:5002/api/health

# Frontend
curl http://localhost:5173

# Database
psql -h localhost -U game_plug -d game_plug -c "SELECT 1"

# Redis
docker compose exec redis redis-cli PING
```

## Troubleshooting

### Service won't start

```bash
# Check logs for errors
docker compose logs backend

# Common issues:
# - Port already in use: docker compose down && docker compose up
# - Volume permission errors: check docker user permissions
# - Out of disk space: docker system prune
```

### Database connection errors

```bash
# Verify database is healthy
docker compose ps postgres

# Check credentials in .env match Dockerfile
grep POSTGRES .env
grep POSTGRES docker-compose.yml

# Test connection
docker compose exec postgres pg_isready -U game_plug
```

### Redis connection errors

```bash
# Verify Redis is healthy
docker compose ps redis

# Test connection
docker compose exec redis redis-cli PING

# Check password matches .env
grep REDIS_PASSWORD .env
```

### Frontend can't reach backend

```bash
# Verify both are healthy
docker compose ps

# Check NEXT_PUBLIC_API_URL in .env
grep NEXT_PUBLIC_API_URL .env

# From frontend container
docker compose exec frontend curl http://backend:5002/api/health
```

## Production Deployment

For production deployment, use the central deployment system:

```bash
cd /srv/workspace
docker compose -f docker-compose.apps.yml up -d game-plug
docker compose -f docker-compose.apps.yml logs game-plug
```

### Production Checklist

- [ ] Change all default passwords
- [ ] Generate strong JWT_SECRET
- [ ] Set NODE_ENV=production
- [ ] Update CORS_ORIGIN for production domain
- [ ] Enable SSL/TLS (via reverse proxy)
- [ ] Set up monitoring and logging
- [ ] Configure backups for PostgreSQL
- [ ] Test database recovery
- [ ] Load test the application

## Development vs Production

### Development (`docker-compose.yml`)

- Ports bound to `127.0.0.1` (localhost only)
- Default weak passwords for convenience
- Source code volumes for hot-reload
- Debug logging enabled

### Production (`docker-compose.apps.yml`)

- No direct port exposure
- Strong secrets required
- Optimized builds
- Reverse proxy (Traefik) for routing
- Centralized monitoring

## Monitoring

### View Resource Usage

```bash
# CPU, memory, network stats
docker compose stats

# Specific service
docker stats game-plug-backend
```

### Continuous Log Monitoring

```bash
# Follow all logs with timestamps
docker compose logs -f --timestamps

# Follow specific service with timestamp
docker compose logs -f --timestamps backend
```

## Cleanup

```bash
# Remove stopped containers
docker system prune

# Remove unused images
docker image prune

# Remove all unused resources (⚠️ be careful)
docker system prune -a

# Remove volumes (⚠️ deletes data)
docker volume prune
```

## Useful Documentation

- [Docker Compose Docs](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Redis Docker Image](https://hub.docker.com/_/redis)
- [NestJS Docker Guide](https://docs.nestjs.com/deployment/docker)
- [Next.js Docker Guide](https://nextjs.org/docs/deployment/docker)

## Support

If you encounter issues:

1. Check logs: `docker compose logs -f`
2. Verify `.env` configuration
3. Ensure all ports are available
4. Check Docker daemon is running
5. Review service health: `docker compose ps`

For detailed issues, share:

```bash
docker compose ps
docker compose logs --tail 50
echo "ENV:" && grep -E "^[A-Z]" .env | head -20
```
