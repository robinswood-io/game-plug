# API Client Generation - Complete Documentation

## Overview

The frontend includes a fully-typed TypeScript API client automatically generated from the OpenAPI 3.0 specification. The client provides:

- Full type safety for all API requests and responses
- Automatic JWT token management with refresh logic
- React hooks for data fetching with React Query caching
- Axios HTTP client with interceptors
- Comprehensive error handling
- TypeScript strict mode compliance

## Directory Structure

```
frontend/src/
├── api/
│   ├── client.ts          # Axios client with JWT interceptors
│   ├── endpoints.ts       # API endpoint functions
│   ├── types.ts          # All TypeScript types from OpenAPI
│   ├── auth.ts           # Authentication utilities
│   ├── index.ts          # API module exports
│   └── README.md         # API usage documentation
└── hooks/
    ├── useApi.ts         # All React Query hooks
    ├── index.ts          # Hooks exports
    └── USAGE_EXAMPLES.md # Practical hook examples
```

## Files Generated

### API Module (`/src/api/`)

#### `client.ts`
The Axios HTTP client with automatic JWT token management:
- Adds `Authorization: Bearer {token}` header to all requests
- Automatically refreshes expired tokens using refresh token
- Handles 401 responses with transparent retry
- Clears tokens and redirects to login on permanent auth failure
- Emits custom events for login/logout/unauthorized

**Key Features:**
```typescript
// Automatic token injection
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Automatic token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Attempt to refresh token
      // Retry original request with new token
      // Or redirect to login if refresh fails
    }
  }
);
```

#### `types.ts`
Complete TypeScript type definitions generated from OpenAPI:
- `User` - User profile with authentication type
- `AuthResponse` - Login/signup response with tokens
- `GameSession` - Game session metadata
- `Character` - Full character data with attributes
- `InventoryItem` - Item with equipment/damage data
- `Chapter` - Campaign chapter
- `ChapterEvent` - Timeline events (roll, narration, combat, etc.)
- `NarrativeEntry` - GM notes and story details
- `SanityCondition` - Mental health conditions
- `DiceRollRequest/Response` - Dice rolling with outcomes
- All Request/Response types for mutations

**Type Safety Example:**
```typescript
// All types are strict - no 'any' allowed
const character: Character = {
  id: '123',
  sessionId: '456',
  name: 'Detective',
  // All required fields must be present - TypeScript enforces this
  strength: 50,
  constitution: 55,
  // ... etc
};
```

#### `endpoints.ts`
Functions for direct API calls organized by resource:
- `api.health.check()` - Health check
- `api.auth.login()`, `api.auth.signup()`, `api.auth.refresh()`
- `api.gameSessions.*` - CRUD operations for sessions
- `api.characters.*` - CRUD operations for characters
- `api.inventory.*` - Add/update/delete items
- `api.chapters.*` - Manage campaign chapters
- `api.chapterEvents.*` - Log events in timeline
- `api.narrative.*` - GM notes and story elements
- `api.sanity.*` - Mental health tracking
- `api.dice.roll()` - Execute dice rolls

**Example:**
```typescript
// Direct API call (without caching)
const character = await api.characters.get('char-id');
const updated = await api.characters.update('char-id', { hitPoints: 20 });
```

#### `auth.ts`
Authentication utilities for token and user management:

**Token Management:**
```typescript
tokenStorage.getAccessToken()           // Get current token
tokenStorage.setTokens(access, refresh) // Save new tokens
tokenStorage.clearTokens()              // Clear on logout
tokenStorage.hasValidToken()            // Check token validity
tokenStorage.getTimeUntilExpiration()   // Check expiration
```

**User Management:**
```typescript
userStorage.getUser()         // Get logged-in user
userStorage.getCurrentUserId()// Get current user ID
userStorage.isGameMaster()    // Check if user is GM
userStorage.setUser(user)     // Save user data
userStorage.clearUser()       // Clear on logout
```

**Authentication State:**
```typescript
authState.isAuthenticated()         // Check if logged in
authState.handleAuthResponse(resp)  // Process login response
authState.logout()                  // Logout
authState.handleUnauthorized()      // Handle 401 errors
```

**JWT Utilities:**
```typescript
jwtUtils.decode(token)              // Decode JWT payload
jwtUtils.getPayload()               // Get current token payload
jwtUtils.getUserIdFromToken()       // Extract user ID from token
```

**Session Management:**
```typescript
// Setup auto-logout when token expires
setupAutoLogout(() => {
  console.log('Your session has expired');
});
```

