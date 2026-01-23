import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { characters } from '@shared/schema';
import { eq } from 'drizzle-orm';

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
    const [character] = await this.db.db
      .insert(characters)
      .values({ ...data, userId })
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
}
