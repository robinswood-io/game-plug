import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateCharacterAvatarDto {
  @ApiProperty({ description: 'Character ID' })
  @IsString()
  characterId: string;

  @ApiPropertyOptional({ description: 'Force regenerate even if avatar exists' })
  @IsOptional()
  forceRegenerate?: boolean;
}
