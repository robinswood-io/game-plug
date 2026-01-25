import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsBoolean,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEffectDto {
  @ApiPropertyOptional({ example: 'debuff', description: 'Effect type: buff, debuff, damage, sanity_loss' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: 'Cursed Wound', description: 'Effect name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Takes 1d3 damage per round', description: 'Effect description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '1d3', description: 'Dice formula or static value' })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiPropertyOptional({ example: 5, description: 'Duration in rounds/hours' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  duration?: number;

  @ApiPropertyOptional({ example: false, description: 'Is effect currently active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
