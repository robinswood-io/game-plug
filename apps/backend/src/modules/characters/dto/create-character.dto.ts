import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
  IsBoolean,
  IsDecimal,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCharacterDto {
  @ApiProperty({ example: 'Professor John Arcane', description: 'Character name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'sess_123', description: 'Session ID' })
  @IsString()
  @IsOptional()
  sessionId?: string;

  @ApiProperty({ example: 'Archaeologist', description: 'Character occupation' })
  @IsString()
  occupation: string;

  @ApiProperty({ example: 75, description: 'Strength (1-200 with bonuses)' })
  @IsNumber()
  @Min(1)
  @Max(200)
  strength: number;

  @ApiProperty({ example: 70, description: 'Constitution (1-200 with bonuses)' })
  @IsNumber()
  @Min(1)
  @Max(200)
  constitution: number;

  @ApiProperty({ example: 60, description: 'Size (1-200 with bonuses)' })
  @IsNumber()
  @Min(1)
  @Max(200)
  size: number;

  @ApiProperty({ example: 72, description: 'Dexterity (1-200 with bonuses)' })
  @IsNumber()
  @Min(1)
  @Max(200)
  dexterity: number;

  @ApiProperty({ example: 65, description: 'Appearance (1-200 with bonuses)' })
  @IsNumber()
  @Min(1)
  @Max(200)
  appearance: number;

  @ApiProperty({ example: 85, description: 'Intelligence (1-200 with bonuses)' })
  @IsNumber()
  @Min(1)
  @Max(200)
  intelligence: number;

  @ApiProperty({ example: 55, description: 'Power (1-200 with bonuses)' })
  @IsNumber()
  @Min(1)
  @Max(200)
  power: number;

  @ApiProperty({ example: 80, description: 'Education (1-200 with bonuses)' })
  @IsNumber()
  @Min(1)
  @Max(200)
  education: number;

  @ApiProperty({ example: 50, description: 'Luck (1-200 with bonuses)' })
  @IsNumber()
  @Min(1)
  @Max(200)
  luck: number;

  @ApiProperty({ example: 10, description: 'Hit points' })
  @IsNumber()
  @Min(0)
  hitPoints: number;

  @ApiProperty({ example: 12, description: 'Maximum hit points' })
  @IsNumber()
  @Min(0)
  maxHitPoints: number;

  @ApiProperty({ example: 75, description: 'Sanity (0-150 with magic)' })
  @IsNumber()
  @Min(0)
  @Max(150)
  sanity: number;

  @ApiProperty({ example: 99, description: 'Maximum sanity (0-150 with magic)' })
  @IsNumber()
  @Min(0)
  @Max(150)
  maxSanity: number;

  @ApiProperty({ example: 5, description: 'Magic points' })
  @IsNumber()
  @Min(0)
  magicPoints: number;

  @ApiProperty({ example: 10, description: 'Maximum magic points' })
  @IsNumber()
  @Min(0)
  maxMagicPoints: number;

  @ApiPropertyOptional({ example: 45, description: 'Character age' })
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiPropertyOptional({ example: 'Cairo', description: 'Birthplace' })
  @IsOptional()
  @IsString()
  birthplace?: string;

  @ApiPropertyOptional({ example: 'London', description: 'Current residence' })
  @IsOptional()
  @IsString()
  residence?: string;

  @ApiPropertyOptional({ example: 'Male', description: 'Gender' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ example: '175cm', description: 'Height' })
  @IsOptional()
  @IsString()
  height?: string;

  @ApiPropertyOptional({ example: 'Athletic', description: 'Build' })
  @IsOptional()
  @IsString()
  build?: string;

  @ApiPropertyOptional({ example: 'Brown', description: 'Hair color' })
  @IsOptional()
  @IsString()
  hairColor?: string;

  @ApiPropertyOptional({ example: 'Blue', description: 'Eye color' })
  @IsOptional()
  @IsString()
  eyeColor?: string;

  @ApiPropertyOptional({ example: 'https://avatar.url/prof.jpg', description: 'Avatar URL' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 'Wise academic in 1920s attire', description: 'Prompt for AI avatar generation' })
  @IsOptional()
  @IsString()
  avatarPrompt?: string;

  @ApiPropertyOptional({ example: { 'Archaeology': 70, 'Library Use': 60 }, description: 'Character skills (key-value pairs)' })
  @IsOptional()
  @Type(() => Object)
  skills?: Record<string, number>;

  @ApiPropertyOptional({ example: 'Expert in ancient texts', description: 'Player notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: '500.50', description: 'Starting money' })
  @IsOptional()
  @IsDecimal()
  money?: string;

  @ApiPropertyOptional({ example: 'user_456', description: 'User ID (owner)' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ example: true, description: 'Whether character is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
