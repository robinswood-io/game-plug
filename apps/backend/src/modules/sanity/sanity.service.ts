import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { sanityConditions } from '@shared/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class SanityService {
  constructor(private readonly db: DatabaseService) {}

  async findByCharacter(characterId: string) {
    return this.db.db.query.sanityConditions.findMany({
      where: eq(sanityConditions.characterId, characterId),
      orderBy: (sanityConditions, { desc }) => [desc(sanityConditions.createdAt)],
    });
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

  async create(data: any) {
    const [condition] = await this.db.db
      .insert(sanityConditions)
      .values(data)
      .returning();
    return condition;
  }

  async update(id: string, data: any) {
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

  async delete(id: string) {
    const result = await this.db.db
      .delete(sanityConditions)
      .where(eq(sanityConditions.id, id))
      .returning();
    if (result.length === 0) {
      throw new NotFoundException(`Sanity condition ${id} not found`);
    }
  }
}
