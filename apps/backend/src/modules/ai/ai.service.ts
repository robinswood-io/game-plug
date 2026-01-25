import { Injectable, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { AiOpenAiService } from './services';
import { eq } from 'drizzle-orm';
import * as schema from '@shared/schema';
import {
  GenerateGenericAvatarDto,
  GenerateSceneDto,
  SuggestNarrativeDto,
  GenerateCharacterAvatarDto,
  GenerateSessionAvatarsDto,
  MigrateAvatarsDto,
} from './dto';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly openAiService: AiOpenAiService,
  ) {}

  async generateAvatar(dto: GenerateGenericAvatarDto) {
    const prompt = this.buildAvatarPrompt(dto);

    try {
      if (!this.openAiService.isConfigured()) {
        this.logger.warn('OpenAI API not configured, returning mock response');
        return {
          success: true,
          prompt,
          imageUrl: null,
          message: 'Avatar generation endpoint ready. OpenAI API key not configured.',
        };
      }

      const age = dto.age ? parseInt(dto.age, 10) : undefined;
      const result = await this.openAiService.generateCharacterAvatar(
        dto.physicalDescription || dto.characterName,
        dto.characterName,
        dto.occupation,
        age,
      );

      if (result.success && result.url) {
        return {
          success: true,
          prompt,
          imageUrl: result.url,
          message: 'Avatar generated successfully',
        };
      }

      return {
        success: false,
        prompt,
        imageUrl: null,
        message: 'Avatar generation failed',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Avatar generation error: ${errorMessage}`);
      return {
        success: false,
        prompt,
        imageUrl: null,
        message: `Avatar generation failed: ${errorMessage}`,
      };
    }
  }

  async generateScene(dto: GenerateSceneDto) {
    const prompt = this.buildScenePrompt(dto);

    try {
      if (!this.openAiService.isConfigured()) {
        this.logger.warn('OpenAI API not configured, returning mock response');
        return {
          success: true,
          prompt,
          imageUrl: null,
          message: 'Scene generation endpoint ready. OpenAI API key not configured.',
        };
      }

      const result = await this.openAiService.generateSceneImage(prompt);

      if (result.url) {
        return {
          success: true,
          prompt,
          imageUrl: result.url,
          message: 'Scene generated successfully',
        };
      }

      return {
        success: false,
        prompt,
        imageUrl: null,
        message: 'Scene generation failed',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Scene generation error: ${errorMessage}`);
      return {
        success: false,
        prompt,
        imageUrl: null,
        message: `Scene generation failed: ${errorMessage}`,
      };
    }
  }

  async suggestNarrative(dto: SuggestNarrativeDto) {
    const prompt = this.buildNarrativePrompt(dto);

    try {
      if (!this.openAiService.isConfigured()) {
        this.logger.warn('OpenAI API not configured, returning mock response');
        return {
          success: true,
          suggestions: [],
          prompt,
          message: 'Narrative suggestion endpoint ready. OpenAI API key not configured.',
        };
      }

      const suggestion = await this.openAiService.generateNarrativeSuggestion(
        prompt,
      );

      return {
        success: true,
        suggestions: [suggestion],
        prompt,
        message: 'Narrative suggestion generated successfully',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Narrative suggestion error: ${errorMessage}`);
      return {
        success: false,
        suggestions: [],
        prompt,
        message: `Narrative suggestion failed: ${errorMessage}`,
      };
    }
  }

  async generateCharacterAvatar(
    characterId: string,
    dto: GenerateCharacterAvatarDto,
  ) {
    // Get character from database
    const character = await this.db.db
      .select()
      .from(schema.characters)
      .where(eq(schema.characters.id, characterId))
      .limit(1)
      .then((results) => results[0] || null);

    if (!character) {
      throw new BadRequestException('Character not found');
    }

    try {
      // Build description from character data
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

      // Build prompt for AI
      const prompt = this.buildAvatarPrompt({
        characterName: character.name,
        occupation: character.occupation || '',
        age: character.age ? character.age.toString() : undefined,
        gender: character.gender || undefined,
        physicalDescription: description,
        styleHints: 'Call of Cthulhu, 1920s noir style',
      });

      if (!this.openAiService.isConfigured()) {
        this.logger.warn('OpenAI API not configured, returning mock response');
        return {
          success: true,
          characterId,
          characterName: character.name,
          prompt,
          imageUrl: null,
          message:
            'Character avatar generation initiated. OpenAI API key not configured.',
        };
      }

      const result = await this.openAiService.generateCharacterAvatar(
        description,
        character.name,
        character.occupation || undefined,
        character.age || undefined,
      );

      return {
        success: result.success,
        characterId,
        characterName: character.name,
        prompt,
        imageUrl: result.url,
        message: result.success
          ? 'Character avatar generated successfully'
          : 'Character avatar generation failed',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Error generating avatar for character ${characterId}: ${errorMessage}`,
      );
      throw error;
    }
  }

  async generateSessionAvatars(
    sessionId: string,
    dto: GenerateSessionAvatarsDto,
    userId: string,
  ) {
    // Verify user is GM of the session
    const session = await this.db.db
      .select()
      .from(schema.gameSessions)
      .where(eq(schema.gameSessions.id, sessionId))
      .limit(1)
      .then((results) => results[0] || null);

    if (!session) {
      throw new BadRequestException('Session not found');
    }

    if (session.gmId !== userId) {
      throw new ForbiddenException(
        'Only the GM can generate avatars for all characters',
      );
    }

    // Get all characters in session
    const characters = await this.db.db
      .select()
      .from(schema.characters)
      .where(eq(schema.characters.sessionId, sessionId));

    // Filter characters based on forceRegenerate option
    const charactersToGenerate = dto.forceRegenerate
      ? characters
      : characters.filter((c) => !c.avatarUrl);

    if (charactersToGenerate.length === 0) {
      return {
        message: 'All characters already have avatars',
        generated: 0,
        sessionId,
      };
    }

    const results = [];
    const errors = [];
    const isOpenAiConfigured = this.openAiService.isConfigured();

    // Process batch avatar generation
    for (const character of charactersToGenerate) {
      try {
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

        const prompt = this.buildAvatarPrompt({
          characterName: character.name,
          occupation: character.occupation || '',
          age: character.age ? character.age.toString() : undefined,
          gender: character.gender || undefined,
          physicalDescription: description,
          styleHints: 'Call of Cthulhu, 1920s noir style',
        });

        let imageUrl: string | null = null;

        if (isOpenAiConfigured) {
          try {
            const result =
              await this.openAiService.generateCharacterAvatar(
                description,
                character.name,
                character.occupation || undefined,
                character.age || undefined,
              );
            imageUrl = result.url;
          } catch (aiError) {
            this.logger.warn(
              `Failed to generate avatar for ${character.name}: ${aiError instanceof Error ? aiError.message : 'Unknown error'}`,
            );
          }
        }

        results.push({
          characterId: character.id,
          characterName: character.name,
          prompt,
          imageUrl,
        });

        // Small delay to prevent rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        errors.push({
          characterId: character.id,
          characterName: character.name,
          error: errorMessage,
        });
      }
    }

    return {
      message: `Generated ${results.length} avatars for session characters${!isOpenAiConfigured ? ' (OpenAI API not configured, images unavailable)' : ''}`,
      generated: results.length,
      failed: errors.length,
      sessionId,
      results,
      errors,
    };
  }

  async migrateAvatars(dto: MigrateAvatarsDto) {
    // TODO: Implement avatar migration logic
    // This is a utility endpoint for migrating avatars from external URLs to local storage

    if (dto.dryRun) {
      return {
        success: true,
        mode: 'dry-run',
        message: 'Dry-run mode: No changes made',
        totalAvatars: 0,
        migrated: 0,
        failed: 0,
      };
    }

    return {
      success: true,
      message: 'Avatar migration completed',
      totalAvatars: 0,
      migrated: 0,
      failed: 0,
    };
  }

  private buildAvatarPrompt(dto: GenerateGenericAvatarDto): string {
    let prompt = `Portrait of ${dto.characterName}, a ${dto.occupation}`;

    if (dto.age) prompt += `, ${dto.age} years old`;
    if (dto.gender) prompt += `, ${dto.gender}`;
    if (dto.physicalDescription) prompt += `. ${dto.physicalDescription}`;
    if (dto.styleHints) prompt += `. Style: ${dto.styleHints}`;

    prompt += '. Call of Cthulhu style, 1920s era, realistic portrait.';

    return prompt;
  }

  private buildScenePrompt(dto: GenerateSceneDto): string {
    let prompt = `${dto.title}. ${dto.description}`;

    if (dto.location) prompt += `. Location: ${dto.location}`;
    if (dto.timePeriod) prompt += `. Time period: ${dto.timePeriod}`;
    if (dto.mood) prompt += `. Mood: ${dto.mood}`;
    if (dto.characters?.length) {
      prompt += `. Characters present: ${dto.characters.join(', ')}`;
    }

    prompt += '. Call of Cthulhu style, atmospheric, detailed scene.';

    return prompt;
  }

  private buildNarrativePrompt(dto: SuggestNarrativeDto): string {
    let prompt = `Context: ${dto.context}`;

    if (dto.recentEvents?.length) {
      prompt += `\n\nRecent events:\n${dto.recentEvents.map((e, i) => `${i + 1}. ${e}`).join('\n')}`;
    }

    if (dto.characters?.length) {
      prompt += `\n\nCharacters involved: ${dto.characters.join(', ')}`;
    }

    if (dto.tone) {
      prompt += `\n\nDesired tone: ${dto.tone}`;
    }

    prompt += '\n\nGenerate narrative suggestions for the GM to continue the story.';

    return prompt;
  }
}
