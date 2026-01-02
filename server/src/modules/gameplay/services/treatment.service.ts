import { Injectable } from '@nestjs/common';
import type { Character } from '@shared/schema';
import { BuffsService } from './buffs.service';

@Injectable()
export class TreatmentService {
  constructor(private readonly buffsService: BuffsService) {}

  async processNaturalHealing(
    character: Character,
    restType: 'short' | 'long' | 'extended',
  ): Promise<{ hpRecovered: number; sanityRecovered: number }> {
    let hpRecovered = 0;
    let sanityRecovered = 0;

    switch (restType) {
      case 'short':
        hpRecovered = 1;
        break;

      case 'long':
        hpRecovered = Math.floor(Math.random() * 4) + 1;
        sanityRecovered = 1;
        break;

      case 'extended':
        hpRecovered = Math.floor(Math.random() * 4) + 1 + Math.floor(Math.random() * 4) + 1 + 2;
        sanityRecovered = Math.floor(Math.random() * 4) + 1;
        break;
    }

    if (hpRecovered > 0) {
      await this.buffsService.applyHealing(
        character,
        hpRecovered,
        `Repos ${restType === 'short' ? 'court' : restType === 'long' ? 'long' : 'étendu'}`,
      );
    }

    if (sanityRecovered > 0) {
      await this.buffsService.applySanityRecovery(character, sanityRecovered, `Récupération mentale (repos)`);
    }

    return { hpRecovered, sanityRecovered };
  }

  async applyMedicalTreatment(
    character: Character,
    treatmentType: 'first_aid' | 'medicine' | 'surgery',
    skillSuccess: boolean,
    criticalSuccess: boolean = false,
  ): Promise<{ hpRecovered: number; success: boolean }> {
    if (!skillSuccess) {
      return { hpRecovered: 0, success: false };
    }

    let hpRecovered = 0;
    let description = '';

    switch (treatmentType) {
      case 'first_aid':
        hpRecovered = criticalSuccess
          ? Math.floor(Math.random() * 3) + 1 + Math.floor(Math.random() * 3) + 1
          : Math.floor(Math.random() * 3) + 1;
        description = 'Premiers soins' + (criticalSuccess ? ' excellents' : '');
        break;

      case 'medicine':
        hpRecovered = criticalSuccess
          ? Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1 + 2
          : Math.floor(Math.random() * 6) + 1 + 1;
        description = 'Traitement médical' + (criticalSuccess ? ' expert' : '');
        break;

      case 'surgery':
        if (criticalSuccess) {
          hpRecovered =
            Math.floor(Math.random() * 6) +
            1 +
            Math.floor(Math.random() * 6) +
            1 +
            Math.floor(Math.random() * 6) +
            1 +
            3;
          description = 'Chirurgie magistrale';
        } else {
          hpRecovered = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1 + 2;
          description = 'Intervention chirurgicale';
        }
        break;
    }

    await this.buffsService.applyHealing(character, hpRecovered, description);

    return { hpRecovered, success: true };
  }

  async applyPsychologicalTreatment(
    character: Character,
    treatmentType: 'reassurance' | 'psychoanalysis' | 'group_therapy' | 'asylum',
    skillSuccess: boolean,
    criticalSuccess: boolean = false,
  ): Promise<{ sanityRecovered: number; success: boolean }> {
    if (!skillSuccess) {
      return { sanityRecovered: 0, success: false };
    }

    let sanityRecovered = 0;
    let description = '';

    switch (treatmentType) {
      case 'reassurance':
        sanityRecovered = criticalSuccess ? 2 : 1;
        description = 'Réconfort' + (criticalSuccess ? ' profond' : '');
        break;

      case 'psychoanalysis':
        sanityRecovered = criticalSuccess
          ? Math.floor(Math.random() * 4) + 1 + Math.floor(Math.random() * 4) + 1
          : Math.floor(Math.random() * 4) + 1;
        description = 'Psychanalyse' + (criticalSuccess ? ' approfondie' : '');
        break;

      case 'group_therapy':
        sanityRecovered = criticalSuccess
          ? Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1
          : Math.floor(Math.random() * 6) + 1;
        description = 'Thérapie de groupe' + (criticalSuccess ? ' intensive' : '');
        break;

      case 'asylum':
        if (criticalSuccess) {
          sanityRecovered =
            Math.floor(Math.random() * 6) +
            1 +
            Math.floor(Math.random() * 6) +
            1 +
            Math.floor(Math.random() * 6) +
            1;
          description = 'Traitement psychiatrique révolutionnaire';
        } else {
          sanityRecovered = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
          description = 'Traitement en asile';
        }
        break;
    }

    await this.buffsService.applySanityRecovery(character, sanityRecovered, description);

    return { sanityRecovered, success: true };
  }
}
