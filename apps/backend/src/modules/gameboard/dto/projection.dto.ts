import { IsString, IsOptional, IsArray, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectionDto {
  @ApiProperty({ description: 'Session ID for the projection' })
  @IsString()
  sessionId: string;

  @ApiProperty({ description: 'Projection title/name' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Projection description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Character IDs to include in projection', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  characterIds?: string[];

  @ApiPropertyOptional({ description: 'Projection configuration/state (JSON)' })
  @IsOptional()
  @IsObject()
  config?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Camera/viewport settings for display' })
  @IsOptional()
  @IsObject()
  viewport?: Record<string, unknown>;
}

export class UpdateProjectionDto {
  @ApiPropertyOptional({ description: 'Projection title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Projection description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Character IDs to include', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  characterIds?: string[];

  @ApiPropertyOptional({ description: 'Updated configuration/state' })
  @IsOptional()
  @IsObject()
  config?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Updated viewport settings' })
  @IsOptional()
  @IsObject()
  viewport?: Record<string, unknown>;
}
