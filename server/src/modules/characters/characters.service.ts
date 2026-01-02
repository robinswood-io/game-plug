import { Injectable, NotFoundException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';
import { SessionsGateway } from '../sessions/sessions.gateway';
import { eq } from 'drizzle-orm';
import type { CreateCharacterDto } from './dto/create-character.dto';
import type { UpdateCharacterDto } from './dto/update-character.dto';
import type { CreateInventoryItemDto } from './dto/inventory-item.dto';
import type { CreateSanityConditionDto } from './dto/sanity-condition.dto';
import type { CreateActiveEffectDto } from './dto/active-effect.dto';
import type { Character } from '../../shared/schema';

@Injectable()
export class CharactersService {
  constructor(
    private readonly db: DatabaseService,
    @Inject(forwardRef(() => SessionsGateway))
    private readonly sessionsGateway: SessionsGateway,
  ) {}

  async createCharacter(
    data: CreateCharacterDto,
    sessionId: string,
    userId?: string,
  ): Promise<Character> {
    const characterData = {
      ...data,
      sessionId,
      userId,
      skillsLocked: true,
    };

    const [character] = await this.db.client
      .insert(this.db.schema.characters)
      .values(characterData as any) // Cast to bypass type issues - data validated by Zod
      .returning();

    return character;
  }

  async getCharactersByUser(userId: string): Promise<Character[]> {
    return this.db.client
      .select()
      .from(this.db.schema.characters)
      .where(eq(this.db.schema.characters.userId, userId));
  }

  async getCharacterById(id: string) {
    const [character] = await this.db.client
      .select()
      .from(this.db.schema.characters)
      .where(eq(this.db.schema.characters.id, id));

    if (!character) {
      throw new NotFoundException('Character not found');
    }

    const [sanityConditions, activeEffects] = await Promise.all([
      this.db.client
        .select()
        .from(this.db.schema.sanityConditions)
        .where(eq(this.db.schema.sanityConditions.characterId, id)),
      this.db.client
        .select()
        .from(this.db.schema.activeEffects)
        .where(eq(this.db.schema.activeEffects.characterId, id)),
    ]);

    return { ...character, sanityConditions, activeEffects };
  }

  async updateCharacter(id: string, data: UpdateCharacterDto): Promise<Character> {
    // Get previous state for comparison
    const [previousCharacter] = await this.db.client
      .select()
      .from(this.db.schema.characters)
      .where(eq(this.db.schema.characters.id, id));

    if (!previousCharacter) {
      throw new NotFoundException('Character not found');
    }

    const [character] = await this.db.client
      .update(this.db.schema.characters)
      .set(data)
      .where(eq(this.db.schema.characters.id, id))
      .returning();

    if (!character) {
      throw new NotFoundException('Character not found');
    }

    // Broadcast character update via WebSocket
    this.broadcastCharacterUpdate(character.sessionId, id, data, previousCharacter);

    return character;
  }

  private broadcastCharacterUpdate(
    sessionId: string,
    characterId: string,
    updates: UpdateCharacterDto,
    previousCharacter: Character,
  ) {
    // Broadcast general character update
    this.sessionsGateway.broadcastToSession(sessionId, {
      type: 'character_updated',
      data: {
        characterId,
        updates,
      },
    });

    // Special handling for sanity changes
    if (updates.sanity !== undefined && updates.sanity !== previousCharacter.sanity) {
      const change = updates.sanity - previousCharacter.sanity;
      this.sessionsGateway.broadcastToSession(sessionId, {
        type: 'sanity_updated',
        data: {
          characterId,
          previousValue: previousCharacter.sanity,
          newValue: updates.sanity,
          change,
        },
      });
    }

    // Special handling for HP changes
    if (updates.hitPoints !== undefined && updates.hitPoints !== previousCharacter.hitPoints) {
      const change = updates.hitPoints - previousCharacter.hitPoints;
      this.sessionsGateway.broadcastToSession(sessionId, {
        type: 'hp_updated',
        data: {
          characterId,
          previousValue: previousCharacter.hitPoints,
          newValue: updates.hitPoints,
          change,
        },
      });
    }

    // Special handling for skill changes
    if (updates.skills) {
      const previousSkills = (previousCharacter.skills as Record<string, number>) || {};
      const newSkills = updates.skills as Record<string, number>;

      Object.keys(newSkills).forEach((skillName) => {
        const previousValue = previousSkills[skillName] || 0;
        const newValue = newSkills[skillName];

        if (previousValue !== newValue) {
          this.sessionsGateway.broadcastToSession(sessionId, {
            type: 'skill_updated',
            data: {
              characterId,
              skillName,
              previousValue,
              newValue,
              change: newValue - previousValue,
            },
          });
        }
      });
    }
  }

  async deleteCharacter(id: string): Promise<void> {
    await this.db.client
      .delete(this.db.schema.characters)
      .where(eq(this.db.schema.characters.id, id));
  }

  async getCharacterInventory(characterId: string) {
    return this.db.client
      .select()
      .from(this.db.schema.inventory)
      .where(eq(this.db.schema.inventory.characterId, characterId));
  }

  async addInventoryItem(characterId: string, data: CreateInventoryItemDto) {
    const [item] = await this.db.client
      .insert(this.db.schema.inventory)
      .values({ ...data, characterId } as any) // Cast to bypass type issues - data validated by Zod
      .returning();

    // Get character's session to broadcast
    const [character] = await this.db.client
      .select()
      .from(this.db.schema.characters)
      .where(eq(this.db.schema.characters.id, characterId));

    if (character) {
      this.sessionsGateway.broadcastToSession(character.sessionId, {
        type: 'inventory_updated',
        data: {
          characterId,
          action: 'added',
          item: {
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            category: item.category,
          },
        },
      });
    }

    return item;
  }

  async updateInventoryItem(id: string, data: any) {
    const [item] = await this.db.client
      .update(this.db.schema.inventory)
      .set(data)
      .where(eq(this.db.schema.inventory.id, id))
      .returning();

    // Get character's session to broadcast
    const [character] = await this.db.client
      .select()
      .from(this.db.schema.characters)
      .where(eq(this.db.schema.characters.id, item.characterId));

    if (character) {
      this.sessionsGateway.broadcastToSession(character.sessionId, {
        type: 'inventory_updated',
        data: {
          characterId: item.characterId,
          action: 'updated',
          item: {
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            category: item.category,
          },
        },
      });
    }

    return item;
  }

  async deleteInventoryItem(id: string): Promise<void> {
    // Get item before deletion for broadcast
    const [item] = await this.db.client
      .select()
      .from(this.db.schema.inventory)
      .where(eq(this.db.schema.inventory.id, id));

    await this.db.client
      .delete(this.db.schema.inventory)
      .where(eq(this.db.schema.inventory.id, id));

    // Broadcast deletion
    if (item) {
      const [character] = await this.db.client
        .select()
        .from(this.db.schema.characters)
        .where(eq(this.db.schema.characters.id, item.characterId));

      if (character) {
        this.sessionsGateway.broadcastToSession(character.sessionId, {
          type: 'inventory_updated',
          data: {
            characterId: item.characterId,
            action: 'removed',
            item: {
              id: item.id,
              name: item.name,
            },
          },
        });
      }
    }
  }

  async addSanityCondition(characterId: string, data: CreateSanityConditionDto) {
    const [condition] = await this.db.client
      .insert(this.db.schema.sanityConditions)
      .values({ ...data, characterId } as any)
      .returning();

    return condition;
  }

  async addActiveEffect(characterId: string, data: CreateActiveEffectDto) {
    const [effect] = await this.db.client
      .insert(this.db.schema.activeEffects)
      .values({ ...data, characterId } as any)
      .returning();

    // Get character's session to broadcast
    const [character] = await this.db.client
      .select()
      .from(this.db.schema.characters)
      .where(eq(this.db.schema.characters.id, characterId));

    if (character) {
      this.sessionsGateway.broadcastToSession(character.sessionId, {
        type: 'effect_applied',
        data: {
          characterId,
          effectId: effect.id,
          effectName: effect.name,
          effectType: effect.type,
          value: effect.value,
          duration: effect.duration,
          description: effect.description,
        },
      });
    }

    return effect;
  }

  async updateActiveEffect(id: string, data: any) {
    const [effect] = await this.db.client
      .update(this.db.schema.activeEffects)
      .set(data)
      .where(eq(this.db.schema.activeEffects.id, id))
      .returning();

    return effect;
  }

  async deleteActiveEffect(id: string): Promise<void> {
    await this.db.client
      .delete(this.db.schema.activeEffects)
      .where(eq(this.db.schema.activeEffects.id, id));
  }

  async checkGMOwnership(characterId: string, userId: string): Promise<boolean> {
    const [character] = await this.db.client
      .select()
      .from(this.db.schema.characters)
      .where(eq(this.db.schema.characters.id, characterId));

    if (!character) return false;

    const [session] = await this.db.client
      .select()
      .from(this.db.schema.gameSessions)
      .where(eq(this.db.schema.gameSessions.id, character.sessionId));

    return session?.gmId === userId;
  }

  async checkCharacterOwnership(characterId: string, userId: string): Promise<boolean> {
    const [character] = await this.db.client
      .select()
      .from(this.db.schema.characters)
      .where(eq(this.db.schema.characters.id, characterId));

    return character?.userId === userId;
  }
}
