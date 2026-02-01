# System Configuration (US-5.4.1)

## Overview

The System Configuration module provides admin panel functionality to manage application-wide settings and feature toggles without code changes.

## Features

- Create, read, update, and delete system configurations
- Redis caching with automatic invalidation on updates
- JSON support for complex configuration values
- Audit trail with `updatedBy` tracking
- Admin UI for easy configuration management
- Default configurations initialization on app startup

## Backend Implementation

### Database Schema

```sql
CREATE TABLE system_config (
  key VARCHAR PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_by VARCHAR REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT now(),
  INDEX ON updated_at
);
```

### Service: AdminConfigService

**Location:** `/srv/workspace/game-plug/apps/backend/src/modules/admin-config/admin-config.service.ts`

#### Methods

- `get(key: string)`: Get a config by key (with caching)
- `getAll()`: Get all configs (with caching)
- `set(key, value, description?, updatedBy?)`: Create or update a config
- `delete(key)`: Delete a config
- `initializeDefaults()`: Initialize default configs on startup

#### Cache Strategy

- **Cache Key Format:** `system_config:{key}` for individual configs, `system_config:all` for all
- **TTL:** 1 hour (3600000ms)
- **Invalidation:** On `set()` or `delete()`, both individual and all-configs caches are invalidated

### API Endpoints

All endpoints require JWT authentication via `@UseGuards(AuthGuard('jwt'))`.

#### GET /api/admin/config
Get all system configurations.

**Response:**
```json
[
  {
    "key": "api.timeout",
    "value": 30000,
    "description": "API request timeout in milliseconds",
    "updatedBy": "user-id",
    "updatedAt": "2026-01-31T12:00:00Z"
  }
]
```

#### GET /api/admin/config/:key
Get a specific configuration by key.

**Response:**
```json
{
  "key": "api.timeout",
  "value": 30000,
  "description": "API request timeout in milliseconds",
  "updatedBy": "user-id",
  "updatedAt": "2026-01-31T12:00:00Z"
}
```

#### PATCH /api/admin/config/:key
Update a configuration value.

**Request Body:**
```json
{
  "value": 35000,
  "description": "Updated timeout"
}
```

**Response:** Updated config object

#### DELETE /api/admin/config/:key
Delete a configuration.

**Response:**
```json
{
  "success": true
}
```

## Frontend Implementation

### Pages

#### Admin Dashboard
**Location:** `/srv/workspace/game-plug/apps/frontend/app/(admin)/page.tsx`

Dashboard overview showing:
- Quick stats for default configurations
- Links to configuration management
- System status indicators

#### Configuration Manager
**Location:** `/srv/workspace/game-plug/apps/frontend/app/(admin)/config/page.tsx`

Features:
- Table view of all configurations
- Edit configurations with JSON support
- Create new configurations
- Delete configurations
- Real-time value type detection (boolean, number, string, json)

### Components

#### AdminNav
**Location:** `/srv/workspace/game-plug/apps/frontend/components/admin-nav.tsx`

Navigation sidebar for admin panel with links to:
- Dashboard
- Configuration
- Back to Game

## Default Configurations

The following default configurations are initialized on application startup:

```typescript
{
  key: "api.timeout",
  value: 30000,
  description: "API request timeout in milliseconds"
},
{
  key: "upload.maxSize",
  value: "50MB",
  description: "Maximum upload file size"
},
{
  key: "features.aiEnabled",
  value: true,
  description: "Enable AI features in the application"
},
{
  key: "limits.maxProjects",
  value: 1000,
  description: "Maximum number of projects per session"
}
```

## Usage Examples

### Backend Usage

```typescript
// In any service
constructor(private readonly configService: AdminConfigService) {}

// Get a config value
async getApiTimeout() {
  const config = await this.configService.get('api.timeout');
  return config?.value || 30000; // fallback to default
}

// Set a config value
async updateTimeout(newTimeout: number, userId: string) {
  await this.configService.set(
    'api.timeout',
    newTimeout,
    'Updated API timeout',
    userId
  );
}
```

### Frontend Usage

```typescript
// Fetch configs
const { data: configs } = useQuery({
  queryKey: ["admin-config"],
  queryFn: () => apiRequest("/api/admin/config"),
});

// Update a config
const updateMutation = useMutation({
  mutationFn: (data) =>
    apiRequest(`/api/admin/config/${data.key}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
});
```

## Testing

### Unit Tests
**Location:** `/srv/workspace/game-plug/apps/backend/src/modules/admin-config/admin-config.service.spec.ts`

Tests cover:
- Caching behavior
- Config retrieval
- Creation and updates
- Cache invalidation
- Default initialization

### E2E Tests
**Location:** `/srv/workspace/game-plug/e2e/admin-config.spec.ts`

Tests cover:
- Page loading
- Configuration table display
- Creating new configurations
- Editing existing configurations
- Deleting configurations
- JSON validation
- Cache persistence

**Run Tests:**
```bash
npx playwright test e2e/admin-config.spec.ts
```

## Configuration Value Types

The system supports any JSON-serializable value:

- **Boolean:** `true` or `false`
- **Number:** `30000`, `50.5`, etc.
- **String:** `"value"` or just `value` (parsed as string)
- **Array:** `[1, 2, 3]`
- **Object:** `{"key": "value"}`

## Security Considerations

1. **Authentication:** All admin config endpoints require JWT authentication
2. **Audit Trail:** The `updatedBy` field tracks which user made changes
3. **Cache Invalidation:** Changes are immediately reflected in the application
4. **No Secrets:** Do not store sensitive data (API keys, passwords) in system config

## Performance

- **Caching:** Configurations are cached for 1 hour to minimize database queries
- **Indexes:** `updated_at` column is indexed for efficient queries
- **Batch Operations:** Use `getAll()` to fetch multiple configs in one query

## Migration from Code Configuration

To migrate from hardcoded configs to the system config:

1. Create configs via admin panel or API
2. Update services to fetch from AdminConfigService
3. Add fallback values for backward compatibility:
   ```typescript
   const timeout = (await this.configService.get('api.timeout'))?.value || 30000;
   ```

## Troubleshooting

### Configuration not appearing in UI
- Check browser console for API errors
- Verify JWT token is valid
- Ensure backend container is running: `docker ps | grep game-plug`

### Changes not persisting
- Check Redis connection: `docker logs game-plug | grep redis`
- Verify database permissions
- Check server logs: `docker logs game-plug-backend`

### Cache not invalidating
- Manually clear cache: `redis-cli FLUSHALL`
- Restart backend service: `docker restart game-plug-backend`

## Files Created/Modified

### Created
- `/srv/workspace/game-plug/apps/backend/src/modules/admin-config/` - Backend module
- `/srv/workspace/game-plug/apps/frontend/app/(admin)/` - Frontend admin section
- `/srv/workspace/game-plug/apps/frontend/components/admin-nav.tsx` - Navigation component
- `/srv/workspace/game-plug/e2e/admin-config.spec.ts` - E2E tests
- `/srv/workspace/game-plug/migrations/0000_amused_fallen_one.sql` - Database migration

### Modified
- `/srv/workspace/game-plug/shared/schema.ts` - Added `systemConfig` table and schemas
- `/srv/workspace/game-plug/apps/backend/src/app.module.ts` - Registered AdminConfigModule

## Next Steps

1. Test the admin panel: Navigate to `https://game-plug.rbw.ovh/admin/config`
2. Create custom configurations as needed
3. Integrate configs into other services
4. Monitor performance with prometheus metrics (future enhancement)
