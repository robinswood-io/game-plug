import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
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

  async findOne(id: string) {
    const item = await this.db.db.query.inventory.findFirst({
      where: eq(inventory.id, id),
    });
    if (!item) {
      throw new NotFoundException(`Inventory item ${id} not found`);
    }
    return item;
  }

  async create(data: CreateInventoryDto) {
    // Validate character exists before creating inventory item (BUG-009 fix)
    const characterId = data.characterId as string;
    await this.charactersService.findOne(characterId);

    const [item] = await this.db.db
      .insert(inventory)
      .values({ ...data, characterId } as typeof inventory.$inferInsert)
      .returning();
    return item;
  }

  async update(id: string, data: UpdateInventoryDto) {
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

  async delete(id: string) {
    const result = await this.db.db
      .delete(inventory)
      .where(eq(inventory.id, id))
      .returning();
    if (result.length === 0) {
      throw new NotFoundException(`Inventory item ${id} not found`);
    }
  }

  async toggleEquipped(id: string) {
    const item = await this.findOne(id);

    const [updated] = await this.db.db
      .update(inventory)
      .set({
        isEquipped: !item.isEquipped,
      } as Partial<typeof inventory.$inferInsert>)
      .where(eq(inventory.id, id))
      .returning();

    return updated;
  }
}
