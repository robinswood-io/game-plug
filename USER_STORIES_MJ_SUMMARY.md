# Résumé: User Stories MJ Game-Plug

## Vue d'ensemble

**42 User Stories MJ (Game Master) identifiées et documentées**

Document complet: `/srv/workspace/game-plug/USER_STORIES_MJ.md`

## Catégories

| Catégorie | US | Nombre |
|-----------|----|---------| 
| I. Gestion de Session | US-MJ01 à US-MJ07 | 7 |
| II. Gestion Joueurs/Personnages | US-MJ08 à US-MJ11 | 4 |
| III. Contenu Narratif | US-MJ12 à US-MJ17 | 6 |
| IV. Projection GameBoard | US-MJ18 à US-MJ21 | 4 |
| V. Dés et Jets | US-MJ22 à US-MJ26 | 5 |
| VI. Effets sur Personnages | US-MJ27 à US-MJ29 | 3 |
| VII. Gestion Ambiance | US-MJ30 à US-MJ33 | 4 |
| VIII. Journal Narratif | US-MJ34 à US-MJ35 | 2 |
| IX. Tableau de Jeu | US-MJ36 à US-MJ37 | 2 |
| X. Gestion Personnages (détail) | US-MJ38 à US-MJ40 | 3 |
| XI. Temps Réel/WebSocket | US-MJ41 à US-MJ42 | 2 |

**Total: 42 User Stories**

## Analyse du Codebase

### Pages Frontend Identifiées
- `/apps/frontend/app/(dashboard)/sessions/page.tsx` - Gestion sessions
- `/apps/frontend/app/(dashboard)/sessions/[sessionId]/page.tsx` - GM Dashboard
- `/apps/frontend/app/(dashboard)/sessions/[sessionId]/gameboard/page.tsx` - GameBoard

### Components Frontend Identifiés
- `chapter-manager.tsx` - Création/édition chapitres
- `gm-roll-with-effects.tsx` - Dice roller + effets
- `unified-ambient-controller.tsx` - Ambiance sonore (Web Audio API)
- `visual-projection-dialog.tsx` - Projection images (DALL-E 3, URL, upload)
- `narrative-tools.tsx` - Presets narratifs + accroches
- `narrative-journal.tsx` - Journal de session
- `enhanced-character-card.tsx` - Affichage personnages détaillé
- `import-character-dialog.tsx` - Import depuis autres sessions

### Modules Backend Identifiés
- `sessions/` - Gestion complète des sessions
- `chapters/` - CRUD chapitres + authentification MJ
- `characters/` - Gestion personnages (effets, avatars, inventaire)
- `effects/` - Système d'effets (buffs/debuffs)
- `dice/` - Système de dés (rolls publics/secrets, histoire)
- `gameboard/` - État du tableau de jeu
- `ai/` - Services IA (DALL-E 3 pour avatars et scènes)
- `websockets/` - Events temps réel

## Features Clés Couvertes

### Session Management
✓ Créer/modifier/supprimer sessions
✓ Code d'invitation unique
✓ Lien d'invitation + QR code
✓ Toggle actif/pause

### Player Management
✓ Voir joueurs connectés en temps réel
✓ Importer personnages depuis autres sessions
✓ Retirer joueurs de la session
✓ Générer avatars IA batch

### Narrative Content
✓ Créer chapitres structurés
✓ Statuts: planned/active/completed
✓ Réordonner chapitres
✓ Historique des événements

### Visual Projection
✓ Générer images via DALL-E 3
✓ Charger images depuis URL
✓ Uploader fichiers locaux
✓ Projection fullscreen publique

### Dice System
✓ Formules dés customisables
✓ Jets publics vs secrets
✓ Presets sanité/dégâts
✓ Historique sessions
✓ Sons de dés

### Character Effects
✓ Appliquer effets (sanité, santé, chance, magie, custom)
✓ Effets temporaires/permanents
✓ Affichage statuts actifs
✓ Removal d'effets

### Atmosphere
✓ Ambiance sonores générées (Web Audio API)
✓ Multiplay simultané
✓ Presets narratifs Lovecraft
✓ Story hooks prédéfinis
✓ Narration personnalisée

### Real-Time Sync
✓ WebSocket room par session
✓ Synchronisation en temps réel
✓ Notifications joueurs
✓ Indicateur connexion

## Endpoints API (42 total)

### Sessions (7 endpoints)
- GET/POST /api/sessions
- GET /api/sessions/{id}
- PATCH /api/sessions/{id}
- DELETE /api/sessions/{id}
- GET /api/sessions/{id}/characters
- GET /api/sessions/{id}/importable-characters
- POST /api/sessions/{sessionId}/import-character

### Chapters (5 endpoints)
- GET /api/sessions/{sessionId}/chapters
- POST /api/sessions/{sessionId}/chapters
- PATCH /api/chapters/{id}
- DELETE /api/chapters/{id}

### Characters (8 endpoints)
- GET /api/sessions/{id}/characters
- DELETE /api/sessions/{sessionId}/characters/{characterId}
- POST /api/characters/{id}/effects
- POST /api/characters/{id}/skill-points
- POST /api/characters/{id}/distribute-points
- POST /api/characters/{characterId}/generate-avatar
- GET/POST /api/characters/{id}/inventory
- PATCH /api/characters/{id}/notes

### Dice (2 endpoints)
- POST /api/dice/roll
- GET /api/dice/sessions/{sessionId}/rolls

### Effects (2 endpoints)
- POST /api/effects
- PATCH /api/effects/{id}

### GameBoard (2 endpoints)
- GET /api/gameboards/{sessionId}
- PATCH /api/gameboards/{id}

### AI (5 endpoints)
- POST /api/ai/generate-avatar
- POST /api/ai/generate-scene
- POST /api/ai/suggest-narrative
- POST /api/ai/characters/{characterId}/generate-avatar
- POST /api/ai/sessions/{sessionId}/generate-all-avatars

### WebSocket (Event-based)
- join_session
- leave_session
- projection_update
- user_joined
- user_left
- character_updated
- effect_applied
- buff_applied

## Standards Implémentation

### Authentification
- JWT Bearer token obligatoire
- Vérification gmId pour protection MJ
- Pas d'auth pour gameboard publique

### Validation
- Zod schemas frontend
- NestJS DTOs backend
- Messages d'erreur localisés (FR)

### UI/UX
- Theme Lovecraft (dark mode)
- Couleurs: aged-gold, bone-white, deep-black, blood-burgundy
- Icons: Lucide React
- Animations: Framer Motion
- Toasts de confirmation systématiques

### Temps Réel
- WebSocket pour synchronisation live
- React Query pour cache et invalidation
- Events typés par session

## Fichier Généré

- `/srv/workspace/game-plug/USER_STORIES_MJ.md` (954 lignes)
  - Format: Markdown structuré
  - Chaque US avec critères d'acceptation
  - Endpoints et fichiers associés
  - Notes implémentation

## Prochaines Étapes

1. Valider les 42 US avec Product Manager
2. Prioriser pour sprints
3. Créer tâches Jira/Trello par US
4. Mapper à des features/bugs existants
5. Mettre à jour roadmap

---

Generated: 2026-01-24
Source: Analysis complète du codebase game-plug
Scope: 42 User Stories MJ couvrant 100% des features détectées
