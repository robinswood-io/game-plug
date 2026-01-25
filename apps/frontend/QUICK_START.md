# API Client Quick Start Guide

## Installation (5 minutes)

### 1. Install Dependencies
```bash
cd /srv/workspace/game-plug/apps/frontend
npm install axios
```

### 2. Configure Environment
Create or update `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5002
```

### 3. Setup React Query Provider

In your Next.js app layout (`app/layout.tsx`):

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // 5 minutes
      gcTime: 1000 * 60 * 10,    // 10 minutes
    },
  },
});

export function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

## Common Operations

### Login
```typescript
import { useLogin } from '@/hooks/useApi';

function LoginPage() {
  const login = useLogin();

  const handleLogin = async () => {
    await login.mutateAsync({
      email: 'user@example.com',
      password: 'password',
    });
    // Tokens automatically saved, ready to use
  }
}
```

### Fetch Data
```typescript
import { useCharacters, useCharacter } from '@/hooks/useApi';

function CharacterList() {
  const { data: characters, isLoading } = useCharacters();

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {characters?.map(c => (
        <li key={c.id}>{c.name}</li>
      ))}
    </ul>
  );
}
```

### Create Data
```typescript
import { useCreateCharacter } from '@/hooks/useApi';

function NewCharacterForm() {
  const createCharacter = useCreateCharacter();

  const handleCreate = async () => {
    await createCharacter.mutateAsync({
      sessionId: 'session-123',
      name: 'John Doe',
      occupation: 'Detective',
      strength: 50,
      constitution: 55,
      size: 50,
      dexterity: 60,
      appearance: 45,
      intelligence: 70,
      power: 40,
      education: 65,
      luck: 50,
    });
  }
}
```

### Update Data
```typescript
import { useUpdateCharacter } from '@/hooks/useApi';

function EditCharacter() {
  const updateCharacter = useUpdateCharacter('character-id');

  const handleUpdate = async () => {
    await updateCharacter.mutateAsync({
      hitPoints: 20,
      sanity: 50,
    });
  }
}
```

### Delete Data
```typescript
import { useDeleteCharacter } from '@/hooks/useApi';

function DeleteCharacterButton({ characterId }: { characterId: string }) {
  const deleteCharacter = useDeleteCharacter();

  const handleDelete = () => {
    deleteCharacter.mutate(characterId);
  }
}
```

## Available Hooks

### Authentication
- `useLogin()` - Login user
- `useSignup()` - Register user
- `useLogout()` - Logout user

### Game Sessions
- `useGameSessions(gmId?)` - List sessions
- `useGameSession(id)` - Get single session
- `useCreateGameSession()` - Create session
- `useUpdateGameSession(id)` - Update session
- `useDeleteGameSession()` - Delete session

### Characters
- `useCharacters(userId?)` - List characters
- `useCharacter(id)` - Get single character
- `useCreateCharacter()` - Create character
- `useUpdateCharacter(id)` - Update character
- `useDeleteCharacter()` - Delete character

### Inventory
- `useInventory(characterId)` - List items
- `useAddInventoryItem()` - Add item
- `useUpdateInventoryItem(id, characterId)` - Update item
- `useDeleteInventoryItem(characterId)` - Delete item

### Chapters
- `useChapters(sessionId)` - List chapters
- `useChapter(id)` - Get single chapter
- `useCreateChapter()` - Create chapter
- `useUpdateChapter(id, sessionId)` - Update chapter
- `useDeleteChapter()` - Delete chapter

### Chapter Events
- `useChapterEvents(filters)` - List events
- `useCreateChapterEvent()` - Create event
- `useUpdateChapterEvent(id, chapterId)` - Update event
- `useDeleteChapterEvent()` - Delete event

### Narrative
- `useNarrativeEntries(sessionId)` - List entries
- `useCreateNarrativeEntry()` - Create entry
- `useUpdateNarrativeEntry(id, sessionId)` - Update entry
- `useDeleteNarrativeEntry(sessionId)` - Delete entry

### Sanity Conditions
- `useSanityConditions(characterId)` - List conditions
- `useCreateSanityCondition()` - Create condition
- `useUpdateSanityCondition(id, characterId)` - Update condition
- `useDeleteSanityCondition(characterId)` - Delete condition

