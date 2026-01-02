import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { CharactersService } from './characters.service';
import { SessionAuthGuard } from '../../common/guards/session-auth.guard';
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
import type { Request } from 'express';
import type { User } from '../../shared/schema';

@Controller('api/characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  private getUserId(req: Request): string {
    return ((req as any).user as User).id;
  }

  @Post()
  @UseGuards(SessionAuthGuard)
  async createCharacter(
    @Body(new ZodValidationPipe(createCharacterSchema)) data: CreateCharacterDto,
    @Req() req: Request,
  ) {
    const userId = this.getUserId(req);
    const sessionId = (data as any).sessionId || 'default';
    return this.charactersService.createCharacter(data, sessionId, userId);
  }

  @Get()
  @UseGuards(SessionAuthGuard)
  async getUserCharacters(@Req() req: Request) {
    const userId = this.getUserId(req);
    return this.charactersService.getCharactersByUser(userId);
  }

  @Get(':id')
  async getCharacter(@Param('id') id: string) {
    return this.charactersService.getCharacterById(id);
  }

  @Patch(':id')
  @UseGuards(SessionAuthGuard)
  async updateCharacter(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateCharacterSchema)) data: UpdateCharacterDto,
    @Req() req: Request,
  ) {
    const userId = this.getUserId(req);
    const isGM = await this.charactersService.checkGMOwnership(id, userId);
    const isOwner = await this.charactersService.checkCharacterOwnership(id, userId);

    if (!isGM && !isOwner) {
      throw new ForbiddenException('Permission denied');
    }

    return this.charactersService.updateCharacter(id, data);
  }

  @Patch(':id/notes')
  @UseGuards(SessionAuthGuard)
  async updateCharacterNotes(
    @Param('id') id: string,
    @Body() body: { notes: string },
    @Req() req: Request,
  ) {
    const userId = this.getUserId(req);
    const isGM = await this.charactersService.checkGMOwnership(id, userId);
    const isOwner = await this.charactersService.checkCharacterOwnership(id, userId);

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
  @UseGuards(SessionAuthGuard)
  async addInventoryItem(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(createInventoryItemSchema)) data: CreateInventoryItemDto,
    @Req() req: Request,
  ) {
    const userId = this.getUserId(req);
    const isGM = await this.charactersService.checkGMOwnership(id, userId);
    const isOwner = await this.charactersService.checkCharacterOwnership(id, userId);

    if (!isGM && !isOwner) {
      throw new ForbiddenException('Permission denied');
    }

    return this.charactersService.addInventoryItem(id, data);
  }

  @Post(':id/sanity-conditions')
  @UseGuards(SessionAuthGuard)
  async addSanityCondition(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(createSanityConditionSchema)) data: CreateSanityConditionDto,
  ) {
    return this.charactersService.addSanityCondition(id, data);
  }

  @Post(':id/effects')
  @UseGuards(SessionAuthGuard)
  async addActiveEffect(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(createActiveEffectSchema)) data: CreateActiveEffectDto,
    @Req() req: Request,
  ) {
    const userId = this.getUserId(req);
    const isGM = await this.charactersService.checkGMOwnership(id, userId);

    if (!isGM) {
      throw new ForbiddenException('Only GM can add effects');
    }

    return this.charactersService.addActiveEffect(id, data);
  }
}

@Controller('api/inventory')
export class InventoryController {
  constructor(private readonly charactersService: CharactersService) {}

  @Patch(':id')
  @UseGuards(SessionAuthGuard)
  async updateInventoryItem(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateInventoryItemSchema)) data: any,
  ) {
    return this.charactersService.updateInventoryItem(id, data);
  }

  @Delete(':id')
  @UseGuards(SessionAuthGuard)
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
  @UseGuards(SessionAuthGuard)
  async updateEffect(@Param('id') id: string, @Body() data: any) {
    return this.charactersService.updateActiveEffect(id, data);
  }

  @Delete(':id')
  @UseGuards(SessionAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteEffect(@Param('id') id: string) {
    await this.charactersService.deleteActiveEffect(id);
    return { message: 'Effect deleted successfully' };
  }
}
