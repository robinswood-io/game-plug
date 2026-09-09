import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { AdminConfigController } from './admin-config/admin-config.controller';
import { AdminConfigService } from './admin-config/admin-config.service';
import { ChapterEventsService } from './chapter-events/chapter-events.service';
import { DatabaseService } from './database/database.service';
import { DiceService } from './dice/dice.service';
import { GameboardService } from './gameboard/gameboard.service';
import { NarrativeService } from './narrative/narrative.service';

describe('session-scoped security boundaries', () => {
  it('requires GM privileges for admin config and ignores spoofed updatedBy', async () => {
    const configService = {
      getAll: jest.fn(),
      set: jest.fn().mockResolvedValue({ key: 'feature.ai', value: true }),
    };
    const controller = new AdminConfigController(configService as unknown as AdminConfigService);

    await expect(
      controller.getAll({ user: { id: 'player-1', isGM: false } }),
    ).rejects.toThrow(ForbiddenException);

    await controller.update(
      'feature.ai',
      { value: true, description: 'enabled', updatedBy: 'attacker' },
      { user: { id: 'gm-1', isGM: true } },
    );

    expect(configService.set).toHaveBeenCalledWith(
      'feature.ai',
      true,
      'enabled',
      'gm-1',
    );
  });

  it('rejects narrative access for a non-GM before inserting', async () => {
    const sessionFindFirst = jest.fn().mockResolvedValue({ id: 'session-1', gmId: 'owner-gm' });
    const insert = jest.fn();
    const db = {
      query: { gameSessions: { findFirst: sessionFindFirst } },
      insert,
    };
    const service = new NarrativeService({ db } as unknown as DatabaseService);

    await expect(
      service.create({ sessionId: 'session-1', gmId: 'attacker', content: 'spoofed' }, 'attacker'),
    ).rejects.toThrow(ForbiddenException);
    expect(insert).not.toHaveBeenCalled();
  });

  it('uses the authenticated GM when creating narrative entries', async () => {
    const values = jest.fn().mockReturnValue({ returning: jest.fn().mockResolvedValue([{ id: 'entry-1' }]) });
    const db = {
      query: { gameSessions: { findFirst: jest.fn().mockResolvedValue({ id: 'session-1', gmId: 'gm-1' }) } },
      insert: jest.fn().mockReturnValue({ values }),
    };
    const service = new NarrativeService({ db } as unknown as DatabaseService);

    await service.create({ sessionId: 'session-1', gmId: 'attacker', content: 'entry' }, 'gm-1');

    expect(values).toHaveBeenCalledWith(
      expect.objectContaining({ sessionId: 'session-1', gmId: 'gm-1', content: 'entry' }),
    );
  });

  it('rejects chapter event access for sessions owned by another GM', async () => {
    const db = {
      query: {
        chapterEvents: {
          findFirst: jest.fn().mockResolvedValue({
            id: 'event-1',
            sessionId: 'session-1',
          }),
        },
        gameSessions: { findFirst: jest.fn().mockResolvedValue({ id: 'session-1', gmId: 'owner-gm' }) },
      },
      update: jest.fn(),
    };
    const service = new ChapterEventsService({ db } as unknown as DatabaseService);

    await expect(
      service.update('event-1', { title: 'changed', sessionId: 'other-session' }, 'attacker'),
    ).rejects.toThrow(ForbiddenException);
    expect(db.update).not.toHaveBeenCalled();
  });

  it('strips spoofed ownership fields from authorized chapter event updates', async () => {
    const returning = jest.fn().mockResolvedValue([{ id: 'event-1' }]);
    const where = jest.fn().mockReturnValue({ returning });
    const set = jest.fn().mockReturnValue({ where });
    const db = {
      query: {
        chapterEvents: {
          findFirst: jest.fn().mockResolvedValue({
            id: 'event-1',
            sessionId: 'session-1',
          }),
        },
        gameSessions: { findFirst: jest.fn().mockResolvedValue({ id: 'session-1', gmId: 'gm-1' }) },
      },
      update: jest.fn().mockReturnValue({ set }),
    };
    const service = new ChapterEventsService({ db } as unknown as DatabaseService);

    await service.update(
      'event-1',
      { title: 'changed', userId: 'attacker', sessionId: 'other-session', chapterId: 'other-chapter' },
      'gm-1',
    );

    expect(set).toHaveBeenCalledWith({ title: 'changed' });
  });

  it('rejects gameboard projection updates without an authorizable session', async () => {
    const service = new GameboardService({ db: { query: {} } } as unknown as DatabaseService);

    await expect(service.updateProjection('projection-1', { title: 'x' }, 'gm-1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('rejects roll history access for sessions owned by another GM', async () => {
    const db = {
      query: {
        gameSessions: { findFirst: jest.fn().mockResolvedValue({ id: 'session-1', gmId: 'owner-gm' }) },
      },
      select: jest.fn(),
    };
    const service = new DiceService({ db } as unknown as DatabaseService);

    await expect(
      service.getSessionRollHistoryForGm('session-1', 10, 'attacker'),
    ).rejects.toThrow(ForbiddenException);
    expect(db.select).not.toHaveBeenCalled();
  });
});
