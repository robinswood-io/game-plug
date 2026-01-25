# Migration Plan - Game Plug vers Stack Entreprise

**Date de début:** 2026-01-22
**Statut global:** 🔄 Phase 1 - Backend Migration (En cours)

## Vue d'ensemble

Migration de Rôle Plug (game-plug) depuis une stack Express + React/Vite vers une architecture entreprise grade basée sur NestJS + Next.js.

### Objectifs

1. **Backend:** Migrer de Express.js vers NestJS 11
2. **Frontend:** Migrer de React/Vite vers Next.js 16
3. **Real-time:** Migrer de ws vers Socket.io
4. **Session Store:** Migrer de MemoryStore vers Redis
5. **API Pattern:** Implémenter tRPC + Server Actions
6. **Deployment:** Architecture dual-container

### Bénéfices attendus

- ✅ **Modularité:** Architecture NestJS modulaire et maintenable
- ✅ **Type Safety:** End-to-end typing avec tRPC
- ✅ **Performance:** Hot reload Turbopack + optimisations Next.js
- ✅ **Scalabilité:** Redis session store + dual containers
- ✅ **DX:** Meilleure developer experience avec Server Actions
- ✅ **Production-ready:** Standards entreprise + monitoring

---

## Phase 1: Backend Migration (NestJS) 🚧 EN COURS

**Durée estimée:** 2-3 semaines
**Statut:** 🔄 Pas encore démarrée

### 1.1 Setup Infrastructure NestJS

**Objectif:** Créer la structure de base NestJS

**Tâches:**

- [ ] Créer répertoire `apps/backend/`
- [ ] Installer NestJS CLI: `npm i -g @nestjs/cli`
- [ ] Initialiser projet NestJS: `nest new backend`
- [ ] Configurer TypeScript strict mode
- [ ] Configurer ESLint + Prettier
- [ ] Ajouter scripts npm dans package.json racine

**Commandes:**

```bash
cd /srv/workspace/game-plug
mkdir -p apps/backend
cd apps/backend
nest new . --strict --package-manager npm
```

**Fichiers à créer:**

```
apps/backend/
├── src/
│   ├── main.ts              # Bootstrap NestJS
│   ├── app.module.ts        # Root module
│   └── common/              # Shared utilities
│       ├── guards/
│       ├── interceptors/
│       ├── filters/
│       └── decorators/
├── tsconfig.json
├── package.json
└── nest-cli.json
```

**Dépendances à installer:**

```bash
# Core NestJS
npm install @nestjs/common @nestjs/core @nestjs/platform-express

# Database
npm install drizzle-orm postgres
npm install -D drizzle-kit

# Validation
npm install class-validator class-transformer zod drizzle-zod

# WebSocket
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io

# Cache/Redis
npm install @nestjs/cache-manager cache-manager
npm install cache-manager-redis-store redis

# Auth
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs
npm install -D @types/passport-jwt @types/bcryptjs

# Config
npm install @nestjs/config

# OpenAI
npm install openai
```

---

### 1.2 Core Modules

#### 1.2.1 DatabaseModule

**Objectif:** Configurer connexion PostgreSQL + Drizzle ORM

**Fichiers:**

```typescript
// apps/backend/src/database/database.module.ts
import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

const databaseProvider = {
  provide: DATABASE_CONNECTION,
  useFactory: () => {
    const connectionString = process.env.DATABASE_URL;
    const client = postgres(connectionString);
    return drizzle(client, { schema });
  },
};

@Module({
  providers: [databaseProvider],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
```

**Usage dans services:**

```typescript
@Injectable()
export class CharactersService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: any,
  ) {}

  async findAll() {
    return this.db.select().from(schema.characters);
  }
}
```

**Tâches:**

- [ ] Créer DatabaseModule
- [ ] Configurer Drizzle provider
- [ ] Tester connexion PostgreSQL
- [ ] Migrer schema depuis `shared/schema.ts`

---

#### 1.2.2 CacheModule (Redis)

**Objectif:** Configurer Redis pour session store et cache

**Fichiers:**

```typescript
// apps/backend/src/cache/cache.module.ts
import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    NestCacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      ttl: 3600, // 1 hour default
    }),
  ],
})
export class CacheModule {}
```

**Tâches:**

- [ ] Créer CacheModule
- [ ] Configurer Redis connection
- [ ] Implémenter session store avec Redis
- [ ] Tester cache avec Redis

