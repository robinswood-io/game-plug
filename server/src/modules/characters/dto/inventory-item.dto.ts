import { insertInventorySchema } from '../../../shared/schema';
import { z } from 'zod';

// @ts-ignore drizzle-zod type compatibility
export type CreateInventoryItemDto = Omit<z.infer<typeof insertInventorySchema>, 'characterId'>;

export const createInventoryItemSchema = insertInventorySchema.omit({
  characterId: true,
});

/**
 * Update Inventory Item DTO
 * Note: id is already excluded in insertInventorySchema
 */
// @ts-ignore drizzle-zod type compatibility
export type UpdateInventoryItemDto = Partial<Omit<z.infer<typeof insertInventorySchema>, 'characterId'>>;

export const updateInventoryItemSchema = insertInventorySchema
  .omit({ characterId: true })
  .partial();
