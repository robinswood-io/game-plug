# OpenAPI 3.0 Documentation

## Overview

This directory contains a complete OpenAPI 3.0 specification for the Game Plug API, a comprehensive tabletop RPG management system.

**File**: `openapi.json`

## Quick Facts

- **Format**: OpenAPI 3.0.0 (JSON)
- **Total Endpoints**: 37
- **Total Schemas**: 30
- **Authentication**: JWT Bearer Token
- **Development Server**: http://localhost:5002
- **Production Server**: https://api.game-plug.dev

## API Structure

### Endpoint Categories

The API is organized into 9 main categories:

1. **Authentication** (3 endpoints) - User signup, login, and token refresh
2. **Health** (1 endpoint) - API health check
3. **Characters** (5 endpoints) - Player character management
4. **Sessions** (5 endpoints) - Game session management
5. **Inventory** (4 endpoints) - Character inventory items
6. **Chapters** (5 endpoints) - Game chapter organization
7. **Chapter Events** (5 endpoints) - Event logging within chapters
8. **Narrative** (4 endpoints) - GM narrative entries and notes
9. **Sanity** (4 endpoints) - Character mental health conditions
10. **Dice** (1 endpoint) - Dice rolling mechanics

## Complete Endpoint List

### Authentication
- `POST /api/auth/signup` - Register a new Game Master account
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/refresh` - Refresh JWT access token

### Health
- `GET /api/health` - Health check (no authentication required)

### Characters (CRUD)
- `GET /api/characters` - List all characters (query: userId)
- `GET /api/characters/{id}` - Get a specific character
- `POST /api/characters` - Create a new character
- `PATCH /api/characters/{id}` - Update character attributes
- `DELETE /api/characters/{id}` - Delete a character

### Sessions (CRUD)
- `GET /api/sessions` - List all sessions (query: gmId)
- `GET /api/sessions/{id}` - Get a specific session
- `POST /api/sessions` - Create a new game session
- `PATCH /api/sessions/{id}` - Update session properties
- `DELETE /api/sessions/{id}` - Delete a session

### Inventory (CRU/D)
- `GET /api/inventory` - List inventory items (query: characterId)
- `POST /api/inventory` - Add an item to inventory
- `PATCH /api/inventory/{id}` - Update inventory item
- `DELETE /api/inventory/{id}` - Remove item from inventory

### Chapters (CRUD)
- `GET /api/chapters` - List chapters (query: sessionId)
- `GET /api/chapters/{id}` - Get a specific chapter
- `POST /api/chapters` - Create a new chapter
- `PATCH /api/chapters/{id}` - Update chapter
- `DELETE /api/chapters/{id}` - Delete a chapter

### Chapter Events (CRUD)
- `GET /api/chapter-events` - List events (query: chapterId, sessionId)
- `GET /api/chapter-events/{id}` - Get a specific event
- `POST /api/chapter-events` - Log a new event
- `PATCH /api/chapter-events/{id}` - Update an event
- `DELETE /api/chapter-events/{id}` - Delete an event

### Narrative (CRU/D)
- `GET /api/narrative` - List entries (query: sessionId)
- `POST /api/narrative` - Create a narrative entry
- `PATCH /api/narrative/{id}` - Update narrative entry
- `DELETE /api/narrative/{id}` - Delete narrative entry

### Sanity (CRU/D)
- `GET /api/sanity` - List conditions (query: characterId)
- `POST /api/sanity` - Add a sanity condition
- `PATCH /api/sanity/{id}` - Update condition
- `DELETE /api/sanity/{id}` - Delete condition

### Dice
- `POST /api/dice/roll` - Execute a dice roll

## Security

All endpoints except the following require JWT Bearer authentication:
- `GET /api/health`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/refresh`

### Authentication Header Format

```
Authorization: Bearer <JWT_TOKEN>
```

## Data Types & Validation

### Common Formats
- **UUID**: All resource IDs are UUIDs (uuid format)
- **DateTime**: ISO 8601 format (date-time)
- **Email**: RFC 5322 format (email)
- **Money**: Decimal with 2 decimal places (e.g., "99.99")
- **URI**: For URLs (uri format)

