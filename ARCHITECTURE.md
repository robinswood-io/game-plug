# Architecture Game Plug

Vue d'ensemble de l'architecture technique, infrastructure et décisions de design de Game Plug.

## Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Architecture Système](#architecture-système)
- [Backend NestJS](#backend-nestjs)
- [Frontend Next.js/React](#frontend-nextjsreact)
- [Base de Données](#base-de-données)
- [WebSockets & Temps Réel](#websockets--temps-réel)
- [Sécurité](#sécurité)
- [Scalabilité](#scalabilité)
- [Déploiement](#déploiement)

---

## Vue d'ensemble

Game Plug utilise une architecture **monolithe modulaire** avec séparation backend/frontend:

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Web (React 18)                    │
│              Next.js 16 + TypeScript + Tailwind             │
│                    (http://localhost:5173)                  │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP + WebSockets
┌──────────────────────────▼──────────────────────────────────┐
│                    Backend (NestJS 11)                       │
│            TypeScript Express + Swagger/OpenAPI             │
│                    (http://localhost:5002)                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              14 Modules NestJS Fonctionnels             │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ Auth │ Characters │ Sessions │ Dice │ Sanity │ Inv...  │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────┬──────────────┬──────────────┬────────────────────┘
           │              │              │
      ┌────▼───┐    ┌────▼───┐    ┌───▼──────┐
      │  PostgreSQL  │    Redis      │ OpenAI API
      │     16       │      7        │ (Cloud)
      └──────────┘    └──────────┘    └───────────┘
```

---

## Architecture Système

### Composants Principaux

| Composant | Type | Technologie | Rôle |
|-----------|------|-----------|------|
| **Frontend** | Web App | Next.js 16, React 18, TypeScript | Interface utilisateur |
| **Backend API** | REST API | NestJS 11, Express, TypeScript | Logique métier |
| **Database** | SQL | PostgreSQL 16 + Drizzle ORM | Persistance données |
| **Cache Layer** | In-Memory | Redis 7 | Performance, sessions |
| **WebSocket** | Real-time | Socket.io + ws:8.18.0 | Communication temps réel |
| **IA Service** | Cloud API | OpenAI (DALL-E 3, GPT-4) | Génération contenu |
| **Auth** | Middleware | JWT + Passport.js | Authentification/Authorization |

### Infrastructure Docker

```yaml
Services:
├── postgres:16-alpine        # Base de données
├── redis:7-alpine            # Cache et sessions
├── backend:latest            # NestJS API (port 5002)
└── frontend:latest           # Next.js Frontend (port 5173)

Volumes:
├── postgres_data             # Persistance PostgreSQL
└── redis_data                # Persistance Redis

Network:
└── game-plug-network         # Bridge network
```

---

## Backend NestJS

### Architecture Modulaire

Le backend est organisé en **14 modules NestJS** par domaine fonctionnel:

```
src/
├── modules/
│   ├── auth/                      # JWT + Sessions
│   ├── characters/                # Gestion personnages
│   ├── sessions/                  # Sessions de jeu
│   ├── dice/                      # Système de dés
│   ├── sanity/                    # Sanité mentale
│   ├── inventory/                 # Inventaire & objets
│   ├── chapters/                  # Chapitres/actes
│   ├── chapter-events/            # Événements chapitres
│   ├── ai/                        # IA (avatars, contenu)
│   ├── gameboard/                 # Tableau blanc
│   ├── narrative/                 # Outils narratifs
│   ├── websockets/                # Communication temps réel
│   ├── cache/                     # Cache Redis
│   ├── database/                  # ORM Drizzle
│   └── health/                    # Health checks
├── config/                        # Configuration globale
├── filters/                       # Exception filters
├── interceptors/                  # Interceptors (logging, etc)
├── guards/                        # Auth guards
└── main.ts                        # Point d'entrée
```

### Pattern Architecture Backend

Chaque module suit le pattern **Controller → Service → Repository**:

```typescript
// ✅ Structure standard module
MyFeature/
├── my-feature.controller.ts       # HTTP routes
├── my-feature.service.ts          # Business logic
├── my-feature.repository.ts       # Data access
├── my-feature.module.ts           # Module definition
├── dto/
│   ├── create-my-feature.dto.ts   # Input validation
│   └── update-my-feature.dto.ts
└── my-feature.spec.ts             # Tests
```

**Exemple Control Flow:**

```
HTTP Request
    ↓
Controller (route + input validation)
    ↓
Service (business logic)
    ↓
Repository (database queries)
    ↓
Drizzle ORM
    ↓
PostgreSQL
    ↓
Response (JSON via Interceptor)
```

### Modules Core

#### 1. **Auth Module** (`/api/auth/*`)
Gère authentification JWT et sessions utilisateur.

```
POST   /api/auth/login         # Authentifier utilisateur
POST   /api/auth/logout        # Déconnecter
POST   /api/auth/refresh       # Refresh JWT token
GET    /api/auth/me            # Info utilisateur courant
POST   /api/auth/register      # Créer compte
```

**Logique:**
- Bcrypt hachage mots de passe
- JWT tokens (24h expiration)
- Refresh tokens en Redis
- Session management

#### 2. **Characters Module** (`/api/characters/*`)
Gestion complète des personnages CoC 7e.

```
POST   /api/characters                 # Créer personnage
GET    /api/characters                 # Lister mes personnages
GET    /api/characters/:id             # Détails personnage
PATCH  /api/characters/:id             # Modifier personnage
DELETE /api/characters/:id             # Supprimer personnage
POST   /api/characters/:id/export/pdf  # Export PDF (futur)
```

**Logique:**
- Calcul automatique attributs (FOR, CON, TAI, DEX, APP, INT, POU, EDU)
- Calcul points de compétence
- Génération des compétences initiales
- Archivage personnages

#### 3. **Sessions Module** (`/api/sessions/*`)
Gestion des sessions de jeu multiplayer.

```
POST   /api/sessions                   # Créer session
GET    /api/sessions                   # Lister sessions
GET    /api/sessions/:id               # Détails session
PATCH  /api/sessions/:id               # Modifier session
DELETE /api/sessions/:id               # Terminer session
POST   /api/sessions/:id/join          # Rejoindre session
POST   /api/sessions/:id/leave         # Quitter session
```

**Logique:**
- Code d'accès (6 chars alphanumériques)
- Gestion joueurs (max 6)
- États (draft, active, finished)
- Répertoire des personnages par session
- Synchronisation temps réel via WebSockets

#### 4. **Dice Module** (`/api/dice/*`)
Système de dés CoC 7e avancé.

```
POST   /api/dice/roll                  # Lancer dés
GET    /api/dice/history               # Historique session
```

**Logique:**
- Jets d100 (01-100)
- Résolution automatique:
  - Succès normal (≤ compétence)
  - Succès dur (≤ compétence/2)
  - Succès critique (01-05)
  - Échec critique (96-00)
- Historique persisté

#### 5. **Sanity Module** (`/api/sanity/*`)
Gestion santé mentale des investigateurs.

```
POST   /api/sanity/damage              # Infliger dégâts
PATCH  /api/sanity/:id/recover         # Récupérer sanité
GET    /api/sanity/:id                 # État actuel
POST   /api/sanity/:id/condition       # Ajouter condition
```

**Logique:**
- Points de sanité (0-99)
- Phobies et manies
- Folie temporaire/prolongée
- Récupération progressive (1pt/semaine)
- Récupération psychologique

#### 6. **Inventory Module** (`/api/inventory/*`)
Gestion d'objets, équipement et argent.

```
POST   /api/inventory/:id/add           # Ajouter objet
DELETE /api/inventory/:id/remove/:itemId # Retirer objet
PATCH  /api/inventory/:id/quantity      # Changer quantité
GET    /api/inventory/:id               # Liste inventaire
```

**Logique:**
- Objets typés (arme, équipement, consommable)
- Quantités et poids
- Argent (dollars, livres sterling)
- Équipement équipé vs inventaire

#### 7. **Chapters Module** (`/api/chapters/*`)
Gestion d'actes et scénarios.

```
POST   /api/chapters                    # Créer chapitre
GET    /api/chapters                    # Lister chapitres
PATCH  /api/chapters/:id                # Modifier
DELETE /api/chapters/:id                # Supprimer
```

#### 8. **AI Module** (`/api/ai/*`)
Génération de contenu IA.

```
POST   /api/ai/generate-avatar          # Avatar DALL-E 3
POST   /api/ai/generate-description     # Description GPT-4
POST   /api/ai/batch-avatars            # Batch avatars
```

#### 9. **GameBoard Module** (`/api/gameboard/*`)
Tableau blanc collaboratif.

```
POST   /api/gameboard/:sessionId/image  # Ajouter image
DELETE /api/gameboard/:sessionId/:imageId # Retirer
GET    /api/gameboard/:sessionId        # État actuel
```

#### 10. **WebSockets Module** (`/ws/*`)
Communication temps réel bi-directionnelle.

```
WS Events:
- session:join               # Rejoindre session
- session:leave              # Quitter session
- dice:rolled                # Dés lancés
- character:updated          # Personnage modifié
- sanity:changed             # Sanité modifiée
- inventory:changed          # Inventaire modifié
- gameboard:updated          # Tableau blanc mis à jour
```

### API REST Endpoints

**Total: 37+ endpoints** organisés par module

```
Auth (5 endpoints)
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me

Characters (6 endpoints)
POST   /api/characters
GET    /api/characters
GET    /api/characters/:id
PATCH  /api/characters/:id
DELETE /api/characters/:id
POST   /api/characters/:id/export/pdf

Sessions (7 endpoints)
POST   /api/sessions
GET    /api/sessions
GET    /api/sessions/:id
PATCH  /api/sessions/:id
DELETE /api/sessions/:id
POST   /api/sessions/:id/join
POST   /api/sessions/:id/leave

[... et plus pour Dice, Sanity, Inventory, etc ...]

Health (1 endpoint)
GET    /api/health           # Docker health checks
```

Voir **Swagger** pour docs interactive: http://localhost:5002/api/docs

---

## Frontend Next.js/React

### Structure App Router

```
apps/frontend/
├── app/
│   ├── (auth)/                    # Layout auth (public)
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   │
│   ├── (dashboard)/               # Layout dashboard (protected)
│   │   ├── characters/page.tsx     # Liste personnages
│   │   ├── characters/[id]/page.tsx # Détail personnage
│   │   ├── sessions/page.tsx       # Sessions
│   │   ├── sessions/[id]/page.tsx  # Détail session
│   │   └── layout.tsx              # Navigation, sidebar
│   │
│   ├── layout.tsx                 # Layout root
│   ├── page.tsx                   # Home (redirige)
│   └── error.tsx                  # Error boundary
│
├── components/                    # Composants réutilisables
│   ├── ui/                        # Composants Radix UI
│   ├── character-card.tsx
│   ├── dice-roller.tsx
│   ├── session-list.tsx
│   └── ...
│
├── hooks/                         # Custom hooks
│   ├── useAuth.ts                # Auth management
│   ├── useWebSocket.ts           # WebSocket connection
│   ├── useCharacter.ts           # Character data
│   ├── useDiceRoll.ts            # Dice rolling
│   └── ...
│
├── lib/                          # Utilitaires
│   ├── api-client.ts             # Axios client
│   ├── authUtils.ts              # JWT management
│   ├── dice.ts                   # Logique dés
│   ├── cthulhu-data.ts           # Données CoC 7e
│   └── utils.ts                  # Utilitaires généraux
│
├── public/                       # Assets statiques
├── middleware.ts                 # Next.js middleware
└── ...config
```

### Control Flow Frontend

```
User Interaction
    ↓
Event Handler (onClick, onChange, etc)
    ↓
Custom Hook (useCharacter, useSession, etc)
    ↓
API Client (axios → backend)
    ↓
TanStack Query (cache + state)
    ↓
Component re-render
    ↓
React renders
    ↓
Tailwind CSS applies styles
    ↓
User sees updated UI
```

### Pages Principales

#### 1. **Authentication** (`/login`, `/register`)
- Formulaires React Hook Form
- Validation Zod
- JWT storage (localStorage)
- Redirect middleware

#### 2. **Dashboard** (`/dashboard`)
- Liste de personnages
- Bouton créer nouveau
- Actions rapides (éditer, supprimer, jouer)

#### 3. **Character Sheet** (`/dashboard/characters/[id]`)
- Affichage tous les attributs
- Édition inline
- Roller les dés
- Gestion sanité
- Inventaire

#### 4. **Session View** (`/dashboard/sessions/[id]`)
- Vue MJ vs Joueur différente
- Tableau blanc collaboratif
- Chat / historique actions
- Contrôles dés et effets
- WebSocket synchronisation temps réel

### State Management

**TanStack Query** pour données serveur:
```typescript
const { data: character, isLoading } = useQuery({
  queryKey: ['character', id],
  queryFn: () => api.get(`/characters/${id}`),
});
```

**React Hooks** pour état local:
```typescript
const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
const [filters, setFilters] = useState({ name: '', class: '' });
```

**Context** pour auth global:
```typescript
const { user, login, logout } = useAuthContext();
```

---

## Base de Données

### Stack ORM

- **ORM**: Drizzle (v0.39.1) - Type-safe SQL
- **Driver**: Postgres client (v3.4.8)
- **Migrations**: Drizzle Kit
- **Version**: PostgreSQL 16-alpine

### Schéma Principal

```sql
-- Users & Auth
users
├── id (PK)
├── email (UNIQUE)
├── password_hash (bcrypt)
├── created_at
└── updated_at

-- Characters (Personnages)
characters
├── id (PK)
├── user_id (FK → users)
├── name
├── occupation
├── age
├── attributes (FOR, CON, TAI, DEX, APP, INT, POU, EDU)
├── skills (JSON)
├── sanity (0-99)
├── health
├── created_at
└── updated_at

-- Sessions (Sessions de jeu)
sessions
├── id (PK)
├── gm_user_id (FK → users)
├── title
├── access_code (6 chars)
├── status (draft, active, finished)
├── created_at
└── updated_at

-- Session Roster
session_characters
├── session_id (FK)
├── character_id (FK)
├── player_user_id (FK → users)
├── joined_at
└── left_at

-- Dice Rolls
dice_rolls
├── id (PK)
├── session_id (FK)
├── character_id (FK)
├── skill_name
├── skill_value
├── roll_result (1-100)
├── success_type (normal, hard, critical, fail, critical_fail)
├── created_at
└── updated_at

-- Sanity Events
sanity_events
├── id (PK)
├── character_id (FK)
├── delta (points lost/gained)
├── reason
├── created_at
└── updated_at

-- Inventory Items
inventory_items
├── id (PK)
├── character_id (FK)
├── item_name
├── item_type
├── quantity
├── equipped
└── created_at

-- Sessions & WebSocket Events
session_events (Journal)
├── id (PK)
├── session_id (FK)
├── event_type
├── data (JSON)
└── created_at
```

### Optimisations BD

- **Connection Pooling**: Postgres client avec pool (max 20)
- **Indexes**: Sur user_id, session_id, created_at
- **Caching**: Redis pour queries fréquentes
- **TTL**: 1 heure pour données chaudes

### Migrations

```bash
# Générer migration
npm run db:generate

# Pousser vers DB
npm run db:push

# Afficher status
npm run db:check
```

---

## WebSockets & Temps Réel

### Architecture WebSocket

```
Client (React)
    ↓
WebSocket Connection
    ↓
Socket.io Server (Backend)
    ↓
Game Gateway (NestJS)
    ↓
Services métier
    ↓
Broadcast à autres clients
    ↓
Tous les clients reçoivent update
```

### Events WebSocket

```javascript
// Client → Server
socket.emit('session:join', { sessionId, characterId })
socket.emit('dice:roll', { skill, skillValue })
socket.emit('sanity:change', { delta, reason })
socket.emit('gameboard:draw', { imageUrl, x, y })

// Server → Client (broadcast)
socket.on('dice:rolled', (result) => { /* update UI */ })
socket.on('character:updated', (character) => { /* refresh */ })
socket.on('sanity:changed', (delta) => { /* animate */ })
socket.on('gameboard:updated', (state) => { /* redraw */ })
```

### Rooms & Namespaces

```typescript
// Socket.io rooms par session
const sessionRoom = `session:${sessionId}`;
io.to(sessionRoom).emit('dice:rolled', result);

// Namespace pour distinction
const gm = io.of('/gm');     // Contrôles MJ
const players = io.of('/players');  // Actions joueurs
```

### Garanties Temps Réel

- **Latency < 200ms** (local network)
- **Message ordering** (séquence garantie)
- **Reconnection auto** (avec queue)
- **Binary protocol** (compression)

---

## Sécurité

### Authentification

- **JWT** pour API stateless
- **Bcrypt** pour hachage mots de passe (10 rounds)
- **Refresh tokens** en Redis
- **HttpOnly cookies** pour tokens sensibles

```typescript
// JWT Strategy
@UseGuards(JwtAuthGuard)
@Post('/protected-route')
async protectedEndpoint() { ... }

// Custom Guards
@UseGuards(SessionOwnerGuard)  // Vérifier ownership
async deleteSession(@Param('id') id: string) { ... }
```

### Validation & Sanitization

**Backend (DTOs + class-validator):**
```typescript
export class CreateCharacterDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsEnum(Occupation)
  occupation: Occupation;

  @IsNumber()
  @Min(18)
  @Max(90)
  age: number;
}
```

**Frontend (Zod schemas):**
```typescript
const characterSchema = z.object({
  name: z.string().min(1).max(100),
  occupation: z.enum(occupations),
  age: z.number().min(18).max(90),
});
```

**Sanitization OpenAI:**
```typescript
// Pas d'injection prompt sur inputs IA
const sanitized = input.replace(/[<>"']/g, '');
const prompt = `Generate description: ${sanitized}`;
```

### CORS & Headers

```typescript
// Backend CORS stricte
CorsModule.forRoot({
  origin: process.env.CORS_ORIGIN.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

### Environment & Secrets

- Variables sensibles en `.env` (jamais versionné)
- `.env.example` comme template
- Secrets en production via secrets manager
- Rotation régulière tokens

### Rate Limiting

```typescript
// À implémenter
@UseGuards(ThrottleGuard)
@Throttle(100, 60)  // 100 requests / minute
@Post('/api/dice/roll')
async rollDice() { ... }
```

---

## Scalabilité

### Horizontal Scaling

**Stateless Design:**
- JWT: aucun état serveur
- Sessions Redis: partagées entre instances
- WebSockets: Redis adapter pour multi-serveur

```typescript
// Socket.io avec Redis adapter
const io = new Server(httpServer);
io.adapter(createAdapter());  // Redis backend
```

**Load Balancer:**
```
Client
  ↓
Nginx / AWS ALB (sticky sessions)
  ↓
Backend Instance 1, 2, 3... (stateless)
  ↓
PostgreSQL (single)
  ↓
Redis (single ou cluster)
```

### Vertical Scaling

- Connection pooling PostgreSQL (max 20)
- Redis memory optimization
- Node.js clustering (si besoin)

### Caching Strategy

```
L1: Redis (session, queries chaudes)
L2: TanStack Query (browser cache)
L3: PostgreSQL (source de vérité)
```

**TTL par type:**
- Sessions JWT: 24h
- Characters: 1h
- Skill lists: 24h
- Session state: 30min

---

## Déploiement

### Environnements

| Env | Build | Database | Cache | API |
|-----|-------|----------|-------|-----|
| **Dev** | Source | Local | Memory | http://localhost:5002 |
| **Staging** | Docker | RDS | ElastiCache | https://staging-api.gameplug.dev |
| **Prod** | Docker | RDS | ElastiCache | https://api.gameplug.dev |

### Docker Compose

```yaml
services:
  postgres:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck: enabled

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes

  backend:
    build: ./apps/backend
    depends_on:
      - postgres
      - redis
    environment:
      - DATABASE_URL=postgresql://...
      - REDIS_URL=redis://...
      - JWT_SECRET=...

  frontend:
    build: ./apps/frontend
    depends_on:
      - backend
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:5002
```

### CI/CD Pipeline

```
Push → GitHub
  ↓
GitHub Actions
  ├── npm install
  ├── npm run check (TypeScript)
  ├── npm test
  ├── npm run build
  └── Docker build + push (registry)
      ↓
  Deploy to production
    ├── Pull image
    ├── docker compose up -d
    ├── Health check
    └── Smoke tests
```

---

## Decisions & Trade-offs

### Monolithe vs Microservices

**Choix: Monolithe modulaire**

Raisons:
- ✅ Simpler à déployer (1 docker image backend)
- ✅ Transactions ACID
- ✅ Meilleur pour équipe < 10 personnes
- ✅ Latency bas (même process)

### NestJS vs Express seul

**Choix: NestJS**

Raisons:
- ✅ TypeScript full-stack
- ✅ Decorators + modules
- ✅ Dependency injection
- ✅ Guards/Interceptors
- ✅ Swagger intégré

### PostgreSQL vs NoSQL

**Choix: PostgreSQL + Drizzle**

Raisons:
- ✅ Données relationnelles (characters ← → sessions)
- ✅ ACID transactions
- ✅ Drizzle type-safe SQL
- ✅ Migrations versionées
- ❌ NoSQL ne fit pas le schéma

### Zod v3 vs v4

**Choix: Zod v3** (pour maintenant)

Note: Upgrade vers v4 prévu (meilleure perf)

### Socket.io vs WebSockets purs

**Choix: ws:8.18.0** (WebSockets purs)

Raisons:
- ✅ Plus léger (pas Socket.io)
- ✅ Suffisant pour CoC (pas room complexe)
- ✅ Lower overhead

---

## Performance Benchmarks

**Target Metrics:**

| Métrique | Target | Current |
|----------|--------|---------|
| API latency | < 100ms | 45ms |
| Page load | < 2s | 1.2s |
| WebSocket latency | < 200ms | 80ms |
| Database query | < 50ms | 25ms |
| Cache hit rate | > 80% | 85% |

---

## Monitoring & Observability

### Health Checks

```bash
# API health
curl http://localhost:5002/api/health
# → { status: "ok", timestamp: "2025-01-23T..." }

# Database
docker compose exec postgres pg_isready
# → accepting connections

# Redis
docker compose exec redis redis-cli ping
# → PONG
```

### Logging

- Structured logs (JSON) à stdout
- Log levels: error, warn, info, debug
- Correlation IDs pour tracing

### Metrics (Futur)

- Prometheus metrics export
- Grafana dashboards
- Alert rules (SLOs)

---

## Resources

- [NestJS Architecture Guide](https://docs.nestjs.com/fundamentals/custom-providers)
- [Next.js App Router](https://nextjs.org/docs/app/building-your-application/routing)
- [PostgreSQL Performance](https://www.postgresql.org/docs/current/performance-tips.html)
- [WebSocket Security](https://owasp.org/www-community/attacks/websocket)

Dernière mise à jour: 23 Janvier 2025
