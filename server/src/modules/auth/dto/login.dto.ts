import { localLoginSchema } from '../../../shared/schema';
import { z } from 'zod';

/**
 * Login DTO
 * Reuses the schema from @shared/schema for consistency with Express backend
 */
export type LoginDto = z.infer<typeof localLoginSchema>;

/**
 * Export the schema for validation
 */
export const loginSchema = localLoginSchema;
