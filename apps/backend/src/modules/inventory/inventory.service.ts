import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { inventory } from '@shared/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class InventoryService {
  constructor(private readonly db: DatabaseService) {}

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

  async create(data: any) {
    const [item] = await this.db.db
      .insert(inventory)
      .values(data)
      .returning();
    return item;
  }

  async update(id: string, data: any) {
    const [updated] = await this.db.db
      .update(inventory)
      .set({ ...data, updatedAt: new Date() })
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
}
