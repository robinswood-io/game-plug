import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { eq, desc } from 'drizzle-orm';
import * as schema from '@shared/schema';

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
    bonusDice?: number;
    penaltyDice?: number;
  }) {
    let result: number;

    // Call of Cthulhu 7e: Bonus/Penalty dice for 1d100 rolls
    if (data.diceFormula === '1d100' && (data.bonusDice || data.penaltyDice)) {
      result = this.rollWithBonusPenalty(data.bonusDice || 0, data.penaltyDice || 0);
    } else {
      result = this.evaluateDiceFormula(data.diceFormula);
    }

    const outcome = data.skillValue ? this.determineOutcome(result, data.skillValue) : undefined;

    return {
      result,
      outcome,
      formula: data.diceFormula,
      skillName: data.skillName,
      skillValue: data.skillValue,
      bonusDice: data.bonusDice,
      penaltyDice: data.penaltyDice,
    };
  }

  async getSessionRollHistory(sessionId: string, limit: number = 50) {
    const rolls = await this.db.db
      .select()
      .from(schema.rollHistory)
      .where(eq(schema.rollHistory.sessionId, sessionId))
      .orderBy(desc(schema.rollHistory.createdAt))
      .limit(limit);

    return rolls;
  }

  async getSessionRollHistoryForGm(sessionId: string, limit: number = 50, gmId: string) {
    const session = await this.db.db.query.gameSessions.findFirst({
      where: eq(schema.gameSessions.id, sessionId),
    });

    if (!session) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }
    if (session.gmId !== gmId) {
      throw new ForbiddenException('Only the GM can access roll history for this session');
    }

    return this.getSessionRollHistory(sessionId, limit);
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

  private determineOutcome(roll: number, skillValue: number): string {
    // Call of Cthulhu 7e outcomes (in priority order)
    const criticalThreshold = Math.min(5, Math.floor(skillValue / 20));
    const extremeThreshold = Math.floor(skillValue / 5);
    const hardThreshold = Math.floor(skillValue / 2);

    // CRITICAL: 01-05 or <= skill/20 (whichever is lower)
    if (roll <= criticalThreshold) return 'critical_success';

    // FUMBLE: 96-100 (always fails)
    if (roll >= 96) return 'fumble';

    // EXTREME: <= skill/5
    if (roll <= extremeThreshold) return 'extreme_success';

    // HARD: <= skill/2
    if (roll <= hardThreshold) return 'hard_success';

    // REGULAR: <= skill
    if (roll <= skillValue) return 'regular_success';

    // FAILURE: > skill
    return 'failure';
  }

  /**
   * Call of Cthulhu 7e: Bonus/Penalty Dice
   * Rolls 1d100 with additional d10s for tens place
   * Bonus: take lowest tens die
   * Penalty: take highest tens die
   */
  private rollWithBonusPenalty(bonusDice: number, penaltyDice: number): number {
    const unitsDie = Math.floor(Math.random() * 10); // 0-9 for units
    const extraDiceCount = Math.max(bonusDice, penaltyDice);

    // Roll base tens die (0-90 by increments of 10)
    const baseTens = Math.floor(Math.random() * 10) * 10;
    const tensDice = [baseTens];

    // Roll extra tens dice
    for (let i = 0; i < extraDiceCount; i++) {
      tensDice.push(Math.floor(Math.random() * 10) * 10);
    }

    // Select tens die based on bonus/penalty
    let selectedTens: number;
    if (bonusDice > 0) {
      selectedTens = Math.min(...tensDice); // Bonus: lowest tens
    } else {
      selectedTens = Math.max(...tensDice); // Penalty: highest tens
    }

    // Combine tens and units (00 = 100)
    const result = selectedTens + unitsDie;
    return result === 0 ? 100 : result;
  }
}
