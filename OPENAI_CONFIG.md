# Configuration OpenAI pour Game Plug

## Status de l'implémentation

L'intégration OpenAI a été implémentée et est prête pour la production.

## Architecture

### Services implémentés

- **AiOpenAiService** (`apps/backend/src/modules/ai/services/openai.service.ts`)
  - Gère toutes les appels à l'API OpenAI
  - Graceful fallback si clé non configurée
  - Logging détaillé des opérations

### Fonctionnalités

1. **generateCharacterAvatar** - Génération d'avatars de personnages
   - Modèle: DALL-E 3
   - Résolution: 1024x1024
   - Qualité: standard (fast)
   - Style: Portraits 1920s noir/horror

2. **generateSceneImage** - Génération de scènes atmosphériques
   - Modèle: DALL-E 3
   - Résolution: 1792x1024 (projection)
   - Qualité: HD
   - Style: Lovecraftian horror 1920s

3. **generatePhobiaDescription** - Descriptions d'une phobie
   - Modèle: GPT-4o
   - Contexte: Call of Cthulhu RPG
   - Limite: 100 mots max

4. **generateManiaDescription** - Descriptions d'une manie
   - Modèle: GPT-4o
   - Contexte: Call of Cthulhu RPG
   - Limite: 100 mots max

5. **generateNarrativeSuggestion** - Suggestions narratives pour MJ
   - Modèle: GPT-4o
   - Langue: Français
   - Limite: 300 tokens max
   - Temperature: 0.8 (creative)

## Configuration Requise

### 1. Obtenir une clé API OpenAI

```bash
# Aller sur https://platform.openai.com/api-keys
# Créer un compte ou se connecter
# Cliquer "Create new secret key"
# Copier la clé (format: sk-proj-...)
```

### 2. Configuration Docker (Production)

**Fichier:** `/srv/workspace/docker-compose.apps.yml` (service `game-plug-backend`)

```yaml
game-plug-backend:
  environment:
    - OPENAI_API_KEY=${OPENAI_API_KEY:-sk-placeholder}
```

Passer la clé via:
```bash
export OPENAI_API_KEY=sk-proj-your-key-here
docker compose -f docker-compose.apps.yml up -d game-plug-backend
```

Ou dans un fichier `.env`:
```bash
OPENAI_API_KEY=sk-proj-your-key-here
docker compose -f docker-compose.apps.yml --env-file .env up -d game-plug-backend
```

### 3. Vérifier la configuration

```bash
# Vérifier que la clé est chargée
docker exec game-plug-backend printenv | grep OPENAI_API_KEY

# Vérifier les logs
docker logs game-plug-backend | grep -i openai
```

## Endpoints disponibles

### POST /api/ai/generate-avatar
Génère un avatar pour un personnage.

**Body:**
```json
{
  "characterName": "Dr. Armitage",
  "occupation": "Librarian",
  "age": "45",
  "gender": "Male",
  "physicalDescription": "Scholarly demeanor, sharp gaze"
}
```

**Response:**
```json
{
  "success": true,
  "prompt": "Portrait of Dr. Armitage...",
  "imageUrl": "https://...",
  "message": "Avatar generated successfully"
}
```

### POST /api/ai/generate-scene
Génère une image de scène.

**Body:**
```json
{
  "title": "Library discovery",
  "description": "An ancient library filled with forbidden knowledge",
  "location": "Miskatonic University Library",
  "mood": "Mysterious and ominous"
}
```

### POST /api/ai/suggest-narrative
Génère des suggestions narratives pour le MJ.

**Body:**
```json
{
  "context": "Les personnages ont découvert un journal mystérieux..."
}
```

### POST /api/ai/characters/:characterId/generate-avatar
Génère un avatar basé sur les stats du personnage.

**Body:**
```json
{
  "description": "Optional additional description"
}
```

### POST /api/ai/sessions/:sessionId/generate-all-avatars
Génère les avatars pour tous les personnages d'une session (MJ seulement).

**Body:**
```json
{
  "forceRegenerate": false
}
```

## Comportement sans clé API

Si `OPENAI_API_KEY` n'est pas configurée:

- ✓ Tous les endpoints restent disponibles
- ✓ Les prompts sont générés correctement
- ✓ Les images retournent `imageUrl: null`
- ✓ Les suggestions narratives retournent des valeurs par défaut
- ✓ Aucune erreur - graceful fallback

```json
{
  "success": true,
  "imageUrl": null,
  "message": "Avatar generation endpoint ready. OpenAI API key not configured."
}
```

## Coûts estimés

- Avatar (DALL-E 3, 1024x1024): ~$0.08 par image
- Scène (DALL-E 3, 1792x1024): ~$0.12 par image
- Phobia/Mania description (GPT-4o): ~$0.001 par requête
- Narrative suggestion (GPT-4o): ~$0.002 par requête

**Exemple:** 1 session avec 4 personnages = ~$0.32 en images

## Tests

### Sans clé API (mode développement)

```bash
# Obtenir token
TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/dev-login \
  -H "Content-Type: application/json" \
  -d '{"email":"gm@example.com"}' | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

# Tester génération avatar
curl -X POST http://localhost:4000/api/ai/generate-avatar \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "characterName": "Dr. Armitage",
    "occupation": "Librarian",
    "age": "45"
  }'

# Tester suggestion narrative
curl -X POST http://localhost:4000/api/ai/suggest-narrative \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "context": "Les personnages explorent la bibliothèque"
  }'
```

### Avec clé API valide

Les réponses contiendront des URLs d'images réelles:

```json
{
  "success": true,
  "imageUrl": "https://oaidalleapiprodscus.blob.core.windows.net/private/...",
  "message": "Avatar generated successfully"
}
```

## Monitoring

Les logs contiennent des informations sur les générations:

```bash
docker logs -f game-plug-backend | grep -i openai
```

Exemple:
```
[Nest] 2026-01-25 12:34:56 LOG [AiOpenAiService] Successfully generated avatar for Dr. Armitage
[Nest] 2026-01-25 12:34:57 LOG [AiService] Avatar generation endpoint ready. OpenAI API key not configured.
```

## Gestion des erreurs

Les erreurs OpenAI sont capturées et loggées:

- Invalid API key → message d'erreur + graceful fallback
- Rate limit → retried avec backoff exponentiel
- Network error → logged et fallback

Les clients reçoivent toujours une réponse valide (même si imageUrl est null).

## Production Checklist

- [x] Service OpenAI implémenté
- [x] Configuration Docker
- [x] Gestion graceful de l'absence de clé API
- [x] Logging détaillé
- [x] Endpoints protégés (JWT auth)
- [x] Type-safety (TypeScript strict)
- [x] Tests de base possibles
- [ ] Clé API fournie par l'utilisateur

## Prochaines étapes

1. Demander clé API OpenAI pour production
2. Configurer dans docker-compose.apps.yml
3. Restart du service game-plug-backend
4. Tester les endpoints avec image URL
5. Monitorer les logs et les coûts OpenAI
