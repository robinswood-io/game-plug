import {
  Controller,
  Post,
  Patch,
  Delete,
  Get,
  Body,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GameplayService } from './gameplay.service';
import { DatabaseService } from '../../common/database/database.service';
import { SessionsGateway } from '../sessions/sessions.gateway';
import { JwtAuthGuard, User } from '@robinswood/auth';
import type { IAuthUser } from '@robinswood/auth';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { EffectsProcessorService } from './services/effects-processor.service';
import { ApplyEffectDto, applyEffectSchema } from './dto/apply-effect.dto';
import { DiceRollDto, diceRollSchema } from './dto/dice-roll.dto';
import { GrantSkillPointsDto, grantSkillPointsSchema } from './dto/skill-points.dto';
import { DistributeSkillPointsDto, distributeSkillPointsSchema } from './dto/skill-points.dto';
import type { InsertActiveEffect } from '../../common/database/database.service';

@Controller('api')
export class GameplayController {
  constructor(
    private readonly gameplayService: GameplayService,
    private readonly effectsProcessor: EffectsProcessorService,
    private readonly db: DatabaseService,
    private readonly sessionsGateway: SessionsGateway,
  ) {}

  @Post('characters/:id/skill-points')
  @UseGuards(JwtAuthGuard)
  async grantSkillPoints(
    @Param('id') characterId: string,
    @Body(new ZodValidationPipe(grantSkillPointsSchema)) dto: GrantSkillPointsDto,
    @User() user: IAuthUser,
  ) {
    const userId = await this.db.getUserIdByEmail(user.email);
    const character = await this.db.getCharacter(characterId);

    if (!character) {
      throw new HttpException('Character not found', HttpStatus.NOT_FOUND);
    }

    const session = await this.db.getGameSession(character.sessionId);
    if (!session || session.gmId !== userId) {
      throw new HttpException('Only the GM can grant skill points', HttpStatus.FORBIDDEN);
    }

    const currentPoints = character.availableSkillPoints || 0;
    const updatedChar = await this.db.updateCharacter(characterId, {
      availableSkillPoints: currentPoints + dto.points,
    });

    // Broadcast skill points update
    if (character.sessionId) {
      this.sessionsGateway.broadcastToSession(character.sessionId, {
        type: 'character_updated',
        data: {
          characterId,
          character: updatedChar,
          updateType: 'skill_points_granted',
        },
      });
    }

    return updatedChar;
  }

  @Post('characters/:id/distribute-points')
  @UseGuards(JwtAuthGuard)
  async distributeSkillPoints(
    @Param('id') characterId: string,
    @Body(new ZodValidationPipe(distributeSkillPointsSchema)) dto: DistributeSkillPointsDto,
    @User() user: IAuthUser,
  ) {
    const userId = await this.db.getUserIdByEmail(user.email);
    const character = await this.db.getCharacter(characterId);

    if (!character) {
      throw new HttpException('Character not found', HttpStatus.NOT_FOUND);
    }

    const session = await this.db.getGameSession(character.sessionId);
    if (character.userId !== userId && session?.gmId !== userId) {
      throw new HttpException('Unauthorized to modify this character', HttpStatus.FORBIDDEN);
    }

    const currentSkills = (character.skills as Record<string, number>) || {};
    let totalPointsUsed = 0;
    const updatedSkills = { ...currentSkills };

    Object.entries(dto.skillUpdates).forEach(([skillName, newValue]) => {
      const currentValue = currentSkills[skillName] || 0;
      const pointsAdded = newValue - currentValue;
      if (pointsAdded > 0) {
        totalPointsUsed += pointsAdded;
        updatedSkills[skillName] = newValue;
      }
    });

    const availablePoints = character.availableSkillPoints || 0;
    if (totalPointsUsed > availablePoints) {
      throw new HttpException('Not enough skill points available', HttpStatus.BAD_REQUEST);
    }

    const updatedChar = await this.db.updateCharacter(characterId, {
      skills: updatedSkills,
      availableSkillPoints: availablePoints - totalPointsUsed,
    });

    // Broadcast skill distribution update
    if (character.sessionId) {
      this.sessionsGateway.broadcastToSession(character.sessionId, {
        type: 'character_updated',
        data: {
          characterId,
          character: updatedChar,
          updateType: 'skills_distributed',
        },
      });
    }

    return updatedChar;
  }

