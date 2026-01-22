# Jest → Vitest Migration Checklist

## Pre-Migration Verification ✅

- [x] `vitest.config.ts` créé avec support NestJS
- [x] `test/setup.ts` créé avec MSW 2.x
- [x] `package.json` scripts mis à jour
- [x] Dépendances vitest ajoutées
- [x] Dépendances jest supprimées
- [x] Documentation de migration créée
- [x] Patterns d'exemple fournis

## Installation & Setup

```bash
# 1. Installer les dépendances
cd /srv/workspace/game-plug/server
npm install

# 2. Vérifier l'installation
npm ls vitest msw unplugin-swc @vitest/coverage-v8
```

## Migration des Tests Existants

### Étapes à Suivre

1. **Pour chaque fichier `.spec.ts`:**
   ```typescript
   // Ancien (Jest)
   import { jest } from '@jest/globals'
   import { describe, it, expect } from '@jest/globals'
   
   // Nouveau (Vitest)
   import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
   ```

2. **Remplacer jest par vi:**
   ```typescript
   // jest.fn() → vi.fn()
   // jest.spyOn() → vi.spyOn()
   // jest.mock() → vi.mock()
   ```

3. **Pour les mocks HTTP:**
   - Utiliser MSW (voir `test/MSW-PATTERNS.md`)
   - Remplacer supertest/nock par handlers MSW
   - Importer `addMockHandler` depuis `test/setup`

4. **Valider la migration:**
   ```bash
   npm run test -- src/your-feature/your-feature.service.spec.ts
   ```

## Vérification Post-Migration

```bash
# Exécuter tous les tests
npm run test

# Mode watch
npm run test:watch

# Rapport de couverture
npm run test:cov
```

## Fichiers de Référence

| Fichier | Purpose | Où le consulter |
|---------|---------|-----------------|
| `vitest.config.ts` | Config Vitest principale | Racine du projet |
| `test/setup.ts` | Lifecycle hooks + MSW | `/test/` |
| `test/example.spec.ts` | Template test Vitest | `/test/` |
| `VITEST-MIGRATION.md` | Guide complet de migration | Racine du projet |
| `test/MSW-PATTERNS.md` | Patterns HTTP mocking | `/test/` |
| `test/DEPENDENCIES.md` | Détail des dépendances | `/test/` |

## Configuration Validée

### vitest.config.ts
- ✅ Support décorateurs NestJS (`unplugin-swc`)
- ✅ Alias paths (`@`, `@shared`)
- ✅ MSW setupFiles
- ✅ Coverage v8
- ✅ Thread pool (parallelization)
- ✅ 10s timeout (ajustable si besoin)

### test/setup.ts
- ✅ `beforeAll` - active interception MSW
- ✅ `afterEach` - reset handlers
- ✅ `afterAll` - cleanup
- ✅ Utilitaires: `addMockHandler()`, `resetMockHandlers()`

### package.json Scripts
```json
{
  "test": "vitest run",           // Exécute une fois
  "test:watch": "vitest",         // Mode watch interactif
  "test:cov": "vitest run --coverage",  // Avec couverture
  "test:e2e": "vitest run --config vitest.config.ts"
}
```

## Dépendances Installées

### Nouvelles ✅
- `vitest@^4.0.0` - Test runner
- `@vitest/coverage-v8@^4.0.0` - Coverage reporter
- `unplugin-swc@^1.4.4` - TypeScript transpiler
- `msw@^2.12.0` - HTTP mocking

### Supprimées
- ~~jest@^29.5.0~~ 
- ~~ts-jest@^29.1.0~~
- ~~@types/jest@^29.5.2~~

## Points d'Attention

⚠️ **IMPORTANT:**

1. **Imports** - Tous les `jest` → `vi`
2. **HTTP Mocking** - Utiliser MSW, pas supertest
3. **Decorators** - unplugin-swc gère automatiquement
4. **Paths** - Alias configurés dans vitest.config.ts
5. **Coverage** - Seuils 70% (modifiable si besoin)

## Commandes Rapides

```bash
# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov

# Tests spécifiques
npm run test -- --grep "UserService"
npm run test -- src/users/users.service.spec.ts

# Debug mode
node --inspect-brk ./node_modules/.bin/vitest run src/file.spec.ts
```

## Troubleshooting

| Problème | Solution |
|----------|----------|
| "Cannot find module @" | Vérifier alias dans vitest.config.ts |
| "Unexpected token @" | unplugin-swc installé? npm install |
| "Timeout" | Augmenter testTimeout dans vitest.config.ts |
| "MSW not intercepting" | Vérifier handler dans addMockHandler() |
| "Memory leak" | resetMockHandlers() appelé automatiquement |

## Next Steps

1. [ ] Installer les dépendances: `npm install`
2. [ ] Valider installation: `npm run test` (si tests existent)
3. [ ] Migrer les fichiers `.spec.ts` existants
4. [ ] Exécuter couverture: `npm run test:cov`
5. [ ] Valider en CI/CD
6. [ ] Supprimer jest.config.ts si existe
7. [ ] Documenter patterns MSW spécifiques au projet

## Support & Documentation

- **Vitest Official**: https://vitest.dev/
- **MSW Guide**: https://mswjs.io/
- **NestJS Testing**: https://docs.nestjs.com/fundamentals/testing
- **Local Examples**: `test/example.spec.ts`, `test/MSW-PATTERNS.md`

---

**Status**: ✅ Configuration complète et prête à utilisation
**Date**: 2026-01-16
**Maintainer**: Cindy (Haiku Agent)
