# Game-Plug Docker Setup

A production-ready Docker Compose configuration for Game-Plug with PostgreSQL, Redis, NestJS backend, and Next.js frontend.

## What's Included

This Docker configuration orchestrates 4 services:

| Service | Technology | Port | Purpose |
|---------|-----------|------|---------|
| **postgres** | PostgreSQL 16 | 5432 | Relational database |
| **redis** | Redis 7 | 6379 | Cache & session store |
| **backend** | NestJS + Bun | 5002 | REST API server |
| **frontend** | Next.js 16 | 5173 | React web application |

## Getting Started

### 1. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit with your values (at minimum change passwords)
nano .env
```

**Minimum required changes**:
```env
POSTGRES_PASSWORD=your-secure-password
REDIS_PASSWORD=your-secure-password
JWT_SECRET=your-secure-jwt-secret
```

### 2. Start Services

```bash
# Using docker compose directly
docker compose up -d

# Or using the helper script
./scripts/docker-setup.sh start
```

### 3. Verify Everything Works

```bash
# Check service status
docker compose ps

# Expected: all services "Up (healthy)"

# Test endpoints
curl http://localhost:5002/api/health
curl http://localhost:5173
```

### 4. Access Services

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5002
- **Database**: localhost:5432 (use psql client)
- **Cache**: localhost:6379 (use redis-cli)

## Quick Commands

```bash
# View logs
docker compose logs -f

# View logs for specific service
docker compose logs -f backend

# Stop services (keep data)
docker compose stop

# Restart services
docker compose restart

# Full cleanup (removes containers but keeps volumes)
docker compose down

# Full cleanup including data
docker compose down -v

# Shell access
docker compose exec backend sh          # Backend shell
docker compose exec postgres psql ...   # PostgreSQL shell
docker compose exec redis redis-cli     # Redis CLI
```

## Using the Helper Script

For easier management, use the provided script:

```bash
./scripts/docker-setup.sh [command]
```

### Available Commands

| Command | Purpose |
|---------|---------|
| `start` | Start all services |
| `stop` | Stop all services |
| `restart` | Restart all services |
| `status` | Show service status |
| `logs [service]` | View service logs |
| `health` | Check all services health |
| `shell [service]` | Open container shell (backend, frontend, etc.) |
| `dbshell` | Open PostgreSQL shell |
| `redis` | Open Redis CLI |
| `migrate` | Run database migrations |
| `rebuild` | Rebuild Docker images |
| `clean` | Remove containers and optionally volumes |

### Examples

```bash
# Quick status check
./scripts/docker-setup.sh status

# Monitor backend logs
./scripts/docker-setup.sh logs backend

# Access database
./scripts/docker-setup.sh dbshell

# Check health
./scripts/docker-setup.sh health

# Rebuild after code changes
./scripts/docker-setup.sh rebuild backend
```

## Configuration Files

### docker-compose.yml
Main configuration file defining all services, networks, and volumes.

### .env (create from .env.example)
Environment variables for all services. Never commit this file.

### .dockerignore
Specifies files to exclude from Docker builds (node_modules, git, etc.)

### Dockerfiles
- `apps/backend/Dockerfile` - Multi-stage NestJS build
- `apps/frontend/Dockerfile` - Multi-stage Next.js build

## Documentation

For more detailed information, see:

- **[DOCKER_SETUP.md](./DOCKER_SETUP.md)** - Comprehensive usage guide with troubleshooting
- **[DOCKER_CONFIGURATION.md](./DOCKER_CONFIGURATION.md)** - Technical details of each service
- **[.env.example](./.env.example)** - All environment variables with descriptions

## Health Checks

Each service has automatic health monitoring:

- **PostgreSQL**: Checks connection with `pg_isready`
- **Redis**: Checks with `redis-cli PING`
- **Backend**: HTTP GET to `/api/health`
- **Frontend**: HTTP GET to `/`

Unhealthy services automatically restart.

## Production Deployment

For production, use the central deployment system:

```bash
cd /srv/workspace
docker compose -f docker-compose.apps.yml up -d game-plug
```

See [DOCKER_CONFIGURATION.md](./DOCKER_CONFIGURATION.md#production-considerations) for production checklist.

## Common Issues

### Services won't start
```bash
docker compose logs          # Check logs for errors
docker compose down -v       # Clean up and start fresh
docker compose up -d         # Start again
```

### Can't connect to backend
```bash
docker compose ps            # Check if backend is healthy
docker compose logs backend   # View backend logs
```

### Database permission errors
```bash
# Check PostgreSQL is healthy
docker compose ps postgres

# Verify password in .env matches docker-compose.yml
grep POSTGRES_PASSWORD .env
```

### Port already in use
```bash
docker compose down          # Stop all containers
docker compose up -d         # Start with default ports
```

## Security Notes

- All ports are bound to `127.0.0.1` (localhost only)
- Use strong passwords in `.env` (never use defaults in production)
- Never commit `.env` file to version control
- Secrets should be managed via proper secret management systems in production
- For production, use a reverse proxy (Nginx, Traefik) for SSL/TLS

## Environment Variables

### Essential
- `POSTGRES_PASSWORD` - Database password
- `REDIS_PASSWORD` - Redis password
- `JWT_SECRET` - JWT signing key

### Optional (have defaults)
- `NODE_ENV` - Environment (production/development)
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `API_PREFIX` - API path prefix (/api)
- `CORS_ORIGIN` - Allowed CORS origins

See [.env.example](./.env.example) for all available variables.

## Troubleshooting

### Check Logs
```bash
# All services
docker compose logs -f

# Specific service with timestamps
docker compose logs -f --timestamps backend
```

### Run Health Check
```bash
./scripts/docker-setup.sh health
```

### Manual Testing
```bash
# Test backend health
curl http://localhost:5002/api/health

# Test frontend
curl http://localhost:5173

# Test database
docker compose exec postgres pg_isready -U game_plug

# Test Redis
docker compose exec redis redis-cli PING
```

### Complete Diagnosis
```bash
# Get detailed status
docker compose ps
docker compose logs --tail 50

# Check Docker disk usage
docker system df

# Clean up unused resources
docker system prune
```

For detailed troubleshooting, see [DOCKER_SETUP.md](./DOCKER_SETUP.md).

## Next Steps

1. Configure `.env` file with your values
2. Run `docker compose up -d` or `./scripts/docker-setup.sh start`
3. Access http://localhost:5173 in your browser
4. Check logs: `docker compose logs -f`

## Support Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/docs/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)

## File Structure

```
game-plug/
├── docker-compose.yml              # Main configuration (this is what you run)
├── .env.example                    # Template for .env (copy and customize)
├── .dockerignore                   # Files to exclude from Docker builds
├── DOCKER_SETUP.md                 # Detailed usage guide
├── DOCKER_CONFIGURATION.md         # Technical documentation
├── README_DOCKER.md                # This file
│
├── scripts/
│   └── docker-setup.sh             # Helper script for management
│
├── apps/
│   ├── backend/
│   │   └── Dockerfile              # NestJS build
│   └── frontend/
│       └── Dockerfile              # Next.js build
│
└── init-db.sql                     # Database initialization
```

---

**Last Updated**: 2026-01-23
**Docker Compose Version**: 3.8
**Status**: Production Ready ✓
