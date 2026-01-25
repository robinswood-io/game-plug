# Docker Configuration Index

Complete reference guide for all Docker-related files in the Game-Plug project.

## Files Overview

### Core Configuration Files

#### 1. docker-compose.yml (5.9 KB)
**Location**: `/srv/workspace/game-plug/docker-compose.yml`

Main Docker Compose configuration file. This is the file you run.

**Contains**:
- Service definitions (postgres, redis, backend, frontend)
- Health checks configuration
- Restart policies
- Volume and network definitions
- Environment variable references
- Port mappings
- Service dependencies

**Usage**:
```bash
cd /srv/workspace/game-plug
docker compose up -d           # Start all services
docker compose down            # Stop all services
docker compose logs -f         # View logs
docker compose ps             # Check status
```

**Key Features**:
- Production-ready configuration
- All ports bound to 127.0.0.1 (localhost only)
- 4 services with health monitoring
- Service dependency management
- Proper logging configuration

---

#### 2. .env.example (6.5 KB)
**Location**: `/srv/workspace/game-plug/.env.example`

Template for environment variables. Copy to `.env` and customize.

**Contains**:
- All supported environment variables
- Default values and explanations
- Required vs optional variables
- Security recommendations
- Production configuration notes
- External service templates

**Critical Variables**:
```env
POSTGRES_PASSWORD=your-secure-password    # Required
REDIS_PASSWORD=your-secure-password       # Required
JWT_SECRET=your-secret-key                # Required
```

**Usage**:
```bash
cp .env.example .env
nano .env  # Edit with your values
```

**Never**:
- Commit .env to version control
- Use default passwords in production
- Share .env file with untrusted parties

---

### Dockerfile Specifications

#### 3. Backend Dockerfile (2.7 KB)
**Location**: `/srv/workspace/game-plug/apps/backend/Dockerfile`

Multi-stage Dockerfile for NestJS backend application.

**Build Stages**:
1. **deps**: Install all dependencies
2. **builder**: Compile TypeScript
3. **runner**: Production runtime

**Base Image**: `oven/bun:1.3.6-alpine`

**Features**:
- Minimal image size (Alpine Linux)
- Non-root user for security
- Signal handling with dumb-init
- Health check included
- Dependency caching
- Works with both Bun and npm

**Build Command**:
```bash
docker compose build backend
```

**Key Details**:
- Exposes port 5002
- Runs `bun run start`
- Health check: `wget http://localhost:5002/api/health`

---

#### 4. Frontend Dockerfile (2.7 KB)
**Location**: `/srv/workspace/game-plug/apps/frontend/Dockerfile`

Multi-stage Dockerfile for Next.js 16 frontend application.

**Build Stages**:
1. **deps**: Install dependencies
2. **builder**: Build Next.js application
3. **runner**: Production runtime

**Base Image**: `node:20-alpine`

**Features**:
- Minimal image size (Alpine Linux)
- Non-root user for security
- Signal handling with dumb-init
- Health check included
- Build arguments support
- Next.js output caching

**Build Command**:
```bash
docker compose build frontend
```

**Key Details**:
- Exposes port 3000 (mapped to 5173)
- Runs `npm run start`
- Health check: `wget http://localhost:3000`

---

### Documentation Files

#### 5. README_DOCKER.md (7.9 KB)
**Location**: `/srv/workspace/game-plug/README_DOCKER.md`

Quick start guide and overview for Docker setup.

**Sections**:
- What's Included (service overview)
- Getting Started (5 steps)
- Quick Commands (copy-paste ready)
- Helper Script Guide
- Configuration Files
- Health Checks
- Production Deployment
- Common Issues
- Troubleshooting

**Best For**: First-time users, quick reference

**Read This First** if you're new to the project.

---

#### 6. DOCKER_SETUP.md (9.4 KB)
**Location**: `/srv/workspace/game-plug/DOCKER_SETUP.md`

Comprehensive usage guide with detailed instructions.

**Sections**:
- Overview of services
- Prerequisites
- Quick Start (5 detailed steps)
- Service Details (for each service)
- Common Commands (organized by function)
- Database Management
- Redis Management
- Health Checks (detailed)
- Troubleshooting
- Production Deployment
- Production Checklist

**Best For**: Learning Docker operations, troubleshooting

**Read This** for detailed understanding of operations.

---

#### 7. DOCKER_CONFIGURATION.md (14 KB)
**Location**: `/srv/workspace/game-plug/DOCKER_CONFIGURATION.md`

Technical reference and detailed specifications.

