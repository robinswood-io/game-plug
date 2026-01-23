import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SuggestNarrativeDto {
  @ApiProperty({ description: 'Session ID for context' })
  @IsString()
  sessionId: string;

  @ApiProperty({ description: 'Current situation or context' })
  @IsString()
  context: string;

  @ApiPropertyOptional({ description: 'Recent events or actions taken', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recentEvents?: string[];

  @ApiPropertyOptional({ description: 'Character names involved' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  characters?: string[];

  @ApiPropertyOptional({ description: 'Desired tone (horror, mystery, action, etc.)' })
  @IsOptional()
  @IsString()
  tone?: string;

  @ApiPropertyOptional({ description: 'Number of suggestions to generate' })
  @IsOptional()
  @IsString()
  suggestionCount?: string;
}