**Notes:**

- Remplace MemoryStore actuel
- Sessions partagées entre instances
- TTL configurable par endpoint

---

#### 1.2.3 AuthModule

**Objectif:** Système d'authentification JWT

**Fichiers:**

```typescript
// apps/backend/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

**Routes à migrer:**

- `POST /api/auth/signup` → `AuthController.signup()`
- `POST /api/auth/login` → `AuthController.login()`
- `POST /api/auth/logout` → `AuthController.logout()`
- `GET /api/auth/user` → `AuthController.getUser()`

**Tâches:**

- [ ] Créer AuthModule avec JWT
- [ ] Implémenter AuthService (bcrypt hash)
- [ ] Créer JwtStrategy + LocalStrategy
- [ ] Créer AuthGuard (remplace middleware `isAuthenticated`)
- [ ] Migrer routes auth
- [ ] Tests unitaires

---

#### 1.2.4 HealthModule

**Objectif:** Health checks pour monitoring

**Fichiers:**

```typescript
// apps/backend/src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Controller('api/health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }
}
```

**Tâches:**

- [ ] Installer @nestjs/terminus
- [ ] Créer HealthModule
- [ ] Migrer route `/api/health`
- [ ] Ajouter checks: DB, Redis, OpenAI

---

### 1.3 Feature Modules

#### 1.3.1 SessionsModule

**Objectif:** Gestion des sessions de jeu (GM)

**Routes à migrer:**

- `POST /api/sessions` → Create session
- `GET /api/sessions` → List sessions
- `GET /api/sessions/:id` → Get session
- `PATCH /api/sessions/:id` → Update session
- `DELETE /api/sessions/:id` → Delete session
- `GET /api/sessions/join/:code` → Join with code
- `GET /api/sessions/:id/characters` → Get session characters

**Structure:**

```
apps/backend/src/sessions/
├── sessions.module.ts
├── sessions.controller.ts
├── sessions.service.ts
├── dto/
│   ├── create-session.dto.ts
│   ├── update-session.dto.ts
│   └── join-session.dto.ts
└── entities/
    └── session.entity.ts
```

**DTOs:**

```typescript
// create-session.dto.ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  code?: string; // Auto-generated if not provided
}
```

**Tâches:**

- [ ] Créer SessionsModule structure
- [ ] Implémenter SessionsService avec Drizzle
- [ ] Créer SessionsController
- [ ] Créer DTOs (Create, Update, Join)
- [ ] Migrer logique métier depuis `server/routes.ts`
- [ ] Implémenter guards (isGM, hasAccess)
- [ ] Tests unitaires + intégration

---

#### 1.3.2 CharactersModule

**Objectif:** Gestion des personnages CoC

**Routes à migrer:**

- `POST /api/characters` → Create character
- `GET /api/characters` → List characters
- `GET /api/characters/:id` → Get character
- `PATCH /api/characters/:id` → Update character
- `PATCH /api/characters/:id/notes` → Update notes
- `POST /api/characters/:id/skill-points` → Add skill points
- `POST /api/characters/:id/distribute-points` → Distribute points
- `POST /api/characters/:id/effects` → Add effect
- `POST /api/characters/:id/sanity-conditions` → Add sanity condition

**Structure:**

```
apps/backend/src/characters/
├── characters.module.ts
├── characters.controller.ts
├── characters.service.ts
├── dto/
│   ├── create-character.dto.ts
│   ├── update-character.dto.ts
│   ├── distribute-points.dto.ts
│   └── add-effect.dto.ts
└── entities/
    └── character.entity.ts
