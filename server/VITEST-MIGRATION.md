# Jest → Vitest Migration Guide

## Migration Complétée

Ce projet a été migré de Jest vers Vitest pour un développement plus rapide et une meilleure intégration NestJS.

### Fichiers de Configuration Créés

1. **vitest.config.ts** - Configuration Vitest principale
   - Support des décorateurs NestJS via `unplugin-swc`
   - Alias de chemin (`@`, `@shared`)
   - Coverage v8 configurée (70% seuils)
   - Pool threads pour isolation des tests

2. **test/setup.ts** - Setup global de tests
   - MSW 2.x intégré pour mock HTTP/WS
   - Hooks de cycle de vie (beforeAll, afterEach, afterAll)
   - Utilitaires pour gérer les handlers mock

### Changements package.json

#### Scripts Mis à Jour
```bash
npm run test         # Exécute tous les tests une fois
npm run test:watch   # Mode watch interactif
npm run test:cov     # Génère rapport de couverture
npm run test:e2e     # Tests E2E
```

#### Dépendances Supprimées
- jest
- ts-jest
- @types/jest
- supertest (optionnel - sera remplacé par des mocks MSW)

#### Dépendances Ajoutées
- `vitest@^4.0.0` - Test runner principal
- `@vitest/coverage-v8@^4.0.0` - Reporter coverage
- `unplugin-swc@^1.4.4` - Support décorateurs NestJS
- `msw@^2.12.0` - Mock Service Worker pour Node

### Migration des Tests Existants

#### Pattern Jest → Vitest

```typescript
// Jest (ancien)
import { Test } from '@nestjs/testing'
import { jest } from '@jest/globals'

describe('UserService', () => {
  it('should do something', async () => {
    const result = jest.fn()
    result.mockReturnValue('test')
  })
})

// Vitest (nouveau)
import { describe, it, expect, vi } from 'vitest'
import { Test } from '@nestjs/testing'

describe('UserService', () => {
  it('should do something', async () => {
    const result = vi.fn()
    result.mockReturnValue('test')
  })
})
```

#### Points Clés de Migration

1. **Imports de test** : Remplacer `jest` par `vi` de Vitest
   ```typescript
   import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
   ```

2. **Mocking HTTP** : Utiliser MSW au lieu de nock ou supertest
   ```typescript
   import { http, HttpResponse } from 'msw'
   import { addMockHandler } from '../../test/setup'
   
   it('should fetch data', async () => {
     addMockHandler(
       http.get('https://api.example.com/data', () => {
         return HttpResponse.json({ success: true })
       })
     )
   })
   ```

3. **NestJS Testing** : Identique à Jest
   ```typescript
   const module = await Test.createTestingModule({
     providers: [UserService],
   }).compile()
   ```

### Configuration TypeScript

Les chemins d'alias sont configurés dans vitest.config.ts :
- `@/*` → `./src/*`
- `@shared/*` → `./shared/*`

### Coverage Reporter

Rapports générés dans `coverage/` :
- `text` - Résumé console
- `html` - Visualisation interactive
- `json` - Données brutes

Seuils de couverture : **70%** (lines, functions, branches, statements)

### Exécution des Tests

```bash
# Run all tests
npm run test

# Watch mode (réexécute à chaque changement)
npm run test:watch

# Coverage report
npm run test:cov

# Tests spécifiques
npm run test -- --grep "UserService"

# Un seul fichier
npm run test -- src/users/users.service.spec.ts
```

### Troubleshooting

**Problème** : "Cannot find module" avec alias
- **Solution** : Vérifier que `vitest.config.ts` et `tsconfig.json` ont les mêmes alias

**Problème** : Décorateurs non recognized
- **Solution** : `unplugin-swc` dans vitest.config.ts fait la conversion automatique

**Problème** : Tests timeout
- **Solution** : Augmenter `testTimeout` dans vitest.config.ts (défaut: 10000ms)

**Problème** : Memory leak avec MSW
- **Solution** : `resetMockHandlers()` appelé après chaque test (automatique via afterEach)

### Prochaines Étapes

1. [ ] Mettre à jour les fichiers `.spec.ts` existants (remplacer jest imports)
2. [ ] Exécuter `npm run test:cov` et vérifier couverture
3. [ ] Ajouter tests E2E si nécessaire
4. [ ] Documenter tout cas de mock complexe
5. [ ] Former l'équipe aux patterns Vitest/MSW

### Ressources

- [Vitest Docs](https://vitest.dev/)
- [MSW Docs](https://mswjs.io/)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
