import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiOpenAiService {
  private readonly logger = new Logger(AiOpenAiService.name);
  private readonly openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      this.logger.warn(
        'OPENAI_API_KEY not configured. AI generation features will be disabled.',
      );
    }

    this.openai = new OpenAI({
      apiKey: apiKey || 'sk-placeholder',
    });
  }

  async generateCharacterAvatar(
    description: string,
    characterName: string,
    occupation?: string,
    age?: number,
  ): Promise<{ url: string | null; success: boolean }> {
    if (!process.env.OPENAI_API_KEY) {
      this.logger.warn(
        'Skipping avatar generation: OPENAI_API_KEY not configured',
      );
      return { url: null, success: false };
    }

    try {
      const occupationContext = occupation
        ? `working as a ${occupation.toLowerCase()}, `
        : '';
      const ageContext = age ? `aged ${age}, ` : '';

      const basePrompt = `Professional studio portrait photograph from 1920s New England. ${characterName}, ${ageContext}${occupationContext}an investigator of the unknown. ${description}`;

      const styleDetails = `
Vintage 1920s portrait photograph with dramatic noir lighting. ${occupation ? `Dressed as a ${occupation}. ` : ''}Period-accurate 1920s attire, mysterious atmosphere suggesting someone who investigates the unknown. Dark, gothic mood with deep shadows. Professional studio quality, sepia-toned or black and white.`;

      const fullPrompt = `${basePrompt}\n\n${styleDetails}`;

      const response = await this.openai.images.generate({
        model: 'dall-e-3',
        prompt: fullPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
      });

      const imageUrl = response.data?.[0]?.url || null;

      if (imageUrl) {
        this.logger.log(
          `Successfully generated avatar for ${characterName}`,
        );
        return { url: imageUrl, success: true };
      }

      return { url: null, success: false };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Error generating character avatar for ${characterName}: ${errorMessage}`,
      );
      throw error;
    }
  }

  async generateSceneImage(prompt: string): Promise<{ url: string | null }> {
    if (!process.env.OPENAI_API_KEY) {
      this.logger.warn('Skipping scene generation: OPENAI_API_KEY not configured');
      return { url: null };
    }

    try {
      const enhancedPrompt = `${prompt}

Artistic style: Dark atmospheric scene painting in the style of 1920s horror fiction and Lovecraftian tales. Dramatic lighting with deep shadows and mysterious atmosphere. Detailed environment suitable for tabletop RPG visualization. Rich textures, vintage mood, cinematic composition. Highly detailed digital artwork with gothic and noir influences.`;

      const response = await this.openai.images.generate({
        model: 'dall-e-3',
        prompt: enhancedPrompt,
        n: 1,
        size: '1792x1024',
        quality: 'hd',
      });

      const imageUrl = response.data?.[0]?.url || null;

      if (imageUrl) {
        this.logger.log('Successfully generated scene image');
      }

      return { url: imageUrl };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error generating scene image: ${errorMessage}`);
      throw error;
    }
  }

  async generatePhobiaDescription(phobiaName: string): Promise<string> {
    if (!process.env.OPENAI_API_KEY) {
      this.logger.warn(
        'Skipping phobia description: OPENAI_API_KEY not configured',
      );
      return `A deep, irrational fear of ${phobiaName.toLowerCase()}.`;
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert on Lovecraftian horror and Call of Cthulhu RPG. Generate atmospheric descriptions for phobias that fit the cosmic horror theme.',
          },
          {
            role: 'user',
            content: `Generate a brief, atmospheric description for the phobia "${phobiaName}" in the context of Call of Cthulhu. Keep it under 100 words and focus on how it manifests in gameplay situations. Make it evocative of cosmic horror themes.`,
          },
        ],
      });

      const description =
        response.choices[0]?.message?.content ||
        `A deep, irrational fear of ${phobiaName.toLowerCase()}.`;

      this.logger.log(
        `Successfully generated phobia description for ${phobiaName}`,
      );
      return description;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Error generating phobia description for ${phobiaName}: ${errorMessage}`,
      );
      return `A deep, irrational fear of ${phobiaName.toLowerCase()}.`;
    }
  }

  async generateManiaDescription(maniaName: string): Promise<string> {
    if (!process.env.OPENAI_API_KEY) {
      this.logger.warn(
        'Skipping mania description: OPENAI_API_KEY not configured',
      );
      return `An obsessive compulsion related to ${maniaName.toLowerCase()}.`;
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert on Lovecraftian horror and Call of Cthulhu RPG. Generate atmospheric descriptions for manias that fit the cosmic horror theme.',
          },
          {
            role: 'user',
            content: `Generate a brief, atmospheric description for the mania "${maniaName}" in the context of Call of Cthulhu. Keep it under 100 words and focus on how it manifests as compulsive behavior. Make it evocative of cosmic horror themes.`,
          },
        ],
      });

      const description =
        response.choices[0]?.message?.content ||
        `An obsessive compulsion related to ${maniaName.toLowerCase()}.`;

      this.logger.log(
        `Successfully generated mania description for ${maniaName}`,
      );
      return description;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Error generating mania description for ${maniaName}: ${errorMessage}`,
      );
      return `An obsessive compulsion related to ${maniaName.toLowerCase()}.`;
    }
  }

  async generateNarrativeSuggestion(context: string): Promise<string> {
    if (!process.env.OPENAI_API_KEY) {
      this.logger.warn(
        'Skipping narrative suggestion: OPENAI_API_KEY not configured',
      );
      return 'Les ombres s\'allongent et une tension palpable emplit l\'air...';
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Tu es un assistant narratif expert pour les Gardiens (Game Masters) de Call of Cthulhu 7e édition.

Ton rôle est d'aider le Gardien à enrichir son récit en proposant des suggestions narratives atmosphériques qui s'inscrivent dans l'univers lovecraftien des années 1920.

Directives :
- Écris en français de manière fluide et immersive
- Inspire-toi du contexte fourni pour créer des continuations ou développements narratifs cohérents
- Évoque l'atmosphère du cosmic horror : mystère, tension, découvertes troublantes
- Propose des descriptions de scènes, d'événements, de PNJ, de lieux ou d'indices
- Reste concis (100-150 mots maximum)
- Utilise un ton évocateur et atmosphérique typique des récits lovecraftiens`,
          },
          {
            role: 'user',
            content: `Contexte récent de la session :\n\n${context || 'Début de la session'}\n\nPropose une suggestion narrative pour continuer ou enrichir le récit.`,
          },
        ],
        max_tokens: 300,
        temperature: 0.8,
      });

      const suggestion =
        response.choices[0]?.message?.content ||
        'Les ombres s\'allongent et une tension palpable emplit l\'air...';

      this.logger.log('Successfully generated narrative suggestion');
      return suggestion;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Error generating narrative suggestion: ${errorMessage}`,
      );
      return 'Une atmosphère étrange plane dans l\'air, laissant présager des événements mystérieux à venir...';
    }
  }

  isConfigured(): boolean {
    return !!process.env.OPENAI_API_KEY;
  }
}
