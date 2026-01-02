# Character Edit Page - Implementation Guide

## Overview

The character edit page allows GMs to modify any aspect of a player character in the Call of Cthulhu RPG system.

## Route

**URL Pattern**: `/gm/{sessionId}/edit-character/{id}`

**File**: `app/app/(authenticated)/gm/[sessionId]/edit-character/[id]/page.tsx`

## Features

### 1. Character Data Form
- **Name** (required, min 2 chars)
- **Occupation** (dropdown with 7e edition occupations)
- **Age** (15-99)
- **Gender** (text field)
- **Birthplace** (text field)
- **Residence** (text field)

### 2. Characteristics System (Call of Cthulhu 7th Edition)
- 9 base characteristics: STR, CON, SIZ, DEX, APP, INT, POW, EDU, CHA
- Values range 1-100
- "Roll All" button: Uses 3d6×5 and (2d6+6)×5 formulas
- "Recalculate Stats" button: Updates derived stats based on characteristics

### 3. Derived Statistics
- **Hit Points**: (CON + SIZ) / 10
- **Sanity**: Based on POW
- **Magic Points**: POW / 5
- Each can be modified independently or auto-calculated

### 4. Skills Management
- **40+ skills** from the core rulebook
- Values: 0-100%
- Shows base value and current value
- GM has free edit access (no occupation-based restrictions)
- Alphabetically sorted by French name

### 5. Resources
- **Money**: Dollar amount (supports decimals)

### 6. Avatar Generation
- AI-generated portrait via DALL-E API
- Optional custom description
- Image preview
- Update on save

## State Management

### Server State (TanStack Query)
```typescript
// Fetch session to verify GM
useQuery({
  queryKey: ['/api/sessions', sessionId],
  enabled: !!sessionId && isAuthenticated,
})

// Fetch character data
useQuery({
  queryKey: ['/api/characters', characterId],
  enabled: !!characterId && isAuthenticated,
})
```

### Form State (React Hook Form)
```typescript
const form = useForm<CharacterEditForm>({
  resolver: zodResolver(characterEditSchema),
  defaultValues: { /* ... */ }
})
```

### Local State
```typescript
const [skillPoints, setSkillPoints] = useState<Record<string, number>>({})
const [avatarUrl, setAvatarUrl] = useState<string>('')
const [avatarDescription, setAvatarDescription] = useState('')
const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false)
```

## API Endpoints

### GET `/api/sessions/:sessionId`
Fetch session data to verify user is GM.

**Returns**: `GameSession` with `gmId` field

### GET `/api/characters/:id`
Fetch character data to populate form.

**Returns**: `Character` with all stats, skills, and avatar URL

### PATCH `/api/characters/:id`
Update character data.

**Request Body**:
```typescript
{
  name: string
  occupation: string
  age: number
  birthplace?: string
  residence?: string
  gender?: string
  strength: number // 1-100
  constitution: number
  size: number
  dexterity: number
  appearance: number
  intelligence: number
  power: number
  education: number
  luck: number
  hitPoints: number
  maxHitPoints: number
  sanity: number
  maxSanity: number
  magicPoints: number
  maxMagicPoints: number
  money?: number
  skills: Record<string, number>
  avatarUrl: string
  skillsLocked: boolean
}
```

**Response**: Updated character data

### POST `/api/generate-avatar`
Generate AI portrait.

**Request Body**:
```typescript
{
  description: string
  characterName: string
  occupation: string
  age: number
}
```

**Response**:
```typescript
{
  avatarUrl: string
}
```

## Validation Rules

### Form Validation (Zod Schema)

```typescript
const characterEditSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  occupation: z.string().min(1, 'Veuillez sélectionner une occupation'),
  age: z.coerce.number()
    .min(15, "L'âge minimum est 15 ans")
    .max(99, "L'âge maximum est 99 ans"),
  // ... other fields with min/max constraints
})
```

### Business Rules
- **GM Only**: User must be GM of the session
- **Authenticated**: User must be logged in
- **Character Exists**: Character must exist in database
- **Skill Limits**: Skills capped at 0-100%
- **Characteristic Limits**: Characteristics capped at 1-100

## Access Control

### Authentication Check
```typescript
useEffect(() => {
  if (!authLoading && !isAuthenticated) {
    // Redirect to login
    window.location.href = '/api/login'
  }
}, [isAuthenticated, authLoading])
```

### Authorization Check (GM Verification)
```typescript
const isGM = session && user && typeof user === 'object' &&
  user !== null && 'id' in user &&
  session.gmId === (user as any).id

if (!isGM) {
  // Show access denied message
  return <AccessDeniedUI />
}
```

## Game Mechanics

