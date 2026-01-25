# Game Plug - Plateforme RPG Call of Cthulhu 7e

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Tests](https://img.shields.io/badge/tests-100%25-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-85%25-green)
![License](https://img.shields.io/badge/license-MIT-blue)

Plateforme web complète pour jouer à **Call of Cthulhu 7ème édition** avec tableaux blancs collaboratifs, système de dés avancé, gestion de personnages et outils de maître de jeu temps réel.

## ⚠️ IMPORTANT: NPM Workspaces Monorepo

Ce projet utilise **NPM Workspaces**. L'installation des dépendances DOIT se faire depuis la **RACINE** du projet.

### 📚 Guides de Déploiement

| Guide | Usage | Audience |
|-------|-------|----------|
| **[QUICK_START.md](./QUICK_START.md)** | 5 commandes essentielles | Déploiement rapide |
| **[AI_AGENT_README.md](./AI_AGENT_README.md)** | Instructions pour agents automatiques | IA/Bots |
| **[README-DEPLOY-PROD.md](./README-DEPLOY-PROD.md)** | Guide complet de déploiement | Production |
| **[BUILD_INSTRUCTIONS_FOR_AI.md](./BUILD_INSTRUCTIONS_FOR_AI.md)** | Instructions détaillées | Agents IA |
| **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** | Résolution de problèmes | Debug |

### ⚡ Installation Rapide

```bash
# À la RACINE du projet (PAS dans apps/frontend ou apps/backend)
npm install

# Build
cd apps/backend && npm run build && cd ../..
cd apps/frontend && npm run build && cd ../..
```

**⚠️ NE PAS faire:** `cd apps/frontend && npm install` → Erreur garantie

## Table des Matières

- [Fonctionnalités](#fonctionnalités)
- [Stack Technique](#stack-technique)
- [Démarrage Rapide](#démarrage-rapide)
- [Installation](#installation)
- [Documentation](#documentation)
- [Contribution](#contribution)
- [Licence](#licence)

---

## Fonctionnalités

### Gestion de Personnages
- ✅ Création selon règles CoC 7ème édition
- ✅ Génération automatique des caractéristiques (FOR, CON, TAI, DEX, APP, INT, POU, EDU)
- ✅ Calcul automatique des compétences
- ✅ Inventaire complet avec gestion monétaire
- ✅ Feuille de personnage interactive

### Sessions de Jeu Multiplayers
- ✅ Création de sessions avec codes d'accès
- ✅ Synchronisation WebSocket temps réel entre MJ et joueurs
- ✅ Dashboard MJ avec gestion des personnages et des tours
- ✅ Actions joueurs visibles instantanément

### Système de Dés Avancé
- ✅ Jets d100 avec résolution automatique (succès/échec/critique)
- ✅ Système de succès durs (succès <= INT/2)
- ✅ Système de succès critiques (01-05)
- ✅ Historique des jets avec animations

### Gestion de Sanité Mentale
- ✅ Suivi des points de sanité (0-99)
- ✅ Gestion des phobies et manies acquises
- ✅ Conditions psychologiques (folie temporaire/prolongée)
- ✅ Récupération progressive de la sanité

### Ambiance et Immersion
- ✅ Tableau blanc collaboratif (GameBoard)
- ✅ Système de projection visuelle pour images ambiance
- ✅ Génération IA d'avatars 1920 via DALL-E 3
- ✅ Gestionnaire d'ambiance sonore et visuelle

### Outils Narratifs
- ✅ Générateur de contenu IA (descriptions, énigmes)
- ✅ Gestionnaire de chapitres et actes
- ✅ Système d'effets temporaires (buff/debuff)
- ✅ Journal de session automatisé

---

## Stack Technique

### Backend
| Composant | Version | Rôle |
|-----------|---------|------|
| **NestJS** | 11.x | Framework serveur |
| **TypeScript** | 5.7+ | Langage strict |
| **PostgreSQL** | 16 | Base de données relationnelle |
| **Drizzle ORM** | 0.39.1 | ORM typé |
| **Express.js** | 4.21.2 | HTTP server |
| **WebSockets** | 8.18.0 | Communication temps réel |
| **Redis** | 7 | Cache et sessions |
| **OpenAI API** | 5.15.0 | Génération IA |
| **Passport.js** | 0.7.0 | Authentification |

### Frontend
| Composant | Version | Rôle |
|-----------|---------|------|
| **React** | 18.3.1 | Framework UI |
| **TypeScript** | 5.6.3 | Langage strict |
| **Vite** | 5.4.19 | Build tool |
| **Tailwind CSS** | 3.4.17 | Framework CSS |
| **Radix UI** | Dernière | Composants headless |
| **React Hook Form** | 7.55.0 | Gestion formulaires |
| **Zod** | 3.24.2 | Validation schémas |
| **TanStack Query** | 5.60.5 | Gestion état serveur |
| **Framer Motion** | 11.13.1 | Animations |
| **Wouter** | 3.3.5 | Routing client |

### DevOps & Infrastructure
| Composant | Rôle |
|-----------|------|
| **Docker** | Containerisation |
| **Docker Compose** | Orchestration multi-services |
| **GitHub Actions** | CI/CD |
| **ESLint** | Linting |
| **Prettier** | Formatage |

---

## Démarrage Rapide

### Prérequis
- Node.js 20+
- Docker et Docker Compose
- Git
- Un compte OpenAI (optionnel, pour IA features)

### 1. Cloner et Configuration

```bash
# Cloner le repository
git clone https://github.com/votre-org/game-plug.git
cd game-plug

# Installer les dépendances
npm install

# Copier l'environnement de développement
cp .env.example .env
```

### 2. Démarrage avec Docker Compose

```bash
# Démarrer tous les services (PostgreSQL, Redis, Backend, Frontend)
docker compose up -d

# Vérifier l'état des services
docker compose ps

# Afficher les logs
docker compose logs -f
```

L'application est accessible sur:
- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:5002
- **Swagger API** : http://localhost:5002/api/docs

### 3. Démarrage en Développement Local

```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend

# Terminal 3: Base de données (si non Docker)
# Assurez-vous que PostgreSQL et Redis tournent
```

### 4. Initialiser la Base de Données

```bash
# Pousser le schéma Drizzle
npm run db:push

# Générer les migrations (si nécessaire)
npm run db:generate
```

---

## Installation

### Installation Complète

```bash
# 1. Cloner le repository
git clone https://github.com/votre-org/game-plug.git
cd game-plug

# 2. Installer les dépendances npm
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# 4. Démarrer les services
docker compose up -d

# 5. Initialiser la base de données
npm run db:push

# 6. Vérifier que tout fonctionne
npm run check  # TypeScript check
npm test       # Exécuter les tests
```

### Configuration des Variables d'Environnement

Consultez [.env.example](.env.example) pour la liste complète des variables.

**Variables essentielles:**

```env
# Database
DATABASE_URL=postgresql://game_plug:password@postgres:5432/game_plug
POSTGRES_PASSWORD=change-me-in-production

# Redis
REDIS_PASSWORD=change-me-in-production
REDIS_URL=redis://:change-me@redis:6379

# JWT
JWT_SECRET=your-secret-key-min-32-characters
SESSION_SECRET=your-session-secret-min-32-characters

# API
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# OpenAI (optionnel)
OPENAI_API_KEY=sk-...

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5002
NEXT_PUBLIC_WS_URL=ws://localhost:5002
```

---

## Documentation

- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Guide de contribution au projet
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture système détaillée
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guide de déploiement production
- **[API Documentation](./apps/backend/README.md)** - Documentation API REST
- **[Swagger Interactive](http://localhost:5002/api/docs)** - Docs API interactive (local)

### Modules Backend

Le backend NestJS est organisé en modules fonctionnels:

| Module | Description | Endpoints |
|--------|-------------|-----------|
| **Auth** | Authentification JWT & Sessions | `/api/auth/*` |
| **Characters** | Gestion personnages CoC 7e | `/api/characters/*` |
| **Sessions** | Sessions de jeu et répertoires | `/api/sessions/*` |
| **Dice** | Système de dés et jets | `/api/dice/*` |
| **Sanity** | Gestion santé mentale | `/api/sanity/*` |
| **Inventory** | Gestion d'objets et argent | `/api/inventory/*` |
| **Chapters** | Gestion d'actes/chapitres | `/api/chapters/*` |
| **AI** | Génération d'avatars et contenu | `/api/ai/*` |
| **GameBoard** | Tableau blanc collaboratif | `/api/gameboard/*` |
| **WebSockets** | Communication temps réel | `/ws/*` |
| **Cache** | Cache Redis | Interne |
| **Database** | Gestion base de données | Interne |

---

## Usage

### Pour les Maîtres de Jeu

1. **Créer une Session**
   ```
   1. Aller sur "Nouvelles Sessions"
   2. Configurer le nom et les paramètres
   3. Générer un code d'accès pour les joueurs
   4. Les joueurs rejoignent avec le code
   ```

2. **Dashboard MJ**
   - Vue tous les personnages et statistiques
   - Jets de dés temps réel
   - Gestion des tours
   - Projection d'images (GameBoard)
   - Outils narratifs IA

3. **Outils Narratifs**
   - Générer descriptions IA
   - Créer énigmes et pièges
   - Projeter ambiance sur écran
   - Gérer effets temporaires

### Pour les Joueurs

1. **Créer un Personnage**
   ```
   1. Sélectionner "Créer un Investigateur"
   2. Remplir nom et concept
   3. Distribuer points de compétences
   4. Configurer compétences et équipement
   5. Valider et rejoindre session
   ```

2. **Participer à une Session**
   ```
   1. Entrer le code de session
   2. Sélectionner votre personnage
   3. Actions synchronisées en temps réel
   4. Voir changements MJ instantanément
   ```

3. **Lancer les Dés**
   - Cliquer sur une compétence
   - Les dés se lancent automatiquement
   - Succès/Échec/Critique calculés
   - Résultats visibles par tous

---

## Développement

### Scripts Disponibles

```bash
# Développement
npm run dev              # Démarrer tout en dev
npm run dev:backend      # Seulement backend
npm run dev:frontend     # Seulement frontend

# Build
npm run build            # Compiler pour production
npm run build:backend    # Seulement backend
npm run build:frontend   # Seulement frontend

# Tests & Qualité
npm run check            # Vérifier TypeScript (exit 0 requis)
npm test                 # Tests (100% must pass)
npm run lint             # Linting

# Base de données
npm run db:push          # Synchroniser schéma
npm run db:generate      # Générer migrations
npm run db:migrate       # Exécuter migrations

# Production
npm start                # Démarrer app compilée
npm run start:docker     # Démarrer Docker Compose
npm run stop:docker      # Arrêter services
```

### Structure du Projet

```
game-plug/
├── apps/
│   ├── backend/                    # NestJS API
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/          # Authentification
│   │   │   │   ├── characters/    # Personnages
│   │   │   │   ├── sessions/      # Sessions de jeu
│   │   │   │   ├── dice/          # Système de dés
│   │   │   │   ├── sanity/        # Sanité mentale
│   │   │   │   ├── inventory/     # Inventaire
│   │   │   │   ├── chapters/      # Chapitres/Actes
│   │   │   │   ├── ai/            # IA (avatars, contenu)
│   │   │   │   ├── gameboard/     # Tableau blanc
│   │   │   │   ├── websockets/    # WebSockets temps réel
│   │   │   │   ├── cache/         # Redis cache
│   │   │   │   ├── database/      # Drizzle ORM
│   │   │   │   ├── health/        # Health checks
│   │   │   │   └── narrative/     # Outils narratifs
│   │   │   ├── config/            # Configuration globale
│   │   │   ├── filters/           # Exception filters
│   │   │   ├── interceptors/      # Interceptors
│   │   │   ├── guards/            # Guards d'authentification
│   │   │   └── main.ts            # Point d'entrée
│   │   ├── test/                  # Tests unitaires
│   │   └── Dockerfile
│   │
│   └── frontend/                   # Next.js Frontend
│       ├── app/                    # App Router
│       │   ├── (dashboard)/        # Routes protégées
│       │   ├── (auth)/             # Routes auth
│       │   ├── layout.tsx          # Layout root
│       │   └── page.tsx            # Home page
│       ├── components/             # Composants React
│       ├── hooks/                  # Custom hooks
│       ├── lib/                    # Utilitaires
│       ├── public/                 # Assets statiques
│       └── Dockerfile
│
├── shared/                          # Code partagé (types, schemas)
├── docker-compose.yml              # Configuration Docker Compose
├── .env.example                    # Exemple variables d'environnement
├── ARCHITECTURE.md                 # Architecture détaillée
├── CONTRIBUTING.md                 # Guide contribution
├── DEPLOYMENT.md                   # Guide déploiement
└── README.md                       # Ce fichier
```

### Conventions de Code

**TypeScript**
- Mode strict activé (`strict: true`)
- Pas de `any` - utiliser `unknown` avec type guards
- Pas de `@ts-ignore` ou `@ts-expect-error`
- Interfaces pour les contrats publics

**NestJS Backend**
- Architecture modulaire (module = feature)
- Chaque module: controller → service → repository
- DTOs pour validation entrées (class-validator)
- Décorateurs pour authorization

**React Frontend**
- Composants fonctionnels avec hooks
- Props strongly typed
- Custom hooks pour logique réutilisable
- Separation concerns: UI vs logique

**Commits**
- Format: `type: description`
- Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`
- Exemple: `feat: add character sanity tracking`

---

## Sécurité

### Authentification
- JWT avec refresh tokens
- Bcrypt pour hachage mots de passe
- Sessions sécurisées en Redis
- CSRF protection

### Validation & Sanitization
- Schémas Zod (frontend)
- class-validator (backend DTOs)
- Input sanitization OpenAI
- SQL injection prevention (ORM)

### Environnement
- Variables sensibles dans `.env` (jamais versionné)
- Secrets stockés en production (secrets manager)
- CORS restrictif en production
- Pas d'exposition données sensibles

### Infrastructure
- HTTPS en production (Let's Encrypt)
- Rate limiting sur endpoints publics
- Health checks pour résilience
- Logging sécurisé (pas de tokens)

---

## Tests

### Exécuter les Tests

```bash
# Tous les tests
npm test

# Mode watch
npm test -- --watch

# Coverage
npm test -- --coverage

# Spécifique
npm test -- characters.service
```

### Écrire des Tests

Backend: `/apps/backend/test/**/*.spec.ts`
Frontend: `/apps/frontend/**/*.test.tsx`

Obligation:
- Coverage > 80%
- Tests unitaires pour logique métier
- Tests d'intégration pour API
- 100% pass requis avant merge

---

## Performance & Monitoring

### Optimisations
- Cache Redis pour données chaudes
- Connection pooling PostgreSQL
- Compression gzip
- Code splitting frontend
- Image optimization

### Monitoring
- Health checks Docker (`/api/health`)
- Logs structurés (JSON)
- Metrics de performance
- Error tracking (optional: Sentry)

---

## Contribution

Voir [CONTRIBUTING.md](./CONTRIBUTING.md) pour:
- Processus de contribution
- Standards de code
- Workflow Git
- Guide de commit

---

## Troubleshooting

### Service ne démarre pas

```bash
# Vérifier logs
docker compose logs backend
docker compose logs frontend

# Redémarrer
docker compose restart

# Vérifier santé
curl http://localhost:5002/api/health
curl http://localhost:5173
```

### Erreur base de données

```bash
# Vérifier PostgreSQL
docker compose logs postgres

# Réinitialiser données (⚠️ perte données)
docker volume rm game-plug-postgres-data
docker compose up -d postgres
npm run db:push
```

### Port occupé

```bash
# Changer ports dans .env
BACKEND_PORT=5002
FRONTEND_PORT=5173

# Ou tuer processus existant
lsof -i :5002
kill -9 <PID>
```

---

## Roadmap

- [ ] Support multi-langue (EN/FR)
- [ ] Mobile app (React Native)
- [ ] Export PDF feuilles personnage
- [ ] Intégration Discord
- [ ] Webhook notifications
- [ ] Système de campagnes persistantes
- [ ] Marketplace scénarios/modules

---

## Ressources

### Officielles
- [Call of Cthulhu 7e - Chaosium](https://www.chaosium.com/call-of-cthulhu-rpg/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Drizzle ORM](https://orm.drizzle.team/)
- [PostgreSQL](https://www.postgresql.org/docs/)

### Communauté
- GitHub Issues - Bugs et features
- Discussions - Questions et suggestions
- Discord (futur) - Chat communauté

---

## Licence

**© 2025 - Tous droits réservés**

Ce projet est disponible sous licence MIT. Voir [LICENSE](./LICENSE) pour détails complets.

### Conditions d'Utilisation

**✅ Autorisé:**
- Usage personnel et éducatif
- Modification du code source
- Distribution du code modifié
- Usage dans projets open source

**❌ Interdit:**
- Usage commercial sans autorisation
- Redistribution de versions dérivées commerciales
- Utilisation du nom "Game Plug" pour projets dérivés

### Attribution

Toute utilisation doit inclure:
```
Basé sur Game Plug - Plateforme RPG Call of Cthulhu 7e
https://github.com/votre-org/game-plug
```

---

## Support

- **Issues** : [GitHub Issues](https://github.com/votre-org/game-plug/issues)
- **Discussions** : [GitHub Discussions](https://github.com/votre-org/game-plug/discussions)
- **Email** : support@gameplug.dev

---

**Développé avec ❤️ pour la communauté Call of Cthulhu**

Dernière mise à jour: 23 Janvier 2025
