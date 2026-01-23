# API Usage Examples

This document provides practical examples for using the Game Plug API.

## Table of Contents

1. [Authentication Examples](#authentication)
2. [Character Management](#characters)
3. [Game Sessions](#sessions)
4. [Inventory](#inventory)
5. [Chapters & Events](#chapters)
6. [Dice Rolling](#dice)

---

## Authentication

### 1. User Registration (Signup)

Register a new Game Master account.

```bash
curl -X POST http://localhost:5002/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "gm@example.com",
    "password": "SecurePassword123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Response (201 Created):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "gm@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isGM": true,
    "createdAt": "2026-01-23T10:00:00Z",
    "updatedAt": "2026-01-23T10:00:00Z"
  }
}
```

### 2. User Login

Authenticate with email and password.

```bash
curl -X POST http://localhost:5002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "gm@example.com",
    "password": "SecurePassword123"
  }'
```

### 3. Refresh Token

Get a new access token using a refresh token.

```bash
curl -X POST http://localhost:5002/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

---

## Characters

All character endpoints require JWT authentication in the `Authorization` header.

### 4. Create a Character

Create a new player character.

```bash
curl -X POST http://localhost:5002/api/characters \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "sessionId": "550e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Elara Shadowmere",
    "occupation": "Private Investigator",
    "age": 32,
    "birthplace": "Boston, Massachusetts",
    "residence": "New York City",
    "gender": "Female",
    "height": "5ft 7in",
    "build": "Athletic",
    "hairColor": "Black",
    "eyeColor": "Blue",
    "strength": 65,
    "constitution": 70,
    "size": 70,
    "dexterity": 75,
    "appearance": 60,
    "intelligence": 80,
    "power": 55,
    "education": 75,
    "luck": 50,
    "skills": {
      "investigation": 70,
      "psychology": 65,
      "firearms": 60,
      "library_use": 75,
      "dodge": 55
    },
    "notes": "Experienced investigator with connections in the underworld"
  }'
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "sessionId": "550e8400-e29b-41d4-a716-446655440001",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Elara Shadowmere",
  "occupation": "Private Investigator",
  "strength": 65,
  "constitution": 70,
  "size": 70,
  "dexterity": 75,
  "appearance": 60,
  "intelligence": 80,
  "power": 55,
  "education": 75,
  "luck": 50,
  "hitPoints": 72,
  "maxHitPoints": 72,
  "sanity": 75,
  "maxSanity": 75,
  "magicPoints": 27,
  "maxMagicPoints": 27,
  "skills": {
    "investigation": 70,
    "psychology": 65,
    "firearms": 60,
    "library_use": 75,
    "dodge": 55
  },
  "skillsLocked": false,
  "availableSkillPoints": 0,
  "createdAt": "2026-01-23T10:05:00Z",
  "updatedAt": "2026-01-23T10:05:00Z"
}
```

### 5. List All Characters

Get all characters for the current user.

```bash
curl -X GET "http://localhost:5002/api/characters?userId=550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 6. Get a Specific Character

Retrieve a character by ID.

```bash
curl -X GET http://localhost:5002/api/characters/550e8400-e29b-41d4-a716-446655440002 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 7. Update Character

Update character attributes (e.g., after damage).

```bash
curl -X PATCH http://localhost:5002/api/characters/550e8400-e29b-41d4-a716-446655440002 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "hitPoints": 65,
    "sanity": 68,
    "magicPoints": 20,
    "skills": {
      "investigation": 75,
      "psychology": 65,
      "firearms": 60,
      "library_use": 75,
      "dodge": 55
    }
  }'
```

### 8. Delete Character

Remove a character from the game.

```bash
curl -X DELETE http://localhost:5002/api/characters/550e8400-e29b-41d4-a716-446655440002 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Sessions

### 9. Create a Game Session

Start a new game session.

```bash
curl -X POST http://localhost:5002/api/sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "The Shadow Over Innsmouth",
    "gmId": "550e8400-e29b-41d4-a716-446655440000",
    "code": "ABC123"
  }'
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "name": "The Shadow Over Innsmouth",
  "code": "ABC123",
  "gmId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "preparation",
  "isActive": true,
  "createdAt": "2026-01-23T10:00:00Z",
  "updatedAt": "2026-01-23T10:00:00Z"
}
```

### 10. List Sessions

Get all sessions for a Game Master.

```bash
curl -X GET "http://localhost:5002/api/sessions?gmId=550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 11. Start Session

Update session status to "active".

```bash
curl -X PATCH http://localhost:5002/api/sessions/550e8400-e29b-41d4-a716-446655440001 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "status": "active"
  }'
```

---

## Inventory

### 12. Add Item to Character Inventory

```bash
curl -X POST http://localhost:5002/api/inventory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "characterId": "550e8400-e29b-41d4-a716-446655440002",
    "name": ".38 Revolver",
    "description": "Standard police-issue revolver",
    "category": "weapon",
    "quantity": 1,
    "weight": 2,
    "damage": "1d8",
    "isEquipped": true,
    "properties": {
      "ammunition": ".38 Special",
      "range": "15 yards"
    }
  }'
```

### 13. List Character Inventory

```bash
curl -X GET "http://localhost:5002/api/inventory?characterId=550e8400-e29b-41d4-a716-446655440002" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 14. Update Inventory Item

Update item quantity or equipped status.

```bash
curl -X PATCH http://localhost:5002/api/inventory/550e8400-e29b-41d4-a716-446655440003 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "quantity": 12,
    "isEquipped": false
  }'
```

---

## Chapters

### 15. Create a Chapter

```bash
curl -X POST http://localhost:5002/api/chapters \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "sessionId": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Chapter 1: Whispers in the Dark",
    "description": "The investigators arrive in Innsmouth...",
    "orderIndex": 1,
    "notes": "Set atmosphere with coastal horror elements"
  }'
```

### 16. List Session Chapters

```bash
curl -X GET "http://localhost:5002/api/chapters?sessionId=550e8400-e29b-41d4-a716-446655440001" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 17. Log Chapter Event

Record what happens in a chapter.

```bash
curl -X POST http://localhost:5002/api/chapter-events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "chapterId": "550e8400-e29b-41d4-a716-446655440004",
    "sessionId": "550e8400-e29b-41d4-a716-446655440001",
    "eventType": "sanity",
    "title": "Witness Horrifying Discovery",
    "description": "Elara witnesses the unholy ritual at midnight",
    "characterId": "550e8400-e29b-41d4-a716-446655440002",
    "metadata": {
      "sanityLoss": 1,
      "outcome": "temporary_insanity"
    },
    "isImportant": true
  }'
