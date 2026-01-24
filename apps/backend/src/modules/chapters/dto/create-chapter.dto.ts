import { IsString, IsOptional, IsInt, IsNotEmpty, Min, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChapterDto {
  @ApiProperty({ example: 'Chapitre 1: L\'Appel', description: 'Chapter name' })
  @IsString()
  @IsNotEmpty({ message: 'Le nom du chapitre est requis' })
  name: string;

  @ApiPropertyOptional({ example: 'Les investigateurs decouvrent...', description: 'Chapter description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 0, description: 'Order index for sorting chapters' })
  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;

  @ApiPropertyOptional({ example: 'planned', description: 'Chapter status: planned, active, completed' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 'Notes privees du MJ...', description: 'GM private notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
