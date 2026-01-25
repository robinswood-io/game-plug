# Docker Configuration Documentation

## Overview

The Game-Plug project uses Docker Compose to orchestrate a multi-service application stack consisting of:

1. **PostgreSQL 16** - Relational database
2. **Redis 7** - Cache and session store
3. **NestJS Backend** - REST API server
4. **Next.js 16 Frontend** - React-based web application

## File Structure

```
game-plug/
├── docker-compose.yml              # Main Compose configuration
├── .env.example                    # Environment variables template
├── .dockerignore                   # Files to exclude from Docker builds
├── Dockerfile                      # Root-level Dockerfile (legacy)
├── DOCKER_SETUP.md                 # Usage guide and troubleshooting
├── DOCKER_CONFIGURATION.md         # This file
│
├── apps/
│   ├── backend/
│   │   ├── Dockerfile              # NestJS multi-stage build
│   │   ├── src/                    # TypeScript source code
│   │   ├── dist/                   # Compiled JavaScript
│   │   ├── package.json            # Dependencies
│   │   └── tsconfig.json           # TypeScript configuration
│   │
│   └── frontend/
│       ├── Dockerfile              # Next.js multi-stage build
│       ├── app/                    # Next.js app directory
│       ├── public/                 # Static assets
│       ├── package.json            # Dependencies
│       └── next.config.js          # Next.js configuration
│
├── scripts/
│   └── docker-setup.sh             # Automated setup and management
│
└── init-db.sql                     # Database initialization script
```

## Configuration Details

### Docker Compose File: `docker-compose.yml`

**Format**: Docker Compose 3.8

The configuration defines 4 services with the following characteristics:

#### PostgreSQL Service

```yaml
Service: postgres
Container: game-plug-postgres
Image: postgres:16-alpine
Port: 127.0.0.1:5432:5432
Network: game-plug-network
Volumes:
  - postgres_data:/var/lib/postgresql/data
  - ./init-db.sql:/docker-entrypoint-initdb.d/init.sql
Health Check:
  - Command: pg_isready -U {user}
  - Interval: 10s
  - Timeout: 5s
  - Retries: 5
Restart Policy: unless-stopped
```

**Environment Variables**:
- `POSTGRES_DB` - Database name (default: game_plug)
- `POSTGRES_USER` - Database user (default: game_plug)
- `POSTGRES_PASSWORD` - Database password (MUST change in production)
- `POSTGRES_INITDB_ARGS` - UTF-8 locale settings

**Purpose**: Stores all application data (users, games, sessions, etc.)

---

#### Redis Service

```yaml
Service: redis
Container: game-plug-redis
Image: redis:7-alpine
Port: 127.0.0.1:6379:6379
Network: game-plug-network
Volumes:
  - redis_data:/data
Health Check:
  - Command: redis-cli PING
  - Interval: 10s
  - Timeout: 5s
  - Retries: 5
Restart Policy: unless-stopped
```

**Environment Variables**:
- `REDIS_PASSWORD` - Authentication password (default: redis_dev_password)

**Startup Command**:
```bash
redis-server --appendonly yes --requirepass {password}
```

**Purpose**: Session storage, caching, real-time data

---

#### Backend Service (NestJS)

```yaml
Service: backend
Container: game-plug-backend
Build Context: ./apps/backend
Dockerfile: ./apps/backend/Dockerfile
Port: 127.0.0.1:5002:5002
Network: game-plug-network
Depends On:
  - postgres (service_healthy)
  - redis (service_healthy)
Health Check:
  - Command: wget http://localhost:5002/api/health
  - Interval: 30s
  - Timeout: 10s
  - Start Period: 40s
  - Retries: 3
Restart Policy: unless-stopped
Volumes:
  - ./apps/backend/src:/app/src (read-only)
  - ./apps/backend/dist:/app/dist
```

**Environment Variables**:
- `NODE_ENV` - Application environment (development/production)
- `PORT` - Listen port (default: 5002)
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection URL
- `JWT_SECRET` - Signing key for JWT tokens
- `API_PREFIX` - API route prefix (default: /api)
- `CORS_ORIGIN` - Allowed CORS origins

**Startup Command**:
```bash
bun run start
```

**Health Endpoint**: `GET /api/health`

**Purpose**: REST API, business logic, database interactions

---

#### Frontend Service (Next.js)

```yaml
Service: frontend
Container: game-plug-frontend
Build Context: ./apps/frontend
Dockerfile: ./apps/frontend/Dockerfile
Port: 127.0.0.1:5173:3000
Network: game-plug-network
Depends On:
  - backend (service_healthy)
Health Check:
  - Command: wget http://localhost:3000
  - Interval: 30s
  - Timeout: 10s
  - Start Period: 60s
  - Retries: 3
Restart Policy: unless-stopped
Volumes:
  - ./apps/frontend/.next:/app/.next
  - ./apps/frontend/public:/app/public (read-only)
```

