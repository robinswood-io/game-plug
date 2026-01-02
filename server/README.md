# Game Plug - NestJS Backend

Migration du backend Express.js vers NestJS 11.

## 🎯 Objectif

Migration complète du backend Express.js vers NestJS avec:
- Architecture modulaire (9 modules)
- WebSocket Socket.IO (remplace raw `ws`)
- Drizzle ORM (réutilise schema existant - **ZERO modification DB**)
- Session-based authentication (compatible Express)
- Call of Cthulhu 7e game mechanics

## 📦 Modules

### Core Modules
- **DatabaseModule**: Global, provides Drizzle ORM (reuses existing schema)
- **AuthModule**: Session-based auth, GM signup, local login

### Feature Modules (à venir)
- **SessionsModule**: Game sessions management + WebSocket Gateway
- **CharactersModule**: Characters CRUD + DALL-E avatars
- **GameplayModule**: CoC 7e mechanics (dice, effects, sanity)
- **ProjectionsModule**: Scene projection + DALL-E generation
- **InventoryModule**: Items management
- **NarrativeModule**: Story entries + GPT suggestions
- **AiModule**: OpenAI integration (DALL-E, GPT)

## 🚀 Installation

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your DATABASE_URL and secrets

# Build
npm run build

# Development
npm run start:dev

# Production
npm run start:prod
```

## 🔧 Configuration

### Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/game_plug
SESSION_SECRET=your-secret-key-here
PORT=5001
FRONTEND_URL=http://localhost:5173
OPENAI_API_KEY=your-openai-api-key
```

### Database

**IMPORTANT**: Ce backend réutilise EXACTEMENT le même schéma Drizzle que l'Express backend via `@shared/schema`. Aucune migration n'est nécessaire. Les données existantes sont préservées.

La connexion utilise le même `DATABASE_URL` et la même table `sessions`.

## 🏗️ Architecture

```
src/
├── main.ts                    # Bootstrap NestJS
├── app.module.ts              # Root module
│
├── common/                    # Infrastructure commune
│   ├── database/
│   │   ├── database.module.ts
│   │   ├── database.service.ts
│   │   └── database.constants.ts
│   ├── guards/
│   │   └── session-auth.guard.ts
│   └── pipes/
│       └── zod-validation.pipe.ts
│
└── modules/                   # Feature modules
    ├── auth/
    │   ├── auth.module.ts
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   ├── session.serializer.ts
    │   └── dto/
    │       ├── signup.dto.ts
    │       └── login.dto.ts
    │
    ├── sessions/ (à venir)
    ├── characters/ (à venir)
    └── ...
```

## 📝 API Endpoints

### Auth Module

#### POST /api/auth/signup
Création compte GM (local auth).

```json
{
  "email": "gm@example.com",
  "password": "securepass",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### POST /api/auth/login
Authentification locale.

```json
{
  "email": "gm@example.com",
  "password": "securepass"
}
```

#### POST /api/auth/logout
Déconnexion (détruit la session).

#### GET /api/auth/user
Récupère l'utilisateur connecté (requiert auth).

## 🔐 Sécurité

- Passwords hashés avec bcrypt (12 salt rounds)
- Session-based auth (compatible Express backend)
- CORS configuré pour FRONTEND_URL
- Validation Zod sur tous les inputs
- Réutilisation sessions table PostgreSQL

## 🧪 Tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📅 Migration Status

### ✅ Phase 1 Semaine 1 (En cours)
- [x] Setup NestJS project
- [x] DatabaseModule + Drizzle provider
- [x] AuthModule (signup, login, logout, user)
- [ ] Tests unitaires AuthService
- [ ] Tests E2E auth endpoints

### 🔜 Phase 1 Semaine 2
- [ ] SessionsModule + Controller + Service
- [ ] WebSocket Gateway (Socket.IO)
- [ ] Migration broadcast logic

### 🔜 Phase 1 Semaine 3
- [ ] CharactersModule + Avatar generation
- [ ] GameplayModule + Game logic

### 🔜 Phase 1 Semaine 4
- [ ] Remaining modules (Projections, Inventory, Narrative, AI)
- [ ] Integration tests
- [ ] Performance testing

## 🔗 Liens

- [Plan complet](../.claude/plans/kind-launching-thimble.md)
- [Express backend](../backend/) - Backend original (sera déprécié)
- [Shared schema](../shared/schema.ts) - Schéma Drizzle partagé

## ⚠️ IMPORTANT - Préservation des Données

Ce backend NestJS réutilise **EXACTEMENT** le même schéma de base de données que l'Express backend via le module `@shared/schema`. Cela garantit:

- ✅ ZERO modification de la structure DB
- ✅ ZERO perte de données
- ✅ Compatibilité totale avec les données existantes
- ✅ Possibilité de rollback vers Express à tout moment

**Le DatabaseService est un simple wrapper** autour de Drizzle qui ajoute le support des transactions mais ne modifie AUCUNE table.
