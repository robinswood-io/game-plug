import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGameboardDto {
  @ApiProperty({ description: 'Session ID for the gameboard' })
  @IsString()
  sessionId: string;

  @ApiProperty({ description: 'Gameboard title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Gameboard description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Character IDs to include', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  characterIds?: string[];

  @ApiPropertyOptional({ description: 'Initial state or configuration (JSON)' })
  @IsOptional()
  state?: Record<string, unknown>;
}
