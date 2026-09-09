import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { inventory } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { CharactersService } from '../characters/characters.service';
import { CreateInventoryDto, UpdateInventoryDto } from './dto';

@Injectable()
export class InventoryService {
  constructor(
    private readonly db: DatabaseService,
    @Inject(forwardRef(() => CharactersService))
    private readonly charactersService: CharactersService,
  ) {}

  async findByCharacter(characterId: string) {
    return this.db.db.query.inventory.findMany({
      where: eq(inventory.characterId, characterId),
      orderBy: (inventory, { desc }) => [desc(inventory.createdAt)],
    });
  }

  async findByCharacterAuthorized(characterId: string, userId: string) {
    await this.charactersService.findOneAuthorized(characterId, userId);
    return this.findByCharacter(characterId);
  }

  async findOne(id: string) {
    const item = await this.db.db.query.inventory.findFirst({
      where: eq(inventory.id, id),
    });
    if (!item) {
      throw new NotFoundException(`Inventory item ${id} not found`);
    }
    return item;
  }

  async create(data: CreateInventoryDto, userId: string) {
    if (!data.characterId) {
      throw new BadRequestException('Character ID is required');
    }

    // Validate character exists before creating inventory item (BUG-009 fix)
    const characterId = data.characterId as string;
    await this.charactersService.findOneAuthorized(characterId, userId);

    const [item] = await this.db.db
      .insert(inventory)
      .values({ ...data, characterId } as typeof inventory.$inferInsert)
      .returning();
    return item;
  }

  async update(id: string, data: UpdateInventoryDto, userId: string, characterId?: string) {
    const existing = await this.findOneAuthorized(id, userId, characterId);
    const [updated] = await this.db.db
      .update(inventory)
      .set({ ...data, updatedAt: new Date() } as Partial<typeof inventory.$inferInsert>)
      .where(eq(inventory.id, id))
      .returning();
    if (!updated) {
      throw new NotFoundException(`Inventory item ${id} not found`);
    }
    return updated;
  }

  async delete(id: string, userId: string, characterId?: string) {
    await this.findOneAuthorized(id, userId, characterId);
    const result = await this.db.db
      .delete(inventory)
      .where(eq(inventory.id, id))
      .returning();
    if (result.length === 0) {
      throw new NotFoundException(`Inventory item ${id} not found`);
    }
  }

  async toggleEquipped(id: string, userId: string) {
    const item = await this.findOneAuthorized(id, userId);

    const [updated] = await this.db.db
      .update(inventory)
      .set({
        isEquipped: !item.isEquipped,
      } as Partial<typeof inventory.$inferInsert>)
      .where(eq(inventory.id, id))
      .returning();

    return updated;
  }

  private async findOneAuthorized(id: string, userId: string, characterId?: string) {
    const item = await this.findOne(id);

    if (characterId && item.characterId !== characterId) {
      throw new ForbiddenException('Inventory item does not belong to this character');
    }

    await this.charactersService.findOneAuthorized(item.characterId, userId);
    return item;
  }
}
