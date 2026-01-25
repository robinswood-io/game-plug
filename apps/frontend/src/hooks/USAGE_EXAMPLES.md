# React Hooks Usage Examples

This document provides practical examples of how to use the API hooks in React components.

## Basic Usage Pattern

All hooks follow this pattern:

```typescript
import { useCharacters } from '@/hooks/useApi';

function MyComponent() {
  const { data, isLoading, error } = useCharacters(userId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.map(character => (
        <div key={character.id}>{character.name}</div>
      ))}
    </div>
  );
}
```

## Query Hooks (Read Operations)

### List Operations

```typescript
// List all game sessions (optionally filtered by GM)
const { data: sessions } = useGameSessions();
const { data: myGameSessions } = useGameSessions(gmId);

// List all characters (optionally filtered by user)
const { data: characters } = useCharacters();
const { data: myCharacters } = useCharacters(userId);

// List inventory items for a character
const { data: items } = useInventory(characterId);

// List chapters in a session
const { data: chapters } = useChapters(sessionId);

// List chapter events
const { data: events } = useChapterEvents({ chapterId: 'chapter-1' });
const { data: sessionEvents } = useChapterEvents({ sessionId: 'session-1' });

// List narrative entries
const { data: narratives } = useNarrativeEntries(sessionId);

// List sanity conditions for a character
const { data: conditions } = useSanityConditions(characterId);
```

### Get Single Item

```typescript
// Get specific game session
const { data: session, isLoading } = useGameSession(sessionId);

// Get specific character
const { data: character, error } = useCharacter(characterId);

// Get specific chapter
const { data: chapter } = useChapter(chapterId);
```

## Mutation Hooks (Write Operations)

### Create Operations

```typescript
import { useCreateCharacter } from '@/hooks/useApi';

function CreateCharacterForm() {
  const createCharacter = useCreateCharacter();

  const handleSubmit = async (formData: CreateCharacterRequest) => {
    try {
      const newCharacter = await createCharacter.mutateAsync(formData);
      console.log('Character created:', newCharacter.id);
    } catch (error) {
      console.error('Failed to create:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields... */}
      <button disabled={createCharacter.isPending}>
        {createCharacter.isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

### Update Operations

```typescript
import { useUpdateCharacter } from '@/hooks/useApi';

