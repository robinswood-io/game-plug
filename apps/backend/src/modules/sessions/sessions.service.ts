import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { gameSessions, characters, sanityConditions, activeEffects, inventory } from '@shared/schema';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class SessionsService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(gmId?: string) {
    if (gmId) {
      return this.db.db.query.gameSessions.findMany({
        where: eq(gameSessions.gmId, gmId),
      });
    }
    return this.db.db.query.gameSessions.findMany();
  }

  async findOne(id: string) {
    const session = await this.db.db.query.gameSessions.findFirst({
      where: eq(gameSessions.id, id),
    });
    if (!session) {
      throw new NotFoundException(`Session ${id} not found`);
    }
    return session;
  }

  async findOneForGm(id: string, gmId: string) {
    const session = await this.findOne(id);
    if (session.gmId !== gmId) {
      throw new NotFoundException(`Session ${id} not found`);
    }
    return session;
  }

  async findByJoinCode(code: string) {
    const session = await this.db.db.query.gameSessions.findFirst({
      where: eq(gameSessions.code, code.toUpperCase()),
    });

    if (!session || session.status !== 'active') {
      throw new NotFoundException('Session not found or inactive');
    }

    return session;
  }

  async create(data: any) {
    // Generate unique 6-character code for joining
    const code = this.generateSessionCode();

    const [session] = await this.db.db
      .insert(gameSessions)
      .values({
        ...data,
        code,
        status: 'active', // Default status
      })
      .returning();
    return session;
  }

  private generateSessionCode(): string {
    // Generate random 6-character alphanumeric code
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude similar chars (0,O,1,I)
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async update(id: string, data: any, gmId: string) {
    await this.findOneForGm(id, gmId);
    const [updated] = await this.db.db
      .update(gameSessions)
      .set(data)
      .where(eq(gameSessions.id, id))
      .returning();
    return updated;
  }

  async delete(id: string, gmId: string) {
    await this.findOneForGm(id, gmId);
    // Soft delete: mark session as inactive instead of hard delete (BUG-010 fix)
    // This prevents cascade delete foreign key constraint errors
    const updateData: any = { isActive: false, status: 'ended' };
    const [updated] = await this.db.db
      .update(gameSessions)
      .set(updateData)
      .where(eq(gameSessions.id, id))
      .returning();

    if (!updated) {
      throw new NotFoundException(`Session ${id} not found`);
    }

    return updated;
  }

  async getImportableCharacters(sessionId: string, gmId: string) {
    // Verify GM owns this session
    const session = await this.findOne(sessionId);
    if (session.gmId !== gmId) {
      throw new ForbiddenException('Only the GM can import characters');
    }

    // Get all sessions owned by this GM
    const gmSessions = await this.findAll(gmId);

    // Get all characters from GM's other sessions, sorted by creation date
    const charactersFromOtherSessions = await Promise.all(
      gmSessions
        .filter(s => s.id !== sessionId)
        .map(async (s) => {
          const chars = await this.db.db.query.characters.findMany({
            where: eq(characters.sessionId, s.id as any),
            orderBy: (chars, { asc }) => asc(chars.createdAt),
          });
          return chars.map(char => ({
            ...char,
            sessionName: s.name,
          }));
        })
    );

    return charactersFromOtherSessions.flat();
  }

  async importCharacter(sessionId: string, characterId: string, gmId: string, resetState: boolean = true) {
    // Check if user is GM of target session
    const targetSession = await this.findOne(sessionId);
    if (targetSession.gmId !== gmId) {
      throw new ForbiddenException('Only the GM can import characters');
    }

    // Get source character
    const sourceCharacter = await this.db.db.query.characters.findFirst({
      where: eq(characters.id, characterId),
    });

    if (!sourceCharacter) {
      throw new NotFoundException('Source character not found');
    }

    if (!sourceCharacter.sessionId) {
      throw new BadRequestException('Source character is not associated with a session');
    }

    // Verify source session belongs to same GM
    const sourceSession = await this.findOne(sourceCharacter.sessionId);
    if (sourceSession.gmId !== gmId) {
      throw new ForbiddenException('You can only import characters from your own sessions');
    }

    // Create copy of character in new session
    const [importedCharacter] = await this.db.db
      .insert(characters)
      .values({
        name: sourceCharacter.name,
        occupation: sourceCharacter.occupation,
        age: sourceCharacter.age,
        birthplace: sourceCharacter.birthplace,
        residence: sourceCharacter.residence,
        gender: sourceCharacter.gender,

        // Physical characteristics
        height: sourceCharacter.height,
        build: sourceCharacter.build,
        hairColor: sourceCharacter.hairColor,
        eyeColor: sourceCharacter.eyeColor,

        sessionId: sessionId,
        userId: sourceCharacter.userId,

        // Copy all characteristics
        strength: sourceCharacter.strength,
        constitution: sourceCharacter.constitution,
        size: sourceCharacter.size,
        dexterity: sourceCharacter.dexterity,
        appearance: sourceCharacter.appearance,
        intelligence: sourceCharacter.intelligence,
        power: sourceCharacter.power,
        education: sourceCharacter.education,
        luck: sourceCharacter.luck,

        // Apply state based on resetState parameter
        hitPoints: resetState ? sourceCharacter.maxHitPoints : sourceCharacter.hitPoints,
        maxHitPoints: sourceCharacter.maxHitPoints,
        sanity: resetState ? sourceCharacter.maxSanity : sourceCharacter.sanity,
        maxSanity: sourceCharacter.maxSanity,
        magicPoints: resetState ? sourceCharacter.maxMagicPoints : sourceCharacter.magicPoints,
        maxMagicPoints: sourceCharacter.maxMagicPoints,

        // Avatar
        avatarUrl: sourceCharacter.avatarUrl,
        avatarPrompt: sourceCharacter.avatarPrompt,

        // Copy skills
        skills: sourceCharacter.skills,
        skillsLocked: sourceCharacter.skillsLocked || false,
        availableSkillPoints: resetState ? 0 : (sourceCharacter.availableSkillPoints || 0),

        // Handle progress-related fields based on resetState
        notes: resetState ? null : sourceCharacter.notes,
        money: resetState ? '0.00' : sourceCharacter.money,
      } as any)
      .returning();

    // If not resetting state, copy sanity conditions, active effects, and inventory
    if (!resetState) {
      // Copy sanity conditions
      const sourceConditions = await this.db.db.query.sanityConditions.findMany({
        where: eq(sanityConditions.characterId, characterId),
      });

      for (const condition of sourceConditions) {
        await this.db.db.insert(sanityConditions).values({
          characterId: importedCharacter.id,
          type: condition.type,
          name: condition.name,
          description: condition.description,
          duration: condition.duration,
          isActive: condition.isActive,
        } as any);
      }

      // Copy active effects
      const sourceEffects = await this.db.db.query.activeEffects.findMany({
        where: eq(activeEffects.characterId, characterId),
      });

      for (const effect of sourceEffects) {
        await this.db.db.insert(activeEffects).values({
          characterId: importedCharacter.id,
          appliedBy: effect.appliedBy,
          type: effect.type,
          name: effect.name,
          description: effect.description,
          value: effect.value,
          duration: effect.duration,
          isActive: effect.isActive,
        } as any);
      }

      // Copy inventory items
      const sourceInventory = await this.db.db.query.inventory.findMany({
        where: eq(inventory.characterId, characterId),
      });

      for (const item of sourceInventory) {
        await this.db.db.insert(inventory).values({
          characterId: importedCharacter.id,
          name: item.name,
          category: item.category,
          description: item.description,
          quantity: item.quantity ?? 1,
          weight: item.weight ?? 1,
          isEquipped: item.isEquipped ?? false,
          damage: item.damage,
          armor: item.armor,
          properties: item.properties,
        } as any);
      }
    }

    return {
      message: 'Character imported successfully',
      character: importedCharacter,
      resetState,
    };
  }

  async removeCharacter(sessionId: string, characterId: string, gmId: string) {
    // Check if GM owns this session
    const session = await this.findOne(sessionId);
    if (session.gmId !== gmId) {
      throw new ForbiddenException('Only the GM can remove players from the session');
    }

    // Check if character exists and belongs to this session
    const character = await this.db.db.query.characters.findFirst({
      where: eq(characters.id, characterId),
    });

    if (!character) {
      throw new NotFoundException('Character not found');
    }

    if (character.sessionId !== sessionId) {
      throw new BadRequestException('Character does not belong to this session');
    }

    // Delete the character
    await this.db.db.delete(characters).where(eq(characters.id, characterId));

    return { message: 'Character removed from session successfully' };
  }

  async getCharacters(sessionId: string) {
    // Get all characters in the session, sorted by creation date (stable sort)
    const sessionCharacters = await this.db.db.query.characters.findMany({
      where: eq(characters.sessionId, sessionId),
      orderBy: (chars, { asc }) => asc(chars.createdAt),
    });

    // Get sanity conditions and active effects for each character
    const charactersWithDetails = await Promise.all(
      sessionCharacters.map(async (character) => {
        const [conditions, effects] = await Promise.all([
          this.db.db.query.sanityConditions.findMany({
            where: eq(sanityConditions.characterId, character.id),
          }),
          this.db.db.query.activeEffects.findMany({
            where: eq(activeEffects.characterId, character.id),
          }),
        ]);

        return {
          ...character,
          sanityConditions: conditions,
          activeEffects: effects,
        };
      })
    );

    return charactersWithDetails;
  }

  async getCharactersForGm(sessionId: string, gmId: string) {
    // Verify GM owns this session
    const session = await this.findOne(sessionId);
    if (session.gmId !== gmId) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }
    return this.getCharacters(sessionId);
  }
}
