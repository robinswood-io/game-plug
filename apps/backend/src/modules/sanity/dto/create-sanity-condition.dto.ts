import {
  IsString,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSanityConditionDto {
  @ApiProperty({ description: 'Character ID associated with this condition' })
  @IsString()
  characterId: string;

  @ApiProperty({
    description: 'Type of sanity condition',
    enum: ['phobia', 'mania', 'temporary_insanity', 'indefinite_insanity'],
  })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Name of the sanity condition' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Detailed description of the condition' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Duration type',
    enum: ['temporary', 'indefinite', 'permanent'],
  })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({ description: 'Whether the condition is currently active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
