import { z } from 'zod';

export const applyEffectSchema = z.object({
  name: z.string().min(1, 'Effect name is required'),
  description: z.string().optional(),
  type: z.enum(['buff', 'debuff', 'damage', 'sanity_loss']),
  value: z.string().optional(), // String to support "+10", "-5" formats
  duration: z.number().int().min(0).optional().default(0),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type ApplyEffectDto = z.infer<typeof applyEffectSchema>;
