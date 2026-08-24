import { randomUUID } from 'crypto';
import { ForbiddenException } from '@nestjs/common';
import { EffectsService } from './effects.service';

describe('EffectsService ownership enforcement', () => {
  const effectId = randomUUID();
  const characterId = randomUUID();
  const otherUserId = randomUUID();
  const effectFindFirst = jest.fn();
  const insert = jest.fn();
  const update = jest.fn();
  const charactersService = {
    findOneAuthorized: jest.fn(),
  };
  const db = {
    query: { activeEffects: { findFirst: effectFindFirst } },
    insert,
    update,
  };
  const service = new EffectsService({ db } as any, charactersService as any);

  beforeEach(() => {
    jest.clearAllMocks();
    charactersService.findOneAuthorized.mockRejectedValue(
      new ForbiddenException('other user'),
    );
  });

  it('denies another user before creating an effect for a real character UUID', async () => {
    await expect(
      service.create({ characterId, type: 'damage', name: 'IDOR' } as any, otherUserId),
    ).rejects.toThrow(ForbiddenException);
    expect(insert).not.toHaveBeenCalled();
  });

  it('denies another user before updating a real effect UUID', async () => {
    effectFindFirst.mockResolvedValue({ id: effectId, characterId });

    await expect(service.update(effectId, { name: 'IDOR' } as any, otherUserId)).rejects.toThrow(
      ForbiddenException,
    );
    expect(update).not.toHaveBeenCalled();
  });
});
