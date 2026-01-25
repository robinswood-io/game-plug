# Guide Technique: Activation de l'Intégration OpenAI

## Vue d'ensemble

Ce document décrit techniquement comment activer et mettre en place l'intégration OpenAI (DALL-E 3 + GPT-4o) dans game-plug.

---

## 1. Configuration de l'Environnement

### 1.1 Obtenir une Clé API OpenAI

**Étapes:**

1. Allez sur https://platform.openai.com/api-keys
2. Connectez-vous (créez un compte si nécessaire)
3. Cliquez sur "Create new secret key"
4. Nommez-la "game-plug-production"
5. Copiez la clé (format: `sk-...`)

**Vérification:**
```bash
# Tester la clé API
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer sk-YOUR_KEY_HERE" | head -20
```

### 1.2 Configuration Docker Compose

**Fichier:** `/srv/workspace/docker-compose.apps.yml`

**Recherchez:**
```yaml
game-plug-backend:
  build:
    context: ./game-plug
    dockerfile: apps/backend/Dockerfile
  container_name: game-plug-backend
  restart: unless-stopped
  environment:
    - NODE_ENV=production
    - DATABASE_URL=${GAME_PLUG_DATABASE_URL:-...}
    - JWT_SECRET=${GAME_PLUG_JWT_SECRET}
    - PORT=4000
```

**Modifiez en:**
```yaml
game-plug-backend:
  build:
    context: ./game-plug
    dockerfile: apps/backend/Dockerfile
  container_name: game-plug-backend
  restart: unless-stopped
  environment:
    - NODE_ENV=production
    - DATABASE_URL=${GAME_PLUG_DATABASE_URL:-...}
    - JWT_SECRET=${GAME_PLUG_JWT_SECRET}
    - PORT=4000
    - OPENAI_API_KEY=${GAME_PLUG_OPENAI_API_KEY}  # ← AJOUTER
```

### 1.3 Fichier .env Global

**Fichier:** `/srv/workspace/.env` (ou `.env.production`)

**Ajoutez:**
```bash
# OpenAI Configuration for game-plug
GAME_PLUG_OPENAI_API_KEY=sk-YOUR_ACTUAL_KEY_HERE
```

### 1.4 Vérification de Configuration

```bash
# Redémarrer le conteneur
cd /srv/workspace
docker compose -f docker-compose.apps.yml restart game-plug-backend

# Vérifier que la variable est présente
docker exec game-plug-backend printenv | grep OPENAI

# Output attendu:
# OPENAI_API_KEY=sk-...
```

---

## 2. Intégration du Code OpenAI

### 2.1 Structure Actuelle

```
/srv/workspace/game-plug/
├── apps/
│   └── backend/
│       └── src/
│           └── modules/
│               └── ai/
│                   ├── ai.service.ts          (Mock - à modifier)
│                   ├── ai.controller.ts       (OK)
│                   ├── ai.module.ts           (OK)
│                   └── dto/
│                       ├── generate-avatar.dto.ts
│                       ├── generate-scene.dto.ts
│                       └── suggest-narrative.dto.ts
│
├── server-legacy-archive-final/
│   └── openai.ts                              (Code complet existant)
```

### 2.2 Créer le fichier ai-openai.service.ts