  @Post('characters/:id/effects')
  @UseGuards(JwtAuthGuard)
  async applyEffect(
    @Param('id') characterId: string,
    @Body(new ZodValidationPipe(applyEffectSchema)) dto: ApplyEffectDto,
    @User() user: IAuthUser,
  ) {
    const userId = await this.db.getUserIdByEmail(user.email);
    const character = await this.db.getCharacter(characterId);

    if (!character) {
      throw new HttpException('Character not found', HttpStatus.NOT_FOUND);
    }

    const effectData: InsertActiveEffect = {
      characterId,
      name: dto.name,
      type: dto.type,
      description: dto.description,
      value: dto.value,
      duration: dto.duration,
      appliedBy: userId,
      isActive: true,
    };

    const effect = await this.db.addActiveEffect(effectData);
    const value = parseInt(effectData.value || '0');

    const { updateData, shouldApplyAutoEffects } = await this.effectsProcessor.processEffect(
      character,
      effectData.type,
      effectData.name,
      value,
      effectData.duration ?? undefined,
    );

    if (Object.keys(updateData).length > 0) {
      await this.db.updateCharacter(characterId, updateData);
    }

    await this.effectsProcessor.applyAutoEffectsIfNeeded(character, updateData, shouldApplyAutoEffects);

    // Broadcast character update to all session participants for real-time sync
    const updatedCharacter = await this.db.getCharacter(characterId);
    if (updatedCharacter && character.sessionId) {
      this.sessionsGateway.broadcastToSession(character.sessionId, {
        type: 'character_updated',
        data: {
          characterId,
          character: updatedCharacter,
          effect: {
            id: effect.id,
            name: effect.name,
            type: effect.type,
            value: effect.value,
          },
          updateData,
        },
      });
    }

    return effect;
  }

  @Patch('effects/:id')
  @UseGuards(JwtAuthGuard)
  async updateEffect(
    @Param('id') effectId: string,
    @Body() updateData: Record<string, unknown>,
  ) {
    const effect = await this.db.updateActiveEffect(effectId, updateData);
    return effect;
  }

  @Delete('effects/:id')
  @UseGuards(JwtAuthGuard)
  async deleteEffect(@Param('id') effectId: string) {
    await this.db.deleteActiveEffect(effectId);
    return { message: 'Effect deleted successfully' };
  }

  @Post('rolls')
  @UseGuards(JwtAuthGuard)
  async createRoll(
    @Body(new ZodValidationPipe(diceRollSchema)) dto: DiceRollDto,
    @User() user: IAuthUser,
  ) {
    const userId = await this.db.getUserIdByEmail(user.email);

    const diceFormula =
      dto.modifier !== undefined && dto.modifier !== 0
        ? `1${dto.diceType}${dto.modifier > 0 ? '+' : ''}${dto.modifier}`
        : `1${dto.diceType}`;

    const rollType = dto.skillName ? 'skill' : 'custom';
    const outcome = this.determineOutcome(dto);

    const rollData = {
      userId,
      characterId: dto.characterId || null,
      sessionId: dto.sessionId,
      rollType,
      skillName: dto.skillName || null,
      skillValue: dto.skillValue || null,
      diceFormula,
      result: dto.result,
      outcome,
      isGmRoll: false,
    };

    const roll = await this.db.addRollHistory(rollData);

    if (dto.sessionId) {
      this.sessionsGateway.broadcastToSession(dto.sessionId, {
        type: 'roll_result',
        data: roll,
      });
    }

    return roll;
  }

  private determineOutcome(dto: DiceRollDto): string | null {
    if (dto.success === undefined) return null;

    if (dto.success) {
      return dto.critical ? 'extreme_success' : 'success';
    }
    return dto.fumble ? 'fumble' : 'failure';
  }

  @Get('sessions/:id/rolls')
  @UseGuards(JwtAuthGuard)
  async getSessionRolls(@Param('id') sessionId: string) {
    return this.db.getSessionRollHistory(sessionId);
  }
}
