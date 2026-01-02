import { z } from 'zod';

export const generateAvatarSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  characterName: z.string().min(1, 'Character name is required'),
  occupation: z.string().optional(),
  age: z.number().int().positive().optional(),
});

export type GenerateAvatarDto = z.infer<typeof generateAvatarSchema>;
