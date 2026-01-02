import { insertCharacterSchema } from '../../../shared/schema';
import { type InsertCharacter } from '../../../common/database/database.service';

/**
 * Create Character DTO
 * Note: sessionId and userId are set from context
 */
export type CreateCharacterDto = Omit<InsertCharacter, 'sessionId' | 'userId'>;

/**
 * Export the schema for validation
 */
export const createCharacterSchema = insertCharacterSchema.omit({
  sessionId: true,
  userId: true,
});