function EditCharacterForm({ characterId }: { characterId: string }) {
  const updateCharacter = useUpdateCharacter(characterId);

  const handleSubmit = async (updates: UpdateCharacterRequest) => {
    try {
      const updated = await updateCharacter.mutateAsync(updates);
      console.log('Updated character:', updated);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  if (updateCharacter.isSuccess) {
    return <div>Character updated successfully!</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Update form fields... */}
      {updateCharacter.error && <p className="error">{updateCharacter.error.message}</p>}
      <button disabled={updateCharacter.isPending}>
        {updateCharacter.isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

### Delete Operations

```typescript
import { useDeleteCharacter } from '@/hooks/useApi';

function CharacterCard({ characterId, characterName }: { characterId: string; characterName: string }) {
  const deleteCharacter = useDeleteCharacter();

  const handleDelete = async () => {
    if (window.confirm(`Delete ${characterName}?`)) {
      try {
        await deleteCharacter.mutateAsync(characterId);
        console.log('Character deleted');
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  return (
    <div>
      <h3>{characterName}</h3>
      <button onClick={handleDelete} disabled={deleteCharacter.isPending}>
        {deleteCharacter.isPending ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
}
```

## Authentication Hooks

### Login and Signup

```typescript
import { useLogin, useLogout } from '@/hooks/useApi';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login.mutateAsync({ email, password });
      // Tokens are automatically saved, redirect happens elsewhere
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button disabled={login.isPending}>
        {login.isPending ? 'Logging in...' : 'Login'}
      </button>
      {login.error && <p className="error">{login.error.message}</p>}
    </form>
  );
}

function LogoutButton() {
  const logout = useLogout();

  return <button onClick={logout}>Logout</button>;
}
```

## Complex Examples

### Character Management Dashboard

```typescript
import { useCharacters, useDeleteCharacter, useUpdateCharacter } from '@/hooks/useApi';

function CharacterDashboard() {
  const { data: characters, isLoading } = useCharacters();
  const deleteCharacter = useDeleteCharacter();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (isLoading) return <div>Loading characters...</div>;

  return (
    <div>
      <h2>Characters ({characters?.length})</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Occupation</th>
            <th>Hit Points</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {characters?.map((char) => (
            <tr key={char.id}>
              <td>{char.name}</td>
              <td>{char.occupation}</td>
              <td>{char.hitPoints} / {char.maxHitPoints}</td>
              <td>
                <button onClick={() => setSelectedId(char.id)}>Edit</button>
                <button
                  onClick={() => deleteCharacter.mutate(char.id)}
                  disabled={deleteCharacter.isPending}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedId && (
        <CharacterEditor
          characterId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}

function CharacterEditor({
  characterId,
  onClose,
}: {
  characterId: string;
  onClose: () => void;
}) {
  const { data: character } = useCharacter(characterId);
  const updateCharacter = useUpdateCharacter(characterId);
  const [hitPoints, setHitPoints] = useState(0);

  useEffect(() => {
    if (character) setHitPoints(character.hitPoints);
  }, [character]);

  if (!character) return <div>Loading...</div>;

  const handleSave = async () => {
    await updateCharacter.mutateAsync({ hitPoints });
    onClose();
  };

  return (
    <div className="modal">
      <h3>Edit {character.name}</h3>
      <div>
        <label>
          Hit Points:
          <input
            type="number"
            value={hitPoints}
            onChange={(e) => setHitPoints(Number(e.target.value))}
          />
          / {character.maxHitPoints}
        </label>
      </div>
      <button onClick={handleSave} disabled={updateCharacter.isPending}>
        Save
      </button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}
```

### Game Session with Characters

```typescript
import { useGameSession, useCharacters, useCreateCharacter } from '@/hooks/useApi';

function GameSessionView({ sessionId }: { sessionId: string }) {
  const { data: session } = useGameSession(sessionId);
  const { data: characters } = useCharacters();
  const sessionCharacters = characters?.filter((c) => c.sessionId === sessionId) || [];

  return (
    <div>
      <h2>{session?.name}</h2>
      <p>Status: {session?.status}</p>
      <p>Join Code: {session?.code}</p>

      <h3>Characters in Session ({sessionCharacters.length})</h3>
      <ul>
        {sessionCharacters.map((char) => (
          <li key={char.id}>
            <strong>{char.name}</strong> - {char.occupation}
            <p>
              HP: {char.hitPoints}/{char.maxHitPoints} | Sanity:{' '}
              {char.sanity}/{char.maxSanity}
            </p>
          </li>
        ))}
      </ul>

      <AddCharacterForm sessionId={sessionId} />
    </div>
  );
}

function AddCharacterForm({ sessionId }: { sessionId: string }) {
  const createCharacter = useCreateCharacter();
  const [showForm, setShowForm] = useState(false);

  const handleCreate = async (formData: CreateCharacterRequest) => {
    await createCharacter.mutateAsync({
      ...formData,
      sessionId,
    });
    setShowForm(false);
  };

  if (!showForm) {
    return (
      <button onClick={() => setShowForm(true)}>Add Character</button>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // Get form data and call handleCreate
      }}
    >
      {/* Form fields... */}
      <button type="submit" disabled={createCharacter.isPending}>
        Create
      </button>
    </form>
  );
}
```

### Real-time Dice Roller

```typescript
import { useDiceRoll } from '@/hooks/useApi';

function DiceRoller() {
  const roll = useDiceRoll();
  const [history, setHistory] = useState<DiceRollResponse[]>([]);

  const handleRoll = async (formula: string) => {
    try {
      const result = await roll.mutateAsync({
        diceFormula: formula,
        rollType: 'custom',
      });
      setHistory((prev) => [result, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error('Roll failed:', error);
    }
  };

  return (
    <div className="dice-roller">
      <h3>Dice Roller</h3>
      <div className="buttons">
        <button onClick={() => handleRoll('1d20')}>d20</button>
        <button onClick={() => handleRoll('2d6')}>2d6</button>
        <button onClick={() => handleRoll('1d100')}>d100</button>
      </div>

      {roll.data && (
        <div className="result">
          <h4>Result: {roll.data.result}</h4>
          <p>Formula: {roll.data.diceFormula}</p>
        </div>
      )}

      <h4>History</h4>
      <ul>
        {history.map((r, i) => (
          <li key={i}>
            {r.diceFormula} = {r.result}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Inventory Management

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
  const updateItem = useUpdateInventoryItem('', characterId);
  const deleteItem = useDeleteInventoryItem(characterId);

  return (
    <div>
      <h3>Inventory</h3>
      <div className="inventory-items">
        {items?.map((item) => (
          <InventoryItemCard
            key={item.id}
            item={item}
            onUpdate={(updates) => updateItem.mutate(updates)}
            onDelete={() => deleteItem.mutate(item.id)}
          />
        ))}
      </div>

      <AddItemForm
        characterId={characterId}
        onAdd={(data) => addItem.mutate(data)}
      />
    </div>
  );
}

function InventoryItemCard({
  item,
  onUpdate,
  onDelete,
}: {
  item: InventoryItem;
  onUpdate: (updates: UpdateInventoryItemRequest) => void;
  onDelete: () => void;
}) {
  const [quantity, setQuantity] = useState(item.quantity || 1);

  return (
    <div className="inventory-item">
      <h4>{item.name}</h4>
      <p>{item.description}</p>
      <p>Category: {item.category}</p>

      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />
      <button onClick={() => onUpdate({ quantity })}>Update Qty</button>

      <label>
        <input
          type="checkbox"
          checked={item.isEquipped}
          onChange={(e) => onUpdate({ isEquipped: e.target.checked })}
        />
        Equipped
      </label>

      <button onClick={onDelete} className="btn-danger">
        Delete
      </button>
    </div>
  );
}
```

## Performance Tips

1. **Use proper dependencies**: Always specify dependencies correctly to avoid unnecessary re-renders.

```typescript
// Good: Dependencies listed
useEffect(() => {
  // Logic
}, [characterId, sessionId]);

// Avoid: Missing dependencies
useEffect(() => {
  // Logic
}, []); // Missing characterId, sessionId
```

2. **Cache at the right level**: React Query caches by query key, so the same data won't be fetched twice.

```typescript
// Both components will share the same cached data
function Component1() {
  const { data } = useCharacters(userId);
}

function Component2() {
  const { data } = useCharacters(userId); // Same cache key
}
```

3. **Invalidate strategically**: Only invalidate queries that changed.

```typescript
// Good: Invalidate only affected queries
onSuccess: (data) => {
  queryClient.invalidateQueries({
    queryKey: queryKeys.charactersByUser(userId),
  });
}

// Avoid: Clearing entire cache
queryClient.clear();
```

## Error Handling Best Practices

```typescript
function SafeCharacterList({ userId }: { userId: string }) {
  const {
    data: characters,
    isLoading,
    error,
    isFetching,
  } = useCharacters(userId);

  if (isLoading) {
    return <div>Loading characters...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <h3>Failed to load characters</h3>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      {isFetching && <p>Syncing...</p>}
      {characters?.map((char) => (
        <div key={char.id}>{char.name}</div>
      ))}
      {characters?.length === 0 && <p>No characters found</p>}
    </div>
  );
}
```
