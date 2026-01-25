# Developer Quick Start - User Stories Joueur

**Guide rapide pour développeurs sur la base des 45 user stories joueur exhaustives**

---

## Fichiers de Référence

```bash
# Documentation complète
cat /srv/workspace/game-plug/USER_STORIES_JOUEUR.md              # 45 stories détaillées
cat /srv/workspace/game-plug/USER_STORIES_SUMMARY.md             # Résumé exécutif
cat /srv/workspace/game-plug/USER_STORIES_INDEX.md               # Index par domaine
cat /srv/workspace/game-plug/FEATURE_ENDPOINT_MAPPING.md         # API → Components
cat /srv/workspace/game-plug/JOUEUR_STORIES_VISUAL_SUMMARY.txt   # Synthèse visuelle
```

---

## Statut Implémentation Rapide

**28 ✅ DONE | 8 ⚠️ PARTIAL | 9 ❌ PENDING**

### Features à Terminer (P1 - Important)

1. **Historique Session** (US-J34) - ChapterTimeline UI
2. **Notifications** (US-J33) - NotificationCenter finalization
3. **Invitations** (US-J28) - Frontend + Dialog
4. **Demandes MJ** (US-J37) - RollRequestDialog complet
5. **Folie temporaire/indéfinie** (US-J24-25) - UX complète
6. **Avancées XP** (US-J08-09) - Détails tracking

### Features à Créer (P2 - Comfort)

1. **Chat Texte** (US-J38) - ChatPanel + WebSocket
2. **Bulletin Board** (US-J39) - BulletinBoard CRUD
3. **Préférences** (US-J40-42) - Theme, Audio, Notifications
4. **Profil Joueur** (US-J05) - Profile management page
5. **Export PDF** (US-J35) - PDF generation
6. **Statistiques** (US-J44-45) - Analytics dashboard

---

## Commandes Utiles

### Démarrer le projet

```bash
cd /srv/workspace/game-plug

# Backend
npm run dev:backend
# Accès: http://localhost:5002
# Swagger: http://localhost:5002/api-docs

# Frontend
npm run dev:frontend
# Accès: http://localhost:5173

# Avec Docker
docker compose -f docker-compose.apps.yml up -d
```

### Tests

```bash
# TypeScript check
npx tsc --noEmit

# Tests unitaires backend
npm run test:backend

# Tests E2E Playwright (frontend)
npx playwright test
npx playwright test --grep "US-J01"  # Test story spécifique

# Tests par user story
npx playwright test --grep "création.*personnage"
```

### Base de données

```bash
# Migrations
npm run db:migrate

# Seed test data
npm run db:seed

# Voir la DB (PostgreSQL)
psql -h localhost -U game_plug -d game_plug

# Voir Redis
redis-cli
```

---

## Mapping Rapide: Story → Code

### US-J01: Créer Personnage
```
Frontend: /apps/frontend/app/(dashboard)/characters/new/page.tsx
Component: CharacterCreationForm
Backend API: POST /api/characters
Service: CharactersService.charactersControllerCreate
Database: characters table
```

### US-J15: Lancer 1d100
```
Frontend Component: DiceRoller (/components/dice-roller.tsx)
Backend API: POST /api/dice/roll
Service: DiceService.rollDice
Lib: /lib/dice.ts (rollCharacteristics, calculateDerivedStats)
Database: rollHistory table
```

### US-J22: Tracker Sanité
```
Frontend Component: SanityTracker (/components/sanity-tracker.tsx)
Backend API: GET /api/characters/{id}/sanity
Service: SanityService
Database: characters.sanity, sanityConditions table
```

---

## Fichiers Clés par Domaine

### Système de Dés
```
/apps/backend/src/modules/dice/               # Backend logic
  ├── dice.service.ts
  ├── dice.controller.ts
  └── dice.repository.ts

/apps/frontend/components/dice-roller.tsx     # UI lanceur
/apps/frontend/lib/dice.ts                    # Utils dés
```

### Personnages
```
/apps/backend/src/modules/characters/         # Backend logic
  ├── characters.service.ts
  ├── characters.controller.ts
  └── characters.repository.ts

/apps/frontend/app/(dashboard)/characters/    # Pages personnage
  ├── new/page.tsx       (création)
  ├── [id]/page.tsx      (lecture)
  └── [id]/edit/page.tsx (édition)
```

### Sanité
```
/apps/backend/src/modules/sanity/             # Backend logic
  ├── sanity.service.ts
  ├── sanity.controller.ts
  └── sanity.repository.ts

/apps/frontend/components/sanity-tracker.tsx  # UI tracker
```

### Sessions & WebSocket
```
/apps/backend/src/modules/sessions/           # Session logic
/apps/backend/src/modules/websockets/         # WebSocket handler

/apps/frontend/hooks/useWebSocket.ts          # WebSocket client
/apps/frontend/components/connection-indicator.tsx
```

---

## Structure Backend (NestJS)

### Ajouter un nouvel endpoint

```bash
# Exemple: POST /api/characters/{id}/export/pdf

# 1. Créer DTO
# /apps/backend/src/modules/characters/dto/export-character.dto.ts

# 2. Ajouter au service
# /apps/backend/src/modules/characters/characters.service.ts
export async exportPdf(id: string): Promise<Buffer> {
  const character = await this.findOne(id);
  // Logic here
  return pdfBuffer;
}

# 3. Ajouter au controller
# /apps/backend/src/modules/characters/characters.controller.ts
@Post(':id/export/pdf')
@ApiOperation({ summary: 'Export character to PDF' })
async exportPdf(@Param('id') id: string) {
  return await this.charactersService.exportPdf(id);
}

# 4. Tester
curl -X POST http://localhost:5002/api/characters/{id}/export/pdf
```

