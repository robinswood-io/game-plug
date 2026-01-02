import { insertActiveEffectSchema } from '../../../shared/schema';
import { z } from 'zod';

// @ts-ignore drizzle-zod type compatibility
export type CreateActiveEffectDto = Omit<z.infer<typeof insertActiveEffectSchema>, 'characterId'>;

export const createActiveEffectSchema = insertActiveEffectSchema.omit({
  characterId: true,
});

/**
 * Update Active Effect DTO
 * Note: id is already excluded in insertActiveEffectSchema
 */
// @ts-ignore drizzle-zod type compatibility
export type UpdateActiveEffectDto = Partial<Omit<z.infer<typeof insertActiveEffectSchema>, 'characterId'>>;

export const updateActiveEffectSchema = insertActiveEffectSchema
  .omit({ characterId: true })
  .partial();