**Sections**:
- File Structure (diagram)
- Service Configuration Details (for each service)
- Volumes Explanation
- Networks Explanation
- Environment Variables Reference
- Dockerfile Details
- Port Mappings
- Health Checks Implementation
- Logging Configuration
- Restart Policies
- Service Dependencies
- Production Considerations
- Troubleshooting
- Maintenance

**Best For**: Understanding architecture, production planning

**Read This** for technical deep-dive and production setup.

---

#### 8. DOCKER_VALIDATION_REPORT.md (12 KB)
**Location**: `/srv/workspace/game-plug/DOCKER_VALIDATION_REPORT.md`

Validation report and status summary.

**Contains**:
- Configuration status summary
- Files created list
- Service configuration checklist
- Health checks verification
- Security features checklist
- Environment variable verification
- Port mapping verification
- Docker Compose validation
- Documentation completeness
- Production readiness assessment
- Known limitations
- Maintenance schedule

**Best For**: Verification, status check, project overview

**Read This** to verify complete setup.

---

### Helper Script

#### 9. docker-setup.sh (11 KB)
**Location**: `/srv/workspace/game-plug/scripts/docker-setup.sh`

Automated management script with 15+ commands.

**Executable**: Yes (chmod +x)

**Usage**:
```bash
./scripts/docker-setup.sh [command]
```

**Commands**:

| Command | Purpose |
|---------|---------|
| `setup` | Initial setup and validation |
| `validate` | Validate Docker and config |
| `health` | Check all services |
| `start` | Start all services |
| `stop` | Stop all services |
| `restart` | Restart all services |
| `status` | Show service status |
| `logs [svc]` | View service logs |
| `rebuild [svc]` | Rebuild Docker images |
| `shell [svc]` | Open container shell |
| `dbshell` | PostgreSQL shell |
| `redis` | Redis CLI |
| `migrate` | Run migrations |
| `clean` | Remove containers/volumes |
| `help` | Show help |

**Features**:
- Color-coded output
- Error handling
- Configuration validation
- Health monitoring
- Helpful error messages

**Examples**:
```bash
# Initial setup
./scripts/docker-setup.sh setup

# Monitor services
./scripts/docker-setup.sh health
./scripts/docker-setup.sh logs backend

# Database operations
./scripts/docker-setup.sh dbshell
./scripts/docker-setup.sh migrate

# Troubleshooting
./scripts/docker-setup.sh logs
./scripts/docker-setup.sh status
```

---

## File Structure

```
game-plug/
├── docker-compose.yml              # Main config (RUN THIS)
├── .env.example                    # Environment template
├── Dockerfile                      # Legacy (root level)
├── README_DOCKER.md                # Quick start
├── DOCKER_SETUP.md                 # Comprehensive guide
├── DOCKER_CONFIGURATION.md         # Technical reference
├── DOCKER_VALIDATION_REPORT.md     # Validation status
├── DOCKER_INDEX.md                 # This file
│
├── apps/
│   ├── backend/
│   │   ├── Dockerfile              # NestJS build
│   │   ├── src/
│   │   ├── dist/
│   │   └── package.json
│   │
│   └── frontend/
│       ├── Dockerfile              # Next.js build
│       ├── app/
│       ├── public/
│       └── package.json
│
├── scripts/
│   └── docker-setup.sh             # Helper script
│
└── init-db.sql                     # Database init
```

---

## Quick Reference

### Getting Started
1. Read: `README_DOCKER.md`
2. Configure: `cp .env.example .env && nano .env`
3. Start: `docker compose up -d`
4. Verify: `./scripts/docker-setup.sh health`
5. Access: http://localhost:5173

### Common Operations
```bash
# View status
docker compose ps
./scripts/docker-setup.sh status

# View logs
docker compose logs -f
./scripts/docker-setup.sh logs backend

# Database access
./scripts/docker-setup.sh dbshell
docker compose exec postgres psql -U game_plug -d game_plug

# Rebuild
docker compose build
./scripts/docker-setup.sh rebuild backend

# Stop services
docker compose stop
./scripts/docker-setup.sh stop

# Clean up
docker compose down -v
./scripts/docker-setup.sh clean
```

### Services & Ports
| Service | Port | Health | URL |
|---------|------|--------|-----|
| PostgreSQL | 5432 | pg_isready | localhost:5432 |
| Redis | 6379 | redis-cli PING | localhost:6379 |
| Backend | 5002 | GET /api/health | http://localhost:5002 |
| Frontend | 5173 | GET / | http://localhost:5173 |

