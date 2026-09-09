import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { sanityConditions } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { CharactersService } from '../characters/characters.service';

@Injectable()
export class SanityService {
  constructor(
    private readonly db: DatabaseService,
    private readonly charactersService: CharactersService,
  ) {}

  async findByCharacter(characterId: string) {
    return this.db.db.query.sanityConditions.findMany({
      where: eq(sanityConditions.characterId, characterId),
      orderBy: (sanityConditions, { desc }) => [desc(sanityConditions.createdAt)],
    });
  }

  async findByCharacterAuthorized(characterId: string, userId: string) {
    await this.charactersService.findOneAuthorized(characterId, userId);
    return this.findByCharacter(characterId);
  }

  async findOne(id: string) {
    const condition = await this.db.db.query.sanityConditions.findFirst({
      where: eq(sanityConditions.id, id),
    });
    if (!condition) {
      throw new NotFoundException(`Sanity condition ${id} not found`);
    }
    return condition;
  }

  async create(data: any, userId: string) {
    if (!data.characterId) {
      throw new BadRequestException('Character ID is required');
    }
    await this.charactersService.findOneAuthorized(data.characterId, userId);
    const [condition] = await this.db.db
      .insert(sanityConditions)
      .values(data)
      .returning();
    return condition;
  }

  async update(id: string, data: any, userId: string) {
    await this.findOneAuthorized(id, userId);
    const [updated] = await this.db.db
      .update(sanityConditions)
      .set(data)
      .where(eq(sanityConditions.id, id))
      .returning();
    if (!updated) {
      throw new NotFoundException(`Sanity condition ${id} not found`);
    }
    return updated;
  }

  async delete(id: string, userId: string) {
    await this.findOneAuthorized(id, userId);
    const result = await this.db.db
      .delete(sanityConditions)
      .where(eq(sanityConditions.id, id))
      .returning();
    if (result.length === 0) {
      throw new NotFoundException(`Sanity condition ${id} not found`);
    }
  }

  private async findOneAuthorized(id: string, userId: string) {
    const condition = await this.findOne(id);
    if (!condition.characterId) {
      throw new ForbiddenException('Sanity condition is not attached to a character');
    }
    await this.charactersService.findOneAuthorized(condition.characterId, userId);
    return condition;
  }
}
