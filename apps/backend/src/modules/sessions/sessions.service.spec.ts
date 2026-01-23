import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { DatabaseService } from '../database/database.service';

describe('SessionsService', () => {
  let service: SessionsService;
  let dbService: DatabaseService;

  const mockSession = {
    id: 'session-1',
    gmId: 'gm-1',
    name: 'Test Campaign',
    code: 'ABC123',
    status: 'active',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any;

  const mockSession2 = {
    id: 'session-2',
    gmId: 'gm-1',
    name: 'Second Campaign',
    code: 'DEF456',
    status: 'preparation',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: DatabaseService,
          useValue: {
            db: {
              query: {
                gameSessions: {
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

    service = module.get<SessionsService>(SessionsService);
    dbService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all sessions when no gmId provided', async () => {
      const mockSessions = [mockSession, mockSession2];
      jest.spyOn(dbService.db.query.gameSessions, 'findMany').mockResolvedValue(mockSessions as any);

      const result = await service.findAll();

      expect(result).toEqual(mockSessions);
      expect(dbService.db.query.gameSessions.findMany).toHaveBeenCalledWith();
    });

    it('should return sessions filtered by gmId', async () => {
      const mockSessions = [mockSession, mockSession2];
      jest.spyOn(dbService.db.query.gameSessions, 'findMany').mockResolvedValue(mockSessions as any);

      const result = await service.findAll('gm-1');

      expect(result).toEqual(mockSessions);
      expect(dbService.db.query.gameSessions.findMany).toHaveBeenCalledWith({
        where: expect.anything(),
      });
    });

    it('should return empty array when no sessions exist', async () => {
      jest.spyOn(dbService.db.query.gameSessions, 'findMany').mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });

    it('should return empty array for gmId with no sessions', async () => {
      jest.spyOn(dbService.db.query.gameSessions, 'findMany').mockResolvedValue([]);

      const result = await service.findAll('gm-nonexistent');

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a session by id', async () => {
      jest.spyOn(dbService.db.query.gameSessions, 'findFirst').mockResolvedValue(mockSession as any);

      const result = await service.findOne('session-1');

      expect(result).toEqual(mockSession);
      expect(dbService.db.query.gameSessions.findFirst).toHaveBeenCalledWith({
        where: expect.anything(),
      });
    });

    it('should throw NotFoundException when session not found', async () => {
      jest.spyOn(dbService.db.query.gameSessions, 'findFirst').mockResolvedValue(null as any);

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
      await expect(service.findOne('nonexistent')).rejects.toThrow('Session nonexistent not found');
    });

    it('should throw NotFoundException when session is undefined', async () => {
      jest.spyOn(dbService.db.query.gameSessions, 'findFirst').mockResolvedValue(undefined);

      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a session', async () => {
      const createData = {
        gmId: 'gm-1',
        name: 'New Campaign',
        status: 'active',
      };

      const mockInsertChain = {
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([mockSession]),
        }),
      };

      jest.spyOn(dbService.db, 'insert').mockReturnValue(mockInsertChain as any);

      const result = await service.create(createData);

      expect(result).toEqual(mockSession);
      expect(dbService.db.insert).toHaveBeenCalled();
      expect(mockInsertChain.values).toHaveBeenCalledWith(createData);
    });

    it('should create a minimal session', async () => {
      const createData = {
        gmId: 'gm-2',
        name: 'Minimal Campaign',
      };

      const mockInsertChain = {
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([mockSession2]),
        }),
      };

      jest.spyOn(dbService.db, 'insert').mockReturnValue(mockInsertChain as any);

      const result = await service.create(createData);

      expect(result).toEqual(mockSession2);
      expect(mockInsertChain.values).toHaveBeenCalledWith(createData);
    });

    it('should handle database errors during creation', async () => {
      const createData = {
        gmId: 'gm-1',
        title: 'Test',
      };

      const mockInsertChain = {
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockRejectedValue(new Error('DB Error')),
        }),
      };

      jest.spyOn(dbService.db, 'insert').mockReturnValue(mockInsertChain as any);

      await expect(service.create(createData)).rejects.toThrow('DB Error');
    });
  });

  describe('update', () => {
    it('should update a session', async () => {
      const updateData = { name: 'Updated Campaign' };
      const updatedSession = { ...mockSession, ...updateData };

      const mockUpdateChain = {
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([updatedSession]),
          }),
        }),
      };

      jest.spyOn(dbService.db, 'update').mockReturnValue(mockUpdateChain as any);

      const result = await service.update('session-1', updateData);

      expect(result).toEqual(updatedSession);
      expect(dbService.db.update).toHaveBeenCalled();
      expect(mockUpdateChain.set).toHaveBeenCalledWith(updateData);
    });

    it('should update session status', async () => {
      const updateData = { status: 'ended', isActive: false };
      const updatedSession = { ...mockSession, ...updateData };

      const mockUpdateChain = {
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([updatedSession]),
          }),
        }),
      };

      jest.spyOn(dbService.db, 'update').mockReturnValue(mockUpdateChain as any);

      const result = await service.update('session-1', updateData);

      expect(result).toEqual(updatedSession);
      expect(mockUpdateChain.set).toHaveBeenCalledWith(updateData);
    });

    it('should update multiple session fields', async () => {
      const updateData = {
        name: 'New Title',
        code: 'NEW123',
        status: 'active',
      };
      const updatedSession = { ...mockSession, ...updateData };

      const mockUpdateChain = {
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([updatedSession]),
          }),
        }),
      };

      jest.spyOn(dbService.db, 'update').mockReturnValue(mockUpdateChain as any);

      const result = await service.update('session-1', updateData);

      expect(result).toEqual(updatedSession);
      expect(mockUpdateChain.set).toHaveBeenCalledWith(updateData);
    });

    it('should handle update on non-existent session', async () => {
      const updateData = { title: 'Updated' };

      const mockUpdateChain = {
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([undefined]),
          }),
        }),
      };

      jest.spyOn(dbService.db, 'update').mockReturnValue(mockUpdateChain as any);

      const result = await service.update('nonexistent', updateData);

      expect(result).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('should delete a session', async () => {
      const mockDeleteChain = {
        where: jest.fn().mockResolvedValue(undefined),
      };

      jest.spyOn(dbService.db, 'delete').mockReturnValue(mockDeleteChain as any);

      await service.delete('session-1');

      expect(dbService.db.delete).toHaveBeenCalled();
      expect(mockDeleteChain.where).toHaveBeenCalled();
    });

    it('should handle delete on non-existent session', async () => {
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

      await expect(service.delete('session-1')).rejects.toThrow('DB Error');
    });
  });
});
