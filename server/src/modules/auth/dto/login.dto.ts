import { z } from 'zod';

/**
 * Login DTO Schema - Zod validation
 * Reuses schema from shared/schema.ts for consistency
 */
export const LoginDtoSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

/**
 * Type inference from schema
 * Ensures DTO type is always in sync with validation schema
 */
export type LoginDto = z.infer<typeof LoginDtoSchema>;
