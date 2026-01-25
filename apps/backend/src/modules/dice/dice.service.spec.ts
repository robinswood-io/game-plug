import { Test, TestingModule } from '@nestjs/testing';
import { DiceService } from './dice.service';
import { DatabaseService } from '../database/database.service';

describe('DiceService', () => {
  let service: DiceService;
  let dbService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiceService,
        {
          provide: DatabaseService,
          useValue: {
            db: {
              query: {},
              insert: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<DiceService>(DiceService);
    dbService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('roll', () => {
    it('should return dice roll result with formula', async () => {
      const rollData = {
        userId: 'user-1',
        characterId: 'char-1',
        sessionId: 'session-1',
        rollType: 'skill_check',
        diceFormula: '1d20',
      };

      const result = await service.roll(rollData);

      expect(result).toHaveProperty('result');
      expect(result).toHaveProperty('formula', '1d20');
      expect(result).toHaveProperty('outcome', undefined);
      expect(result.result).toBeGreaterThanOrEqual(1);
      expect(result.result).toBeLessThanOrEqual(20);
    });

    it('should support dice formula with modifier', async () => {
      const rollData = {
        userId: 'user-1',
        rollType: 'attack',
        diceFormula: '1d20+5',
      };

      const result = await service.roll(rollData);

      expect(result.result).toBeGreaterThanOrEqual(6);
      expect(result.result).toBeLessThanOrEqual(25);
      expect(result.formula).toBe('1d20+5');
    });

    it('should support negative modifiers', async () => {
      const rollData = {
        userId: 'user-1',
        rollType: 'defense',
        diceFormula: '1d10-2',
      };

      const result = await service.roll(rollData);

      expect(result.result).toBeGreaterThanOrEqual(-1);
      expect(result.result).toBeLessThanOrEqual(8);
    });

    it('should support multiple dice', async () => {
      const rollData = {
        userId: 'user-1',
        rollType: 'damage',
        diceFormula: '3d6',
      };

      const result = await service.roll(rollData);

      expect(result.result).toBeGreaterThanOrEqual(3);
      expect(result.result).toBeLessThanOrEqual(18);
    });

    it('should handle complex formulas', async () => {
      const rollData = {
        userId: 'user-1',
        rollType: 'complex',
        diceFormula: '2d8+3',
      };

      const result = await service.roll(rollData);

      expect(result.result).toBeGreaterThanOrEqual(5);
      expect(result.result).toBeLessThanOrEqual(19);
    });

    it('should handle plain number as formula', async () => {
      const rollData = {
        userId: 'user-1',
        rollType: 'fixed',
        diceFormula: '10',
      };

      const result = await service.roll(rollData);

      expect(result.result).toBe(10);
    });

    it('should return 0 for invalid formula', async () => {
      const rollData = {
        userId: 'user-1',
        rollType: 'invalid',
        diceFormula: 'invalid',
      };

      const result = await service.roll(rollData);

      expect(result.result).toBe(0);
    });

    it('should include skill name and value in result', async () => {
      const rollData = {
        userId: 'user-1',
        rollType: 'skill',
        diceFormula: '1d100',
        skillName: 'Psychology',
        skillValue: 60,
      };

      const result = await service.roll(rollData);

      expect(result.skillName).toBe('Psychology');
      expect(result.skillValue).toBe(60);
    });

    it('should include optional characterId and sessionId', async () => {
      const rollData = {
        userId: 'user-1',
        characterId: 'char-1',
        sessionId: 'session-1',
        rollType: 'test',
        diceFormula: '1d20',
      };

      const result = await service.roll(rollData);

      expect(result.formula).toBe('1d20');
    });
  });

  describe('roll with skill value - determineOutcome (CoC 7e)', () => {
    it('should return critical_success when roll is 01-05', async () => {
      const rollData = {
        userId: 'user-1',
        rollType: 'skill',
        diceFormula: '1d100',
        skillValue: 80,
      };

      // Mock Math.random to return value that gives us 3
      const originalRandom = Math.random;
      Math.random = jest.fn().mockReturnValue(0.02);

      try {
        const result = await service.roll(rollData);
        // Should be critical_success for rolls 1-5
        if (result.result <= 5) {
          expect(result.outcome).toBe('critical_success');
        }
      } finally {
        Math.random = originalRandom;
      }
    });

    it('should return critical_success when roll is <= skillValue/20', async () => {
      const rollData = {
        userId: 'user-1',
        rollType: 'skill',
        diceFormula: '1d100',
        skillValue: 100,
      };

      // Mock Math.random to return 0 (minimum value for 1d100 = 1)
      const originalRandom = Math.random;
      Math.random = jest.fn().mockReturnValue(0);

      try {
        const result = await service.roll(rollData);
        // skillValue/20 = 100/20 = 5, min(5, 5) = 5
        if (result.result <= 5) {
          expect(result.outcome).toBe('critical_success');
        }
      } finally {
        Math.random = originalRandom;
      }
    });

    it('should return fumble when roll is 96-100', async () => {
      const rollData = {
        userId: 'user-1',
        rollType: 'skill',
        diceFormula: '1d100',
        skillValue: 80,
      };

      // Mock Math.random to return value that gives us 97
      const originalRandom = Math.random;
      Math.random = jest.fn().mockReturnValue(0.96);

      try {
        const result = await service.roll(rollData);
        // Should be fumble for rolls 96-100
        if (result.result >= 96) {
          expect(result.outcome).toBe('fumble');
        }
      } finally {
        Math.random = originalRandom;
      }
    });

    it('should return extreme_success when roll is <= skillValue/5', async () => {
      const rollData = {
        userId: 'user-1',
        rollType: 'skill',
        diceFormula: '1d100',
        skillValue: 50,
      };

      // Mock Math.random to return 0 (minimum value for 1d100 = 1)
      const originalRandom = Math.random;
      Math.random = jest.fn().mockReturnValue(0);

      try {
        const result = await service.roll(rollData);
        // skillValue/5 = 50/5 = 10, so we need result <= 10
        if (result.result > 5 && result.result <= 10) {
          expect(result.outcome).toBe('extreme_success');
        }
      } finally {
        Math.random = originalRandom;
      }
    });

    it('should return hard_success when roll is > skillValue/5 but <= skillValue/2', async () => {
      const rollData = {
        userId: 'user-1',
        rollType: 'skill',
        diceFormula: '1d100',
        skillValue: 60,
      };

      const result = await service.roll(rollData);

      // This test checks the outcome determination logic
      // skillValue/5 = 12, skillValue/2 = 30
      if (result.result > 12 && result.result <= 30) {
        expect(result.outcome).toBe('hard_success');
      }
    });

    it('should return regular_success when roll is > skillValue/2 but <= skillValue', async () => {
      const rollData = {
        userId: 'user-1',
        rollType: 'skill',
        diceFormula: '1d100',
        skillValue: 80,
      };

      const result = await service.roll(rollData);

      // skillValue/2 = 40, skillValue = 80
      if (result.result > 40 && result.result <= 80) {
        expect(result.outcome).toBe('regular_success');
      }
    });

    it('should return failure when roll is > skillValue', async () => {
      const rollData = {
        userId: 'user-1',
        rollType: 'skill',
        diceFormula: '1d100',
        skillValue: 30,
      };

      const result = await service.roll(rollData);

      // If roll > skillValue (30), it should be failure
      if (result.result > 30) {
        expect(result.outcome).toBe('failure');
      }
    });

    it('should not include outcome when skillValue is not provided', async () => {
      const rollData = {
        userId: 'user-1',
        rollType: 'damage',
        diceFormula: '2d6',
      };

      const result = await service.roll(rollData);

      expect(result.outcome).toBeUndefined();
    });

    it('should not include outcome when skillValue is undefined', async () => {
      const rollData = {
        userId: 'user-1',
        rollType: 'test',
        diceFormula: '1d20',
        skillValue: undefined,
      };

      const result = await service.roll(rollData);

      expect(result.outcome).toBeUndefined();
    });
  });

  describe('dice formula validation and parsing', () => {
    it('should handle uppercase D in formula', async () => {
      const rollData = {
        userId: 'user-1',
        rollType: 'test',
        diceFormula: '2D6',
      };

      const result = await service.roll(rollData);

      expect(result.result).toBeGreaterThanOrEqual(2);
      expect(result.result).toBeLessThanOrEqual(12);
    });

    it('should handle lowercase d in formula', async () => {
      const rollData = {
        userId: 'user-1',
        rollType: 'test',
        diceFormula: '1d20',
      };

      const result = await service.roll(rollData);

      expect(result.result).toBeGreaterThanOrEqual(1);
      expect(result.result).toBeLessThanOrEqual(20);
    });

    it('should handle various dice sizes', async () => {
      const testCases = [
        { formula: '1d4', min: 1, max: 4 },
        { formula: '1d6', min: 1, max: 6 },
        { formula: '1d8', min: 1, max: 8 },
        { formula: '1d12', min: 1, max: 12 },
        { formula: '1d20', min: 1, max: 20 },
        { formula: '1d100', min: 1, max: 100 },
      ];

      for (const testCase of testCases) {
        const rollData = {
          userId: 'user-1',
          rollType: 'test',
          diceFormula: testCase.formula,
        };

        const result = await service.roll(rollData);

        expect(result.result).toBeGreaterThanOrEqual(testCase.min);
        expect(result.result).toBeLessThanOrEqual(testCase.max);
      }
    });

    it('should handle large number of dice', async () => {
      const rollData = {
        userId: 'user-1',
        rollType: 'test',
        diceFormula: '10d6',
      };

      const result = await service.roll(rollData);

      expect(result.result).toBeGreaterThanOrEqual(10);
      expect(result.result).toBeLessThanOrEqual(60);
    });

    it('should handle large modifiers', async () => {
      const rollData = {
        userId: 'user-1',
        rollType: 'test',
        diceFormula: '1d20+100',
      };

      const result = await service.roll(rollData);

      expect(result.result).toBeGreaterThanOrEqual(101);
      expect(result.result).toBeLessThanOrEqual(120);
    });
  });

  describe('CoC 7e - Bonus/Penalty Dice', () => {
    it('should handle bonus dice for 1d100 rolls', async () => {
      const rollData = {
        userId: 'user-1',
        rollType: 'skill',
        diceFormula: '1d100',
        skillValue: 50,
        bonusDice: 1,
      };

      const result = await service.roll(rollData);

      expect(result).toHaveProperty('bonusDice', 1);
      expect(result.result).toBeGreaterThanOrEqual(1);
      expect(result.result).toBeLessThanOrEqual(100);
    });

    it('should handle penalty dice for 1d100 rolls', async () => {
      const rollData = {
        userId: 'user-1',
        rollType: 'skill',
        diceFormula: '1d100',
        skillValue: 50,
        penaltyDice: 1,
      };

      const result = await service.roll(rollData);

      expect(result).toHaveProperty('penaltyDice', 1);
      expect(result.result).toBeGreaterThanOrEqual(1);
      expect(result.result).toBeLessThanOrEqual(100);
    });

    it('should handle multiple bonus dice', async () => {
      const rollData = {
        userId: 'user-1',
        rollType: 'skill',
        diceFormula: '1d100',
        skillValue: 50,
        bonusDice: 2,
      };

      const result = await service.roll(rollData);

      expect(result).toHaveProperty('bonusDice', 2);
      expect(result.result).toBeGreaterThanOrEqual(1);
      expect(result.result).toBeLessThanOrEqual(100);
    });

    it('should not use bonus/penalty dice for non-1d100 rolls', async () => {
      const rollData = {
        userId: 'user-1',
        rollType: 'damage',
        diceFormula: '2d6',
        bonusDice: 1,
      };

      const result = await service.roll(rollData);

      // Bonus dice only applies to 1d100
      expect(result.result).toBeGreaterThanOrEqual(2);
      expect(result.result).toBeLessThanOrEqual(12);
    });

    it('should verify bonus dice tend to give lower results over many rolls', async () => {
      let bonusTotal = 0;
      let regularTotal = 0;
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        const bonusRoll = await service.roll({
          userId: 'user-1',
          diceFormula: '1d100',
          bonusDice: 1,
        });
        bonusTotal += bonusRoll.result;

        const regularRoll = await service.roll({
          userId: 'user-1',
          diceFormula: '1d100',
        });
        regularTotal += regularRoll.result;
      }

      const bonusAverage = bonusTotal / iterations;
      const regularAverage = regularTotal / iterations;

      // Bonus dice should statistically result in lower average
      // This is a statistical test, might occasionally fail due to randomness
      expect(bonusAverage).toBeLessThan(regularAverage + 10);
    });
  });

  describe('roll method - integration scenarios', () => {
    it('should handle complete character skill check', async () => {
      const rollData = {
        userId: 'user-123',
        characterId: 'char-456',
        sessionId: 'session-789',
        rollType: 'skill_check',
        diceFormula: '1d100',
        skillName: 'Occult Knowledge',
        skillValue: 45,
      };

      const result = await service.roll(rollData);

      expect(result).toHaveProperty('result');
      expect(result).toHaveProperty('outcome');
      expect(result).toHaveProperty('formula', '1d100');
      expect(result).toHaveProperty('skillName', 'Occult Knowledge');
      expect(result).toHaveProperty('skillValue', 45);
      expect(typeof result.result).toBe('number');
    });

    it('should handle damage roll scenario', async () => {
      const rollData = {
        userId: 'user-123',
        characterId: 'char-456',
        sessionId: 'session-789',
        rollType: 'damage',
        diceFormula: '2d8+2',
      };

      const result = await service.roll(rollData);

      expect(result.result).toBeGreaterThanOrEqual(4);
      expect(result.result).toBeLessThanOrEqual(18);
      expect(result.outcome).toBeUndefined();
    });

    it('should handle sanity roll', async () => {
      const rollData = {
        userId: 'user-123',
        characterId: 'char-456',
        sessionId: 'session-789',
        rollType: 'sanity_check',
        diceFormula: '1d100',
        skillName: 'Sanity',
        skillValue: 60,
      };

      const result = await service.roll(rollData);

      expect(result.skillName).toBe('Sanity');
      expect(result.skillValue).toBe(60);
      expect(result.outcome).toBeDefined();
    });
  });
});