**Build Arguments**:
- `NEXT_PUBLIC_API_URL` - Backend URL for client-side requests

**Environment Variables**:
- `NODE_ENV` - Application environment (development/production)
- `PORT` - Listen port (default: 3000, mapped to 5173)
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_TELEMETRY_DISABLED` - Disable Next.js telemetry

**Startup Command**:
```bash
npm run start
```

**Purpose**: Web UI, client-side rendering, static asset serving

---

## Volumes

Three volumes manage persistent data:

### postgres_data
- **Mount Point**: `/var/lib/postgresql/data` (inside container)
- **Purpose**: PostgreSQL data directory
- **Persistence**: Yes, survives container restarts
- **Size**: Grows with database

### redis_data
- **Mount Point**: `/data` (inside container)
- **Purpose**: Redis appendonly file (AOF) for persistence
- **Persistence**: Yes, survives container restarts
- **Size**: Grows with cache data

### .next (bind mount)
- **Mount Point**: `./.next:/app/.next` (application cache)
- **Purpose**: Next.js build cache for faster rebuilds
- **Type**: Bind mount (direct host filesystem mapping)

## Networks

### game-plug-network
- **Type**: Docker bridge network
- **Driver**: Bridge (default)
- **Scope**: Local to the Docker daemon
- **Services Connected**: All 4 services
- **Purpose**: Internal service-to-service communication

**Service Discovery**:
- Services can reach each other by service name
- Example: Backend reaching database: `postgres:5432`
- Example: Frontend reaching backend: `http://backend:5002`

## Environment Variables

### Required (Production)
These must be set in `.env` file:

```env
POSTGRES_PASSWORD=<strong-password>
REDIS_PASSWORD=<strong-password>
JWT_SECRET=<32-char-hex-string>
NEXT_PUBLIC_API_URL=<backend-url>
DATABASE_URL=<connection-string>
```

### Optional (With Defaults)
These have fallback values if not specified:

```env
NODE_ENV=production
POSTGRES_DB=game_plug
POSTGRES_USER=game_plug
POSTGRES_PORT=5432
LOG_LEVEL=info
API_PREFIX=/api
```

### Configuration Notes

1. **Database URL**: Built from components in Docker Compose
   - Format: `postgresql://{user}:{password}@{host}:{port}/{database}`
   - For Docker: Host is service name `postgres`
   - For local dev: Host is `localhost`

2. **Redis URL**: Built from password and host
   - Format: `redis://:{password}@{host}:{port}`
   - Connection requires password authentication

3. **API URL**: Different for client vs server
   - Backend environment: `DATABASE_URL`, `REDIS_URL` use service names
   - Frontend environment: `NEXT_PUBLIC_API_URL` uses `http://backend:5002` (Docker) or `http://localhost:5002` (local)

4. **Security**: All passwords should be strong random strings
   - Generate JWT_SECRET: `openssl rand -hex 32`
   - Change default database password immediately
   - Use different passwords for dev/staging/prod

## Dockerfiles

### Backend Dockerfile (`apps/backend/Dockerfile`)

**Multi-stage Build Strategy**:
1. **deps stage**: Install dependencies
2. **builder stage**: Compile TypeScript to JavaScript
3. **runner stage**: Minimal production image

**Features**:
- Alpine Linux base (minimal size)
- Non-root user (security)
- dumb-init for signal handling
- Health check included
- Automatic dependency installation
- Works with both Bun and npm

**Build Time**: ~2-3 minutes
**Image Size**: ~500MB

### Frontend Dockerfile (`apps/frontend/Dockerfile`)

**Multi-stage Build Strategy**:
1. **deps stage**: Install dependencies
2. **builder stage**: Build Next.js application
3. **runner stage**: Minimal production image

**Features**:
- Node.js 20 Alpine base
- Non-root user (security)
- dumb-init for signal handling
- Health check included
- Build arguments for environment variables
- Caches Next.js build output

**Build Time**: ~3-5 minutes
**Image Size**: ~400MB

## Port Mappings

All ports are bound to `127.0.0.1` (localhost only) for security:

| Service | Container Port | Host Port | URL | Purpose |
|---------|-----------------|-----------|-----|---------|
| PostgreSQL | 5432 | 5432 | `localhost:5432` | Database access |
| Redis | 6379 | 6379 | `localhost:6379` | Cache/session access |
| Backend | 5002 | 5002 | `http://localhost:5002` | API server |
| Frontend | 3000 | 5173 | `http://localhost:5173` | Web application |

**Security Consideration**: Binding to `127.0.0.1` ensures services are only accessible from the local machine, not from other hosts on the network.

## Health Checks

Each service includes automatic health monitoring:

