import { z } from 'zod';

// Grant skill points (GM only)
export const grantSkillPointsSchema = z.object({
  points: z.number().int().positive('Points must be a positive number'),
});

export type GrantSkillPointsDto = z.infer<typeof grantSkillPointsSchema>;

// Distribute skill points (player action)
export const distributeSkillPointsSchema = z.object({
  skillUpdates: z.record(z.string(), z.number().int().min(0)),
});

export type DistributeSkillPointsDto = z.infer<typeof distributeSkillPointsSchema>;
