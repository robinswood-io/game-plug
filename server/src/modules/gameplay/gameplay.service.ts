import { Injectable } from '@nestjs/common';
import type { Character } from '@shared/schema';
import { StatusEffectsService, type StatusCheck } from './services/status-effects.service';
import { BuffsService } from './services/buffs.service';
import { TreatmentService } from './services/treatment.service';

// Re-export types for convenience
export type { StatusCheck } from './services/status-effects.service';

/**
 * Main Gameplay Service - Orchestrates game mechanics
 * Delegates to specialized services for cleaner code organization
 */
@Injectable()
export class GameplayService {
  constructor(
    private readonly statusEffectsService: StatusEffectsService,
    private readonly buffsService: BuffsService,
    private readonly treatmentService: TreatmentService,
  ) {}

  // ========== STATUS EFFECTS ==========

  async applyAutomaticStatusEffects(status: StatusCheck): Promise<void> {
    return this.statusEffectsService.applyAutomaticStatusEffects(status);
  }

  calculateSanityLoss(
    horrorLevel: 'minor' | 'moderate' | 'major' | 'extreme',
    currentSanity: number,
    mythosCthulhu?: number,
  ): number {
    return this.statusEffectsService.calculateSanityLoss(horrorLevel, currentSanity, mythosCthulhu);
  }

  shouldMakeSanityRoll(sanityLostThisRound: number, maxSanityPerRound?: number): boolean {
    return this.statusEffectsService.shouldMakeSanityRoll(sanityLostThisRound, maxSanityPerRound);
  }

  async applyTemporaryInsanity(characterId: string, duration?: string): Promise<void> {
    return this.statusEffectsService.applyTemporaryInsanity(characterId, duration);
  }

  calculateNaturalHealing(constitution: number, hasFirstAid?: boolean, hasMedicine?: boolean): number {
    return this.statusEffectsService.calculateNaturalHealing(constitution, hasFirstAid, hasMedicine);
  }

  calculateDamageReduction(incomingDamage: number, size: number, hasArmor?: boolean): number {
    return this.statusEffectsService.calculateDamageReduction(incomingDamage, size, hasArmor);
  }

  // ========== BUFFS ==========

  async applyHealing(
    character: Character,
    healAmount: number,
    description?: string,
  ): Promise<{ finalHp: number; amountHealed: number }> {
    return this.buffsService.applyHealing(character, healAmount, description);
  }

  async applySanityRecovery(
    character: Character,
    sanityAmount: number,
    description?: string,
  ): Promise<{ finalSanity: number; amountRecovered: number }> {
    return this.buffsService.applySanityRecovery(character, sanityAmount, description);
  }

  async applyMagicRecovery(
    character: Character,
    magicAmount: number,
    description?: string,
  ): Promise<{ finalMagic: number; amountRecovered: number }> {
    return this.buffsService.applyMagicRecovery(character, magicAmount, description);
  }

  async applyLuckBoost(
    character: Character,
    luckAmount: number,
    duration?: number,
    description?: string,
  ): Promise<{ finalLuck: number; amountIncreased: number }> {
    return this.buffsService.applyLuckBoost(character, luckAmount, duration, description);
  }

  async applySkillBonus(
    character: Character,
    skillBonus: number,
    duration?: number,
    description?: string,
  ): Promise<void> {
    return this.buffsService.applySkillBonus(character, skillBonus, duration, description);
  }

  // ========== TREATMENTS ==========

  async processNaturalHealing(
    character: Character,
    restType: 'short' | 'long' | 'extended',
  ): Promise<{ hpRecovered: number; sanityRecovered: number }> {
    return this.treatmentService.processNaturalHealing(character, restType);
  }

  async applyMedicalTreatment(
    character: Character,
    treatmentType: 'first_aid' | 'medicine' | 'surgery',
    skillSuccess: boolean,
    criticalSuccess?: boolean,
  ): Promise<{ hpRecovered: number; success: boolean }> {
    return this.treatmentService.applyMedicalTreatment(character, treatmentType, skillSuccess, criticalSuccess);
  }

  async applyPsychologicalTreatment(
    character: Character,
    treatmentType: 'reassurance' | 'psychoanalysis' | 'group_therapy' | 'asylum',
    skillSuccess: boolean,
    criticalSuccess?: boolean,
  ): Promise<{ sanityRecovered: number; success: boolean }> {
    return this.treatmentService.applyPsychologicalTreatment(
      character,
      treatmentType,
      skillSuccess,
      criticalSuccess,
    );
  }
}
