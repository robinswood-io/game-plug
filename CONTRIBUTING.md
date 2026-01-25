# Guide de Contribution - Game Plug

Nous apprécions les contributions de la communauté! Ce guide vous aidera à contribuer efficacement au projet Game Plug.

## Table des Matières

- [Code de Conduite](#code-de-conduite)
- [Comment Contribuer](#comment-contribuer)
- [Processus de Contribution](#processus-de-contribution)
- [Standards de Code](#standards-de-code)
- [Workflow Git](#workflow-git)
- [Tests](#tests)
- [Documentation](#documentation)
- [Pull Requests](#pull-requests)
- [Reporting Issues](#reporting-issues)

---

## Code de Conduite

Ce projet adhère à un code de conduite inclusif. En participant, vous acceptez:

- Respecter les opinions et expériences de chacun
- Pas de harcèlement, discrimination ou abus
- Constructivité dans les retours
- Acceptation de critiques constructives

---

## Comment Contribuer

### Types de Contributions

1. **Bug Fixes** - Correction de bugs existants
2. **Nouvelles Fonctionnalités** - Nouvelles features
3. **Améliorations de Performance** - Optimisations
4. **Documentation** - Amélioration des docs
5. **Tests** - Augmentation de la couverture
6. **Refactoring** - Amélioration du code

### Avant de Commencer

1. Vérifiez que le problème n'existe pas déjà
2. Pour les nouvelles features, créez une issue d'abord
3. Assignez-vous à une issue pour indiquer que vous travaillez dessus

---

## Processus de Contribution

### 1. Forker le Repository

```bash
# Cloner votre fork
git clone https://github.com/votre-username/game-plug.git
cd game-plug

# Ajouter le upstream
git remote add upstream https://github.com/original-org/game-plug.git
```

### 2. Créer une Branche

```bash
# Récupérer les derniers changements
git fetch upstream
git checkout upstream/main

# Créer une nouvelle branche
git checkout -b type/description

# Exemples:
git checkout -b feat/add-character-export
git checkout -b fix/sanity-calculation-bug
git checkout -b docs/improve-api-docs
```

**Convention de nommage:**
- `feat/` - Nouvelle fonctionnalité
- `fix/` - Correction de bug
- `refactor/` - Refactoring du code
- `docs/` - Changements documentation
- `test/` - Ajout/amélioration tests
- `chore/` - Tâches maintenance
- `perf/` - Amélioration performance

### 3. Faire les Changements

```bash
# Installer les dépendances (si première fois)
npm install

# Faire vos changements
# Éditer les fichiers pertinents

# Vérifier TypeScript
npm run check  # Doit retourner exit 0

# Formater le code
npm run format

# Exécuter les tests
npm test  # 100% must pass
```

### 4. Commiter les Changements

```bash
# Stage les changements
git add path/to/modified/files

# Commiter avec message conventionnel
git commit -m "type: description courte

Description détaillée si besoin.
- Point 1
- Point 2

Fixes #123
```

**Format des Commits:**
```
type: subject line (max 50 chars)

Detailed description (max 72 chars per line)
- Bullet points OK
- One more thing

Closes #issue-number
```

**Types obligatoires:**
- `feat:` - Nouvelle fonctionnalité
- `fix:` - Correction de bug
- `refactor:` - Refactoring
- `docs:` - Documentation
- `test:` - Tests
- `chore:` - Maintenance
- `perf:` - Performance
- `ci:` - CI/CD

**Exemple complet:**
```
feat: add character export to PDF

Implement PDF export functionality for character sheets.
Allows players to download their investigator sheet as PDF.

- Add PDFKit dependency
- Create CharacterPdfService
- Add export endpoint /api/characters/:id/export/pdf
- Add tests for PDF generation

Closes #145
```

### 5. Pousser et Créer une PR

```bash
# Pousser votre branche
git push origin type/description

# Créer une Pull Request sur GitHub
# Utilisez le template fourni
```

---

## Standards de Code

### TypeScript

**Obligatoire:**
- Mode strict (`strict: true`)
- Pas de `any` - utiliser `unknown` avec type guards
- Pas de `@ts-ignore` ou `@ts-expect-error`
- Types explicites pour fonctions publiques

**Style:**
```typescript
// ✅ BON
interface Character {
  id: string;
  name: string;
  attributes: CharacterAttributes;
}

function calculateDamage(skill: number): number {
  if (skill < 0) {
    throw new Error('Skill cannot be negative');
  }
  return Math.floor(skill / 2);
}

// ❌ MAUVAIS
interface Character {
  [key: string]: any;  // ← NO ANY
}

function calculateDamage(skill: any): any {  // ← NO ANY
  return skill / 2;
}
```

### NestJS Backend

**Architecture:**
- 1 module = 1 fonctionnalité
- Chaque module: `controller` → `service` → `repository`
- DTOs pour validation (class-validator)
- Guards pour authorization
- Filters pour error handling

```typescript
// ✅ Structure correcte
my-feature/
├── my-feature.controller.ts
├── my-feature.service.ts
├── my-feature.module.ts
├── dto/
│   ├── create-my-feature.dto.ts
│   └── update-my-feature.dto.ts
└── my-feature.spec.ts

// ✅ Exemple Controller
@Controller('my-feature')
export class MyFeatureController {
  constructor(private service: MyFeatureService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateMyFeatureDto) {
    return this.service.create(dto);
  }
}

// ✅ Exemple DTO
import { IsString, IsNumber, Min } from 'class-validator';

export class CreateMyFeatureDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(1)
  value: number;
}
```

### React Frontend

**Conventions:**
- Composants fonctionnels avec hooks
- Props strongly typed
- Custom hooks pour logique réutilisable
- Separation concerns: UI vs logique

```typescript
// ✅ Bon composant
interface CharacterCardProps {
  character: Character;
  onSelect: (id: string) => void;
}

export function CharacterCard({ character, onSelect }: CharacterCardProps) {
  return (
    <div onClick={() => onSelect(character.id)}>
      <h3>{character.name}</h3>
      <p>Sanity: {character.sanity}/99</p>
    </div>
  );
}

// ✅ Custom hook
function useCharacter(id: string) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCharacter(id).then(setCharacter).finally(() => setLoading(false));
  }, [id]);

  return { character, loading };
}
```

### Tailwind CSS

```typescript
// ✅ Classes utilisables
<div className="flex gap-4 p-6 rounded-lg bg-slate-100">
  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    Click me
  </button>
</div>

// ❌ Éviter les styles arbitraires compliqués
<div style={{ padding: '24px' }}>  // Use Tailwind instead
```

### Linting & Formatage

```bash
# Formater le code (Prettier)
npm run format

# Vérifier TypeScript
npm run check

# Linter TypeScript
npm run lint
```

---

## Workflow Git

### Avant de Créer une PR

```bash
# 1. Récupérer les derniers changements du upstream
git fetch upstream

# 2. Rebaser sur main
git rebase upstream/main

# 3. Vérifier tout passe
npm run check && npm test

# 4. Pousser
git push origin type/description
```

### Pendant la Review

- Répondez aux commentaires et critiques
- Faites les changements demandés
- Poussez les changements (ne pas force push)
- Demandez une nouvelle review

### Merge

Les maintainers vont:
- Vérifier les tests ✅
- Vérifier TypeScript ✅
- Vérifier la documentation ✅
- Vérifier les standards de code ✅
- Merger si tout est OK

---

## Tests

### Exécuter les Tests

```bash
# Tous les tests
npm test

# Mode watch
npm test -- --watch

# Avec coverage
npm test -- --coverage
```

### Écrire des Tests

**Backend NestJS:**
```typescript
// ✅ Exemple test service
describe('CharacterService', () => {
  let service: CharacterService;
  let repository: CharacterRepository;

  beforeEach(() => {
    repository = mock(CharacterRepository);
    service = new CharacterService(repository);
  });

  it('should create a character', async () => {
    const dto: CreateCharacterDto = {
      name: 'John Doe',
      occupation: 'Detective',
    };

    const result = await service.create(dto);

    expect(result).toBeDefined();
    expect(result.name).toBe('John Doe');
  });
});
```

**Frontend React:**
```typescript
// ✅ Exemple test composant
import { render, screen } from '@testing-library/react';
import { CharacterCard } from './CharacterCard';

describe('CharacterCard', () => {
  it('should render character name', () => {
    const character: Character = {
      id: '1',
      name: 'John Doe',
      sanity: 50,
    };

    render(<CharacterCard character={character} onSelect={() => {}} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

**Obligation:**
- Coverage > 80%
- Tests unitaires pour logique métier
- Tests d'intégration pour API
- 100% pass requis avant merge

---

## Documentation

### Commenter le Code

```typescript
// ✅ Bon commentaire
/**
 * Calcule les dégâts basés sur la compétence.
 * @param skill - Niveau de compétence (0-99)
 * @returns Dégâts causés
 */
function calculateDamage(skill: number): number {
  // Division par 2 pour les succès durs (règles CoC 7e p.123)
  return Math.floor(skill / 2);
}

// ❌ Mauvais commentaire
// ajouter 5
x = x + 5;  // EXPLIQUE POURQUOI, pas QUOI
```

### Documenter les APIs

```typescript
/**
 * Crée un nouveau personnage.
 *
 * @param createCharacterDto - Données du personnage
 * @returns Personnage créé
 * @throws BadRequestException si données invalides
 * @throws UnauthorizedException si utilisateur non authentifié
 *
 * @example
 * const character = await service.create({
 *   name: 'John Doe',
 *   occupation: 'Detective',
 * });
 */
@Post()
@UseGuards(JwtAuthGuard)
async create(@Body() createCharacterDto: CreateCharacterDto) {
  return this.service.create(createCharacterDto);
}
```

### Mise à Jour de la Documentation

- Mettre à jour README.md si changements API publique
- Ajouter exemples pour nouvelles features
- Documenter les breaking changes
- Mettre à jour CHANGELOG.md

---

## Pull Requests

### Créer une PR

1. **Titre clair:**
   ```
   feat: add character sanity tracking system
   fix: resolve dice roll critical calculation bug
   docs: improve API documentation
   ```

2. **Description complète:**
   ```markdown
   ## Description
   Brief description of the changes

   ## Type of Change
   - [x] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## How to Test
   Steps to test the changes:
   1. Step 1
   2. Step 2
   3. Verify the result

   ## Checklist
   - [x] Code follows style guidelines
   - [x] Tests added/updated
   - [x] Documentation updated
   - [x] No breaking changes
   - [x] TypeScript check passes
   - [x] All tests pass
   ```

### Review Process

**Avant la review:**
- ✅ `npm run check` (TypeScript check)
- ✅ `npm test` (100% pass)
- ✅ Code review sur GitHub
- ✅ CI/CD passe

**Pendant la review:**
- Répondez aux commentaires courteusement
- Faites les changements demandés
- Re-demandez une review

**Merge:**
- Minimum 1 approbation requise
- Tous les tests doivent passer
- Pas de breaking changes non documentés

---

## Reporting Issues

### Signaler un Bug

Créez une issue avec:

```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. Observed behavior

## Expected Behavior
What should happen instead

## Environment
- OS: Windows/Mac/Linux
- Browser: Chrome/Firefox/Safari
- Node.js version: 20.x
- Game Plug version: v1.0.0

## Logs
```
Error message here
Stack trace if available
```

## Screenshots
If applicable, add screenshots
```

### Proposer une Fonctionnalité

```markdown
## Feature Request
Brief description

## Motivation
Why this feature is needed

## Proposed Solution
How it should work

## Alternatives
Other solutions considered

## Additional Context
Any other information
```

---

## Questions?

- **Issues GitHub** - Pour bugs et features
- **Discussions GitHub** - Pour questions et discussions
- **Email** - support@gameplug.dev

---

## Remerciements

Merci d'avoir contribué à Game Plug! Votre travail aide la communauté Call of Cthulhu.

Happy coding! 🎲
