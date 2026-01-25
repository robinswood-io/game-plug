import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateSessionAvatarsDto {
  @ApiProperty({ description: 'Session ID' })
  @IsString()
  sessionId: string;

  @ApiPropertyOptional({
    description: 'Force regenerate avatars for all characters, even if they exist',
  })
  @IsOptional()
  @IsBoolean()
  forceRegenerate?: boolean;
}
