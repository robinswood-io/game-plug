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
      jest
        .spyOn(dbService.db.query.gameSessions, 'findMany')
        .mockResolvedValue(mockSessions as any);

      const result = await service.findAll();

      expect(result).toEqual(mockSessions);
      expect(dbService.db.query.gameSessions.findMany).toHaveBeenCalledWith();
    });

    it('should return sessions filtered by gmId', async () => {
      const mockSessions = [mockSession, mockSession2];
      jest
        .spyOn(dbService.db.query.gameSessions, 'findMany')
        .mockResolvedValue(mockSessions as any);

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
      jest
        .spyOn(dbService.db.query.gameSessions, 'findFirst')
        .mockResolvedValue(mockSession as any);

      const result = await service.findOne('session-1');

      expect(result).toEqual(mockSession);
      expect(dbService.db.query.gameSessions.findFirst).toHaveBeenCalledWith({
        where: expect.anything(),
      });
    });

    it('should throw NotFoundException when session not found', async () => {
      jest
        .spyOn(dbService.db.query.gameSessions, 'findFirst')
        .mockResolvedValue(null as any);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('nonexistent')).rejects.toThrow(
        'Session nonexistent not found',
      );
    });

    it('should throw NotFoundException when session is undefined', async () => {
      jest
        .spyOn(dbService.db.query.gameSessions, 'findFirst')
        .mockResolvedValue(undefined);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOneForGm', () => {
    it('should return a session owned by the GM', async () => {
      jest
        .spyOn(dbService.db.query.gameSessions, 'findFirst')
        .mockResolvedValue(mockSession as any);

      await expect(service.findOneForGm('session-1', 'gm-1')).resolves.toEqual(
        mockSession,
      );
    });

    it('should reject cross-GM session access as not found', async () => {
      jest
        .spyOn(dbService.db.query.gameSessions, 'findFirst')
        .mockResolvedValue({ ...mockSession, gmId: 'gm-2' } as any);

      await expect(service.findOneForGm('session-1', 'gm-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a session with generated code and active status', async () => {
      const createData = {
        gmId: 'gm-1',
        name: 'New Campaign',
        status: 'preparation',
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
      expect(mockInsertChain.values).toHaveBeenCalledWith(
        expect.objectContaining({
          ...createData,
          code: expect.stringMatching(/^[A-Z2-9]{6}$/),
          status: 'active',
        }),
      );
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
      expect(mockInsertChain.values).toHaveBeenCalledWith(
        expect.objectContaining({
          ...createData,
          code: expect.stringMatching(/^[A-Z2-9]{6}$/),
          status: 'active',
        }),
      );
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
    it('should update a session owned by the GM', async () => {
      const updateData = { name: 'Updated Campaign' };
      const updatedSession = { ...mockSession, ...updateData };

      jest
        .spyOn(dbService.db.query.gameSessions, 'findFirst')
        .mockResolvedValue(mockSession as any);

      const mockUpdateChain = {
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([updatedSession]),
          }),
        }),
      };

      jest.spyOn(dbService.db, 'update').mockReturnValue(mockUpdateChain as any);

      const result = await service.update('session-1', updateData, 'gm-1');

      expect(result).toEqual(updatedSession);
      expect(dbService.db.update).toHaveBeenCalled();
      expect(mockUpdateChain.set).toHaveBeenCalledWith(updateData);
    });

    it('should reject cross-GM updates', async () => {
      jest
        .spyOn(dbService.db.query.gameSessions, 'findFirst')
        .mockResolvedValue({ ...mockSession, gmId: 'gm-2' } as any);

      await expect(
        service.update('session-1', { name: 'Updated' }, 'gm-1'),
      ).rejects.toThrow(NotFoundException);
      expect(dbService.db.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException for a non-existent session', async () => {
      jest
        .spyOn(dbService.db.query.gameSessions, 'findFirst')
        .mockResolvedValue(null as any);

      await expect(
        service.update('nonexistent', { title: 'Updated' }, 'gm-1'),
      ).rejects.toThrow(NotFoundException);
      expect(dbService.db.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should soft delete a session owned by the GM', async () => {
      const endedSession = { ...mockSession, isActive: false, status: 'ended' };

      jest
        .spyOn(dbService.db.query.gameSessions, 'findFirst')
        .mockResolvedValue(mockSession as any);

      const mockUpdateChain = {
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([endedSession]),
          }),
        }),
      };

      jest.spyOn(dbService.db, 'update').mockReturnValue(mockUpdateChain as any);

      await expect(service.delete('session-1', 'gm-1')).resolves.toEqual(
        endedSession,
      );

      expect(dbService.db.delete).not.toHaveBeenCalled();
      expect(dbService.db.update).toHaveBeenCalled();
      expect(mockUpdateChain.set).toHaveBeenCalledWith({
        isActive: false,
        status: 'ended',
      });
    });

    it('should reject cross-GM deletion', async () => {
      jest
        .spyOn(dbService.db.query.gameSessions, 'findFirst')
        .mockResolvedValue({ ...mockSession, gmId: 'gm-2' } as any);

      await expect(service.delete('session-1', 'gm-1')).rejects.toThrow(
        NotFoundException,
      );
      expect(dbService.db.update).not.toHaveBeenCalled();
      expect(dbService.db.delete).not.toHaveBeenCalled();
    });

    it('should handle update failures during soft deletion', async () => {
      jest
        .spyOn(dbService.db.query.gameSessions, 'findFirst')
        .mockResolvedValue(mockSession as any);

      const mockUpdateChain = {
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockRejectedValue(new Error('DB Error')),
          }),
        }),
      };

      jest.spyOn(dbService.db, 'update').mockReturnValue(mockUpdateChain as any);

      await expect(service.delete('session-1', 'gm-1')).rejects.toThrow(
        'DB Error',
      );
    });
  });
});
