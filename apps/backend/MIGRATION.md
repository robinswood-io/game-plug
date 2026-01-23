# Backend NestJS - Migration Stack Entreprise

## État Actuel ✅

### Backend NestJS Opérationnel

**37 endpoints REST** + 1 health check = **38 routes exposées**

## Architecture

### Modules (15)

#### Core Infrastructure
- **DatabaseModule** (Global) - PostgreSQL + Drizzle ORM
- **CacheModule** (Global) - Redis avec fallback in-memory
- **AuthModule** - JWT + Passport + bcrypt
- **WebSocketsModule** - Socket.io pour temps réel
- **HealthModule** - Health check système

#### Business Logic
- **CharactersModule** - Personnages Call of Cthulhu 7e
- **SessionsModule** - Sessions de jeu
- **InventoryModule** - Inventaire personnages
- **ChaptersModule** - Chapitres de session
- **ChapterEventsModule** - Événements de chapitre
- **NarrativeModule** - Entrées narratives GM
- **SanityModule** - Conditions santé mentale
- **DiceModule** - Système de dés CoC 7e

#### Features
- **AIModule** - Intégration IA (OpenAI)
- **GameboardModule** - Plateau de jeu

## API Endpoints

### Authentification (3 endpoints)
```
POST   /api/auth/signup    - Inscription utilisateur
POST   /api/auth/login     - Connexion JWT
POST   /api/auth/refresh   - Rafraîchir token
```

### Personnages CoC 7e (5 endpoints)
```
GET    /api/characters           - Liste personnages
GET    /api/characters/:id       - Détail personnage
POST   /api/characters           - Créer personnage
PATCH  /api/characters/:id       - Mettre à jour
DELETE /api/characters/:id       - Supprimer
```

### Sessions de Jeu (5 endpoints)
```
GET    /api/sessions             - Liste sessions
GET    /api/sessions/:id         - Détail session
POST   /api/sessions             - Créer session
PATCH  /api/sessions/:id         - Mettre à jour
DELETE /api/sessions/:id         - Supprimer
```

### Inventaire (4 endpoints)
```
GET    /api/inventory?characterId=   - Items par personnage
POST   /api/inventory                - Ajouter item
PATCH  /api/inventory/:id            - Modifier item
DELETE /api/inventory/:id            - Supprimer item
```

### Chapitres (5 endpoints)
```
GET    /api/chapters?sessionId=   - Chapitres par session
GET    /api/chapters/:id          - Détail chapitre
POST   /api/chapters              - Créer chapitre
PATCH  /api/chapters/:id          - Modifier
DELETE /api/chapters/:id          - Supprimer
```

### Événements Chapitre (5 endpoints)
```
GET    /api/chapter-events?chapterId=  - Événements par chapitre
GET    /api/chapter-events?sessionId=  - Événements par session
GET    /api/chapter-events/:id         - Détail événement
POST   /api/chapter-events             - Créer événement
PATCH  /api/chapter-events/:id         - Modifier
DELETE /api/chapter-events/:id         - Supprimer
```

### Narration (4 endpoints)
```
GET    /api/narrative?sessionId=  - Entrées narratives
POST   /api/narrative             - Créer entrée
PATCH  /api/narrative/:id         - Modifier
DELETE /api/narrative/:id         - Supprimer
```

### Santé Mentale (4 endpoints)
```
GET    /api/sanity?characterId=   - Conditions par personnage
POST   /api/sanity                - Créer condition
PATCH  /api/sanity/:id            - Modifier
DELETE /api/sanity/:id            - Supprimer
```

### Système de Dés (1 endpoint)
```
POST   /api/dice/roll             - Lancer de dés CoC 7e
```

### Monitoring (1 endpoint)
```
GET    /api/health                - Health check serveur
```

## Fonctionnalités Techniques

### ✅ Implémenté

- **TypeScript Strict** - 0 erreurs de compilation
- **Authentification JWT** - Login, signup, refresh token
- **Drizzle ORM** - Requêtes type-safe avec PostgreSQL
- **Cache Redis** - Avec fallback in-memory automatique
- **WebSockets** - Socket.io pour communication temps réel
- **Système de dés CoC 7e** - Évaluation formules (d100, succès critique/hard/normal)
- **Relations Drizzle** - Chargement automatique des relations
- **Error Handling** - NotFoundException pour ressources manquantes
- **CORS** - Configuré pour développement

### 🔄 En Cours

- **DTOs avec Validation** - class-validator pour tous les endpoints
- **Documentation OpenAPI** - Swagger UI automatique
- **Tests Unitaires** - Jest pour services et controllers
- **Guards personnalisés** - Permissions GM/Player

### ⏭️ Prochaines Étapes

1. **Documentation OpenAPI/Swagger**
   - Installer @nestjs/swagger compatible
   - Créer DTOs avec @ApiProperty
   - Générer spec OpenAPI

2. **Validation Complète**
   - DTOs avec class-validator
   - Pipes de validation globaux
   - Sanitization des inputs

3. **Tests**
   - Tests unitaires services
   - Tests e2e endpoints
   - Coverage > 80%

4. **Migration Frontend**
   - Next.js 16 + Turbopack
   - Client TypeScript auto-généré depuis OpenAPI
   - Suppression tRPC (remplacé par REST + OpenAPI)

5. **Déploiement**
   - Configuration Docker Compose
   - Variables d'environnement production
   - CI/CD pipeline

## Commandes

### Développement
```bash
cd /srv/workspace/game-plug/apps/backend

# Type check
npx tsc --noEmit

# Build
npm run build

# Démarrer serveur
npm start

# Mode watch (développement)
npm run start:dev
```

### Test
```bash
# Tests unitaires
npm test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## Configuration

### Variables d'Environnement

Créer `/srv/workspace/game-plug/.env` :

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/game_plug

# Redis (optionnel - fallback in-memory si absent)
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key-change-in-production

# Server
PORT=5002
CORS_ORIGIN=http://localhost:5173

# OpenAI (optionnel)
OPENAI_API_KEY=sk-...
```

### Base de Données

Le schema est défini dans `/srv/workspace/game-plug/shared/schema.ts` avec :
- 13 tables PostgreSQL
- Relations Drizzle ORM
- Zod schemas pour validation

## Architecture Technique

### Stack
- **NestJS 11** - Framework backend modulaire
- **TypeScript 5.7+** - Mode strict
- **Drizzle ORM 0.45+** - ORM type-safe
- **PostgreSQL 16** - Base de données
- **Redis 4+** - Cache distribué
- **Socket.io 4+** - WebSockets
- **Passport + JWT** - Authentification
- **bcrypt** - Hash passwords

### Patterns
- **Module par domaine** - Séparation claire des responsabilités
- **Dependency Injection** - NestJS DI container
- **Repository Pattern** - Services encapsulent logique métier
- **DTO Pattern** - Séparation modèles DB / API
- **Global Modules** - Database, Cache partagés
- **Guards** - Protection endpoints avec JWT

## Métriques

- **Modules**: 15
- **Controllers**: 9
- **Services**: 15
- **Endpoints REST**: 37
- **Lignes de code TypeScript**: ~2000
- **Compilation**: 0 erreurs
- **Couverture tests**: 0% (à implémenter)
