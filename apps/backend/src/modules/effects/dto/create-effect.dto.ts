import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEffectDto {
  @ApiProperty({ example: 'char_123', description: 'Character ID to apply effect to' })
  @IsString()
  characterId: string;

  @ApiProperty({ example: 'buff', description: 'Effect type: buff, debuff, damage, sanity_loss' })
  @IsString()
  type: string;

  @ApiProperty({ example: 'Blessed by Ancient Artifact', description: 'Effect name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Grants +1d6 to all rolls for 3 rounds', description: 'Effect description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '1d6', description: 'Dice formula or static value' })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiPropertyOptional({ example: 3, description: 'Duration in rounds/hours' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  duration?: number;

  @ApiPropertyOptional({ example: 'user_456', description: 'GM user ID who applied the effect' })
  @IsOptional()
  @IsString()
  appliedBy?: string;

  @ApiPropertyOptional({ example: true, description: 'Is effect currently active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
