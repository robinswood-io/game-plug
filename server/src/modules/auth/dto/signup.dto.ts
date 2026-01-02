import { gmSignupSchema } from '../../../shared/schema';
import { z } from 'zod';

/**
 * Signup DTO
 * Reuses the schema from @shared/schema for consistency with Express backend
 */
export type SignupDto = z.infer<typeof gmSignupSchema>;

/**
 * Export the schema for validation
 */
export const signupSchema = gmSignupSchema;
