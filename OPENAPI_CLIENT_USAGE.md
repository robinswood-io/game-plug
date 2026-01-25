# Guide d'Utilisation du Client OpenAPI Généré

## Configuration

Le client OpenAPI est configuré dans `apps/frontend/lib/api-config.ts`:

```typescript
import { OpenAPI } from './api-client';

// Configuration automatique au démarrage
OpenAPI.BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
OpenAPI.WITH_CREDENTIALS = true;
OpenAPI.CREDENTIALS = 'include';
```

## Utilisation dans les Pages

### 1. Import des Services

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CharactersService, AuthenticationService } from '@/lib/api-client';
```

### 2. Queries (GET)

```typescript
// Liste de personnages
const { data: characters, isLoading } = useQuery({
  queryKey: ['characters'],
  queryFn: () => CharactersService.charactersControllerFindAll(),
});

// Personnage unique
const { data: character } = useQuery({
  queryKey: ['character', characterId],
  queryFn: () => CharactersService.charactersControllerFindOne(characterId),
  enabled: !!characterId, // Requête conditionnelle
});
```

### 3. Mutations (POST/PUT/PATCH/DELETE)

```typescript
const queryClient = useQueryClient();

const createMutation = useMutation({
  mutationFn: (data) => CharactersService.charactersControllerCreate(data),
  onSuccess: (character) => {
    // Invalider cache pour refetch
    queryClient.invalidateQueries({ queryKey: ['characters'] });
    
    toast({
      title: 'Personnage créé',
      description: `${character.name} a été créé avec succès.`,
    });
    
    router.push(`/characters/${character.id}`);
  },
  onError: (error: any) => {
    toast({
      title: 'Erreur',
      description: error.message,
      variant: 'destructive',
    });
  },
});

// Utilisation
createMutation.mutate(characterData);
```

### 4. Update Mutation

```typescript
const updateMutation = useMutation({
  mutationFn: ({ id, data }) => 
    CharactersService.charactersControllerUpdate(id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['character', characterId] });
  },
});

// Utilisation
updateMutation.mutate({ id: '123', data: { name: 'New Name' } });
```

## Services Disponibles

### AuthenticationService
- `authControllerSignup(data: SignupDto)`
- `authControllerLogin(data: LoginDto)`
- `authControllerRefresh()`

### CharactersService
- `charactersControllerFindAll(userId?: string)`
- `charactersControllerCreate(data: CreateCharacterDto)`
- `charactersControllerFindOne(id: string)`
- `charactersControllerUpdate(id: string, data: UpdateCharacterDto)`
- `charactersControllerDelete(id: string)`

### SessionsService
- `sessionsControllerFindAll(gmId: string)`
- `sessionsControllerCreate(data: CreateSessionDto)`
- `sessionsControllerFindOne(id: string)`
- `sessionsControllerUpdate(id: string, data: UpdateSessionDto)`
- `sessionsControllerDelete(id: string)`

### DiceService
- `diceControllerRoll(data: DiceRollDto)`

### SanityService
- `sanityControllerCreateCondition(characterId: string, data: CreateSanityConditionDto)`
- `sanityControllerUpdateCondition(id: string, data: UpdateSanityConditionDto)`

### AiService
- `aiControllerGenerateAvatar(data: GenerateAvatarDto)`
- `aiControllerGenerateScene(data: GenerateSceneDto)`

### InventoryService
- `inventoryControllerCreate(data: CreateInventoryDto)`
- `inventoryControllerUpdate(id: string, data: UpdateInventoryDto)`

## Gestion du Cache TanStack Query

### Invalidation après Mutation
```typescript
// Invalider une query spécifique
queryClient.invalidateQueries({ queryKey: ['characters'] });

// Invalider plusieurs queries
queryClient.invalidateQueries({ queryKey: ['characters', characterId] });
```

### QueryKeys Conventions
```typescript
// Liste: ['resource']
queryKey: ['characters']

// Détail: ['resource', id]
queryKey: ['character', characterId]

// Nested: ['resource', id, 'nested']
queryKey: ['character', characterId, 'inventory']
```

## Gestion des Erreurs

```typescript
try {
  const character = await CharactersService.charactersControllerFindOne(id);
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.status, error.message);
  }
}
```

## Types Générés

Tous les types sont disponibles depuis `@/lib/api-client`:

```typescript
import type { 
  CreateCharacterDto, 
  UpdateCharacterDto,
  SignupDto,
  LoginDto 
} from '@/lib/api-client';
```

## Régénération du Client

Quand l'API backend change:

```bash
cd apps/frontend
npx openapi-typescript-codegen \
  --input ../backend/openapi.json \
  --output ./lib/api-client \
  --client fetch
```

## Bonnes Pratiques

1. **Toujours invalider le cache** après mutation
2. **Utiliser enabled** pour queries conditionnelles
3. **Gérer les erreurs** dans onError des mutations
4. **Utiliser queryClient** uniquement dans composants React
5. **Ne pas modifier** les fichiers générés dans `lib/api-client/`

## Debugging

### Voir les requêtes en cours
```typescript
import { useIsFetching } from '@tanstack/react-query';

const isFetching = useIsFetching();
console.log('Fetching:', isFetching); // Nombre de requêtes en cours
```

### React Query Devtools
```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Dans app/providers.tsx (déjà inclus en dev)
{process.env.NODE_ENV === 'development' && (
  <ReactQueryDevtools initialIsOpen={false} />
)}
```
