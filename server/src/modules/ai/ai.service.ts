import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { AvatarStorageService } from './services/avatar-storage.service';
import type { Character } from '@shared/schema';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private avatarStorage: AvatarStorageService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || 'default_key',
    });
  }

  async generateSceneImage(prompt: string): Promise<{ url: string }> {
    const enhancedPrompt = `${prompt}

Artistic style: Dark atmospheric scene painting in the style of 1920s horror fiction and Lovecraftian tales. Dramatic lighting with deep shadows and mysterious atmosphere. Detailed environment suitable for tabletop RPG visualization. Rich textures, vintage mood, cinematic composition. Highly detailed digital artwork with gothic and noir influences.`;

    try {
      const response = await this.openai.images.generate({
        model: 'dall-e-3',
        prompt: enhancedPrompt,
        n: 1,
        size: '1792x1024',
        quality: 'hd',
      });

      const tempUrl = response.data?.[0]?.url || '';
      return { url: tempUrl };
    } catch (error) {
      console.error('Error generating scene image:', error);
      throw new Error('Failed to generate scene image');
    }
  }

  async generateCharacterAvatar(
    description: string,
    characterName: string,
    occupation?: string,
    age?: number,
    characterId?: string,
  ): Promise<{ url: string }> {
    const occupationContext = occupation ? `working as a ${occupation.toLowerCase()}, ` : '';
    const ageContext = age ? `aged ${age}, ` : '';

    const basePrompt = `Professional studio portrait photograph from 1920s New England. ${characterName}, ${ageContext}${occupationContext}an investigator of the unknown. ${description}`;

    const styleDetails = `
Vintage 1920s portrait photograph with dramatic noir lighting. ${occupation ? `Dressed as a ${occupation}. ` : ''}Period-accurate 1920s attire, mysterious atmosphere suggesting someone who investigates the unknown. Dark, gothic mood with deep shadows. Professional studio quality, sepia-toned or black and white.`;

    const fullPrompt = `${basePrompt}\n\n${styleDetails}`;

    try {
      const response = await this.openai.images.generate({
        model: 'dall-e-3',
        prompt: fullPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
      });

      const tempUrl = response.data?.[0]?.url || '';

      if (tempUrl && characterId) {
        try {
          const permanentUrl = await this.avatarStorage.downloadAndSaveImage(tempUrl, characterId);
          return { url: permanentUrl };
        } catch (error) {
          console.error('Failed to save image permanently, returning temporary URL:', error);
          return { url: tempUrl };
        }
      }

      return { url: tempUrl };
    } catch (error) {
      console.error('Error generating character avatar:', error);
      throw new Error('Failed to generate character avatar');
    }
  }

  async generatePhobiaDescription(phobiaName: string): Promise<string> {
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

      return response.choices[0].message.content || `A deep, irrational fear of ${phobiaName.toLowerCase()}.`;
    } catch (error) {
      console.error('Error generating phobia description:', error);
      return `A deep, irrational fear of ${phobiaName.toLowerCase()}.`;
    }
  }

  async generateManiaDescription(maniaName: string): Promise<string> {
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

      return response.choices[0].message.content || `An obsessive compulsion related to ${maniaName.toLowerCase()}.`;
    } catch (error) {
      console.error('Error generating mania description:', error);
      return `An obsessive compulsion related to ${maniaName.toLowerCase()}.`;
    }
  }

  async generateNarrativeSuggestion(context: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Tu es un assistant narratif expert pour les Gardiens (Game Masters) de Call of Cthulhu 7e édition.

Ton rôle est de suggérer des développements narratifs atmosphériques et engageants basés sur le contexte de la session.

Règles:
- Réponds toujours en français
- Garde un ton mystérieux et lovecraftien
- Suggère des développements qui créent de la tension
- Reste cohérent avec l'univers des années 1920
- Propose des éléments qui peuvent être facilement intégrés par le Gardien`,
          },
          {
            role: 'user',
            content: `Contexte actuel de la session:\n${context}\n\nSuggère un développement narratif pour enrichir cette scène.`,
          },
        ],
      });

      return response.choices[0].message.content || "Les ombres s'allongent et une tension palpable emplit l'air...";
    } catch (error) {
      console.error('Error generating narrative suggestion:', error);
      return "Les ombres s'allongent et une tension palpable emplit l'air...";
    }
  }

  // Delegated storage methods
  async downloadAndSaveImage(imageUrl: string, characterId: string): Promise<string> {
    return this.avatarStorage.downloadAndSaveImage(imageUrl, characterId);
  }

  async deleteAvatar(avatarUrl: string): Promise<void> {
    return this.avatarStorage.deleteAvatar(avatarUrl);
  }

  avatarFileExists(avatarUrl: string): boolean {
    return this.avatarStorage.avatarFileExists(avatarUrl);
  }

  copyAvatar(sourceAvatarUrl: string, targetCharacterId: string): string | null {
    return this.avatarStorage.copyAvatar(sourceAvatarUrl, targetCharacterId);
  }

  async migrateExistingAvatars(): Promise<{ success: number; failed: number; total: number }> {
    return this.avatarStorage.migrateExistingAvatars();
  }

  buildAvatarDescription(character: Character): string {
    let description = '';

    if (character.gender) {
      description += `${character.gender}, `;
    }

    if (character.appearance && character.appearance >= 60) {
      description += 'attractive appearance, ';
    } else if (character.appearance && character.appearance <= 30) {
      description += 'weathered appearance, ';
    }

    if (character.education && character.education >= 80) {
      description += 'scholarly and intellectual demeanor, ';
    } else if (character.intelligence && character.intelligence >= 70) {
      description += 'intelligent and sharp gaze, ';
    }

    if (character.strength && character.strength >= 70) {
      description += 'strong and robust build, ';
    } else if (character.constitution && character.constitution >= 70) {
      description += 'healthy and vigorous appearance, ';
    }

    if (description === '') {
      description = 'mysterious investigator with a determined expression, ';
    }

    description += 'dramatic shadows, vintage 1920s style';

    return description;
  }
}
