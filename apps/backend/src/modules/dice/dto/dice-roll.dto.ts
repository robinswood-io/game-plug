import {
  IsString,
  IsOptional,
  IsBoolean,
  Matches,
  IsNumber,
} from 'class-validator';

export class DiceRollDto {
  @IsString()
  @Matches(/^\d+d\d+(?:\+|-)\d+|\d+d\d+$/, {
    message:
      'Le format doit être valide (ex: 1d20, 2d6+3, 1d100-5)',
  })
  diceFormula: string;

  @IsOptional()
  @IsString()
  rollType?: string; // 'skill', 'sanity', 'damage', 'custom'

  @IsOptional()
  @IsString()
  skillName?: string;

  @IsOptional()
  @IsNumber()
  skillValue?: number;

  @IsOptional()
  @IsString()
  characterId?: string;

  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsOptional()
  @IsBoolean()
  isGmRoll?: boolean;

  @IsOptional()
  @IsNumber()
  bonusDice?: number;

  @IsOptional()
  @IsNumber()
  penaltyDice?: number;
}