#### `index.ts`
Main export file for the API module - import everything from `/api`.

### Hooks Module (`/src/hooks/`)

#### `useApi.ts`
Complete set of React hooks for data fetching:

**Authentication Hooks:**
- `useLogin()` - Login mutation
- `useSignup()` - Registration mutation
- `useLogout()` - Logout function

**Query Hooks (Read):**
- `useHealthCheck()` - API health status
- `useGameSessions(gmId?)` - List sessions
- `useGameSession(id)` - Get single session
- `useCharacters(userId?)` - List characters
- `useCharacter(id)` - Get single character
- `useInventory(characterId)` - List items
- `useChapters(sessionId)` - List chapters
- `useChapterEvents(filters)` - List events
- `useNarrativeEntries(sessionId)` - List narrative
- `useSanityConditions(characterId)` - List conditions
- And more...

**Mutation Hooks (Write):**
- `useCreateGameSession()` - Create session
- `useUpdateGameSession(id)` - Update session
- `useDeleteGameSession()` - Delete session
- `useCreateCharacter()` - Create character
- `useUpdateCharacter(id)` - Update character
- `useDeleteCharacter()` - Delete character
- And more...

**Key Features:**
```typescript
// Hooks return query status
const { data, isLoading, error, isFetching } = useCharacters();

// Mutations have separate isPending state
const createChar = useCreateCharacter();
await createChar.mutateAsync(data); // Returns promise
// Or use mutation.mutate() for fire-and-forget

// Automatic cache invalidation on success
onSuccess: (data) => {
  queryClient.invalidateQueries({
    queryKey: queryKeys.characters(),
  });
}
```

#### Query Key Structure
Organized by resource for proper cache invalidation:
```typescript
queryKeys.characters()                    // All characters
queryKeys.character(id)                   // Specific character
queryKeys.charactersByUser(userId)        // Filter by user
queryKeys.sessions()                      // All sessions
queryKeys.sessionsByGm(gmId)             // Filter by GM
queryKeys.inventory()                     // All inventory
queryKeys.inventoryByCharacter(charId)   // Character inventory
// ... and many more
```

## Installation and Setup

### 1. Dependencies

The frontend already has the required dependencies:

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.60.5",
    "axios": "^1.7.2",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@tanstack/react-query-devtools": "^5.91.2",
    "typescript": "^5.6.3"
  }
}
```

If you need to install them manually:
```bash
cd /srv/workspace/game-plug/apps/frontend
npm install axios
npm install @tanstack/react-query
```

### 2. Environment Configuration

Create a `.env.local` file in the frontend root:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5002

# Optional: Token warning threshold (milliseconds before expiration)
NEXT_PUBLIC_TOKEN_WARNING_TIME=60000

# Optional: API request timeout
NEXT_PUBLIC_API_TIMEOUT=10000

# Optional: Enable debug logging
NEXT_PUBLIC_API_DEBUG=false
```

### 3. Configure React Query Provider

In your Next.js app layout, set up the React Query provider:

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10,   // 10 minutes (formerly cacheTime)
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

## Usage Examples

### Basic Login Flow

```typescript
import { useLogin } from '@/hooks/useApi';
import { userStorage } from '@/api/auth';

function LoginPage() {
  const login = useLogin();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login.mutateAsync({ email, password });
      // Tokens saved, user ready
      const user = userStorage.getUser();
      console.log('Logged in as:', user?.email);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    // ... form JSX
  );
}
```

### Fetching Data with Hooks

```typescript
import { useCharacters, useCharacter } from '@/hooks/useApi';

function CharacterPage({ characterId }: { characterId: string }) {
  const { data: character, isLoading, error } = useCharacter(characterId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{character?.name}</h1>
      <p>Occupation: {character?.occupation}</p>
      <p>HP: {character?.hitPoints} / {character?.maxHitPoints}</p>
    </div>
  );
}
```

### Creating and Updating Data

```typescript
import {
  useCreateCharacter,
  useUpdateCharacter,
  useDeleteCharacter,
} from '@/hooks/useApi';

function CharacterForm({ sessionId }: { sessionId: string }) {
  const createChar = useCreateCharacter();
  const [name, setName] = useState('');
  const [occupation, setOccupation] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newChar = await createChar.mutateAsync({
        sessionId,
        name,
        occupation,
        // ... other required attributes
      });
      console.log('Created:', newChar.id);
    } catch (error) {
      console.error('Failed:', error);
    }
  };

  return (
    <form onSubmit={handleCreate}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={occupation} onChange={(e) => setOccupation(e.target.value)} />
      <button disabled={createChar.isPending}>
        {createChar.isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

## TypeScript Strict Mode

All code uses TypeScript strict mode with no `any` types:

```typescript
// ✓ Correct - Proper typing
const user: User = getUserData();
const result: unknown = someData;
if (typeof result === 'string') {
  // Now TypeScript knows result is string
}

