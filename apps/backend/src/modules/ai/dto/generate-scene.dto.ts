import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateSceneDto {
  @ApiProperty({ description: 'Scene title or theme' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Scene description or context' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ description: 'Location of the scene' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'Time period (e.g., 1920s, modern, Victorian)' })
  @IsOptional()
  @IsString()
  timePeriod?: string;

  @ApiPropertyOptional({ description: 'Mood or atmosphere (e.g., tense, mysterious, calm)' })
  @IsOptional()
  @IsString()
  mood?: string;

  @ApiPropertyOptional({ description: 'Characters present in the scene', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  characters?: string[];
}
