# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Rôle Plug** is a modern web-based digital platform for playing Call of Cthulhu 7th Edition RPG sessions. It provides real-time tools for Game Masters (GMs) to manage sessions and for players to create and interact with their investigator characters. The platform features AI-generated avatars and scenes, WebSocket-based synchronization, and a lovecraftian-themed UI.

**Tech Stack:**
- Frontend: React 18 + TypeScript + Vite + Wouter (routing)
- Backend: Express.js + TypeScript + WebSocket Server
- Database: PostgreSQL with Drizzle ORM
- UI: Radix UI + shadcn/ui + Tailwind CSS
- AI: OpenAI (DALL-E 3 for avatars/scenes, GPT for narrative)

## Claude Code Agents

@.claude-agents.md

**Agent métier principal :** `game-master` (Sonnet) - Expert RPG digital Call of Cthulhu 7e

**Utiliser pour :** Logique game master AI, mécaniques CoC 7e (skill checks, combat, SAN system), génération avatars DALL-E, WebSocket real-time, dice mechanics, gestion scénarios, AI narratif (GPT-4/5, Claude).

Voir `.claude-agents.md` pour liste complète agents techniques et exemples d'utilisation.

## Development Commands

### Essential Commands
```bash
# Development (runs both frontend and backend with hot reload)
npm run dev

# Type checking
npm run check

# Build for production
npm run build

# Start production server
npm start

# Database operations
npm run db:push    # Push schema changes to database
```

### Development Server
The dev server runs on `http://localhost:5000` (or `PORT` env variable). It serves both API routes (`/api/*`) and the Vite dev frontend with HMR.

## Architecture Overview

### Monorepo Structure
```
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route pages (lazy loaded)
│   │   ├── hooks/       # Custom hooks (useAuth, useWebSocket, use-toast)
│   │   └── lib/         # Utilities (dice rolls, CoC data, queryClient)
├── server/              # Express backend
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # REST API endpoints
│   ├── websocket.ts     # WebSocket server for real-time sync
│   ├── storage.ts       # Database abstraction layer
│   ├── game-logic.ts    # Call of Cthulhu rules engine
│   ├── buff-logic.ts    # Character effects and buffs
│   ├── openai.ts        # AI generation (avatars, scenes, narrative)
│   └── replitAuth.ts    # Authentication (Replit + local)
├── shared/              # Shared TypeScript types
│   └── schema.ts        # Drizzle schema + Zod validation schemas
└── public/
    └── avatars/         # Generated character avatars (git-ignored)
```

### Key Architecture Patterns

#### Database Layer (Drizzle ORM)
- **Schema**: [shared/schema.ts](shared/schema.ts) defines all tables and types
- **Storage Interface**: [server/storage.ts](server/storage.ts) provides abstraction over database operations
- Tables: `users`, `gameSessions`, `characters`, `chapters`, `chapterEvents`, `sanityConditions`, `activeEffects`, `rollHistory`, `inventory`, `narrativeEntries`
- Uses Drizzle relations for complex queries
- Zod schemas generated from Drizzle schema via `createInsertSchema()`

#### Real-Time WebSocket Architecture
The WebSocket server ([server/websocket.ts](server/websocket.ts)) handles:
- Session-based broadcasting (messages only go to clients in same session)
- Message types: `roll`, `effect`, `projection`, `narration`, `ambiance`, `characterUpdate`, `sanityUpdate`, etc.
- Connection tracking: Each WebSocket is tagged with `userId` and `sessionId`
- Automatic reconnection on client side with exponential backoff

Client-side WebSocket hook: [client/src/hooks/useWebSocket.ts](client/src/hooks/useWebSocket.ts)
- Message history with circular buffer (max 100 messages)
- Auto-reconnect with retry logic
- Toast notifications for connection status

#### Authentication System
Supports two auth modes ([server/replitAuth.ts](server/replitAuth.ts)):
1. **Replit Auth**: OAuth-based for Replit deployment
2. **Local Auth**: Username/password for GMs (stored in `users` table with bcrypt)

Auth flow:
- GMs must authenticate to create/manage sessions
- Players can join sessions without authentication (using session codes)
- Session-based authentication with `express-session`

