import { insertGameSessionSchema } from '../../../shared/schema';
import { type InsertGameSession } from '../../../common/database/database.service';

/**
 * Update Session DTO
 * Partial of InsertGameSession (all fields optional)
 * Excludes gmId, code (cannot be updated)
 */
export type UpdateSessionDto = Partial<Omit<InsertGameSession, 'gmId' | 'code'>>;

/**
 * Export the schema for validation
 */
export const updateSessionSchema = insertGameSessionSchema
  .omit({
    gmId: true,
    code: true,
  })
  .partial();