### Characteristics Rolling
Uses Call of Cthulhu 7e rules:
- **Standard stats** (STR, CON, DEX, APP, POW, CHA): 3d6 × 5
- **INT, SIZ, EDU**: (2d6 + 6) × 5

### Derived Stats Calculation
```typescript
function calculateDerivedStats(characteristics: CharacterStats) {
  const { strength, constitution, size, power, dexterity } = characteristics

  const hitPoints = Math.floor((constitution + size) / 10)
  const sanity = power
  const magicPoints = Math.floor(power / 5)

  // Damage bonus and build from STR + SIZ
  // Movement from STR, DEX, SIZ comparison

  return { hitPoints, sanity, magicPoints, damageBonus, build, movement }
}
```

### Skills System
- 40+ predefined skills with French translations
- Each skill has a base value (occupation-dependent)
- GM can freely modify any skill value (0-100%)
- Skills are saved with character

## UI Components

### Cards
- **Basic Information**: Name, occupation, age, gender, birthplace, residence
- **Characteristics**: All 9 base stats with roll/recalculate buttons
- **Derived Stats**: HP, Sanity, Magic Points
- **Resources**: Money
- **Skills**: Editable skill grid
- **Avatar**: Portrait display and generation

### Forms
- React Hook Form integration
- Zod validation
- Form-level and field-level error messages
- Automatic error clearing on input

### Buttons
- **Roll All**: Re-roll all characteristics
- **Recalculate Stats**: Update derived stats
- **Generate Avatar**: Call AI generation
- **Save**: Submit form (PATCH request)
- **Cancel**: Return to dashboard

## Navigation

### On Success
```typescript
router.push(`/gm/${sessionId}`)
```

### On Error
- If unauthorized: Redirect to `/api/login`
- If API error: Show toast notification
- If character not found: Show error message and return button

## Error Handling

### Authorization Errors (401)
```typescript
if (isUnauthorizedError(error)) {
  // Show unauthorized message
  // Redirect to login after delay
}
```

### API Errors
```typescript
onError: (error: Error) => {
  toast({
    title: 'Erreur',
    description: 'Impossible de modifier le personnage.',
    variant: 'destructive',
  })
}
```

## Toast Notifications

- **Success**: "Personnage modifié" - Modifications saved successfully
- **Error (General)**: "Impossible de modifier le personnage"
- **Error (Avatar)**: "Impossible de générer le portrait..."
- **Error (Auth)**: "Non autorisé" - Session expired

## Styling

### Theme Colors
- **Primary**: aged-gold (#D4AF37)
- **Background**: deep-black, charcoal, cosmic-void
- **Text**: bone-white, aged-parchment
- **Accent**: blood-burgundy, eldritch-green

### Classes
- `font-cinzel`: Titles
- `font-source`: Body text
- `parchment-bg`: Card backgrounds
- `glow-text`: Golden glow effect
- `glass-card`: Glass morphism for navigation

## Responsive Design

- **Mobile**: Single column layout, touch-friendly buttons
- **Tablet**: 2-column grid for some sections
- **Desktop**: 3-column grid for characteristics and skills

## Dependencies

### Packages
- `react-hook-form`: Form state management
- `@hookform/resolvers`: Zod resolver
- `zod`: Schema validation
- `@tanstack/react-query`: Server state management
- `lucide-react`: Icons
- `tailwindcss`: Styling
- `radix-ui`: Accessible UI primitives
- `shadcn/ui`: Pre-built components

### Custom Utilities
- `dice.ts`: Character stat calculations
- `cthulhu-data.ts`: Game data (occupations, skills)
- `authUtils.ts`: Authentication utilities
- `queryClient.ts`: TanStack Query setup

## Testing Considerations

1. **GM Access**: Verify non-GMs cannot edit
2. **Authentication**: Verify non-authenticated users redirect to login
3. **Form Validation**: Test all field validation rules
4. **Characteristics**: Verify roll formulas work correctly
5. **Derived Stats**: Verify recalculation is accurate
6. **Skills**: Verify all 40+ skills load and save
7. **Avatar**: Test with and without custom descriptions
8. **Error Handling**: Test API failures, timeouts, unauthorized responses
9. **Navigation**: Verify successful save redirects to GM dashboard
10. **State**: Verify form doesn't lose data on page interactions

## Future Enhancements

- [ ] Batch character updates for multiple characters
- [ ] Character import/export
- [ ] History/changelog of character modifications
- [ ] Comparison view (current vs. edited)
- [ ] Template-based character creation
- [ ] Custom skill categories
- [ ] Character sheet PDF export
- [ ] Real-time collaboration (multi-GM editing)

---

**Version**: 1.0.0
**Status**: Production Ready
**Last Updated**: 2025-12-29