```

**Business Logic à migrer:**

- Calculs CoC 7e (HP, Sanity, Magic Points)
- Distribution de points de compétence
- Validation règles CoC
- Gestion des effets/buffs

**Tâches:**

- [ ] Créer CharactersModule structure
- [ ] Implémenter CharactersService
- [ ] Migrer logique métier CoC (`server/game-logic.ts`)
- [ ] Créer DTOs avec validation Zod
- [ ] Créer CharactersController
- [ ] Tests unitaires (logique CoC)

---

#### 1.3.3 ChaptersModule

**Objectif:** Gestion des chapitres de session

**Routes à migrer:**

- `POST /api/sessions/:sessionId/chapters` → Create chapter
- `GET /api/sessions/:sessionId/chapters` → List chapters
- `PATCH /api/chapters/:id` → Update chapter
- `DELETE /api/chapters/:id` → Delete chapter

**Tâches:**

- [ ] Créer ChaptersModule
- [ ] Implémenter ChaptersService
- [ ] Créer ChaptersController
- [ ] Tests

---

#### 1.3.4 ChapterEventsModule

**Objectif:** Événements importants de session

**Routes à migrer:**

- `POST /api/chapter-events` → Create event
- `GET /api/chapters/:chapterId/events` → List events
- `GET /api/sessions/:sessionId/important-events` → Get important events
- `PATCH /api/chapter-events/:id` → Update event
- `DELETE /api/chapter-events/:id` → Delete event

**Tâches:**

- [ ] Créer ChapterEventsModule
- [ ] Implémenter service + controller
- [ ] Tests

---

#### 1.3.5 InventoryModule

**Objectif:** Gestion inventaire personnages

**Routes à migrer:**

- `GET /api/characters/:id/inventory` → Get inventory
- `POST /api/characters/:id/inventory` → Add item
- `PATCH /api/inventory/:id` → Update item
- `PATCH /api/inventory/:id/equip` → Equip/unequip
- `DELETE /api/inventory/:id` → Delete item
- `PATCH /api/characters/:characterId/inventory/:itemId` → Update item
- `DELETE /api/characters/:characterId/inventory/:itemId` → Delete item

**Tâches:**

- [ ] Créer InventoryModule
- [ ] Implémenter service + controller
- [ ] Gérer logique équipement
- [ ] Tests

---

#### 1.3.6 NarrativeModule

**Objectif:** Éléments narratifs de session

**Routes à migrer:**

- `GET /api/sessions/:sessionId/narrative` → Get narrative elements
- `POST /api/sessions/:sessionId/narrative` → Create narrative
- `POST /api/sessions/:sessionId/narrative/ai-suggest` → AI suggestions
- `PATCH /api/narrative/:id` → Update narrative
- `DELETE /api/narrative/:id` → Delete narrative

**Tâches:**

- [ ] Créer NarrativeModule
- [ ] Implémenter service + controller
- [ ] Intégrer AIService pour suggestions
- [ ] Tests

---

#### 1.3.7 GameboardModule

**Objectif:** GameBoard projection visuelle

**Routes à migrer:**

- `POST /api/gameboard/generate-scene` → Generate scene image

**Tâches:**

- [ ] Créer GameboardModule
- [ ] Implémenter service (délègue à AIService)
- [ ] Tests

---

#### 1.3.8 AIModule

**Objectif:** Intégration OpenAI (DALL-E 3, GPT-5)

**Routes à migrer:**

- `POST /api/generate-avatar` → Generate avatar
- `POST /api/characters/:characterId/generate-avatar` → Generate for character
- `POST /api/sessions/:sessionId/generate-all-avatars` → Batch generation
- `POST /api/migrate-avatars` → Migrate avatars to storage

**Structure:**

```
apps/backend/src/ai/
├── ai.module.ts
├── ai.service.ts          # Orchestration
├── dalle.service.ts       # DALL-E 3 integration
├── gpt.service.ts         # GPT-5 integration
└── dto/
    ├── generate-avatar.dto.ts
    └── generate-scene.dto.ts
```

**Services:**

```typescript
// ai.service.ts
@Injectable()
export class AIService {
  constructor(
    private readonly dalle: DallEService,
    private readonly gpt: GPTService,
  ) {}

  async generateAvatar(character: Character): Promise<string> {
    const prompt = this.buildAvatarPrompt(character);
    return this.dalle.generate(prompt, '1024x1024');
  }

  async generateScene(description: string): Promise<string> {
    const prompt = this.buildScenePrompt(description);
    return this.dalle.generate(prompt, '1792x1024');
  }

  async suggestNarrative(context: string): Promise<string> {
    return this.gpt.complete(context);
  }

  private buildAvatarPrompt(character: Character): string {
    return `1920s style portrait of ${character.name}, ${character.occupation},
            age ${character.age}, ${character.gender},
            ${character.hairColor} hair, ${character.eyeColor} eyes,
            ${character.build} build, black and white vintage photograph`;
  }

