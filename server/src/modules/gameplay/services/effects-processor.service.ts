import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../common/database/database.service';
import { GameplayService } from '../gameplay.service';
import type { Character, ActiveEffect } from '@shared/schema';

export interface EffectProcessingResult {
  updateData: Partial<Character>;
  shouldApplyAutoEffects: boolean;
}

@Injectable()
export class EffectsProcessorService {
  constructor(
    private readonly db: DatabaseService,
    private readonly gameplayService: GameplayService,
  ) {}

  async processEffect(
    character: Character,
    effectType: string,
    effectName: string | undefined,
    value: number,
    duration: number | undefined,
  ): Promise<EffectProcessingResult> {
    const updateData: Partial<Character> = {};
    let shouldApplyAutoEffects = false;

    if (effectType === 'damage' && value !== 0) {
      updateData.hitPoints = Math.max(0, character.hitPoints - Math.abs(value));
      shouldApplyAutoEffects = true;
    } else if (effectType === 'sanity_loss' && value !== 0) {
      updateData.sanity = Math.max(0, character.sanity - Math.abs(value));
      shouldApplyAutoEffects = true;

      if (Math.abs(value) >= 5) {
        await this.gameplayService.applyTemporaryInsanity(character.id);
      }
    } else if (effectType === 'buff') {
      await this.processBuff(character, effectName, Math.abs(value), duration || 0);
      shouldApplyAutoEffects = this.isHealingOrSanityBuff(effectName);
    }

    return { updateData, shouldApplyAutoEffects };
  }

  private async processBuff(
    character: Character,
    effectName: string | undefined,
    buffValue: number,
    duration: number,
  ): Promise<void> {
    const name = effectName?.toLowerCase() || '';

    if (this.isHealingBuff(name)) {
      const result = await this.gameplayService.applyHealing(character, buffValue, effectName);
      console.log(`Applied healing: +${result.amountHealed} HP to ${character.name}`);
    } else if (this.isSanityBuff(name)) {
      const result = await this.gameplayService.applySanityRecovery(character, buffValue, effectName);
      console.log(`Applied sanity recovery: +${result.amountRecovered} SAN to ${character.name}`);
    } else if (this.isMagicBuff(name)) {
      const result = await this.gameplayService.applyMagicRecovery(character, buffValue, effectName);
      console.log(`Applied magic recovery: +${result.amountRecovered} MP to ${character.name}`);
    } else if (this.isLuckBuff(name)) {
      const result = await this.gameplayService.applyLuckBoost(character, buffValue, duration, effectName);
      console.log(`Applied luck boost: +${result.amountIncreased} Luck to ${character.name}`);
    } else if (this.isSkillBuff(name)) {
      await this.gameplayService.applySkillBonus(character, buffValue, duration, effectName);
      console.log(`Applied skill bonus: +${buffValue}% to ${character.name}`);
    }
  }

  private isHealingOrSanityBuff(effectName: string | undefined): boolean {
    const name = effectName?.toLowerCase() || '';
    return this.isHealingBuff(name) || this.isSanityBuff(name);
  }

  private isHealingBuff(name: string): boolean {
    return (
      name.includes('soin') ||
      name.includes('heal') ||
      name.includes('premiers soins') ||
      name.includes('traitement') ||
      name.includes('chirurgie') ||
      name.includes('pv') ||
      name.includes('vie')
    );
  }

  private isSanityBuff(name: string): boolean {
    return (
      name.includes('sanité') ||
      name.includes('sanity') ||
      name.includes('thérapie') ||
      name.includes('réconfort') ||
      name.includes('psychanalyse')
    );
  }

  private isMagicBuff(name: string): boolean {
    return (
      name.includes('magie') ||
      name.includes('magic') ||
      name.includes('méditation') ||
      name.includes('repos rituel')
    );
  }

  private isLuckBuff(name: string): boolean {
    return name.includes('chance') || name.includes('luck') || name.includes('bénédiction');
  }

  private isSkillBuff(name: string): boolean {
    return (
      name.includes('compétence') ||
      name.includes('skill') ||
      name.includes('inspiration') ||
      name.includes('bonus')
    );
  }

  async applyAutoEffectsIfNeeded(
    character: Character,
    updateData: Partial<Character>,
    shouldApply: boolean,
  ): Promise<void> {
    if (!shouldApply) return;

    const updatedChar = { ...character, ...updateData };
    await this.gameplayService.applyAutomaticStatusEffects({
      characterId: character.id,
      currentHp: updatedChar.hitPoints ?? character.hitPoints,
      maxHp: updatedChar.maxHitPoints ?? character.maxHitPoints,
      currentSanity: updatedChar.sanity ?? character.sanity,
      maxSanity: updatedChar.maxSanity ?? character.maxSanity,
      strength: updatedChar.strength ?? character.strength,
      constitution: updatedChar.constitution ?? character.constitution,
      size: updatedChar.size ?? character.size,
    });
  }
}
