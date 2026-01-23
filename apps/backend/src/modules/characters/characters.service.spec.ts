import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { DatabaseService } from '../database/database.service';

describe('CharactersService', () => {
  let service: CharactersService;
  let dbService: DatabaseService;

  const mockCharacter = {
    id: '1',
    userId: 'user-1',
    sessionId: 'session-1',
    name: 'Test Character',
    occupation: 'Detective',
    strength: 10,
    constitution: 10,
    size: 10,
    dexterity: 10,
    appearance: 10,
    intelligence: 10,
    power: 10,
    education: 10,
    luck: 10,
    hitPoints: 10,
    maxHitPoints: 10,
    sanity: 50,
    maxSanity: 50,
    magicPoints: 0,
    maxMagicPoints: 0,
    skills: {},
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any;

  const mockCharacter2 = {
    id: '2',
    userId: 'user-1',
    sessionId: 'session-1',
    name: 'Second Character',
    occupation: 'Professor',
    strength: 10,
    constitution: 10,
    size: 10,
    dexterity: 10,
    appearance: 10,
    intelligence: 10,
    power: 10,
    education: 10,
    luck: 10,
    hitPoints: 10,
    maxHitPoints: 10,
    sanity: 50,
    maxSanity: 50,
    magicPoints: 0,
    maxMagicPoints: 0,
    skills: {},
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharactersService,
        {
          provide: DatabaseService,
          useValue: {
            db: {
              query: {
                characters: {
                  findMany: jest.fn(),
                  findFirst: jest.fn(),
                },
              },
              insert: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CharactersService>(CharactersService);
    dbService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all characters when no userId provided', async () => {
      const mockCharacters = [mockCharacter, mockCharacter2];
      jest.spyOn(dbService.db.query.characters, 'findMany').mockResolvedValue(mockCharacters as any);

      const result = await service.findAll();

      expect(result).toEqual(mockCharacters);
      expect(dbService.db.query.characters.findMany).toHaveBeenCalledWith();
    });

    it('should return characters filtered by userId', async () => {
      const mockCharacters = [mockCharacter];
      jest.spyOn(dbService.db.query.characters, 'findMany').mockResolvedValue(mockCharacters as any);

      const result = await service.findAll('user-1');

      expect(result).toEqual(mockCharacters);
      expect(dbService.db.query.characters.findMany).toHaveBeenCalledWith({
        where: expect.anything(),
      });
    });

    it('should return empty array when no characters exist', async () => {
      jest.spyOn(dbService.db.query.characters, 'findMany').mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a character by id', async () => {
      jest.spyOn(dbService.db.query.characters, 'findFirst').mockResolvedValue(mockCharacter as any);

      const result = await service.findOne('1');

      expect(result).toEqual(mockCharacter);
      expect(dbService.db.query.characters.findFirst).toHaveBeenCalledWith({
        where: expect.anything(),
      });
    });

    it('should throw NotFoundException when character not found', async () => {
      jest.spyOn(dbService.db.query.characters, 'findFirst').mockResolvedValue(null as any);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
      await expect(service.findOne('999')).rejects.toThrow('Character 999 not found');
    });

    it('should throw NotFoundException when character is undefined', async () => {
      jest.spyOn(dbService.db.query.characters, 'findFirst').mockResolvedValue(undefined);

      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a character with userId', async () => {
      const createData = {
        name: 'New Character',
        class: 'Investigator',
        occupation: 'Detective',
      };

      const mockInsertChain = {
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([mockCharacter]),
        }),
      };

      jest.spyOn(dbService.db, 'insert').mockReturnValue(mockInsertChain as any);

      const result = await service.create(createData, 'user-1');

      expect(result).toEqual(mockCharacter);
      expect(dbService.db.insert).toHaveBeenCalled();
      expect(mockInsertChain.values).toHaveBeenCalledWith({
        ...createData,
        userId: 'user-1',
      });
    });

    it('should create a character without userId', async () => {
      const createData = {
        name: 'Anonymous Character',
        class: 'Scholar',
        occupation: 'Professor',
      };

      const mockInsertChain = {
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([mockCharacter2]),
        }),
      };

      jest.spyOn(dbService.db, 'insert').mockReturnValue(mockInsertChain as any);

      const result = await service.create(createData);

      expect(result).toEqual(mockCharacter2);
      expect(mockInsertChain.values).toHaveBeenCalledWith({
        ...createData,
        userId: undefined,
      });
    });

    it('should handle database errors during creation', async () => {
      const createData = {
        name: 'Test',
        class: 'Test',
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

  describe('update', () => {
    it('should update a character', async () => {
      const updateData = { name: 'Updated Character' };
      const updatedCharacter = { ...mockCharacter, ...updateData };

      const mockUpdateChain = {
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([updatedCharacter]),
          }),
        }),
      };

      jest.spyOn(dbService.db, 'update').mockReturnValue(mockUpdateChain as any);

      const result = await service.update('1', updateData);

      expect(result).toEqual(updatedCharacter);
      expect(dbService.db.update).toHaveBeenCalled();
      expect(mockUpdateChain.set).toHaveBeenCalledWith(updateData);
    });

    it('should update multiple fields', async () => {
      const updateData = {
        name: 'Updated Name',
        class: 'Updated Class',
        occupation: 'Updated Occupation',
      };
      const updatedCharacter = { ...mockCharacter, ...updateData };

      const mockUpdateChain = {
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([updatedCharacter]),
          }),
        }),
      };

      jest.spyOn(dbService.db, 'update').mockReturnValue(mockUpdateChain as any);

      const result = await service.update('1', updateData);

      expect(result).toEqual(updatedCharacter);
      expect(mockUpdateChain.set).toHaveBeenCalledWith(updateData);
    });

    it('should handle update on non-existent character', async () => {
      const updateData = { name: 'Updated' };

      const mockUpdateChain = {
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([undefined]),
          }),
        }),
      };

      jest.spyOn(dbService.db, 'update').mockReturnValue(mockUpdateChain as any);

      const result = await service.update('999', updateData);

      expect(result).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('should delete a character', async () => {
      const mockDeleteChain = {
        where: jest.fn().mockResolvedValue(undefined),
      };

      jest.spyOn(dbService.db, 'delete').mockReturnValue(mockDeleteChain as any);

      await service.delete('1');

      expect(dbService.db.delete).toHaveBeenCalled();
      expect(mockDeleteChain.where).toHaveBeenCalled();
    });

    it('should handle delete on non-existent character', async () => {
      const mockDeleteChain = {
        where: jest.fn().mockResolvedValue(undefined),
      };

      jest.spyOn(dbService.db, 'delete').mockReturnValue(mockDeleteChain as any);

      await service.delete('999');

      expect(dbService.db.delete).toHaveBeenCalled();
    });

    it('should handle database errors during deletion', async () => {
      const mockDeleteChain = {
        where: jest.fn().mockRejectedValue(new Error('DB Error')),
      };

      jest.spyOn(dbService.db, 'delete').mockReturnValue(mockDeleteChain as any);

      await expect(service.delete('1')).rejects.toThrow('DB Error');
    });
  });
});