**Créez:** `/srv/workspace/game-plug/apps/backend/src/modules/ai/ai-openai.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

/**
 * Service wrapper pour OpenAI API
 * Encapsule les appels à DALL-E 3 et GPT-4o
 */
@Injectable()
export class AiOpenAiService {
  private openai: OpenAI;

  constructor() {
    // Initialise le client OpenAI avec la clé d'env
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Génère une image d'avatar caractère avec DALL-E 3
   */
  async generateCharacterAvatar(
    characterName: string,
    occupation: string,
    description: string,
    age?: string,
    gender?: string,
  ): Promise<{ imageUrl: string; revisedPrompt?: string }> {
    const occupationContext = occupation ? `working as a ${occupation.toLowerCase()}, ` : '';
    const ageContext = age ? `aged ${age}, ` : '';

    const basePrompt = `Professional studio portrait photograph from 1920s New England. ${characterName}, ${ageContext}${occupationContext}an investigator of the unknown. ${description}`;

    const styleDetails = `Vintage 1920s portrait photograph with dramatic noir lighting. ${occupation ? `Dressed as a ${occupation}. ` : ''}Period-accurate 1920s attire, mysterious atmosphere suggesting someone who investigates the unknown. Dark, gothic mood with deep shadows. Professional studio quality, sepia-toned or black and white.`;

    const fullPrompt = `${basePrompt}\n\n${styleDetails}`;

    try {
      const response = await this.openai.images.generate({
        model: 'dall-e-3',
        prompt: fullPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard', // standard pour rapidité (vs hd)
      });

      const imageUrl = response.data?.[0]?.url || '';
      const revisedPrompt = response.data?.[0]?.revised_prompt;

      if (!imageUrl) {
        throw new Error('No image URL returned from DALL-E 3');
      }

      return {
        imageUrl,
        revisedPrompt,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to generate character avatar: ${errorMessage}`);
    }
  }

  /**
   * Génère une image de scène pour le GameBoard avec DALL-E 3
   */
  async generateSceneImage(
    title: string,
    description: string,
    location?: string,
    timePeriod?: string,
  ): Promise<{ imageUrl: string; revisedPrompt?: string }> {
    let prompt = `${title}. ${description}`;

    if (location) prompt += `. Location: ${location}`;
    if (timePeriod) prompt += `. Time period: ${timePeriod}`;

    const enhancedPrompt = `${prompt}

Artistic style: Dark atmospheric scene painting in the style of 1920s horror fiction and Lovecraftian tales. Dramatic lighting with deep shadows and mysterious atmosphere. Detailed environment suitable for tabletop RPG visualization. Rich textures, vintage mood, cinematic composition. Highly detailed digital artwork with gothic and noir influences.`;

    try {
      const response = await this.openai.images.generate({
        model: 'dall-e-3',
        prompt: enhancedPrompt,
        n: 1,
        size: '1792x1024', // Format paysage pour projection
        quality: 'hd', // Haute qualité pour visibilité
      });

      const imageUrl = response.data?.[0]?.url || '';
      const revisedPrompt = response.data?.[0]?.revised_prompt;

      if (!imageUrl) {
        throw new Error('No image URL returned from DALL-E 3');
      }

      return {
        imageUrl,
        revisedPrompt,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to generate scene image: ${errorMessage}`);
    }
  }

  /**
   * Génère une suggestion narrative avec GPT-4o
   */
  async generateNarrativeSuggestion(context: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Tu es un assistant narratif expert pour les Gardiens (Game Masters) de Call of Cthulhu 7e édition.

Ton rôle est d'aider le Gardien à enrichir son récit en proposant des suggestions narratives atmosphériques qui s'inscrivent dans l'univers lovecraftien des années 1920.

Directives:
- Écris en français de manière fluide et immersive
- Inspire-toi du contexte fourni pour créer des continuations ou développements narratifs cohérents
- Évoque l'atmosphère du cosmic horror: mystère, tension, découvertes troublantes
- Propose des descriptions de scènes, d'événements, de PNJ, de lieux ou d'indices
- Reste concis (100-150 mots maximum)
- Utilise un ton évocateur et atmosphérique typique des récits lovecraftiens`,
          },
          {
            role: 'user',
            content: `Contexte récent de la session:\n\n${context || 'Début de la session'}\n\nPropose une suggestion narrative pour continuer ou enrichir le récit.`,
          },
        ],
        max_tokens: 300,
        temperature: 0.8, // Créatif mais contrôlé
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content returned from GPT-4o');
      }

      return content;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to generate narrative suggestion: ${errorMessage}`);
    }
  }

  /**
   * Génère une description de phobie avec GPT-4o
   */
  async generatePhobiaDescription(phobiaName: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert on Lovecraftian horror and Call of Cthulhu RPG. Generate atmospheric descriptions for phobias that fit the cosmic horror theme.',
          },
          {
            role: 'user',
            content: `Generate a brief, atmospheric description for the phobia "${phobiaName}" in the context of Call of Cthulhu. Keep it under 100 words and focus on how it manifests in gameplay situations. Make it evocative of cosmic horror themes.`,
          },
        ],
        max_tokens: 150,
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        return `A deep, irrational fear of ${phobiaName.toLowerCase()}.`;
      }

      return content;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error generating phobia description:', errorMessage);
      return `A deep, irrational fear of ${phobiaName.toLowerCase()}.`;
    }
  }

  /**
   * Génère une description de mania avec GPT-4o
   */
  async generateManiaDescription(maniaName: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert on Lovecraftian horror and Call of Cthulhu RPG. Generate atmospheric descriptions for manias that fit the cosmic horror theme.',
          },
          {
            role: 'user',
            content: `Generate a brief, atmospheric description for the mania "${maniaName}" in the context of Call of Cthulhu. Keep it under 100 words and focus on how it manifests as compulsive behavior. Make it evocative of cosmic horror themes.`,
          },
        ],
        max_tokens: 150,
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        return `An obsessive compulsion related to ${maniaName.toLowerCase()}.`;
      }

      return content;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error generating mania description:', errorMessage);
      return `An obsessive compulsion related to ${maniaName.toLowerCase()}.`;
    }
  }
}
```

