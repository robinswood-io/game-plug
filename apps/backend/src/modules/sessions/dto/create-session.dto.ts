import { IsString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty({ example: 'La Malediction de Cthulhu', description: 'Session name' })
  @IsString()
  @IsNotEmpty({ message: 'Le nom de la session est requis' })
  name: string;

  @ApiPropertyOptional({ example: 'ABC123', description: 'Session join code (6 characters)' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ example: 'Une aventure horrifique...', description: 'Session description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'CoC7e', description: 'Game system identifier' })
  @IsOptional()
  @IsString()
  gameSystem?: string;

  @ApiPropertyOptional({ example: 'preparation', description: 'Session status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: true, description: 'Is session active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