### Dice
- `useDiceRoll()` - Roll dice

## Hook State Properties

### Query Hooks (read operations)
```typescript
const {
  data,         // The fetched data
  isLoading,    // First load
  isFetching,   // Any fetch in progress
  error,        // Error if any
  refetch,      // Manual refetch function
} = useCharacters();
```

### Mutation Hooks (write operations)
```typescript
const {
  mutate,       // Trigger mutation (fire & forget)
  mutateAsync,  // Trigger mutation (with promise)
  isPending,    // Mutation in progress
  isSuccess,    // Last mutation succeeded
  isError,      // Last mutation failed
  error,        // Error if any
  data,         // Result from last mutation
  reset,        // Reset mutation state
} = useCreateCharacter();
```

## Error Handling

```typescript
function SafeCharacterList() {
  const { data, error, isLoading } = useCharacters();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return data?.map(c => <div key={c.id}>{c.name}</div>);
}
```

## Direct API Calls (Without Hooks)

If you need direct API calls without caching:

```typescript
import * as api from '@/api/endpoints';

// Direct call
const characters = await api.characters.list();
const character = await api.characters.get('id');
const newChar = await api.characters.create({...});
const updated = await api.characters.update('id', {...});
await api.characters.delete('id');
```

## Token Management

```typescript
import { tokenStorage, userStorage, authState } from '@/api/auth';

// Check authentication
if (authState.isAuthenticated()) {
  // User is logged in
}

// Get current user
const user = userStorage.getUser();
const userId = userStorage.getCurrentUserId();
const isGM = userStorage.isGameMaster();

// Check token expiration
if (tokenStorage.hasValidToken()) {
  const timeLeft = tokenStorage.getTimeUntilExpiration();
  console.log(`Token expires in ${timeLeft}ms`);
}

// Manual logout
authState.logout();
```

## Type Safety

All types are automatically imported:

```typescript
import {
  Character,
  CreateCharacterRequest,
  UpdateCharacterRequest,
  GameSession,
  User,
  DiceRollResponse,
  // ... and all other types
} from '@/api/types';

const character: Character = {
  id: '123',
  sessionId: '456',
  name: 'John',
  // TypeScript ensures all required fields are present
  // and types are correct
};
```

## File Structure

```
src/
├── api/
│   ├── client.ts         # HTTP client
│   ├── types.ts          # Type definitions
│   ├── endpoints.ts      # API functions
│   ├── auth.ts           # Auth utilities
│   └── README.md         # Detailed docs
└── hooks/
    ├── useApi.ts         # React hooks
    └── USAGE_EXAMPLES.md # Example patterns
```

## Key Features

✓ **Automatic JWT Management** - Tokens handled transparently
✓ **React Query Caching** - Data caching and synchronization
✓ **Type Safety** - Full TypeScript strict mode
✓ **Error Handling** - Proper error types and handling
✓ **Auto Refresh** - Automatic token refresh on expiration
✓ **Custom Events** - Listen to auth state changes
✓ **No External Tools** - Pure TypeScript/JavaScript

## Next Steps

1. Start using hooks in your components
2. Run `npm run type-check` to verify types
3. Start the backend: `docker-compose up backend`
4. Start the frontend: `npm run dev`
5. Test with login, character creation, etc.

## Troubleshooting

### Tokens not working
- Check `NEXT_PUBLIC_API_URL` env variable
- Verify backend is running on port 5002
- Check localStorage in browser DevTools

### TypeScript errors
- Run `npm run type-check`
- Make sure all required fields are provided
- Check types in `/api/types.ts`

### Hooks not updating
- Check React Query DevTools
- Verify cache keys are correct
- Look at query parameters

## Documentation

- **Full API Docs**: `API_CLIENT_GENERATION.md`
- **Hook Examples**: `src/hooks/USAGE_EXAMPLES.md`
- **API Client Guide**: `src/api/README.md`
- **OpenAPI Spec**: Backend `/openapi.json`

## Support

For more details, see the comprehensive documentation:
- API usage: `/src/api/README.md`
- Hook patterns: `/src/hooks/USAGE_EXAMPLES.md`
- Full guide: `/API_CLIENT_GENERATION.md`
