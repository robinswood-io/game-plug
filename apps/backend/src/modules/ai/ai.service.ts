import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
  GenerateAvatarDto,
  GenerateSceneDto,
  SuggestNarrativeDto,
} from './dto';

@Injectable()
export class AiService {
  constructor(private readonly db: DatabaseService) {}

  async generateAvatar(dto: GenerateAvatarDto) {
    // TODO: Implement AI avatar generation logic
    // For now, return a mock response
    const prompt = this.buildAvatarPrompt(dto);

    return {
      success: true,
      prompt,
      imageUrl: null, // Will be populated when AI integration is implemented
      message: 'Avatar generation endpoint ready. AI integration pending.',
    };
  }

  async generateScene(dto: GenerateSceneDto) {
    // TODO: Implement AI scene generation logic
    const prompt = this.buildScenePrompt(dto);

    return {
      success: true,
      prompt,
      imageUrl: null, // Will be populated when AI integration is implemented
      message: 'Scene generation endpoint ready. AI integration pending.',
    };
  }

  async suggestNarrative(dto: SuggestNarrativeDto) {
    // TODO: Implement AI narrative suggestion logic
    const prompt = this.buildNarrativePrompt(dto);

    return {
      success: true,
      suggestions: [],
      prompt,
      message: 'Narrative suggestion endpoint ready. AI integration pending.',
    };
  }

  private buildAvatarPrompt(dto: GenerateAvatarDto): string {
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
