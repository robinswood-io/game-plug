# API Client Documentation

This is the TypeScript API client for the Game Plug API, automatically generated from the OpenAPI 3.0 specification. The client includes full type safety, authentication handling, and React hooks for data fetching.

## Table of Contents

1. [Installation](#installation)
2. [Authentication](#authentication)
3. [API Client Usage](#api-client-usage)
4. [React Hooks](#react-hooks)
5. [Token Management](#token-management)
6. [Error Handling](#error-handling)
7. [Examples](#examples)

## Installation

The API client is already set up in the frontend project. Dependencies are installed in `package.json`:

- `axios` - HTTP client
- `@tanstack/react-query` - Data fetching and caching

## Authentication

### Login and Token Management

Tokens are automatically managed through the Axios interceptors. When you call `useLogin` or `useSignup`, tokens are automatically stored in localStorage.

```typescript
import { useLogin } from '@/hooks/useApi';

function LoginPage() {
  const loginMutation = useLogin();

  const handleLogin = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
    // Tokens are automatically stored and ready to use
  }
}
```

### Token Storage

Tokens are stored in localStorage under these keys:
- `access_token` - JWT access token
- `refresh_token` - JWT refresh token
- `user` - Current user data (JSON string)

### Automatic Token Refresh

When a request returns 401 (Unauthorized), the client automatically:
1. Uses the refresh token to get a new access token
2. Retries the original request with the new token
3. If refresh fails, logs out the user and redirects to login

This is handled transparently by the Axios interceptor in `client.ts`.

### Manual Authentication

For manual authentication management:

```typescript
import { authState, tokenStorage, userStorage } from '@/api/auth';

// Check if user is authenticated
if (authState.isAuthenticated()) {
  // User is logged in
}

// Get current user
const user = userStorage.getUser();

// Get current user ID
const userId = userStorage.getCurrentUserId();

// Check if current user is a Game Master
if (userStorage.isGameMaster()) {
  // User is a GM
}

// Logout
authState.logout();
```

## API Client Usage

### Direct API Calls

For direct API calls without caching, use the endpoints directly:

```typescript
import * as api from '@/api/endpoints';

// Create a character
const character = await api.characters.create({
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

// Update a character
const updated = await api.characters.update('character-123', {
  hitPoints: 15,
  sanity: 40,
});

// Delete a character
await api.characters.delete('character-123');
```

### Available Endpoints

All endpoints are available through the API modules:

- `api.health.check()` - Health check
- `api.auth.*` - Authentication endpoints
- `api.gameSessions.*` - Game session management
- `api.characters.*` - Character management
- `api.inventory.*` - Inventory management
- `api.chapters.*` - Chapter management
- `api.chapterEvents.*` - Chapter events
- `api.narrative.*` - Narrative entries
- `api.sanity.*` - Sanity conditions
- `api.dice.*` - Dice rolling

## React Hooks

### Query Hooks (Data Fetching)

Query hooks use React Query for caching and synchronization:

#### Game Sessions

```typescript
import { useGameSessions, useGameSession, useCreateGameSession } from '@/hooks/useApi';

function SessionsList() {
  const { data: sessions, isLoading } = useGameSessions();

  return (
    <div>
      {isLoading ? 'Loading...' : sessions?.map(s => <div key={s.id}>{s.name}</div>)}
    </div>
  );
}

function CreateSessionForm() {
  const createSession = useCreateGameSession();

  const handleCreate = async () => {
    await createSession.mutateAsync({
      name: 'New Campaign',
      gmId: 'gm-123',
    });
  }
}

function SessionDetail({ sessionId }: { sessionId: string }) {
  const { data: session } = useGameSession(sessionId);

  return <div>{session?.name}</div>;
}
```

#### Characters

```typescript
import {
  useCharacters,
  useCharacter,
  useCreateCharacter,
  useUpdateCharacter,
  useDeleteCharacter,
} from '@/hooks/useApi';

function CharacterList() {
  const { data: characters } = useCharacters();

  return characters?.map(c => <CharacterCard key={c.id} character={c} />);
}

function CreateCharacterForm({ sessionId }: { sessionId: string }) {
  const createCharacter = useCreateCharacter();

  const handleCreate = async (formData: CreateCharacterRequest) => {
    await createCharacter.mutateAsync({
      ...formData,
      sessionId,
    });
  }
}

function EditCharacter({ characterId }: { characterId: string }) {
  const { data: character } = useCharacter(characterId);
  const updateCharacter = useUpdateCharacter(characterId);

  const handleUpdate = async (updates: UpdateCharacterRequest) => {
    await updateCharacter.mutateAsync(updates);
  }
}
```

#### Inventory

```typescript
import {
  useInventory,
  useAddInventoryItem,
  useUpdateInventoryItem,
  useDeleteInventoryItem,
} from '@/hooks/useApi';

function CharacterInventory({ characterId }: { characterId: string }) {
  const { data: items } = useInventory(characterId);
  const addItem = useAddInventoryItem();

  const handleAddWeapon = async () => {
    await addItem.mutateAsync({
      characterId,
      name: 'Revolver',
      category: 'weapon',
      damage: '1d10',
    });
  }
}
```

#### Chapters and Events

```typescript
import {
  useChapters,
  useCreateChapter,
  useChapterEvents,
  useCreateChapterEvent,
} from '@/hooks/useApi';

function SessionChapters({ sessionId }: { sessionId: string }) {
  const { data: chapters } = useChapters(sessionId);
  const createChapter = useCreateChapter();

  const handleCreateChapter = async () => {
    await createChapter.mutateAsync({
      sessionId,
      name: 'Chapter 1: The Beginning',
      orderIndex: 1,
    });
  }
}

function ChapterTimeline({ chapterId }: { chapterId: string }) {
  const { data: events } = useChapterEvents({ chapterId });
  const createEvent = useCreateChapterEvent();

  const handleAddEvent = async () => {
    await createEvent.mutateAsync({
      chapterId,
      sessionId: 'session-123',
      eventType: 'narration',
      title: 'Investigators arrive at the mansion',
    });
  }
}
```

#### Narrative, Sanity, and Dice

```typescript
import {
  useNarrativeEntries,
  useCreateNarrativeEntry,
  useSanityConditions,
  useCreateSanityCondition,
  useDiceRoll,
} from '@/hooks/useApi';

function GameMasterNotes({ sessionId }: { sessionId: string }) {
  const { data: entries } = useNarrativeEntries(sessionId);
  const createEntry = useCreateNarrativeEntry();

  const handleAddNote = async () => {
    await createEntry.mutateAsync({
      sessionId,
      gmId: 'gm-123',
      content: 'The cult meets at midnight',
      entryType: 'note',
    });
  }
}

function CharacterSanity({ characterId }: { characterId: string }) {
  const { data: conditions } = useSanityConditions(characterId);
  const createCondition = useCreateSanityCondition();

  const handleAddPhobia = async () => {
    await createCondition.mutateAsync({
      characterId,
      type: 'phobia',
      name: 'Arachnophobia',
      description: 'Fear of spiders',
      duration: 'temporary',
    });
  }
}

function DiceRoller() {
  const roll = useDiceRoll();

  const handleRoll = async () => {
    const result = await roll.mutateAsync({
      diceFormula: '2d6+2',
      rollType: 'damage',
    });
    console.log(`Rolled: ${result.result}`);
  }
}
```

## Token Management

### Checking Token Status

```typescript
import { tokenStorage } from '@/api/auth';

// Check if token is valid
if (tokenStorage.hasValidToken()) {
  // Token is still valid
}

// Get time until expiration (in milliseconds)
const timeLeft = tokenStorage.getTimeUntilExpiration();
if (timeLeft < 60000) {
  // Token expires in less than 1 minute
  console.warn('Token expiring soon');
}

// Get expiration time (as timestamp)
const expirationTime = tokenStorage.getTokenExpirationTime();
```

### Automatic Logout on Expiration

Set up automatic logout when token expires:

```typescript
import { useEffect } from 'react';
import { setupAutoLogout } from '@/api/auth';

function useSessionTimeout() {
  useEffect(() => {
    const cleanup = setupAutoLogout(() => {
      // Token expired, user logged out
      console.log('Session expired');
      // You can also redirect here
      window.location.href = '/login';
    });

    return cleanup;
  }, []);
}
```

### Listen to Auth Events

```typescript
useEffect(() => {
  const handleLogin = (event: CustomEvent) => {
    console.log('User logged in:', event.detail.user);
  };

  const handleLogout = () => {
    console.log('User logged out');
  };

  const handleUnauthorized = () => {
    console.log('Unauthorized - redirecting to login');
  };

  window.addEventListener('login', handleLogin as EventListener);
  window.addEventListener('logout', handleLogout);
  window.addEventListener('unauthorized', handleUnauthorized);

  return () => {
    window.removeEventListener('login', handleLogin as EventListener);
    window.removeEventListener('logout', handleLogout);
    window.removeEventListener('unauthorized', handleUnauthorized);
  };
}, []);
```

## Error Handling

All API errors are returned with proper TypeScript typing:

```typescript
import { useCharacter } from '@/hooks/useApi';
import { ErrorResponse } from '@/api/types';

function CharacterDetail({ id }: { id: string }) {
  const { data, error, isLoading } = useCharacter(id);

  if (error instanceof Error) {
    // Handle error
    const apiError = error as { response?: { data: ErrorResponse } };
    if (apiError.response?.data) {
      return <div>Error: {apiError.response.data.message}</div>;
    }
  }

  return <div>{data?.name}</div>;
}
```

### Error Handling with Mutations

```typescript
const updateCharacter = useUpdateCharacter(characterId);

try {
  await updateCharacter.mutateAsync(updates);
} catch (error) {
  if (error instanceof Error) {
    console.error('Failed to update character:', error.message);
  }
}

// Or use the hook's error state
if (updateCharacter.error) {
  return <div>Error: {updateCharacter.error.message}</div>;
}
```

## Examples

### Complete Character Creation Form

```typescript
import { useState } from 'react';
import { useCreateCharacter } from '@/hooks/useApi';
import { CreateCharacterRequest } from '@/api/types';

function CharacterCreationForm({ sessionId }: { sessionId: string }) {
  const [formData, setFormData] = useState<CreateCharacterRequest>({
    sessionId,
    name: '',
    occupation: '',
    strength: 50,
    constitution: 50,
    size: 50,
    dexterity: 50,
    appearance: 50,
    intelligence: 50,
    power: 50,
    education: 50,
    luck: 50,
  });

  const createCharacter = useCreateCharacter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCharacter.mutateAsync(formData);
      // Success - form reset happens via React Query
    } catch (error) {
      console.error('Failed to create character:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Character Name"
      />
      <input
        type="text"
        value={formData.occupation}
        onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
        placeholder="Occupation"
      />
      {/* Attributes inputs... */}
      <button type="submit" disabled={createCharacter.isPending}>
        {createCharacter.isPending ? 'Creating...' : 'Create Character'}
      </button>
      {createCharacter.error && (
        <p className="error">{createCharacter.error.message}</p>
      )}
    </form>
  );
}
```

### Game Session Management

```typescript
import { useGameSessions, useCreateGameSession } from '@/hooks/useApi';

function SessionManagement() {
  const { data: sessions, isLoading } = useGameSessions();
  const createSession = useCreateGameSession();

  return (
    <div>
      <h2>Your Game Sessions</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {sessions?.map((session) => (
            <li key={session.id}>
              <h3>{session.name}</h3>
              <p>Status: {session.status}</p>
              <p>Code: {session.code}</p>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() =>
          createSession.mutate({
            name: 'New Campaign',
            gmId: 'current-user-id',
          })
        }
      >
        Create New Session
      </button>
    </div>
  );
}
```

## Type Safety

All API responses and requests are fully typed. The types are generated from the OpenAPI specification:

```typescript
import {
  Character,
  CreateCharacterRequest,
  UpdateCharacterRequest,
  GameSession,
  DiceRollResponse,
} from '@/api/types';

// All properties are type-checked
const character: Character = {
  id: '123',
  sessionId: '456',
  name: 'John',
  occupation: 'Detective',
  strength: 50,
  // ... all required properties
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Request types ensure correct data structure
const createRequest: CreateCharacterRequest = {
  sessionId: '456',
  name: 'Jane',
  occupation: 'Archeologist',
  strength: 45,
  // ... required attributes
};

// Update requests have optional fields
const updateRequest: UpdateCharacterRequest = {
  hitPoints: 20, // Only updating this field
};
```

## Configuration

The API client uses environment variables for configuration:

- `NEXT_PUBLIC_API_URL` - Base URL for API requests (defaults to `http://localhost:5002`)

Set this in your `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5002
```

## Generated From

This client is generated from the OpenAPI 3.0 specification located at:
- Backend: `/srv/workspace/game-plug/apps/backend/openapi.json`
- Documentation: http://localhost:5002/api/docs (Swagger UI)
