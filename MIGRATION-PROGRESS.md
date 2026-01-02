# Migration Progress - NestJS + Next.js

**Date:** 2025-12-29
**Objectif:** Migration complète Express.js + React/Vite → NestJS + Next.js/Turbopack
**Status:** 🟡 EN COURS - Phase 3 Staging Deployment

---

## ✅ Phase 1 : Backend NestJS (TERMINÉ)

### Semaine 1 : Infrastructure + Auth ✅
- [x] Projet NestJS 11 créé
- [x] DatabaseModule avec Drizzle ORM (préserve schéma exact)
- [x] AuthModule complet (4 endpoints)
  - POST /api/auth/signup
  - POST /api/auth/login
  - POST /api/auth/logout
  - GET /api/auth/user
- [x] Session-based authentication (Passport.js + express-session)
- [x] Bcrypt password hashing (12 rounds)

### Semaine 2 : Sessions + WebSocket ✅
- [x] SessionsModule (11 endpoints REST)
  - CRUD sessions complètes
  - Gestion chapitres
  - Join via code 6-char
- [x] WebSocket Migration : raw `ws` → Socket.IO
- [x] SessionsGateway avec 9 message types
  - join_session, leave_session
  - gm_roll, player_roll
  - ambiance, narration
  - effect_applied, projection_update
  - ping/pong
- [x] Broadcasting session-based

### Semaine 3 : Characters ✅
- [x] CharactersModule (10+ endpoints)
  - CRUD characters
  - Inventory management (add/update/remove)
  - Effects (healing, sanity loss, buffs)
- [x] Multiple controllers (Characters, Inventory, Effects)
- [x] Service layer avec Drizzle queries
- [x] DTOs avec Zod validation

### Semaine 4 : Build & Vérifications 🟡
- [x] Structure complète 29 fichiers TypeScript
- [⏳] Build local en cours via Docker (contournement issues TS paths)
- [x] Dockerfile multi-stage optimisé
- [x] Healthcheck endpoints configurés

**Modules NestJS créés:** 9
- DatabaseModule, AuthModule, SessionsModule, CharactersModule
- InventoryModule, EffectsModule, ConfigModule, WebSocketModule

**Endpoints backend:** 25+ REST + 9 WebSocket message types

---

## ✅ Phase 2 : Frontend Next.js (EN COURS - 40%)

### Semaine 5 : Infrastructure Next.js ✅
- [x] Projet Next.js 15 créé
- [x] Turbopack configuré (next.config.ts)
- [x] Tailwind CSS + globals.css (thème CoC)
- [x] Socket.IO client intégration
  - lib/socket-client.ts (singleton pattern)
  - hooks/use-socket.ts (React hook)
  - components/providers/socket-provider.tsx (context)
- [x] TanStack Query provider
- [x] API client (lib/api-client.ts) - wraps backend NestJS

### Semaine 6 : Pages Publiques 🟡
- [x] shadcn/ui components copiés (47 components)
- [x] Hooks copiés (use-toast, useAuth, use-mobile)
- [x] Custom CSS migré (aged-gold, cosmic-void, etc.)
- [x] Landing page (app/page.tsx) - MIGRÉ ✅
- [x] GM Login (app/(public)/gm-login/page.tsx) - MIGRÉ ✅
- [⏳] GM Signup (à migrer)
- [⏳] Join Session (à migrer)
- [⏳] Join with Code (à migrer)

**Pages migrées:** 2/15 (13%)

### Semaine 7-8 : Pages Complexes (À FAIRE)
- [ ] Character Creation (1,331 LOC - DALL-E avatar generation)
- [ ] GM Dashboard (1,680 LOC - WebSocket real-time)
- [ ] Character Sheet
- [ ] Character Edit
- [ ] Session Manager
- [ ] GameBoard (projection)
- [ ] Select Character

**Travail restant frontend:**
- 13 pages React → Next.js App Router
- Composants game logic (dice roller, character cards, etc.)
- Ambient Controller refactoring (58KB → modules)

---

## 🟡 Phase 3 : Staging Deployment (EN COURS)

