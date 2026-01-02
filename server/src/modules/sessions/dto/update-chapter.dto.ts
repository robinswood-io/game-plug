import { insertChapterSchema } from '../../../shared/schema';
import { type InsertChapter } from '../../../common/database/database.service';

/**
 * Update Chapter DTO
 * Partial of InsertChapter (all fields optional)
 * Excludes sessionId (cannot be updated)
 */
export type UpdateChapterDto = Partial<Omit<InsertChapter, 'sessionId'>>;

/**
 * Export the schema for validation
 */
export const updateChapterSchema = insertChapterSchema
  .omit({
    sessionId: true,
  })
  .partial();
