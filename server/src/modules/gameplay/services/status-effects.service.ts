import { Injectable } from '@nestjs/common';
import { DatabaseService, type InsertActiveEffect } from '../../../common/database/database.service';
import { activeEffects } from '../../../shared/schema';
import { eq, and } from 'drizzle-orm';

// Call of Cthulhu 7th Edition - Status Effects Logic

// Sanity thresholds and effects
export const SANITY_THRESHOLDS = {
  INDEFINITE_INSANITY: 0,
  MAJOR_MADNESS: 0.2,
  TEMPORARY_INSANITY: 5,
  PHOBIA_TRIGGER: 0.5,
};

// Hit Points thresholds and effects
export const HP_THRESHOLDS = {
  DYING: 0,
  UNCONSCIOUS: 2,
  MAJOR_WOUND: 0.5,
  MINOR_WOUND: 0.75,
};

export interface StatusCheck {
  characterId: string;
  currentHp: number;
  maxHp: number;
  currentSanity: number;
  maxSanity: number;
  strength?: number;
  constitution?: number;
  size?: number;
}

@Injectable()
export class StatusEffectsService {
  constructor(private readonly db: DatabaseService) {}

  async applyAutomaticStatusEffects(status: StatusCheck): Promise<void> {
    const { characterId, currentHp, maxHp, currentSanity, maxSanity } = status;

    // Clear existing automatic debuffs
    await this.db.client.delete(activeEffects).where(
      and(
        eq(activeEffects.characterId, characterId),
        eq(activeEffects.type, 'debuff'),
      ),
    );

    const effectsToApply: InsertActiveEffect[] = [];

    // HP-based effects
    const hpPercentage = currentHp / maxHp;

    if (currentHp <= 0) {
      effectsToApply.push({
        characterId,
        name: 'Mort',
        description: 'Le personnage est décédé',
        type: 'debuff',
        value: '-100',
        duration: 0,
      });
    } else if (currentHp <= HP_THRESHOLDS.UNCONSCIOUS) {
      effectsToApply.push({
        characterId,
        name: 'Mourant',
        description: 'Inconscient et en train de mourir. Nécessite des soins immédiats!',
        type: 'debuff',
        value: '-50',
        duration: 0,
      });
    } else if (hpPercentage < HP_THRESHOLDS.MAJOR_WOUND) {
      effectsToApply.push({
        characterId,
        name: 'Blessure Grave',
        description: 'Malus de -20% à tous les jets de compétence',
        type: 'debuff',
        value: '-20',
        duration: 0,
      });
    } else if (hpPercentage < HP_THRESHOLDS.MINOR_WOUND) {
      effectsToApply.push({
        characterId,
        name: 'Blessure Légère',
        description: 'Malus de -10% à tous les jets de compétence',
        type: 'debuff',
        value: '-10',
        duration: 0,
      });
    }

    // Sanity-based effects
    const sanityPercentage = currentSanity / maxSanity;

    if (currentSanity <= 0) {
      effectsToApply.push({
        characterId,
        name: 'Folie Permanente',
        description: "L'esprit du personnage est définitivement brisé",
        type: 'debuff',
        value: '-100',
        duration: 0,
      });
    } else if (sanityPercentage < SANITY_THRESHOLDS.MAJOR_MADNESS) {
      effectsToApply.push({
        characterId,
        name: 'Folie Majeure',
        description: 'État mental extrêmement fragile. Malus de -30% aux jets sociaux',
        type: 'debuff',
        value: '-30',
        duration: 0,
      });
    } else if (sanityPercentage < SANITY_THRESHOLDS.PHOBIA_TRIGGER) {
      effectsToApply.push({
        characterId,
        name: 'Instabilité Mentale',
        description: 'Nervosité et paranoïa. Malus de -15% aux jets de Psychologie et Persuasion',
        type: 'debuff',
        value: '-15',
        duration: 0,
      });
    }

    // Combined effects (low HP + low Sanity)
    if (hpPercentage < 0.3 && sanityPercentage < 0.3) {
      effectsToApply.push({
        characterId,
        name: 'État Critique',
        description: "Corps et esprit au bord de l'effondrement. Malus de -40% à tous les jets",
        type: 'debuff',
        value: '-40',
        duration: 0,
      });
    }

    if (effectsToApply.length > 0) {
      await this.db.addActiveEffects(effectsToApply);
    }
  }

  calculateSanityLoss(
    horrorLevel: 'minor' | 'moderate' | 'major' | 'extreme',
    currentSanity: number,
    mythosCthulhu: number = 0,
  ): number {
    const baseLoss = {
      minor: 1,
      moderate: 3,
      major: 6,
      extreme: 10,
    };

    let loss = baseLoss[horrorLevel];

    if (mythosCthulhu > 0) {
      loss = Math.max(1, loss - Math.floor(mythosCthulhu / 20));
    }

    if (currentSanity < 20) {
      loss = Math.ceil(loss * 1.5);
    }

    return loss;
  }

  shouldMakeSanityRoll(sanityLostThisRound: number, maxSanityPerRound: number = 5): boolean {
    return sanityLostThisRound >= maxSanityPerRound;
  }

  async applyTemporaryInsanity(characterId: string, duration: string = '1d10 rounds'): Promise<void> {
    const insanityTypes = [
      { name: 'Amnésie', description: 'Ne se souvient plus des dernières heures' },
      { name: 'Catatonie', description: 'Figé par la terreur, incapable de bouger' },
      { name: 'Fuite Panique', description: 'Fuit sans réfléchir loin du danger' },
      { name: 'Crise de Panique', description: 'Tremblements incontrôlables et hyperventilation' },
      { name: 'Hallucinations', description: "Voit et entend des choses qui n'existent pas" },
    ];

    const randomInsanity = insanityTypes[Math.floor(Math.random() * insanityTypes.length)];

    await this.db.addActiveEffect({
      characterId,
      name: `Folie Temporaire: ${randomInsanity.name}`,
      description: randomInsanity.description,
      type: 'debuff',
      value: '-25',
      duration: 10,
    });
  }

  calculateNaturalHealing(
    constitution: number,
    hasFirstAid: boolean = false,
    hasMedicine: boolean = false,
  ): number {
    let healing = Math.ceil(constitution / 10);

    if (hasFirstAid) healing += 1;
    if (hasMedicine) healing += 2;

    return healing;
  }

  calculateDamageReduction(incomingDamage: number, size: number, hasArmor: boolean = false): number {
    let reduction = 0;

    if (size >= 80) reduction += 2;
    if (size >= 100) reduction += 1;

    if (hasArmor) reduction += 3;

    return Math.max(1, incomingDamage - reduction);
  }
}