### 2.3 Modifier ai.service.ts

**Fichier:** `/srv/workspace/game-plug/apps/backend/src/modules/ai/ai.service.ts`

Remplacez le contenu existant par:

```typescript
import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { AiOpenAiService } from './ai-openai.service';
import { eq } from 'drizzle-orm';
import * as schema from '@shared/schema';
import {
  GenerateAvatarDto,
  GenerateSceneDto,
  SuggestNarrativeDto,
  GenerateCharacterAvatarDto,
  GenerateSessionAvatarsDto,
  MigrateAvatarsDto,
} from './dto';

@Injectable()
export class AiService {
  constructor(
    private readonly db: DatabaseService,
    private readonly aiOpenAi: AiOpenAiService,
  ) {}

  async generateAvatar(dto: GenerateAvatarDto) {
    const prompt = this.buildAvatarPrompt(dto);

    try {
      const result = await this.aiOpenAi.generateCharacterAvatar(
        dto.characterName,
        dto.occupation,
        dto.physicalDescription || '',
        dto.age,
        dto.gender,
      );

      return {
        success: true,
        prompt,
        imageUrl: result.imageUrl,
        revisedPrompt: result.revisedPrompt,
        message: 'Avatar generated successfully with DALL-E 3',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error generating avatar:', errorMessage);
      return {
        success: false,
        prompt,
        imageUrl: null,
        error: errorMessage,
        message: 'Failed to generate avatar. Please try again.',
      };
    }
  }

  async generateScene(dto: GenerateSceneDto) {
    const prompt = this.buildScenePrompt(dto);

    try {
      const result = await this.aiOpenAi.generateSceneImage(
        dto.title,
        dto.description,
        dto.location,
        dto.timePeriod,
      );

      return {
        success: true,
        prompt,
        imageUrl: result.imageUrl,
        revisedPrompt: result.revisedPrompt,
        message: 'Scene generated successfully with DALL-E 3',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error generating scene:', errorMessage);
      return {
        success: false,
        prompt,
        imageUrl: null,
        error: errorMessage,
        message: 'Failed to generate scene. Please try again.',
      };
    }
  }

  async suggestNarrative(dto: SuggestNarrativeDto) {
    const prompt = this.buildNarrativePrompt(dto);

    try {
      const suggestion = await this.aiOpenAi.generateNarrativeSuggestion(
        dto.context,
      );

      return {
        success: true,
        suggestions: [suggestion],
        prompt,
        message: 'Narrative suggestion generated successfully with GPT-4o',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error generating narrative suggestion:', errorMessage);
      return {
        success: false,
        suggestions: [],
        prompt,
        error: errorMessage,
        message: 'Failed to generate narrative suggestion. Please try again.',
      };
    }
  }

  // ... reste des méthodes existantes (generateCharacterAvatar, generateSessionAvatars, etc.)
  // ...
}
```

### 2.4 Modifier ai.module.ts

**Fichier:** `/srv/workspace/game-plug/apps/backend/src/modules/ai/ai.module.ts`

Assurez-vous que le module importe et fournit le nouveau service:

```typescript
import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiOpenAiService } from './ai-openai.service';
import { AiController } from './ai.controller';

@Module({
  providers: [AiService, AiOpenAiService],
  controllers: [AiController],
})
export class AiModule {}
```

---

## 3. Installation des Dépendances

### 3.1 Vérifier que OpenAI est installé

```bash
cd /srv/workspace/game-plug/apps/backend

# Vérifier dans package.json
grep "openai" package.json

# Si absent, installer:
npm install openai@^4.x
```

### 3.2 Rebuild du service

```bash
cd /srv/workspace/game-plug/apps/backend

# Build
npm run build

# Ou avec webpack:
npm run build:webpack
```

---

## 4. Testing

### 4.1 Tests Unitaires

Créez: `/srv/workspace/game-plug/apps/backend/src/modules/ai/ai-openai.service.spec.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { AiOpenAiService } from './ai-openai.service';

describe('AiOpenAiService', () => {
  let service: AiOpenAiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiOpenAiService],
    }).compile();

    service = module.get<AiOpenAiService>(AiOpenAiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test generateCharacterAvatar with mock
  it('should generate character avatar', async () => {
    // Mock OpenAI API call
    // Test that the service constructs the correct prompt
    // Test error handling
  });
});
```

