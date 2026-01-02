import { insertChapterSchema } from '../../../shared/schema';
import { type InsertChapter } from '../../../common/database/database.service';

/**
 * Create Chapter DTO
 * Note: sessionId is set from URL params
 */
export type CreateChapterDto = Omit<InsertChapter, 'sessionId'>;

/**
 * Export the schema for validation (without sessionId)
 */
export const createChapterSchema = insertChapterSchema.omit({
  sessionId: true,
});
