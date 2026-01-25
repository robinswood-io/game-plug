import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum EffectType {
  BUFF = 'buff',
  DEBUFF = 'debuff',
  DAMAGE = 'damage',
  HEALING = 'healing',
  SANITY_LOSS = 'sanity_loss',
  SANITY_RECOVERY = 'sanity_recovery',
  MAGIC_LOSS = 'magic_loss',
  MAGIC_RECOVERY = 'magic_recovery',
}

export class ApplyEffectDto {
  @ApiProperty({
    example: 'buff',
    description: 'Type of effect to apply',
    enum: EffectType,
  })
  @IsEnum(EffectType)
  type: EffectType;

  @ApiProperty({
    example: 'Healing Potion',
    description: 'Name of the effect',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'Restores 10 HP over time',
    description: 'Detailed description of the effect',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: '10',
    description: 'Numeric value of the effect (damage, healing amount, stat bonus, etc.)',
  })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiPropertyOptional({
    example: 3,
    description: 'Duration in rounds or turns (0 for permanent)',
  })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the effect is currently active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
