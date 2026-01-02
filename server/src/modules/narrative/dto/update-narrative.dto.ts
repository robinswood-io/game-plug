import { z } from 'zod';

export const updateNarrativeSchema = z.object({
  content: z.string().min(1).trim().optional(),
  entryType: z.enum(['note', 'event', 'npc', 'location', 'clue']).optional(),
  isVisibleToPlayers: z.boolean().optional(),
});

export type UpdateNarrativeDto = z.infer<typeof updateNarrativeSchema>;