### Database Schema (Drizzle)

```typescript
// /shared/schema.ts - Ajouter nouvelle table/relation

export const myNewTable = pgTable('my_new_table', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  name: varchar('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const myNewTableRelations = relations(myNewTable, ({ one }) => ({
  // Relations ici
}));
```

---

## Structure Frontend (React/Next.js)

### Ajouter une nouvelle page

```bash
# Exemple: /profile/preferences

# 1. Créer page
# /apps/frontend/app/(dashboard)/profile/preferences/page.tsx

'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

export default function PreferencesPage() {
  const { data: preferences } = useQuery({
    queryKey: ['preferences'],
    queryFn: () => fetch('/api/users/preferences').then(r => r.json()),
  });

  return (
    <div>
      {/* Contenu */}
    </div>
  );
}

# 2. Créer component
# /apps/frontend/components/preferences-panel.tsx

export default function PreferencesPanel() {
  // Component logic
}

# 3. Importer dans page
import PreferencesPanel from '@/components/preferences-panel';
```

### Test E2E Playwright

```typescript
// playwright.config.ts
import { test, expect } from '@playwright/test';

test('US-J01: User can create character', async ({ page }) => {
  // Naviguer
  await page.goto('/characters/new');

  // Remplir formulaire
  await page.fill('input[name="name"]', 'John Doe');
  await page.selectOption('select[name="occupation"]', 'Accountant');

  // Soumettre
  await page.click('button[type="submit"]');

  // Vérifier résultat
  await expect(page).toHaveURL(/\/characters\/\w+/);
});

// Lancer tests
npx playwright test
npx playwright test --headed  # Voir navigateur
```

---

## API Testing (cURL)

### Créer personnage
```bash
curl -X POST http://localhost:5002/api/characters \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "occupation": "Accountant",
    "age": 32,
    "strength": 45,
    "constitution": 50,
    "size": 55,
    "dexterity": 40,
    "appearance": 60,
    "intelligence": 70,
    "power": 55,
    "education": 65,
    "luck": 35
  }'
```

### Lancer dés
```bash
curl -X POST http://localhost:5002/api/dice/roll \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-id",
    "characterId": "char-id",
    "diceFormula": "1d100",
    "rollType": "custom"
  }'
```

### Appliquer dégâts
```bash
curl -X POST http://localhost:5002/api/characters/{id}/apply-damage \
  -H "Content-Type: application/json" \
  -d '{
    "damage": 10,
    "armorValue": 2
  }'
```

---

## Documentation API (Swagger)

```bash
# Accéder à Swagger UI
http://localhost:5002/api-docs

# Endpoint pour JSON spec
http://localhost:5002/api-spec

# Exemple: voir tous endpoints characters
curl http://localhost:5002/api-spec | jq '.paths | keys[]'
```

---

## Debugging

### Backend (NestJS)

```bash
# Logs détaillés
npm run dev:backend -- --debug

# VS Code debugger (launch.json)
{
  "type": "node",
  "request": "launch",
  "program": "${workspaceFolder}/apps/backend/src/main.ts",
  "preLaunchTask": "npm: dev:backend"
}
```

### Frontend (React)

```bash
# React DevTools Chrome extension
# Redux DevTools (si utilisé)

# Logs console
console.log('Debug:', data);

# Network tab (F12)
# WebSocket messages (Network → WS)
```

### Database

```bash
# Voir query logs
// Dans /apps/backend/src/database/database.module.ts
logger: true,
```

---

## Git Workflow

```bash
# Feature branch par user story
git checkout -b feat/US-J15-dice-roller

# Commits en français
git commit -m "feat: implémenter lanceur 1d100"

# Pull request avec description
# - Lien vers US-J15
# - Description des changements
# - Tests ajoutés
# - Screenshots UI

# Merge en main quand:
# - Tests passent (100%)
# - Code review approuvée
# - Pas de breaking changes
```

---

## Checklist Implémentation Story

Pour chaque user story:

- [ ] **Backend**
  - [ ] API endpoint créé
  - [ ] Service business logic
  - [ ] Database queries
  - [ ] Error handling
  - [ ] Test unitaire (>80% coverage)

- [ ] **Frontend**
  - [ ] Page ou component créé
  - [ ] Form validation
  - [ ] API integration (TanStack Query)
  - [ ] Loading states
  - [ ] Error messages
  - [ ] Responsive design

- [ ] **Integration**
  - [ ] WebSocket si temps-réel
  - [ ] Notification utilisateur
  - [ ] Audit logs si critiques
  - [ ] Performance OK (<500ms)

- [ ] **Testing**
  - [ ] Test E2E Playwright
  - [ ] Test manuel complet
  - [ ] Cross-browser (Chrome, Firefox)
  - [ ] Mobile responsive

- [ ] **Documentation**
  - [ ] Swagger/OpenAPI updated
  - [ ] Code comments si complexe
  - [ ] User story marked DONE

---

## Performance Tips

- Use React Query caching wisely
- Lazy load components (React.lazy)
- Optimize images (next/image)
- PostgreSQL indexes sur colonnes fréquentes
- Redis pour sessions
- WebSocket compression

---

## Ressources

- **Call of Cthulhu 7e:** /opt/ia-webdev/rulebook-ai/
- **NestJS Docs:** https://docs.nestjs.com
- **React Docs:** https://react.dev
- **Drizzle ORM:** https://orm.drizzle.team
- **Playwright:** https://playwright.dev

---

**Créé:** 24 Janvier 2026
**Équipe:** Game Plug Dev Team
**Couverture:** 45 user stories joueur