#### Game Logic System
**Call of Cthulhu 7e Rules Engine** ([server/game-logic.ts](server/game-logic.ts)):
- Automatic status effects based on HP/Sanity thresholds
- Sanity loss calculations with temporary/indefinite insanity
- Death/unconsciousness checks
- Phobia/mania triggers

**Buff System** ([server/buff-logic.ts](server/buff-logic.ts)):
- Healing, sanity recovery, magic recovery
- Luck boosts, skill bonuses
- Temporary and permanent effects tracked in `activeEffects` table

#### AI Integration
**OpenAI Services** ([server/openai.ts](server/openai.ts)):
- `generateCharacterAvatar()`: DALL-E 3 portraits (1920s style, 512x512)
- `generateSceneImage()`: DALL-E 3 scenes for GameBoard (1792x1024, HD)
- `generateNarrativeSuggestion()`: GPT narrative assistance
- `generatePhobiaDescription()`, `generateManiaDescription()`: Sanity condition descriptions

Avatar storage:
- Generated avatars saved to `public/avatars/` (served statically)
- Filename format: `{characterId}.png`
- Auto-migration system for existing characters without avatars

#### Frontend Routing
**Wouter** router ([client/src/App.tsx](client/src/App.tsx)) with lazy-loaded pages:
- Public routes: `/join`, `/join/:code`, `/gm-signup`, `/gm-login`, `/character/:id`, `/gm/:sessionId/gameboard`
- Authenticated routes: `/` (home), `/gm/:sessionId`, `/sessions`, `/character-creation/:sessionId`
- All pages are code-split for optimal bundle size

#### State Management
- **TanStack Query** for server state (API calls with caching)
- **WebSocket messages** for real-time updates
- Local React state for UI-only state
- No global state manager (Redux/Zustand) - kept intentionally simple

### Performance Optimizations

#### Vite Build Configuration
The [vite.config.ts](vite.config.ts) includes aggressive optimizations:

**Manual Chunking Strategy:**
- `vendor-react`: React core (react, react-dom, react-hook-form)
- `vendor-query`: TanStack Query
- `vendor-radix`: Primary Radix UI components
- `vendor-radix-extra`: Secondary Radix UI components
- `vendor-ui`: UI libraries (framer-motion, lucide-react, cmdk, vaul)
- `vendor-utils`: Utilities (wouter, clsx, tailwind-merge, date-fns, zod)

**Result**: Initial bundle is ~5.27 kB gzipped (see [BUILD_ANALYSIS.md](BUILD_ANALYSIS.md))

**Terser Minification:**
- `drop_console: true` - removes all console.log in production
- `drop_debugger: true` - removes debugger statements

**Lazy Loading:**
- All pages are lazy-loaded with React.lazy()
- Loading fallback with spinner

### Call of Cthulhu Specific Logic

#### Character Creation Flow
1. Roll or assign characteristics (STR, CON, SIZ, DEX, APP, INT, POW, EDU, LUCK)
2. Calculate derived stats:
   - HP = (CON + SIZ) / 10
   - Sanity = POW
   - Magic Points = POW / 5
3. Select occupation (determines skill points)
4. Distribute skill points across skills
5. Generate AI avatar from physical description

#### Skill System
Skills stored as JSONB in `characters.skills`:
```typescript
{
  "Spot Hidden": 45,
  "Library Use": 60,
  "Persuade": 55,
  // ... etc
}
```

Skill points:
- Occupation points based on EDU/INT
- Personal interest points
- `availableSkillPoints` tracks unspent points
- `skillsLocked` prevents changes after character finalization

#### Sanity Mechanics
Tracked in `sanityConditions` table:
- Phobias (fear of specific things)
- Manias (compulsive behaviors)
- Temporary vs. indefinite insanity
- Auto-applied debuffs when sanity drops below thresholds

#### GameBoard Projection System
GMs can project images to a shared screen:
- Generate AI scenes from text prompts
- Upload custom images
- Show/hide to players
- Full-screen immersive view at `/gm/:sessionId/gameboard`

### TypeScript Configuration

