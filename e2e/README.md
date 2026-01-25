# Game-Plug E2E Tests

Suite complète de tests End-to-End pour Game-Plug (Call of Cthulhu 7e RPG platform).

## Quick Start

### 1. Prérequis

```bash
# Backend NestJS doit être en cours d'exécution
cd /srv/workspace/game-plug/apps/backend
npm run build
npm run start:dev  # Port 5001

# Frontend Next.js doit être en cours d'exécution
cd /srv/workspace/game-plug/apps/frontend
npm run dev -- -p 5002  # Port 5002
```

### 2. Exécuter Tests

```bash
cd /srv/workspace/game-plug

# Tous les tests
npx playwright test

# Mode interactif
npx playwright test --ui

# Tests spécifiques
npx playwright test e2e/08-inventory-management.spec.ts
npx playwright test e2e/09-effects-system.spec.ts
npx playwright test e2e/10-complete-workflows.spec.ts

# Avec browser visible
npx playwright test --headed

# Générer rapport
npx playwright show-report
```

## Structure

```
e2e/
├── 01-auth.spec.ts                    # 5 tests - Authentification
├── 02-character-creation.spec.ts      # 4 tests - Création personnages
├── 03-game-session.spec.ts            # 6 tests - Gestion sessions
├── 04-gm-dashboard.spec.ts            # 8 tests - Dashboard GM
├── 05-dice-rolling.spec.ts            # 9 tests - Système de dés
├── 06-sanity-management.spec.ts       # 8 tests - Santé mentale
├── 07-api-routes.spec.ts              # 36 tests - API backend
├── 08-inventory-management.spec.ts    # 9 tests - Inventaire ✨
├── 09-effects-system.spec.ts          # 10 tests - Effets/Status ✨
├── 10-complete-workflows.spec.ts      # 6 tests - Workflows E2E ✨
├── TEST_STRATEGY.md                   # Documentation stratégie
├── TEST_EXECUTION_REPORT.md           # Rapport détaillé
└── README.md                          # Ce fichier
```

**Total**: 101 tests

## Workflows Couverts

### ✅ Workflows Critiques

1. **Authentification** (`01-auth.spec.ts`)
   - Signup/Login GM
   - Token validation
   - Logout

2. **Création Personnage** (`02-character-creation.spec.ts`)
   - Génération caractéristiques CoC7e
   - Occupation et compétences
   - Edition fiche

3. **Session GM** (`03-game-session.spec.ts`)
   - Création session
   - Code invitation
   - Gestion personnages

4. **Jets de Dés + Effets** (`05-dice-rolling.spec.ts` + `09-effects-system.spec.ts`)
   - Jets d100, skill checks
   - Buffs/Debuffs
   - Dégâts/Soins

5. **Inventaire** (`08-inventory-management.spec.ts`)
   - CRUD items
   - Équipement
   - Catégorisation

## Configuration

**playwright.config.ts**:
- BaseURL: `http://localhost:5002`
- Workers: 1 (tests séquentiels)
- Retries: 2 (en CI)
- Screenshots: Uniquement sur échec
- Trace: Premier retry

## Debugging

### Voir Tests Échoués

```bash
# Screenshots dans test-results/
ls test-results/*/*.png

# Trace viewer
npx playwright show-trace test-results/*/trace.zip
```

### Mode Debug

```bash
# Pause sur échec
npx playwright test --debug

# Inspecteur Playwright
npx playwright test --headed --debug
```

## Documentation Complète

- **TEST_STRATEGY.md**: Stratégie et patterns détaillés
- **TEST_EXECUTION_REPORT.md**: Rapport d'exécution complet

## Support

Pour questions ou problèmes:
1. Consulter TEST_STRATEGY.md
2. Vérifier TEST_EXECUTION_REPORT.md
3. Contacter l'équipe de développement