  private buildScenePrompt(description: string): string {
    return `Lovecraftian horror scene: ${description},
            atmospheric, dark, mysterious, 1920s era, cinematic`;
  }
}
```

**Tâches:**

- [ ] Créer AIModule
- [ ] Migrer code depuis `server/openai.ts`
- [ ] Implémenter DallEService
- [ ] Implémenter GPTService
- [ ] Implémenter AIService (orchestration)
- [ ] Configurer rate limiting
- [ ] Gérer erreurs OpenAI
- [ ] Tests (mock OpenAI responses)

---

#### 1.3.9 SanityModule

**Objectif:** Gestion santé mentale CoC

**Routes à migrer:**

- `POST /api/characters/:id/sanity-conditions` → Add condition

**Business Logic:**

- Calcul perte de santé mentale
- Déclenchement phobies/manies
- Temporary/Indefinite/Permanent Insanity

**Tâches:**

- [ ] Créer SanityModule
- [ ] Implémenter logique CoC 7e sanity
- [ ] Tests unitaires (règles CoC)

---

### 1.4 WebSocket Migration (Socket.io Gateway)

**Objectif:** Migrer de ws vers Socket.io

**Current Events (ws):**

```typescript
// server/websocket.ts - Current implementation
wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const message = JSON.parse(data);
    switch (message.type) {
      case 'character:update':
        // Broadcast to all clients
        break;
      case 'dice:roll':
        // Broadcast dice result
        break;
      case 'gameboard:update':
        // Update GameBoard
        break;
    }
  });
});
```

**Target Implementation (Socket.io Gateway):**

```typescript
// apps/backend/src/websockets/game.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/game',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Clean up session rooms
  }

  @SubscribeMessage('session:join')
  handleJoinSession(
    @MessageBody() data: { sessionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`session:${data.sessionId}`);
    this.server.to(`session:${data.sessionId}`).emit('player:joined', {
      clientId: client.id,
    });
  }

  @SubscribeMessage('character:update')
  handleCharacterUpdate(
    @MessageBody() data: { sessionId: string; character: any },
  ) {
    this.server.to(`session:${data.sessionId}`).emit('character:updated', data.character);
  }

  @SubscribeMessage('dice:roll')
  handleDiceRoll(
    @MessageBody() data: { sessionId: string; roll: any },
  ) {
    this.server.to(`session:${data.sessionId}`).emit('dice:rolled', data.roll);
  }

  @SubscribeMessage('gameboard:update')
  handleGameboardUpdate(
    @MessageBody() data: { sessionId: string; gameboard: any },
  ) {
    this.server.to(`session:${data.sessionId}`).emit('gameboard:updated', data.gameboard);
  }
}
```

**Events à migrer:**

- `session:join` - Rejoindre une session
- `session:leave` - Quitter une session
- `character:update` - Mise à jour personnage
- `dice:roll` - Lancer de dés
- `gameboard:update` - Mise à jour GameBoard
- `narrative:update` - Mise à jour narrative
- `chapter:update` - Mise à jour chapitre

**Tâches:**

- [ ] Installer @nestjs/websockets + socket.io
- [ ] Créer WebSocketsModule
- [ ] Créer GameGateway
- [ ] Implémenter room-based broadcasting
- [ ] Migrer tous les événements depuis `server/websocket.ts`
- [ ] Gérer reconnexion automatique
- [ ] Tests WebSocket (socket.io-client)

**Bénéfices Socket.io:**

- ✅ Rooms (isolation par session)
- ✅ Reconnexion automatique
- ✅ Acknowledgments
- ✅ Meilleure gestion erreurs

---

### 1.5 Global Infrastructure

#### 1.5.1 Global Guards

```typescript
// apps/backend/src/common/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
```

**Tâches:**

- [ ] Créer JwtAuthGuard (remplace `isAuthenticated`)
- [ ] Créer GMGuard (vérifie isGM)
- [ ] Créer SessionAccessGuard (vérifie accès session)

---

#### 1.5.2 Global Interceptors

```typescript
// apps/backend/src/common/interceptors/logging.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        console.log(`${method} ${url} ${responseTime}ms`);
      }),
    );
  }
}
```

**Tâches:**

- [ ] Créer LoggingInterceptor
- [ ] Créer TransformInterceptor (standardize responses)
- [ ] Créer ErrorsInterceptor

---

#### 1.5.3 Global Filters

```typescript
// apps/backend/src/common/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

**Tâches:**

- [ ] Créer HttpExceptionFilter
- [ ] Créer ValidationExceptionFilter

---

### 1.6 Configuration & Environment

**Fichier `.env` mis à jour:**

