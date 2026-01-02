import { z } from 'zod';

export const createNarrativeSchema = z.object({
  content: z.string().min(1, 'Content is required').trim(),
  entryType: z.enum(['note', 'event', 'npc', 'location', 'clue']).optional().default('note'),
  isAiGenerated: z.boolean().optional().default(false),
});

export type CreateNarrativeDto = z.infer<typeof createNarrativeSchema>;