### 4.2 Tests d'Intégration Manuels

```bash
# 1. Obtenir un token
TOKEN=$(docker exec game-plug-backend sh -c 'curl -s -X POST http://localhost:4000/api/auth/dev-login -H "Content-Type: application/json" -d "{\"email\":\"gm@example.com\"}" | grep -o "\"access_token\":\"[^\"]*" | cut -d"\"" -f4')

# 2. Tester generate-avatar
curl -X POST http://localhost:4000/api/ai/generate-avatar \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "characterName": "Dr. Henry Armitage",
    "occupation": "Librarian",
    "age": "45"
  }' | jq .

# 3. Vérifier que imageUrl n'est plus null
```

---

## 5. Gestion des Erreurs et Retry

### 5.1 Ajouter Retry Logic

```typescript
// Dans ai-openai.service.ts
private async withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000,
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError || new Error('Max retries exceeded');
}
```

### 5.2 Rate Limiting

```typescript
// Ajouter à AiOpenAiService
private lastRequestTime = 0;
private readonly REQUEST_DELAY_MS = 1000; // 1 req/sec minimum

private async enforceRateLimit(): Promise<void> {
  const now = Date.now();
  const timeSinceLastRequest = now - this.lastRequestTime;

  if (timeSinceLastRequest < this.REQUEST_DELAY_MS) {
    await new Promise((resolve) =>
      setTimeout(resolve, this.REQUEST_DELAY_MS - timeSinceLastRequest),
    );
  }

  this.lastRequestTime = Date.now();
}
```

---

## 6. Monitoring et Logging

### 6.1 Ajouter Logging

```typescript
// Dans ai-openai.service.ts
import { Logger } from '@nestjs/common';

@Injectable()
export class AiOpenAiService {
  private readonly logger = new Logger(AiOpenAiService.name);

  async generateCharacterAvatar(...) {
    this.logger.log(`Generating avatar for ${characterName}`);
    try {
      // ... code
      this.logger.log(`Avatar generated successfully: ${imageUrl}`);
    } catch (error) {
      this.logger.error(`Failed to generate avatar: ${error.message}`);
    }
  }
}
```

### 6.2 Dashboard de Monitoring

Accédez à https://platform.openai.com/usage pour:
- Voir les coûts réels
- Tracker les appels API
- Fixer des limites mensuelles

---

## 7. Déploiement en Production

### 7.1 Checklist de Déploiement

```bash
# 1. Vérifier les variables d'env
echo $GAME_PLUG_OPENAI_API_KEY

# 2. Build l'image Docker
docker build -f apps/backend/Dockerfile -t game-plug-backend:v1.0 .

# 3. Lancer les tests
npm test
npm run test:cov

# 4. Redémarrer avec la config mise à jour
docker compose -f docker-compose.apps.yml restart game-plug-backend

# 5. Valider que les endpoints marchent
curl -H "Authorization: Bearer {TOKEN}" \
  http://localhost:4000/api/ai/generate-avatar

# 6. Monitorer les logs
docker logs -f game-plug-backend | grep -i "avatar\|scene\|narrative"
```

### 7.2 Secrets Management

**Important:** Ne pas commettre les clés API en Git

```bash
# .gitignore
.env
.env.local
.env.production
.env.*.local
```

Utiliser un secrets vault en production:
- AWS Secrets Manager
- HashiCorp Vault
- Azure Key Vault

---

## 8. Troubleshooting

### Erreur: "OPENAI_API_KEY not found"

```bash
# Vérifier que la variable est définie
docker exec game-plug-backend printenv | grep OPENAI

# Si absent, vérifier docker-compose.apps.yml
cat /srv/workspace/docker-compose.apps.yml | grep OPENAI
```

### Erreur: "Invalid API key"

```bash
# Tester la clé manuellement
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer sk-YOUR_KEY" | head

# Si 401, la clé est invalide
```

### Erreur: "Rate limit exceeded"

```bash
# Implémenter exponential backoff
# Voir section 5.2 ci-dessus
```

### Images générées avec qualité faible

```typescript
// Augmenter la qualité pour avatars:
quality: 'hd' // au lieu de 'standard'

// Mais attention: coût double ($0.020 vs $0.010)
```

---

## Conclusion

L'activation de l'intégration OpenAI suit 3 étapes majeures:
1. **Configuration** (30 min): Clé API + docker-compose
2. **Intégration** (2h): Créer AiOpenAiService + modifier AiService
3. **Validation** (30 min): Tests + monitoring

**Temps total:** 3-4 heures pour une activation complète et sécurisée.

