import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEnum,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum InventoryCategory {
  WEAPON = 'weapon',
  ARMOR = 'armor',
  TOOL = 'tool',
  BOOK = 'book',
  MISC = 'misc',
}

export class CreateInventoryDto {
  @IsString()
  characterId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(InventoryCategory)
  category: InventoryCategory;

  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @IsOptional()
  @IsBoolean()
  isEquipped?: boolean;

  // Dice formula for weapons (e.g., "1d6+2")
  @IsOptional()
  @IsString()
  damage?: string;

  // Armor value for armor items
  @IsOptional()
  @IsNumber()
  @Min(0)
  armor?: number;

  // Additional properties (range, ammo, etc.)
  @IsOptional()
  @Type(() => Object)
  properties?: Record<string, unknown>;
}
