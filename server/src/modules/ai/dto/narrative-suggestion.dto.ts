import { z } from 'zod';

export const narrativeSuggestionSchema = z.object({
  context: z.string().min(1, 'Context is required'),
});

export type NarrativeSuggestionDto = z.infer<typeof narrativeSuggestionSchema>;
