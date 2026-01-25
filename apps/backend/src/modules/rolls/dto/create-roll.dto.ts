import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsOptional, IsEnum } from 'class-validator';

export class CreateRollDto {
  @ApiProperty({ description: 'Character ID who performed the roll' })
  @IsString()
  characterId: string;

  @ApiProperty({ description: 'Session ID' })
  @IsString()
  sessionId: string;

  @ApiProperty({ description: 'Type of roll (skill, sanity, damage, etc.)' })
  @IsString()
  rollType: string;

  @ApiProperty({ description: 'Name of the skill being rolled', required: false })
  @IsOptional()
  @IsString()
  skillName?: string;

  @ApiProperty({ description: 'Skill value percentage', required: false })
  @IsOptional()
  @IsNumber()
  skillValue?: number;

  @ApiProperty({ description: 'Dice formula (e.g., 1d100, 2d6)' })
  @IsString()
  diceFormula: string;

  @ApiProperty({ description: 'Result of the dice roll' })
  @IsNumber()
  result: number;

  @ApiProperty({ description: 'Outcome of the roll (success, failure, etc.)', required: false })
  @IsOptional()
  @IsString()
  outcome?: string;

  @ApiProperty({ description: 'Whether this is a GM roll', required: false })
  @IsOptional()
  @IsBoolean()
  isGmRoll?: boolean;
}
