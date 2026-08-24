import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { activeEffects } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { CreateEffectDto } from './dto/create-effect.dto';
import { UpdateEffectDto } from './dto/update-effect.dto';
import { CharactersService } from '../characters/characters.service';

@Injectable()
export class EffectsService {
  constructor(
    private readonly db: DatabaseService,
    @Inject(forwardRef(() => CharactersService))
    private readonly charactersService: CharactersService,
  ) {}

  async create(data: CreateEffectDto, userId: string) {
    await this.charactersService.findOneAuthorized(data.characterId, userId);

    const [effect] = await this.db.db
      .insert(activeEffects)
      .values(data)
      .returning();
    return effect;
  }

  async update(id: string, data: UpdateEffectDto, userId: string) {
    const existing = await this.findOne(id);
    await this.charactersService.findOneAuthorized(existing.characterId, userId);
    const [updated] = await this.db.db
      .update(activeEffects)
      .set(data)
      .where(eq(activeEffects.id, id))
      .returning();

    if (!updated) {
      throw new NotFoundException(`Active effect ${id} not found`);
    }

    return updated;
  }

  async findOne(id: string) {
    const effect = await this.db.db.query.activeEffects.findFirst({
      where: eq(activeEffects.id, id),
    });

    if (!effect) {
      throw new NotFoundException(`Active effect ${id} not found`);
    }

    return effect;
  }

  async findByCharacter(characterId: string) {
    return this.db.db.query.activeEffects.findMany({
      where: eq(activeEffects.characterId, characterId),
    });
  }

  async delete(id: string) {
    await this.db.db.delete(activeEffects).where(eq(activeEffects.id, id));
  }
}