---

## For Different Use Cases

### I just want to start the app
→ Read: `README_DOCKER.md` section "Getting Started"
→ Run: `docker compose up -d`

### I want to understand the setup
→ Read: `DOCKER_CONFIGURATION.md`

### I need to troubleshoot an issue
→ Read: `DOCKER_SETUP.md` section "Troubleshooting"
→ Run: `./scripts/docker-setup.sh health`
→ Run: `docker compose logs`

### I'm deploying to production
→ Read: `DOCKER_CONFIGURATION.md` section "Production Considerations"
→ Read: `DOCKER_SETUP.md` section "Production Deployment"
→ Review: `DOCKER_VALIDATION_REPORT.md` section "Production Readiness"

### I need to modify the configuration
→ Edit: `docker-compose.yml` (services)
→ Edit: `.env.example` (variables)
→ Edit: `apps/backend/Dockerfile` or `apps/frontend/Dockerfile` (builds)
→ Verify: `docker compose config --quiet`

### I want to access the database
→ Use: `./scripts/docker-setup.sh dbshell`
→ Or: `docker compose exec postgres psql -U game_plug -d game_plug`
→ See: `DOCKER_SETUP.md` section "Database Management"

---

## File Sizes & Summary

| File | Size | Type | Purpose |
|------|------|------|---------|
| docker-compose.yml | 5.9 KB | Config | Main orchestration |
| .env.example | 6.5 KB | Config | Environment template |
| apps/backend/Dockerfile | 2.7 KB | Build | NestJS build |
| apps/frontend/Dockerfile | 2.7 KB | Build | Next.js build |
| README_DOCKER.md | 7.9 KB | Docs | Quick start |
| DOCKER_SETUP.md | 9.4 KB | Docs | Comprehensive guide |
| DOCKER_CONFIGURATION.md | 14 KB | Docs | Technical reference |
| DOCKER_VALIDATION_REPORT.md | 12 KB | Docs | Validation status |
| docker-setup.sh | 11 KB | Script | Helper automation |
| **Total** | **71.8 KB** | | |

---

## Important Notes

### Security
- All ports bound to 127.0.0.1 (localhost only)
- Change all default passwords in production
- Never commit `.env` file
- Use secrets vault for production
- Generate strong JWT_SECRET: `openssl rand -hex 32`

### Volumes
- `postgres_data`: Persists database
- `redis_data`: Persists cache
- Data survives `docker compose down` but not `docker compose down -v`

### Networks
- All services on `game-plug-network`
- Services communicate by name (DNS resolution)
- Isolated from other Docker networks

### Health Checks
- PostgreSQL: `pg_isready` (10s interval)
- Redis: `redis-cli PING` (10s interval)
- Backend: HTTP GET `/api/health` (30s interval)
- Frontend: HTTP GET `/` (30s interval)
- Failed health checks trigger restart

---

## Troubleshooting Quick Guide

**Service won't start**
→ Check: `docker compose logs [service]`
→ Fix: Review .env, check ports, see DOCKER_SETUP.md

**Can't connect to services**
→ Check: `./scripts/docker-setup.sh health`
→ Fix: Ensure all services are running, see DOCKER_SETUP.md

**Database/Redis connection errors**
→ Check: `docker compose ps`
→ Fix: Verify credentials in .env, see DOCKER_SETUP.md

**Performance issues**
→ Check: `docker compose stats`
→ Check: `docker system df`
→ Fix: See DOCKER_SETUP.md "Cleanup" section

---

## Support & Resources

- **Local Documentation**: See files listed above
- **Docker Docs**: https://docs.docker.com/
- **Docker Compose**: https://docs.docker.com/compose/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Redis**: https://redis.io/docs/
- **NestJS**: https://docs.nestjs.com/
- **Next.js**: https://nextjs.org/docs

---

## File Checklist

Use this to verify your setup:

- [ ] docker-compose.yml exists and is valid
- [ ] .env created from .env.example
- [ ] .env configured with your values
- [ ] apps/backend/Dockerfile exists
- [ ] apps/frontend/Dockerfile exists
- [ ] scripts/docker-setup.sh is executable
- [ ] Documentation files reviewed
- [ ] Docker and Docker Compose installed
- [ ] Services start with `docker compose up -d`
- [ ] All services show "healthy" with `docker compose ps`

---

**Last Updated**: 2026-01-23
**Configuration Version**: 1.0
**Status**: Complete and Production-Ready

For any questions, refer to the appropriate documentation file above.
