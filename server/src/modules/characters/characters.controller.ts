import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { CharactersService } from './characters.service';
import { JwtAuthGuard, User } from '@robinswood/auth';
import type { IAuthUser } from '@robinswood/auth';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  createCharacterSchema,
  type CreateCharacterDto,
} from './dto/create-character.dto';
import {
  updateCharacterSchema,
  type UpdateCharacterDto,
} from './dto/update-character.dto';
import {
  createInventoryItemSchema,
  updateInventoryItemSchema,
  type CreateInventoryItemDto,
} from './dto/inventory-item.dto';
import {
  createSanityConditionSchema,
  type CreateSanityConditionDto,
} from './dto/sanity-condition.dto';
import {
  createActiveEffectSchema,
  type CreateActiveEffectDto,
} from './dto/active-effect.dto';

@Controller('api/characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createCharacter(
    @Body(new ZodValidationPipe(createCharacterSchema)) data: CreateCharacterDto,
    @User() user: IAuthUser,
  ) {
    const sessionId = (data as any).sessionId || 'default';
    return this.charactersService.createCharacterByEmail(data, sessionId, user.email);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserCharacters(@User() user: IAuthUser) {
    return this.charactersService.getCharactersByUserEmail(user.email);
  }

  @Get(':id')
  async getCharacter(@Param('id') id: string) {
    return this.charactersService.getCharacterById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateCharacter(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateCharacterSchema)) data: UpdateCharacterDto,
    @User() user: IAuthUser,
  ) {
    const isGM = await this.charactersService.checkGMOwnershipByEmail(id, user.email);
    const isOwner = await this.charactersService.checkCharacterOwnershipByEmail(id, user.email);

    if (!isGM && !isOwner) {
      throw new ForbiddenException('Permission denied');
    }

    return this.charactersService.updateCharacter(id, data);
  }

  @Patch(':id/notes')
  @UseGuards(JwtAuthGuard)
  async updateCharacterNotes(
    @Param('id') id: string,
    @Body() body: { notes: string },
    @User() user: IAuthUser,
  ) {
    const isGM = await this.charactersService.checkGMOwnershipByEmail(id, user.email);
    const isOwner = await this.charactersService.checkCharacterOwnershipByEmail(id, user.email);

    if (!isGM && !isOwner) {
      throw new ForbiddenException('Permission denied');
    }

    const character = await this.charactersService.updateCharacter(id, {
      notes: body.notes,
    } as any);

    return { notes: character.notes };
  }

  @Get(':id/inventory')
  async getInventory(@Param('id') id: string) {
    return this.charactersService.getCharacterInventory(id);
  }

  @Post(':id/inventory')
  @UseGuards(JwtAuthGuard)
  async addInventoryItem(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(createInventoryItemSchema)) data: CreateInventoryItemDto,
    @User() user: IAuthUser,
  ) {
    const isGM = await this.charactersService.checkGMOwnershipByEmail(id, user.email);
    const isOwner = await this.charactersService.checkCharacterOwnershipByEmail(id, user.email);

    if (!isGM && !isOwner) {
      throw new ForbiddenException('Permission denied');
    }

    return this.charactersService.addInventoryItem(id, data);
  }

  @Post(':id/sanity-conditions')
  @UseGuards(JwtAuthGuard)
  async addSanityCondition(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(createSanityConditionSchema)) data: CreateSanityConditionDto,
  ) {
    return this.charactersService.addSanityCondition(id, data);
  }

  @Post(':id/effects')
  @UseGuards(JwtAuthGuard)
  async addActiveEffect(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(createActiveEffectSchema)) data: CreateActiveEffectDto,
    @User() user: IAuthUser,
  ) {
    const isGM = await this.charactersService.checkGMOwnershipByEmail(id, user.email);

    if (!isGM) {
      throw new ForbiddenException('Only GM can add effects');
    }

    return this.charactersService.addActiveEffect(id, data);
  }

  @Get('test/admin-only')
  @UseGuards(JwtAuthGuard)
  async testAdminOnly(@User() user: IAuthUser) {
    return {
      message: 'Access granted - Admin only endpoint',
      user,
    };
  }

  @Get('test/moderator-or-admin')
  @UseGuards(JwtAuthGuard)
  async testModeratorOrAdmin(@User() user: IAuthUser) {
    return {
      message: 'Access granted - Moderator or Admin',
      user,
    };
  }
}

@Controller('api/inventory')
export class InventoryController {
  constructor(private readonly charactersService: CharactersService) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateInventoryItem(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateInventoryItemSchema)) data: any,
  ) {
    return this.charactersService.updateInventoryItem(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteInventoryItem(@Param('id') id: string) {
    await this.charactersService.deleteInventoryItem(id);
    return { message: 'Item deleted successfully' };
  }
}

@Controller('api/effects')
export class EffectsController {
  constructor(private readonly charactersService: CharactersService) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateEffect(@Param('id') id: string, @Body() data: any) {
    return this.charactersService.updateActiveEffect(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteEffect(@Param('id') id: string) {
    await this.charactersService.deleteActiveEffect(id);
    return { message: 'Effect deleted successfully' };
  }
}
