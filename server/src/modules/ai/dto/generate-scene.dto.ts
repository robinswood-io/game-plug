import { z } from 'zod';

export const generateSceneSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  description: z.string().optional(),
});

export type GenerateSceneDto = z.infer<typeof generateSceneSchema>;