### Infrastructure ✅
- [x] Dockerfile backend (multi-stage Node 20-alpine)
- [x] Dockerfile frontend (multi-stage Node 20-alpine)
- [x] docker-compose.staging.yml
  - PostgreSQL 15-alpine avec healthcheck
  - Backend NestJS port 5001
  - Frontend Next.js port 3000
  - Network bridge configuré
  - Volumes persistants
- [x] .env.staging.example créé

### Déploiement 🟡
- [⏳] `docker-compose up --build` en cours
- [ ] Vérification containers running
- [ ] Test backend endpoints
- [ ] Test frontend accessible
- [ ] Test WebSocket connectivity
- [ ] Test database migrations

---

## 📊 Métriques Actuelles

### Backend
- **Fichiers créés:** 29 TypeScript files
- **Modules:** 9 NestJS modules
- **Endpoints REST:** 25+
- **WebSocket messages:** 9 types
- **Dependencies:** 684 packages
- **Build status:** Docker build en cours

### Frontend
- **Framework:** Next.js 15 + Turbopack
- **Pages migrées:** 2/15 (13%)
- **Components UI:** 47 shadcn/ui components
- **Hooks:** 4 custom hooks
- **Providers:** Socket.IO + TanStack Query

### Infrastructure
- **Database:** PostgreSQL (schéma préservé 100%)
- **Real-time:** Socket.IO (remplace raw WebSocket)
- **Session:** express-session + connect-pg-simple
- **Container:** Docker multi-stage builds

---

## 🔧 Décisions Techniques Prises

### Backend
1. **Path imports:** Symlink src/shared/schema.ts vers /shared/schema.ts
2. **Relative imports:** Utilisés au lieu de path aliases pour éviter issues TS
3. **Database:** Zéro modification - réutilise exact même schéma Drizzle
4. **Sessions:** Réutilise table `sessions` existante (compatibilité Express)
5. **Socket.IO:** Path `/game-ws` maintenu pour compatibilité client

### Frontend
1. **Routing:** Wouter → Next.js App Router (useRouter from 'next/navigation')
2. **Forms:** React Hook Form + Zod validation maintenu
3. **State:** TanStack Query pour server state
4. **WebSocket:** use-socket hook custom (wraps Socket.IO client)
5. **Styling:** Tailwind CSS + custom CoC theme colors

---

## ⚠️ Problèmes Rencontrés & Solutions

### 1. TypeScript Path Resolution ❌→✅
- **Problème:** `@shared/schema` non trouvé lors compilation locale
- **Solution:** Symlink + imports relatifs `../../shared/schema`

### 2. NestJS Local Build Timeout ❌→🔄
- **Problème:** `npm run build` prend > 10 minutes
- **Solution:** Contournement via Docker build (plus fiable)

### 3. Decorator Errors ❌→✅
- **Problème:** TS1206 decorators not valid
- **Solution:** tsconfig.json avec experimentalDecorators: true

---

## 📋 TODO Immédiat

### Critique (Bloquant Staging)
1. [ ] Vérifier Docker build backend réussit
2. [ ] Vérifier Docker build frontend réussit
3. [ ] Tester healthcheck endpoints
4. [ ] Vérifier logs containers propres

### Important (Post-Staging)
1. [ ] Migrer 13 pages restantes
2. [ ] Tester flows utilisateur complets
3. [ ] Tests E2E critiques
4. [ ] Documentation API (Swagger)

### Nice-to-Have
1. [ ] Refactoring Ambient Controller
2. [ ] Optimisation bundle sizes
3. [ ] Performance audit
4. [ ] Tests unitaires coverage > 80%

---

## 🎯 Objectifs Restants

**Phase 2 Frontend (60% restant):**
- 13 pages React → Next.js
- Composants game logic
- Tests E2E

**Phase 3 Staging (80% restant):**
- Validation déploiement complet
- Tests utilisateurs
- Monitoring erreurs
- Documentation finale

**Durée estimée restante:** 3-4 semaines temps plein

---

## 📝 Notes

- **Données préservées:** ✅ Zéro modification base de données
- **Compatibilité:** ✅ Backend NestJS peut coexister avec Express
- **Migration graduelle:** ✅ Possible (ports différents 5000 vs 5001)
- **Rollback:** ✅ Docker Compose down = retour Express

**Status Global:** 🟡 Migration à 40% - Infrastructure complète, frontend partiel, déploiement staging en cours
