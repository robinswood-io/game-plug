import { z } from 'zod';

export const diceRollSchema = z.object({
  characterId: z.string().optional(),
  sessionId: z.string(),
  diceType: z.enum(['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100', 'custom']),
  result: z.number().int(),
  modifier: z.number().int().optional().default(0),
  skillName: z.string().optional(),
  skillValue: z.number().int().optional(),
  success: z.boolean().optional(),
  critical: z.boolean().optional(),
  fumble: z.boolean().optional(),
  description: z.string().optional(),
});

export type DiceRollDto = z.infer<typeof diceRollSchema>;