Path aliases defined in [tsconfig.json](tsconfig.json):
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets/*` → `attached_assets/*`

Import examples:
```typescript
import { Button } from "@/components/ui/button";
import { characters, type Character } from "@shared/schema";
```

### Environment Variables

Required in `.env`:
```env
DATABASE_URL="postgresql://..."
OPENAI_API_KEY="sk-..."
SESSION_SECRET="your-secret-key"
PORT=5000
NODE_ENV=development
```

Note: `.env` is git-ignored. Avatar files in `public/avatars/` are also ignored (regenerated as needed).

### Database Schema Notes

**Key relationships:**
- `gameSessions` → `characters` (one-to-many)
- `users` → `gameSessions` (GM relationship)
- `characters` → `sanityConditions`, `activeEffects`, `rollHistory`, `inventory` (one-to-many)
- `chapters` → `chapterEvents` (one-to-many, for session narrative structure)

**Special fields:**
- `gameSessions.code`: 6-character unique code for players to join
- `characters.avatarUrl`: Path to generated avatar (`/avatars/{id}.png`)
- `characters.skills`: JSONB object with skill names as keys
- `activeEffects.expiresAt`: Nullable timestamp for temporary effects

### Common Development Patterns

#### Making API Calls
Use TanStack Query for all API calls:
```typescript
const { data: character } = useQuery({
  queryKey: ['/api/characters', characterId],
  queryFn: async () => {
    const response = await fetch(`/api/characters/${characterId}`);
    return response.json();
  }
});
```

#### Broadcasting WebSocket Messages
Server-side:
```typescript
import { broadcastToSession } from './websocket';

broadcastToSession(sessionId, {
  type: 'characterUpdate',
  data: { characterId, health: newHealth }
});
```

#### Adding New Game Mechanics
1. Update [shared/schema.ts](shared/schema.ts) if DB changes needed
2. Add logic to [server/game-logic.ts](server/game-logic.ts) or [server/buff-logic.ts](server/buff-logic.ts)
3. Add API endpoint in [server/routes.ts](server/routes.ts)
4. Broadcast changes via WebSocket for real-time sync
5. Update UI components in [client/src/components/](client/src/components/)

#### Creating New UI Components
Follow shadcn/ui patterns:
- Primitive components in [client/src/components/ui/](client/src/components/ui/)
- Composed components in [client/src/components/](client/src/components/)
- Use Tailwind classes with `cn()` utility for conditional styling
- Extract reusable logic to custom hooks in [client/src/hooks/](client/src/hooks/)

### Testing and Debugging

**Development Logging:**
- API calls logged automatically via middleware in [server/index.ts](server/index.ts)
- WebSocket messages logged in development mode
- Frontend logs via `console.log` (stripped in production build)

**TypeScript Checking:**
```bash
npm run check  # Runs tsc without emitting files
```

**Database Inspection:**
Access Drizzle Studio (if configured) or connect directly to PostgreSQL:
```bash
# Using psql
psql $DATABASE_URL

# Common queries
SELECT * FROM game_sessions;
SELECT * FROM characters WHERE session_id = '...';
```

### Known Quirks

1. **Avatar Generation**: First avatar generation may be slow (DALL-E 3 takes 10-20s). Subsequent loads are instant (cached in `public/avatars/`).

2. **WebSocket Reconnection**: On server restart, clients auto-reconnect but need to re-join their session (send `join` message again).

3. **Session Codes**: 6-character codes exclude ambiguous characters (0, O, 1, I, L) to avoid confusion.

4. **Replit Deployment**: The app is designed for Replit but works anywhere. Replit-specific plugins are conditionally loaded in [vite.config.ts](vite.config.ts).

5. **Build Output**: Production build outputs to `dist/public` (frontend) and `dist/index.js` (backend). The backend serves the frontend statically.

### Performance Considerations

- **Initial Load**: ~5.27 kB gzipped for entry point + lazy-loaded page chunks
- **WebSocket**: Keep connections alive with ping/pong (handled automatically)
- **Database**: Use Drizzle's query builder to avoid N+1 queries
- **Images**: DALL-E images cached locally; consider CDN for production
- **Bundle Size**: Vendor chunks cached aggressively; only app code changes frequently

### Additional Documentation

For more details, see:
- [README.md](README.md) - User-facing documentation
- [OPTIMIZATIONS.md](OPTIMIZATIONS.md) - Detailed performance optimizations
- [BUILD_ANALYSIS.md](BUILD_ANALYSIS.md) - Bundle size analysis
