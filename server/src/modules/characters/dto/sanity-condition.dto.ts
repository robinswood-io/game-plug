import { insertSanityConditionSchema } from '../../../shared/schema';
import { z } from 'zod';

// @ts-ignore drizzle-zod type compatibility
export type CreateSanityConditionDto = Omit<z.infer<typeof insertSanityConditionSchema>, 'characterId'>;

export const createSanityConditionSchema = insertSanityConditionSchema.omit({
  characterId: true,
});
