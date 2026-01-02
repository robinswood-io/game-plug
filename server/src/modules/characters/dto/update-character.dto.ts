import { insertCharacterSchema } from '../../../shared/schema';
import { type InsertCharacter } from '../../../common/database/database.service';

/**
 * Update Character DTO
 */
export type UpdateCharacterDto = Partial<Omit<InsertCharacter, 'sessionId' | 'userId'>>;

export const updateCharacterSchema = insertCharacterSchema
  .omit({
    sessionId: true,
    userId: true,
  })
  .partial();
