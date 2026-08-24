import { randomUUID } from 'crypto';
import { ForbiddenException } from '@nestjs/common';
import { CharactersService } from './characters.service';

describe('CharactersService ownership enforcement', () => {
  const characterId = randomUUID();
  const ownerId = randomUUID();
  const otherUserId = randomUUID();
  const sessionGmId = randomUUID();
  const characterFindFirst = jest.fn();
  const sessionFindFirst = jest.fn();
  const update = jest.fn();
  const deleteCharacter = jest.fn();
  const db = {
    query: {
      characters: { findFirst: characterFindFirst },
      gameSessions: { findFirst: sessionFindFirst },
    },
    update,
    delete: deleteCharacter,
  };
  const service = new CharactersService({ db } as any);

  beforeEach(() => {
    jest.clearAllMocks();
    characterFindFirst.mockResolvedValue({
      id: characterId,
      userId: ownerId,
      sessionId: null,
    });
  });

  it('allows the owner for a real UUID', async () => {
    await expect(service.findOneAuthorized(characterId, ownerId)).resolves.toEqual(
      expect.objectContaining({ id: characterId }),
    );
  });

  it('denies another user from reading a character by UUID', async () => {
    await expect(service.findOneAuthorized(characterId, otherUserId)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('denies another user before update or delete queries run', async () => {
    await expect(service.update(characterId, { name: 'idor' }, otherUserId)).rejects.toThrow(
      ForbiddenException,
    );
    await expect(service.delete(characterId, otherUserId)).rejects.toThrow(ForbiddenException);
    expect(update).not.toHaveBeenCalled();
    expect(deleteCharacter).not.toHaveBeenCalled();
  });

  it('allows only the actual session GM when the character belongs to a session', async () => {
    characterFindFirst.mockResolvedValue({
      id: characterId,
      userId: ownerId,
      sessionId: randomUUID(),
    });
    sessionFindFirst.mockResolvedValue({ gmId: sessionGmId });

    await expect(service.findOneAuthorized(characterId, sessionGmId)).resolves.toEqual(
      expect.objectContaining({ id: characterId }),
    );
    await expect(service.findOneAuthorized(characterId, otherUserId)).rejects.toThrow(
      ForbiddenException,
    );
  });
});
