import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { AiService } from './ai.service';
import { DatabaseService } from '../database/database.service';
import { AiOpenAiService } from './services';

describe('AiService', () => {
  let service: AiService;
  let dbService: { db: { select: jest.Mock } };
  let openAiService: { isConfigured: jest.Mock; generateCharacterAvatar: jest.Mock };

  const character = {
    id: 'character-1',
    userId: 'player-1',
    sessionId: 'session-1',
    name: 'Ada Marsh',
    occupation: 'Antiquarian',
    age: 34,
    gender: 'female',
    appearance: 65,
    education: 80,
    intelligence: 70,
    strength: 45,
    constitution: 50,
  };

  const selectChain = (rows: unknown[]) => ({
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue(rows),
  });

  beforeEach(() => {
    dbService = {
      db: {
        select: jest.fn(),
      },
    };

    openAiService = {
      isConfigured: jest.fn().mockReturnValue(false),
      generateCharacterAvatar: jest.fn(),
    };

    service = new AiService(
      dbService as unknown as DatabaseService,
      openAiService as unknown as AiOpenAiService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('allows the character owner to generate an avatar', async () => {
    dbService.db.select.mockReturnValueOnce(selectChain([character]));

    const result = await service.generateCharacterAvatar(
      'character-1',
      { characterId: 'character-1' },
      'player-1',
    );

    expect(result).toEqual(
      expect.objectContaining({
        success: true,
        characterId: 'character-1',
        characterName: 'Ada Marsh',
      }),
    );
    expect(openAiService.generateCharacterAvatar).not.toHaveBeenCalled();
  });

  it('allows the owning session GM to generate a character avatar', async () => {
    dbService.db.select
      .mockReturnValueOnce(selectChain([character]))
      .mockReturnValueOnce(selectChain([{ id: 'session-1', gmId: 'gm-1' }]));

    const result = await service.generateCharacterAvatar(
      'character-1',
      { characterId: 'character-1' },
      'gm-1',
    );

    expect(result).toEqual(
      expect.objectContaining({
        success: true,
        characterId: 'character-1',
      }),
    );
  });

  it('rejects cross-user avatar generation for another player character', async () => {
    dbService.db.select
      .mockReturnValueOnce(selectChain([character]))
      .mockReturnValueOnce(selectChain([{ id: 'session-1', gmId: 'gm-1' }]));

    await expect(
      service.generateCharacterAvatar(
        'character-1',
        { characterId: 'character-1' },
        'player-2',
      ),
    ).rejects.toThrow(ForbiddenException);

    expect(openAiService.generateCharacterAvatar).not.toHaveBeenCalled();
  });

  it('rejects avatar generation when authenticated user context is missing', async () => {
    await expect(
      service.generateCharacterAvatar(
        'character-1',
        { characterId: 'character-1' },
        '',
      ),
    ).rejects.toThrow(ForbiddenException);

    expect(dbService.db.select).not.toHaveBeenCalled();
  });

  it('keeps the not-found behavior for missing characters', async () => {
    dbService.db.select.mockReturnValueOnce(selectChain([]));

    await expect(
      service.generateCharacterAvatar(
        'missing-character',
        { characterId: 'missing-character' },
        'player-1',
      ),
    ).rejects.toThrow(BadRequestException);
  });
});