### Character Attributes
- Attributes range from 1-99
- Includes: STR, CON, SIZE, DEX, APP, INT, POW, EDU, LUCK
- Hit Points, Sanity, and Magic Points derived from attributes

### Enums

#### Character Status
- `preparation` - Session in setup
- `active` - Session ongoing
- `ended` - Session concluded

#### Event Types
- `roll` - Dice roll event
- `narration` - Story narration
- `decision` - Character decision
- `sanity` - Sanity check result
- `combat` - Combat action
- `discovery` - Discovery event
- `milestone` - Campaign milestone

#### Inventory Categories
- `weapon` - Combat weapons
- `armor` - Protective gear
- `tool` - Tools and equipment
- `book` - Books and documents
- `misc` - Miscellaneous items

#### Sanity Types
- `phobia` - Acquired phobia
- `mania` - Acquired mania
- `temporary_insanity` - Temporary insanity
- `indefinite_insanity` - Long-term insanity

## Response Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid JWT |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 503 | Service Unavailable - Server error |

## Key Schemas

### User
Complete user profile with authentication metadata

### GameSession
Complete game session with status, code, and GM info

### Character
Complete character sheet with attributes, skills, and derived stats

### InventoryItem
Item with category, properties, and equipment status

### Chapter
Story chapter with ordering and status

### ChapterEvent
Timestamped event with type and metadata

### NarrativeEntry
GM's narrative note with type and metadata

### SanityCondition
Mental condition with type and duration

### DiceRoll
Dice roll result with formula and outcome

## How to Use This Specification

### For Developers

1. **Generate Client Code**: Use OpenAPI code generators (openapi-generator, swagger-codegen)
2. **Type Generation**: Generate TypeScript interfaces from schemas
3. **Validation**: Use schemas to validate requests/responses

### For API Consumers

1. **Swagger UI**: View interactive documentation at `/api-docs` (when configured)
2. **API Testing**: Import into Postman, Insomnia, or Thunder Client
3. **Client Libraries**: Generate official SDK from spec

### For API Providers

1. **Server Stubs**: Generate NestJS controller stubs
2. **Mock Server**: Create mock API for testing
3. **API Monitoring**: Use for API analytics and rate limiting

## Integration

To integrate this spec with your NestJS backend:

```typescript
// In main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Game Plug API')
  .setDescription('Tabletop RPG Management System')
  .setVersion('1.0.0')
  .addBearerAuth()
  .addServer('http://localhost:5002', 'Development')
  .addServer('https://api.game-plug.dev', 'Production')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api-docs', app, document);
```

## Tools

### Online Viewers
- [Swagger Editor](https://editor.swagger.io/) - Paste spec URL
- [Redoc](https://redoc.ly/) - Beautiful documentation viewer
- [Stoplight](https://stoplight.io/) - Collaborative API design

### Desktop Tools
- **Postman** - Import spec and test endpoints
- **Insomnia** - REST client with OpenAPI support
- **Thunder Client** - VS Code extension for API testing
- **API Bear** - Cross-platform API tool

### Code Generation
- `openapi-generator` - Generate SDKs in 50+ languages
- `swagger-codegen` - Generate server/client code
- `OpenAPI TypeScript** - Generate TypeScript types

## Validation Status

✓ Valid OpenAPI 3.0.0 specification
✓ All 37 endpoints documented
✓ All 30 schemas defined
✓ All required fields specified
✓ Security schemes configured
✓ Response codes for all endpoints
✓ JSON validation passed

## Maintenance

This specification should be updated when:
1. New endpoints are added
2. Existing endpoints are modified
3. Response schemas change
4. Security requirements change
5. Servers are added/removed

### Version History
- **1.0.0** - Initial complete specification covering all 37 endpoints

## Questions?

Refer to the inline descriptions in the OpenAPI spec for detailed parameter and schema documentation.

---

**Last Updated**: January 23, 2026
**Specification Format**: OpenAPI 3.0.0 (JSON)
**License**: MIT