```env
# Database
DATABASE_URL=postgresql://roleplug:password@postgres:5432/roleplug

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secure-jwt-secret
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# OpenAI
OPENAI_API_KEY=sk-your-key

# Application
NODE_ENV=production
PORT=4000
```

**Configuration NestJS:**

```typescript
// apps/backend/src/config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
})
export class ConfigModule {}
```

**Tâches:**

- [ ] Configurer @nestjs/config
- [ ] Créer fichiers config par service
- [ ] Valider env variables au démarrage

---

### 1.7 Tests Backend

**Test Structure:**

```
apps/backend/test/
├── unit/
│   ├── characters.service.spec.ts
│   ├── sessions.service.spec.ts
│   └── ai.service.spec.ts
├── integration/
│   ├── characters.controller.spec.ts
│   └── sessions.controller.spec.ts
└── e2e/
    ├── auth.e2e-spec.ts
    ├── characters.e2e-spec.ts
    └── websocket.e2e-spec.ts
```

**Tâches:**

- [ ] Configurer Jest pour NestJS
- [ ] Écrire tests unitaires pour tous les services
- [ ] Écrire tests intégration pour controllers
- [ ] Écrire tests E2E pour flux critiques
- [ ] Coverage target: 80%+

---

### 1.8 Documentation Backend

**Swagger/OpenAPI:**

```typescript
// apps/backend/src/main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Game Plug API')
  .setDescription('Call of Cthulhu digital platform API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

**Tâches:**

- [ ] Installer @nestjs/swagger
- [ ] Ajouter decorators sur DTOs
- [ ] Générer documentation OpenAPI
- [ ] Accessible sur `/api/docs`

---

## Phase 2: Frontend Migration (Next.js) 🚧 PLANIFIÉE

**Durée estimée:** 2-3 semaines
**Statut:** 🔄 Pas encore démarrée

### 2.1 Setup Next.js Infrastructure

**Tâches:**

- [ ] Créer répertoire `apps/frontend/`
- [ ] Initialiser Next.js 16: `npx create-next-app@latest`
- [ ] Configurer Turbopack
- [ ] Configurer App Router
- [ ] Setup Tailwind CSS + Radix UI
- [ ] Configurer import aliases

**Structure:**

```
apps/frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/
│   │   ├── characters/
│   │   ├── sessions/
│   │   ├── gm-dashboard/
│   │   └── gameboard/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/              # Radix components
│   ├── character/
│   ├── gm/
│   └── gameboard/
├── lib/
│   ├── actions/         # Server Actions
│   ├── trpc-server.ts   # tRPC client
│   └── utils.ts
└── hooks/
    ├── use-characters.ts
    ├── use-sessions.ts
    └── use-websocket.ts
```

---

### 2.2 Authentication (NextAuth.js v5)

**Tâches:**

- [ ] Installer NextAuth.js v5
- [ ] Configurer JWT provider
- [ ] Créer route API `/api/auth/[...nextauth]`
- [ ] Implémenter login/logout flows
- [ ] Protected routes middleware
- [ ] Session management

---

### 2.3 tRPC + Server Actions Setup

**Tâches:**

- [ ] Installer @trpc/client + @trpc/server
- [ ] Créer tRPC client dans Next.js
- [ ] Importer AppRouter type depuis NestJS
- [ ] Créer Server Actions pour chaque module
- [ ] Implémenter cache revalidation

**Example Server Action:**

```typescript
// apps/frontend/lib/actions/characters-trpc.ts
'use server'

import { trpcServerClient } from '@/lib/trpc-server';
import { revalidatePath } from 'next/cache';