```

---

## Dice Rolling

### 18. Roll Dice

Execute a dice roll with skill check.

```bash
curl -X POST http://localhost:5002/api/dice/roll \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "diceFormula": "1d100",
    "rollType": "skill",
    "skillName": "investigation",
    "skillValue": 70,
    "characterId": "550e8400-e29b-41d4-a716-446655440002",
    "sessionId": "550e8400-e29b-41d4-a716-446655440001"
  }'
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440005",
  "diceFormula": "1d100",
  "result": 45,
  "outcome": "hard_success",
  "rollType": "skill",
  "skillName": "investigation",
  "skillValue": 70,
  "characterId": "550e8400-e29b-41d4-a716-446655440002",
  "sessionId": "550e8400-e29b-41d4-a716-446655440001",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "isGmRoll": false,
  "createdAt": "2026-01-23T10:30:00Z"
}
```

---

## Sanity Conditions

### 19. Add Sanity Condition

Assign a mental condition to a character.

```bash
curl -X POST http://localhost:5002/api/sanity \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "characterId": "550e8400-e29b-41d4-a716-446655440002",
    "type": "phobia",
    "name": "Fear of the Deep",
    "description": "Irrational fear of water and aquatic creatures",
    "duration": "indefinite"
  }'
```

### 20. Get Character Sanity Conditions

```bash
curl -X GET "http://localhost:5002/api/sanity?characterId=550e8400-e29b-41d4-a716-446655440002" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Narrative Entries

### 21. Create Narrative Entry

Record a GM note or story development.

```bash
curl -X POST http://localhost:5002/api/narrative \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "sessionId": "550e8400-e29b-41d4-a716-446655440001",
    "gmId": "550e8400-e29b-41d4-a716-446655440000",
    "content": "The Deep Ones have been watching the town for centuries. The investigators must discover the truth before the ritual is completed.",
    "entryType": "event",
    "metadata": {
      "relatedCharacters": ["550e8400-e29b-41d4-a716-446655440002"],
      "importance": "high"
    }
  }'
```

---

## Error Handling Examples

### Authentication Error (401)

```bash
curl -X GET http://localhost:5002/api/characters \
  -H "Authorization: Bearer INVALID_TOKEN"
```

**Response (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Invalid token"
}
```

### Resource Not Found (404)

```bash
curl -X GET http://localhost:5002/api/characters/550e8400-invalid-id \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "Character not found",
  "error": "NotFound"
}
```

### Validation Error (400)

```bash
curl -X POST http://localhost:5002/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "short"
  }'
```

**Response (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Email must be valid, password must be at least 8 characters"
}
```

---

## Tips & Best Practices

### 1. Token Management

Always include the Bearer token in the Authorization header for protected endpoints:

```bash
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 2. Query Parameters

Use query parameters for filtering and limiting results:

```bash
# Filter characters by user
GET /api/characters?userId=<uuid>

# Filter sessions by GM
GET /api/sessions?gmId=<uuid>

# Filter events by chapter or session
GET /api/chapter-events?chapterId=<uuid>&sessionId=<uuid>
```

### 3. Batch Operations

For multiple related operations, organize them logically:

```bash
# Create session
# Create chapter
# Create characters
# Create inventory for each character
# Start session
```

### 4. Error Handling

Always check response status codes:

- 2xx: Success
- 4xx: Client error (fix your request)
- 5xx: Server error (retry later)

### 5. Data Validation

The API validates:

- Email format for signup/login
- UUID format for all IDs
- Attribute ranges (1-99) for character stats
- Required fields in request bodies

---

## Integration Examples

### JavaScript/TypeScript

```typescript
const API_URL = 'http://localhost:5002';

async function createCharacter(accessToken: string, characterData: any) {
  const response = await fetch(`${API_URL}/api/characters`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(characterData)
  });
  
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
```

### Python

```python
import requests

headers = {
    'Authorization': f'Bearer {access_token}',
    'Content-Type': 'application/json'
}

response = requests.post(
    'http://localhost:5002/api/characters',
    headers=headers,
    json=character_data
)

if response.status_code == 201:
    print(response.json())
else:
    print(f"Error: {response.status_code}")
```

---

For more details, see the complete OpenAPI specification in `openapi.json`.
