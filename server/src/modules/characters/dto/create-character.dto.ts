import { insertCharacterSchema } from '../../../shared/schema';
import { type InsertCharacter } from '../../../common/database/database.service';

/**
 * Create Character DTO
 * Note: sessionId is required in request body, userId is set from auth context
 */
export type CreateCharacterDto = Omit<InsertCharacter, 'userId'>;

/**
 * Export the schema for validation
 */
export const createCharacterSchema = insertCharacterSchema.omit({
  userId: true,
});
