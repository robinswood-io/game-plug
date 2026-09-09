import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { EffectsService } from './effects.service';
import { DatabaseService } from '../database/database.service';
import { CharactersService } from '../characters/characters.service';

describe('EffectsService', () => {
  let service: EffectsService;
  let dbService: DatabaseService;
  let charactersService: CharactersService;

  const mockEffect = {
    id: 'effect-1',
    characterId: 'char-1',
    name: 'Poison',
    description: 'Takes 1d6 damage per turn',
    duration: 5,
    type: 'debuff',
    value: '1d6',
    appliedBy: 'gm-1',
    isActive: true,
    createdAt: new Date(),
  } as any;

  const mockEffect2 = {
    id: 'effect-2',
    characterId: 'char-1',
    name: 'Blessed',
    description: '+2 to all rolls',
    duration: 3,
    type: 'buff',
    value: '+2',
    appliedBy: 'gm-1',
    isActive: true,
    createdAt: new Date(),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EffectsService,
        {
          provide: DatabaseService,
          useValue: {
            db: {
              query: {
                activeEffects: {
                  findFirst: jest.fn(),
                  findMany: jest.fn(),
                },
              },
              insert: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: CharactersService,
          useValue: {
            findOneAuthorized: jest.fn().mockResolvedValue({ id: 'char-1' }),
          },
        },
      ],
    }).compile();

    service = module.get<EffectsService>(EffectsService);
    dbService = module.get<DatabaseService>(DatabaseService);
    charactersService = module.get<CharactersService>(CharactersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new effect', async () => {
      const createData = {
        characterId: 'char-1',
        type: 'debuff',
        name: 'Poison',
        description: 'Takes damage',
        duration: 5,
      };

      const mockInsertChain = {
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([mockEffect]),
        }),
      };

      jest.spyOn(dbService.db, 'insert').mockReturnValue(mockInsertChain as any);

      const result = await service.create(createData, 'user-1');

      expect(result).toEqual(mockEffect);
      expect(dbService.db.insert).toHaveBeenCalled();
      expect(charactersService.findOneAuthorized).toHaveBeenCalledWith('char-1', 'user-1');
      expect(mockInsertChain.values).toHaveBeenCalledWith(createData);
    });

    it('should create effect with value', async () => {
      const createData = {
        characterId: 'char-2',
        type: 'buff',
        name: 'Strength Buff',
        duration: 10,
        value: '+5',
      };

      const mockInsertChain = {
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([mockEffect2]),
        }),
      };

      jest.spyOn(dbService.db, 'insert').mockReturnValue(mockInsertChain as any);

      const result = await service.create(createData, 'user-1');

      expect(result).toEqual(mockEffect2);
      expect(mockInsertChain.values).toHaveBeenCalledWith(createData);
    });

    it('should handle database errors during creation', async () => {
      const createData = {
        characterId: 'char-1',
        type: 'buff',
        name: 'Test',
      };

      const mockInsertChain = {
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockRejectedValue(new Error('DB Error')),
        }),
      };

      jest.spyOn(dbService.db, 'insert').mockReturnValue(mockInsertChain as any);

      await expect(service.create(createData, 'user-1')).rejects.toThrow('DB Error');
    });
  });

  describe('findOne', () => {
    it('should return an effect by id', async () => {
      jest.spyOn(dbService.db.query.activeEffects, 'findFirst').mockResolvedValue(mockEffect as any);

      const result = await service.findOne('effect-1');

      expect(result).toEqual(mockEffect);
      expect(dbService.db.query.activeEffects.findFirst).toHaveBeenCalledWith({
        where: expect.anything(),
      });
    });

    it('should throw NotFoundException when effect not found', async () => {
      jest.spyOn(dbService.db.query.activeEffects, 'findFirst').mockResolvedValue(null as any);

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
      await expect(service.findOne('nonexistent')).rejects.toThrow('Active effect nonexistent not found');
    });

    it('should throw NotFoundException when effect is undefined', async () => {
      jest.spyOn(dbService.db.query.activeEffects, 'findFirst').mockResolvedValue(undefined);

      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByCharacter', () => {
    it('should return all effects for a character', async () => {
      const mockEffects = [mockEffect, mockEffect2];
      jest.spyOn(dbService.db.query.activeEffects, 'findMany').mockResolvedValue(mockEffects as any);

      const result = await service.findByCharacter('char-1');

      expect(result).toEqual(mockEffects);
      expect(dbService.db.query.activeEffects.findMany).toHaveBeenCalledWith({
        where: expect.anything(),
      });
    });

    it('should return empty array when character has no effects', async () => {
      jest.spyOn(dbService.db.query.activeEffects, 'findMany').mockResolvedValue([]);

      const result = await service.findByCharacter('char-no-effects');

      expect(result).toEqual([]);
    });

    it('should handle database errors during findByCharacter', async () => {
      jest.spyOn(dbService.db.query.activeEffects, 'findMany').mockRejectedValue(new Error('DB Error'));

      await expect(service.findByCharacter('char-1')).rejects.toThrow('DB Error');
    });
  });

  describe('update', () => {
    it('should update an effect', async () => {
      const updateData = { duration: 10, description: 'Updated' };
      const updatedEffect = { ...mockEffect, ...updateData };

      const mockUpdateChain = {
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([updatedEffect]),
          }),
        }),
      };

      jest
        .spyOn(dbService.db.query.activeEffects, 'findFirst')
        .mockResolvedValue(mockEffect as any);
      jest.spyOn(dbService.db, 'update').mockReturnValue(mockUpdateChain as any);

      const result = await service.update('effect-1', updateData, 'user-1');

      expect(result).toEqual(updatedEffect);
      expect(dbService.db.update).toHaveBeenCalled();
      expect(mockUpdateChain.set).toHaveBeenCalledWith(updateData);
    });

    it('should update effect value', async () => {
      const updateData = { value: '+10' };
      const updatedEffect = { ...mockEffect, ...updateData };

      const mockUpdateChain = {
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([updatedEffect]),
          }),
        }),
      };

      jest
        .spyOn(dbService.db.query.activeEffects, 'findFirst')
        .mockResolvedValue(mockEffect as any);
      jest.spyOn(dbService.db, 'update').mockReturnValue(mockUpdateChain as any);

      const result = await service.update('effect-1', updateData, 'user-1');

      expect(result).toEqual(updatedEffect);
      expect(mockUpdateChain.set).toHaveBeenCalledWith(updateData);
    });

    it('should throw NotFoundException when updating non-existent effect', async () => {
      const updateData = { duration: 5 };

      const mockUpdateChain = {
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([undefined]),
          }),
        }),
      };

      jest.spyOn(dbService.db, 'update').mockReturnValue(mockUpdateChain as any);

      await expect(service.update('nonexistent', updateData, 'user-1')).rejects.toThrow(NotFoundException);
      await expect(service.update('nonexistent', updateData, 'user-1')).rejects.toThrow(
        'Active effect nonexistent not found',
      );
    });

    it('should handle database errors during update', async () => {
      const updateData = { duration: 5 };

      const mockUpdateChain = {
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockRejectedValue(new Error('DB Error')),
          }),
        }),
      };

      jest
        .spyOn(dbService.db.query.activeEffects, 'findFirst')
        .mockResolvedValue(mockEffect as any);
      jest.spyOn(dbService.db, 'update').mockReturnValue(mockUpdateChain as any);

      await expect(service.update('effect-1', updateData, 'user-1')).rejects.toThrow('DB Error');
    });
  });

  describe('delete', () => {
    it('should delete an effect', async () => {
      const mockDeleteChain = {
        where: jest.fn().mockResolvedValue(undefined),
      };

      jest.spyOn(dbService.db, 'delete').mockReturnValue(mockDeleteChain as any);

      await service.delete('effect-1');

      expect(dbService.db.delete).toHaveBeenCalled();
      expect(mockDeleteChain.where).toHaveBeenCalled();
    });

    it('should handle delete on non-existent effect', async () => {
      const mockDeleteChain = {
        where: jest.fn().mockResolvedValue(undefined),
      };

      jest.spyOn(dbService.db, 'delete').mockReturnValue(mockDeleteChain as any);

      await service.delete('nonexistent');

      expect(dbService.db.delete).toHaveBeenCalled();
    });

    it('should handle database errors during deletion', async () => {
      const mockDeleteChain = {
        where: jest.fn().mockRejectedValue(new Error('DB Error')),
      };

      jest.spyOn(dbService.db, 'delete').mockReturnValue(mockDeleteChain as any);

      await expect(service.delete('effect-1')).rejects.toThrow('DB Error');
    });
  });
});
