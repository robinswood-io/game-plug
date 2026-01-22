import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../common/database/database.service';
import type { Character } from '../../../shared/schema';

@Injectable()
export class BuffsService {
  constructor(private readonly db: DatabaseService) {}

  async applyHealing(
    character: Character,
    healAmount: number,
    description?: string,
  ): Promise<{ finalHp: number; amountHealed: number }> {
    const currentHp = character.hitPoints;
    const maxHp = character.maxHitPoints;

    const finalHp = Math.min(currentHp + healAmount, maxHp);
    const amountHealed = finalHp - currentHp;

    await this.db.updateCharacter(character.id, {
      hitPoints: finalHp,
    });

    await this.db.addActiveEffect({
      characterId: character.id,
      name: description || `Soin (+${amountHealed} PV)`,
      description: `Récupération de ${amountHealed} points de vie`,
      type: 'buff',
      value: amountHealed.toString(),
      duration: 0,
    });

    return { finalHp, amountHealed };
  }

  async applySanityRecovery(
    character: Character,
    sanityAmount: number,
    description?: string,
  ): Promise<{ finalSanity: number; amountRecovered: number }> {
    const currentSanity = character.sanity;
    const maxSanity = character.maxSanity;

    const finalSanity = Math.min(currentSanity + sanityAmount, maxSanity);
    const amountRecovered = finalSanity - currentSanity;

    await this.db.updateCharacter(character.id, {
      sanity: finalSanity,
    });

    await this.db.addActiveEffect({
      characterId: character.id,
      name: description || `Récupération Mentale (+${amountRecovered} SAN)`,
      description: `Récupération de ${amountRecovered} points de sanité mentale`,
      type: 'buff',
      value: amountRecovered.toString(),
      duration: 0,
    });

    return { finalSanity, amountRecovered };
  }

  async applyMagicRecovery(
    character: Character,
    magicAmount: number,
    description?: string,
  ): Promise<{ finalMagic: number; amountRecovered: number }> {
    const currentMagic = character.magicPoints;
    const maxMagic = character.maxMagicPoints;

    const finalMagic = Math.min(currentMagic + magicAmount, maxMagic);
    const amountRecovered = finalMagic - currentMagic;

    await this.db.updateCharacter(character.id, {
      magicPoints: finalMagic,
    });

    await this.db.addActiveEffect({
      characterId: character.id,
      name: description || `Récupération Magique (+${amountRecovered} PM)`,
      description: `Récupération de ${amountRecovered} points de magie`,
      type: 'buff',
      value: amountRecovered.toString(),
      duration: 0,
    });

    return { finalMagic, amountRecovered };
  }

  async applyLuckBoost(
    character: Character,
    luckAmount: number,
    duration: number = 24,
    description?: string,
  ): Promise<{ finalLuck: number; amountIncreased: number }> {
    const currentLuck = character.luck;

    const finalLuck = Math.min(currentLuck + luckAmount, 99);
    const amountIncreased = finalLuck - currentLuck;

    await this.db.updateCharacter(character.id, {
      luck: finalLuck,
    });

    await this.db.addActiveEffect({
      characterId: character.id,
      name: description || `Chance Améliorée (+${amountIncreased})`,
      description: `Augmentation temporaire de ${amountIncreased} points de chance`,
      type: 'buff',
      value: amountIncreased.toString(),
      duration: duration,
    });

    return { finalLuck, amountIncreased };
  }

  async applySkillBonus(
    character: Character,
    skillBonus: number,
    duration: number = 1,
    description?: string,
  ): Promise<void> {
    await this.db.addActiveEffect({
      characterId: character.id,
      name: description || `Bonus de Compétence (+${skillBonus}%)`,
      description: `Bonus de ${skillBonus}% aux jets de compétence`,
      type: 'buff',
      value: skillBonus.toString(),
      duration: duration,
    });
  }
}
