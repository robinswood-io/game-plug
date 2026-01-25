import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class ImportCharacterDto {
  @ApiProperty({ description: 'ID of the character to import' })
  @IsString()
  characterId: string;

  @ApiProperty({
    description: 'Whether to reset character state (HP, Sanity, etc.)',
    default: true,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  resetState?: boolean;
}
