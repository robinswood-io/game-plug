import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { characters, activeEffects, inventory, gameSessions } from '@shared/schema';
import { eq } from 'drizzle-orm';
import type { ApplyEffectDto } from './dto/apply-effect.dto';
import type { GenerateAvatarDto } from './dto/generate-avatar.dto';

@Injectable()
export class CharactersService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(userId?: string) {
    if (userId) {
      return this.db.db.query.characters.findMany({
        where: eq(characters.userId, userId),
      });
    }
    return this.db.db.query.characters.findMany();
  }

  async findOne(id: string) {
    const character = await this.db.db.query.characters.findFirst({
      where: eq(characters.id, id),
    });
    if (!character) {
      throw new NotFoundException(`Character ${id} not found`);
    }
    return character;
  }

  async create(data: any, userId?: string) {
    // Explicitly handle userId to avoid it being overwritten by null in data
    const { userId: bodyUserId, ...cleanData } = data;
    const finalUserId = userId || bodyUserId;

    const [character] = await this.db.db
      .insert(characters)
      .values({ ...cleanData, userId: finalUserId })
      .returning();
    return character;
  }

  async update(id: string, data: any) {
    const [updated] = await this.db.db
      .update(characters)
      .set(data)
      .where(eq(characters.id, id))
      .returning();
    return updated;
  }

  async delete(id: string) {
    await this.db.db.delete(characters).where(eq(characters.id, id));
  }

  async giveSkillPoints(characterId: string, points: number) {
    const character = await this.findOne(characterId);

    const currentPoints = character.availableSkillPoints || 0;
    const [updated] = await this.db.db
      .update(characters)
      .set({
        availableSkillPoints: currentPoints + points,
      } as any)
      .where(eq(characters.id, characterId))
      .returning();

    return updated;
  }

  async distributeSkillPoints(characterId: string, skillUpdates: Record<string, number>) {
    const character = await this.findOne(characterId);

    const currentSkills = (character.skills as Record<string, number>) || {};
    let totalPointsUsed = 0;
    const updatedSkills = { ...currentSkills };

    for (const [skillName, newValue] of Object.entries(skillUpdates)) {
      const currentValue = currentSkills[skillName] || 0;
      const pointsAdded = newValue - currentValue;

      if (pointsAdded > 0) {
        totalPointsUsed += pointsAdded;
        updatedSkills[skillName] = newValue;
      }
    }

    const availablePoints = character.availableSkillPoints || 0;
    if (totalPointsUsed > availablePoints) {
      throw new BadRequestException('Not enough skill points available');
    }

    const [updated] = await this.db.db
      .update(characters)
      .set({
        availableSkillPoints: availablePoints - totalPointsUsed,
      } as any)
      .where(eq(characters.id, characterId))
      .returning();

    return updated;
  }

  async applyEffect(characterId: string, dto: ApplyEffectDto) {
    const character = await this.findOne(characterId);

    const [effect] = await this.db.db
      .insert(activeEffects)
      .values({
        characterId,
        type: dto.type,
        name: dto.name,
        ...(dto.description && { description: dto.description }),
        ...(dto.value && { value: dto.value }),
        ...(dto.duration && { duration: dto.duration }),
        isActive: dto.isActive !== undefined ? dto.isActive : true,
      } as any)
      .returning();

    let characterUpdates: any = {};
    const value = parseInt(dto.value || '0');

    if (dto.type === 'damage' && value !== 0) {
      characterUpdates.hitPoints = Math.max(0, character.hitPoints - Math.abs(value));
    } else if (dto.type === 'healing' && value !== 0) {
      characterUpdates.hitPoints = Math.min(
        character.maxHitPoints,
        character.hitPoints + Math.abs(value)
      );
    } else if (dto.type === 'sanity_loss' && value !== 0) {
      characterUpdates.sanity = Math.max(0, character.sanity - Math.abs(value));
    } else if (dto.type === 'sanity_recovery' && value !== 0) {
      characterUpdates.sanity = Math.min(
        character.maxSanity,
        character.sanity + Math.abs(value)
      );
    } else if (dto.type === 'magic_loss' && value !== 0) {
      characterUpdates.magicPoints = Math.max(0, character.magicPoints - Math.abs(value));
    } else if (dto.type === 'magic_recovery' && value !== 0) {
      characterUpdates.magicPoints = Math.min(
        character.maxMagicPoints,
        character.magicPoints + Math.abs(value)
      );
    }

    if (Object.keys(characterUpdates).length > 0) {
      await this.db.db
        .update(characters)
        .set(characterUpdates)
        .where(eq(characters.id, characterId));
    }

    return effect;
  }

  async generateAvatar(characterId: string, dto: GenerateAvatarDto) {
    const character = await this.findOne(characterId);

    if (character.avatarUrl && !dto.forceRegenerate) {
      return {
        message: 'Character already has an avatar. Use forceRegenerate to replace it.',
        avatarUrl: character.avatarUrl,
        characterId,
        characterName: character.name,
      };
    }

    let description = dto.description;

    if (!description) {
      description = this.buildAvatarDescription(character);
    }

    const avatarUrl = `/api/avatars/${characterId}.jpg`;
    const avatarPrompt = description;

    await this.db.db
      .update(characters)
      .set({
        avatarUrl,
        avatarPrompt,
      } as any)
      .where(eq(characters.id, characterId));

    return {
      message: 'Avatar generated successfully',
      avatarUrl,
      characterId,
      characterName: character.name,
      prompt: avatarPrompt,
    };
  }

  async updateNotes(characterId: string, notes: string) {
    const character = await this.findOne(characterId);

    const [updated] = await this.db.db
      .update(characters)
      .set({
        notes,
      } as any)
      .where(eq(characters.id, characterId))
      .returning();

    return updated;
  }

  async addInventoryItem(characterId: string, dto: any, userId: string) {
    const character = await this.findOne(characterId);

    // Check if user is GM or owns the character
    const session = await this.db.db.query.gameSessions.findFirst({
      where: eq(gameSessions.id, character.sessionId),
    });

    const isGM = session && session.gmId === userId;
    const isOwner = character.userId === userId;

    if (!isOwner && !isGM) {
      throw new ForbiddenException('Permission denied - you must own this character or be the GM');
    }

    // Create inventory item
    const [item] = await this.db.db
      .insert(inventory)
      .values({
        characterId,
        ...dto,
      })
      .returning();

    return item;
  }

  private buildAvatarDescription(character: any): string {
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
