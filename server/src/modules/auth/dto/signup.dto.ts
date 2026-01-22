import { z } from 'zod';

/**
 * Signup DTO Schema - Zod validation
 * Reuses schema from shared/schema.ts for consistency
 */
export const SignupDtoSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
});

/**
 * Type inference from schema
 * Ensures DTO type is always in sync with validation schema
 */
export type SignupDto = z.infer<typeof SignupDtoSchema>;