// ✗ Incorrect - No 'any'
const user: any = getUserData(); // Error in strict mode
const data = someData as any;    // Error in strict mode
```

## API Specification

The client is generated from the OpenAPI spec at:
- File: `/srv/workspace/game-plug/apps/backend/openapi.json`
- Live Docs: http://localhost:5002/api/docs (when backend running)

### Available Endpoints

#### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token

#### Game Sessions
- `GET /api/sessions` - List sessions
- `POST /api/sessions` - Create session
- `GET /api/sessions/{id}` - Get session
- `PATCH /api/sessions/{id}` - Update session
- `DELETE /api/sessions/{id}` - Delete session

#### Characters
- `GET /api/characters` - List characters
- `POST /api/characters` - Create character
- `GET /api/characters/{id}` - Get character
- `PATCH /api/characters/{id}` - Update character
- `DELETE /api/characters/{id}` - Delete character

#### Inventory
- `GET /api/inventory?characterId={id}` - List items
- `POST /api/inventory` - Add item
- `PATCH /api/inventory/{id}` - Update item
- `DELETE /api/inventory/{id}` - Delete item

#### And more...
See `/src/api/endpoints.ts` for complete list.

## Error Handling

All errors are properly typed:

```typescript
import { AxiosError } from 'axios';
import { ErrorResponse } from '@/api/types';

function SafeComponent() {
  const { data, error } = useCharacter(id);

  if (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    console.error('Error:', axiosError.response?.data?.message);
  }

  // Also available via hook state
  return error ? <div>Error loading</div> : <div>{data?.name}</div>;
}
```

## Performance Optimization

### Stale Time and Cache Time

Configure React Query behavior:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // 5 minutes before refetch
      gcTime: 1000 * 60 * 10,         // 10 minutes in memory
      retry: 1,                       // Retry once on failure
      retryDelay: 1000,               // 1 second between retries
    },
  },
});
```

### Selective Query Invalidation

Only invalidate affected queries:

```typescript
const createChar = useCreateCharacter();

// Inside mutation onSuccess
onSuccess: (data) => {
  // Only invalidate affected queries
  queryClient.invalidateQueries({
    queryKey: queryKeys.characters(),
  });
  // Don't clear entire cache unnecessarily
}
```

### Pagination and Filtering

Cache is keyed by filters automatically:

```typescript
// These use different cache keys
const { data: allChars } = useCharacters();
const { data: userChars } = useCharacters(userId);

// Each cache independently, no collision
```

## Development Tools

### React Query DevTools

Enable query debugging in development:

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function RootLayout({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### Manual Testing

Use the browser DevTools console to test:

```typescript
// In browser console
import { api } from '@/api';

// Test endpoints directly
const sessions = await api.gameSessions.list();
console.log(sessions);

// Check tokens
import { tokenStorage } from '@/api/auth';
console.log('Token valid:', tokenStorage.hasValidToken());
```

## Next Steps

1. **Implement authentication pages** - Use `useLogin()` and `useSignup()`
2. **Create character management** - Use character hooks
3. **Build game session interface** - Use session and chapter hooks
4. **Add real-time updates** - Consider adding Socket.IO integration
5. **Implement error boundaries** - Catch API errors gracefully

## Troubleshooting

### Tokens Not Persisting

Check that localStorage is accessible:
```typescript
// In browser console
localStorage.getItem('access_token') // Should return token
```

### 401 Errors Still Occurring

Verify refresh token endpoint is working:
```typescript
const { refreshToken } = tokenStorage.getRefreshToken();
const response = await api.auth.refresh({ refreshToken });
```

### Types Not Updating

Ensure TypeScript is recompiled:
```bash
npm run type-check
# or
npx tsc --noEmit
```

### Cache Not Invalidating

Check query keys match:
```typescript
// Make sure queryKey paths match between useQuery and mutations
queryKeys.characters()           // Used in useCharacters
queryKeys.characters()           // Must match in onSuccess
```

## Support

For API documentation:
- OpenAPI Spec: `/srv/workspace/game-plug/apps/backend/openapi.json`
- Swagger UI: http://localhost:5002/api/docs
- API Docs: `src/api/README.md`
- Hook Examples: `src/hooks/USAGE_EXAMPLES.md`