### PostgreSQL Health Check
```bash
pg_isready -U game_plug -d game_plug
```
- Ensures database is accepting connections
- Runs every 10 seconds
- Backend waits for "healthy" status before starting

### Redis Health Check
```bash
redis-cli -a {password} PING
```
- Ensures Redis is responding
- Runs every 10 seconds
- Backend waits for "healthy" status before starting

### Backend Health Check
```bash
wget --quiet --tries=1 --spider http://localhost:5002/api/health
```
- HTTP GET to health endpoint
- Runs every 30 seconds
- Frontend waits for "healthy" status before starting

### Frontend Health Check
```bash
wget --quiet --tries=1 --spider http://localhost:3000
```
- HTTP GET to homepage
- Runs every 30 seconds
- Ensures Next.js is responding

## Logging

Each service logs to JSON files with rotation:

```yaml
logging:
  driver: json-file
  options:
    max-size: 10m      # Maximum file size before rotation
    max-file: 3        # Keep 3 rotated files
```

**Access logs**:
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend

# View specific number of lines
docker compose logs --tail 100 postgres
```

## Restart Policies

All services use `restart: unless-stopped`:
- Automatically restarts if container crashes
- Does not restart after explicit `docker compose stop`
- Useful for production reliability
- Can be overridden with `--no-restart` flag

## Service Dependencies

Service startup order is determined by `depends_on`:

```
1. postgres (no dependencies)
2. redis (no dependencies)
3. backend (depends on postgres and redis being healthy)
4. frontend (depends on backend being healthy)
```

The `condition: service_healthy` ensures dependent services wait for the target service's health check to pass before starting.

## Production Considerations

### For Production Deployment

When deploying to production, consider:

1. **Security**:
   - Use strong, random passwords (32+ characters)
   - Never commit `.env` file to version control
   - Use secrets management (AWS Secrets Manager, HashiCorp Vault, etc.)
   - Enable firewall rules to restrict access

2. **Performance**:
   - Use external managed databases (RDS, Cloud SQL)
   - Use external managed cache (ElastiCache, Memorystore)
   - Implement load balancing
   - Use CDN for static assets

3. **Monitoring**:
   - Enable container logs aggregation (CloudWatch, ELK, etc.)
   - Set up alerts for service health
   - Monitor database performance
   - Track application metrics

4. **Backup & Recovery**:
   - Regular database backups
   - Test backup restoration procedures
   - Document recovery procedures
   - Multiple availability zones

5. **Updates**:
   - Plan maintenance windows
   - Test updates in staging first
   - Keep base images updated
   - Apply security patches promptly

### Central Deployment

For production, use the central Docker Compose configuration:

```bash
cd /srv/workspace
docker compose -f docker-compose.apps.yml up -d game-plug
```

This configuration:
- Integrates with Traefik reverse proxy
- Centralizes logging and monitoring
- Manages multi-project deployments
- Handles networking and service discovery

## Troubleshooting

### Common Issues

**Services won't start**:
```bash
docker compose logs
docker compose ps
```

**Can't connect to database**:
```bash
docker compose exec backend ping postgres
docker compose exec postgres pg_isready
```

**Can't connect to Redis**:
```bash
docker compose exec backend redis-cli -h redis PING
```

**Frontend can't reach backend**:
```bash
docker compose exec frontend curl http://backend:5002/api/health
```

**Ports already in use**:
```bash
docker compose down
# Or change ports in docker-compose.yml
```

## Related Documentation

- [DOCKER_SETUP.md](./DOCKER_SETUP.md) - Usage guide and common commands
- [.env.example](./.env.example) - Environment variable reference
- [init-db.sql](./init-db.sql) - Database initialization
- [apps/backend/Dockerfile](./apps/backend/Dockerfile) - Backend build details
- [apps/frontend/Dockerfile](./apps/frontend/Dockerfile) - Frontend build details

## Maintenance

### Regular Tasks

```bash
# Clean up old images and containers
docker system prune

# View resource usage
docker compose stats

# Check for updates
docker pull postgres:16-alpine
docker pull redis:7-alpine

# Backup database
docker compose exec postgres pg_dump -U game_plug game_plug > backup.sql

# Update images
docker compose pull
docker compose up -d --build
```

### Version Information

- **Docker Compose Format**: 3.8
- **PostgreSQL**: 16-alpine
- **Redis**: 7-alpine
- **Node.js** (Backend): 20-alpine (via Bun)
- **Node.js** (Frontend): 20-alpine
- **NestJS**: Latest
- **Next.js**: 16.x with Turbopack

## Support

For issues or questions:

1. Check logs: `docker compose logs -f`
2. Review `.env` configuration
3. Run validation: `./scripts/docker-setup.sh validate`
4. Test health: `./scripts/docker-setup.sh health`
5. Consult [DOCKER_SETUP.md](./DOCKER_SETUP.md) for troubleshooting