export async function createCharacter(data: CreateCharacterInput) {
  try {
    const character = await trpcServerClient.characters.create.mutate(data);
    revalidatePath('/characters');
    return { data: character, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to create character' };
  }
}
```

---

### 2.4 Page Migration

**Pages à migrer (15 pages):**

| Page actuelle | Route Next.js | Statut |
|---------------|---------------|--------|
| `landing.tsx` | `/` | 🔄 |
| `gm-login.tsx` | `/(auth)/login` | 🔄 |
| `gm-signup.tsx` | `/(auth)/signup` | 🔄 |
| `home.tsx` | `/(dashboard)/home` | 🔄 |
| `character-creation.tsx` | `/(dashboard)/characters/new` | 🔄 |
| `character-sheet.tsx` | `/(dashboard)/characters/[id]` | 🔄 |
| `character-edit.tsx` | `/(dashboard)/characters/[id]/edit` | 🔄 |
| `select-character.tsx` | `/(dashboard)/characters` | 🔄 |
| `session-manager.tsx` | `/(dashboard)/sessions` | 🔄 |
| `join-session.tsx` | `/(dashboard)/join` | 🔄 |
| `join-with-code.tsx` | `/(dashboard)/join/[code]` | 🔄 |
| `gm-dashboard.tsx` | `/(dashboard)/gm/sessions/[id]` | 🔄 |
| `gm-dashboard-simplified.tsx` | `/(dashboard)/gm/sessions/[id]/simple` | 🔄 |
| `gameboard.tsx` | `/(dashboard)/gameboard/[sessionId]` | 🔄 |
| `not-found.tsx` | `/not-found` | 🔄 |

**Tâches par page:**

- [ ] Migrer composant vers Server Component (RSC)
- [ ] Créer Server Actions pour mutations
- [ ] Utiliser TanStack Query pour cache client
- [ ] Migrer hooks personnalisés
- [ ] Tests E2E Playwright

---

### 2.5 Components Migration

**Composants à migrer:**

- [ ] UI components (Radix) - Déjà compatibles
- [ ] Character components (création, sheet, edit)
- [ ] GM dashboard components
- [ ] GameBoard components
- [ ] Dice roller components
- [ ] Inventory components

**Tâches:**

- [ ] Migrer tous composants vers `apps/frontend/components/`
- [ ] Adapter pour Server/Client Components
- [ ] Utiliser Server Actions au lieu de fetch()

---

### 2.6 WebSocket Client (Socket.io)

**Tâches:**

- [ ] Installer socket.io-client
- [ ] Créer `useWebSocket` hook
- [ ] Connecter à NestJS Gateway
- [ ] Gérer events temps réel
- [ ] Implémenter reconnexion auto

**Hook:**

```typescript
// apps/frontend/hooks/use-websocket.ts
'use client'

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useWebSocket(sessionId: string) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:4000/game', {
      reconnection: true,
    });

    newSocket.emit('session:join', { sessionId });

    newSocket.on('character:updated', (character) => {
      // Update UI
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [sessionId]);

  return socket;
}
```

---

### 2.7 Tests Frontend

**Tâches:**

- [ ] Migrer tests Playwright vers Next.js
- [ ] Adapter chemins de routes
- [ ] Tester Server Actions
- [ ] Coverage E2E complète

---

## Phase 3: Production Deployment 🚧 PLANIFIÉE

**Durée estimée:** 1 semaine
**Statut:** 🔄 Pas encore démarrée

### 3.1 Docker Configuration

**Backend Dockerfile:**

```dockerfile
# apps/backend/Dockerfile
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 4000
CMD ["node", "dist/main.js"]
```

**Frontend Dockerfile:**

```dockerfile
# apps/frontend/Dockerfile
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
```

**Tâches:**

- [ ] Créer Dockerfile backend
- [ ] Créer Dockerfile frontend
- [ ] Optimiser image sizes
- [ ] Multi-stage builds

---

### 3.2 Docker Compose (Central Orchestration)

**Mise à jour `/srv/workspace/docker-compose.apps.yml`:**

```yaml
services:
  game-plug-backend:
    build:
      context: /srv/workspace/game-plug/apps/backend
      dockerfile: Dockerfile
    container_name: game-plug-backend
    env_file:
      - /srv/workspace/game-plug/.env
    networks:
      - traefik_public
      - dev_network
    depends_on:
      - postgres
      - redis
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.game-plug-api.rule=Host(`game-plug.rbw.ovh`) && PathPrefix(`/api`)"
      - "traefik.http.services.game-plug-api.loadbalancer.server.port=4000"
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:4000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  game-plug-frontend:
    build:
      context: /srv/workspace/game-plug/apps/frontend
      dockerfile: Dockerfile
    container_name: game-plug-frontend
    environment:
      - NEXT_PUBLIC_API_URL=http://game-plug-backend:4000
      - NEXT_PUBLIC_WS_URL=http://game-plug-backend:4000
    networks:
      - traefik_public
      - dev_network
    depends_on:
      - game-plug-backend
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.game-plug.rule=Host(`game-plug.rbw.ovh`)"
      - "traefik.http.services.game-plug.loadbalancer.server.port=3000"
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
```

**Tâches:**

- [ ] Mettre à jour docker-compose.apps.yml
- [ ] Configurer Traefik routing
- [ ] Configurer health checks
- [ ] Tester déploiement staging

---

### 3.3 Infrastructure (Redis)

**Tâches:**

- [ ] Déployer Redis dans infrastructure partagée
- [ ] Configurer persistance Redis
- [ ] Setup monitoring Redis

---

### 3.4 Deployment & Cutover

**Stratégie Blue-Green:**

1. **Déployer nouvelle stack (Green)** en parallèle
2. **Tester** sur domaine staging
3. **Basculer** Traefik routing vers nouvelle stack
4. **Monitorer** pendant 24h
5. **Rollback plan** si problèmes

**Tâches:**

- [ ] Déployer backend (NestJS)
- [ ] Déployer frontend (Next.js)
- [ ] Migrer données si nécessaire
- [ ] Basculer traffic Traefik
- [ ] Monitorer logs/métriques
- [ ] Désactiver ancienne stack après validation

---

### 3.5 Monitoring & Observability

**Tâches:**

- [ ] Configurer logging structuré (Winston)
- [ ] Setup Prometheus metrics
- [ ] Configurer alertes
- [ ] Dashboard Grafana

---

## Checklist Globale

### Phase 1: Backend (NestJS) 🚧

- [ ] Setup infrastructure NestJS
- [ ] DatabaseModule (Drizzle + PostgreSQL)
- [ ] CacheModule (Redis)
- [ ] AuthModule (JWT)
- [ ] HealthModule
- [ ] SessionsModule
- [ ] CharactersModule
- [ ] ChaptersModule
- [ ] ChapterEventsModule
- [ ] InventoryModule
- [ ] NarrativeModule
- [ ] GameboardModule
- [ ] AIModule (OpenAI)
- [ ] SanityModule
- [ ] WebSocket Gateway (Socket.io)
- [ ] Global Guards/Interceptors/Filters
- [ ] Tests (Unit + Integration + E2E)
- [ ] Documentation (Swagger)

### Phase 2: Frontend (Next.js) 🚧

- [ ] Setup Next.js 16 + Turbopack
- [ ] NextAuth.js v5 authentication
- [ ] tRPC client setup
- [ ] Server Actions
- [ ] Migrer 15 pages
- [ ] Migrer composants
- [ ] WebSocket client (Socket.io)
- [ ] Tests Playwright

### Phase 3: Production 🚧

- [ ] Dockerfiles (backend + frontend)
- [ ] Docker Compose central
- [ ] Redis infrastructure
- [ ] Deployment staging
- [ ] Cutover production
- [ ] Monitoring/Observability

---

## Notes Importantes

### ⚠️ Points d'Attention

1. **Backwards Compatibility:** Maintenir l'ancienne API pendant migration frontend
2. **Database Schema:** Aucun changement prévu - réutilisation complète
3. **WebSocket Protocol:** Adapter clients lors migration Socket.io
4. **Session Store:** Migrer sessions MemoryStore → Redis sans perte
5. **OpenAI Rate Limits:** Conserver même logique rate limiting

### 🎯 Objectifs de Performance

- **Backend:** Response time < 200ms (P95)
- **Frontend:** First Contentful Paint < 1.5s
- **WebSocket:** Latency < 100ms
- **Database:** Query time < 50ms (P95)

### 📊 Métriques de Succès

- [ ] 100% routes migrées (50+ endpoints)
- [ ] 100% pages migrées (15 pages)
- [ ] Tests coverage ≥ 80%
- [ ] Zero downtime deployment
- [ ] Performance égale ou meilleure

---

## Prochaines Étapes Immédiates

**À faire maintenant:**

1. ✅ Créer CLAUDE.md ← FAIT
2. ✅ Créer MIGRATION_PLAN.md ← FAIT
3. 🔄 **NEXT:** Démarrer Phase 1.1 - Setup infrastructure NestJS
   - Créer répertoire `apps/backend/`
   - Initialiser projet NestJS
   - Installer dépendances de base
   - Configurer TypeScript

**Commande de démarrage:**

```bash
cd /srv/workspace/game-plug
mkdir -p apps/backend
cd apps/backend
npx @nestjs/cli new . --strict --package-manager npm
```

---

**Dernière mise à jour:** 2026-01-22
**Responsable:** Claude Code
**Statut:** Phase 1 - Backend Migration à démarrer
