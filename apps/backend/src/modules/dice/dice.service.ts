import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class DiceService {
  constructor(private readonly db: DatabaseService) {}

  async roll(data: {
    userId: string;
    characterId?: string;
    sessionId?: string;
    rollType?: string;
    diceFormula: string;
    skillName?: string;
    skillValue?: number;
  }) {
    const result = this.evaluateDiceFormula(data.diceFormula);
    const outcome = data.skillValue ? this.determineOutcome(result, data.skillValue) : undefined;

    return {
      result,
      outcome,
      formula: data.diceFormula,
      skillName: data.skillName,
      skillValue: data.skillValue,
    };
  }

  private evaluateDiceFormula(formula: string): number {
    const match = formula.match(/(\d+)d(\d+)([+-]\d+)?/i);
    if (!match) {
      return parseInt(formula) || 0;
    }

    const [, numDice, sides, modifier] = match;
    let total = 0;
    for (let i = 0; i < parseInt(numDice); i++) {
      total += Math.floor(Math.random() * parseInt(sides)) + 1;
    }

    if (modifier) {
      total += parseInt(modifier);
    }

    return total;
  }

  private determineOutcome(result: number, skillValue: number): string {
    if (result <= skillValue / 5) return 'extreme_success';
    if (result <= skillValue / 2) return 'hard_success';
    if (result <= skillValue) return 'success';
    return 'failure';
  }
}
