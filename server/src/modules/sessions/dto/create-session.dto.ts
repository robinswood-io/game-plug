import { insertGameSessionSchema } from '../../../shared/schema';
import { type InsertGameSession } from '../../../common/database/database.service';

/**
 * Create Session DTO
 * Note: gmId, code, and status are set server-side
 */
export type CreateSessionDto = Omit<InsertGameSession, 'gmId' | 'code' | 'status'>;

/**
 * Export the schema for validation (without gmId, code, status)
 */
export const createSessionSchema = insertGameSessionSchema.omit({
  gmId: true,
  code: true,
  status: true,
});
