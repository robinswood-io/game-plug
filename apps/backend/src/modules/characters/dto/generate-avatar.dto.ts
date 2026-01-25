import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateAvatarDto {
  @ApiPropertyOptional({
    example: 'Mysterious investigator with a determined expression, dramatic shadows, vintage 1920s style',
    description: 'Custom prompt for avatar generation. If not provided, will be auto-generated from character stats',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Force regeneration even if avatar already exists',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  forceRegenerate?: boolean;
}
