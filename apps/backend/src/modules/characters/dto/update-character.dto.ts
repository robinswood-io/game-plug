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

export class UpdateCharacterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  occupation?: string;

  // Core characteristics (1-200 scale for CoC 7e with bonuses/magic)
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(200)
  strength?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(200)
  constitution?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(200)
  size?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(200)
  dexterity?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(200)
  appearance?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(200)
  intelligence?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(200)
  power?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(200)
  education?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(200)
  luck?: number;

  // Derived stats
  @IsOptional()
  @IsNumber()
  @Min(0)
  hitPoints?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxHitPoints?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(150)
  sanity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(150)
  maxSanity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  magicPoints?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxMagicPoints?: number;

  // Physical characteristics
  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsString()
  birthplace?: string;

  @IsOptional()
  @IsString()
  residence?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  height?: string;

  @IsOptional()
  @IsString()
  build?: string;

  @IsOptional()
  @IsString()
  hairColor?: string;

  @IsOptional()
  @IsString()
  eyeColor?: string;

  // Avatar
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  avatarPrompt?: string;

  // Skills (JSON object)
  @IsOptional()
  @Type(() => Object)
  skills?: Record<string, number>;

  @IsOptional()
  @IsBoolean()
  skillsLocked?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  availableSkillPoints?: number;

  // Player notes
  @IsOptional()
  @IsString()
  notes?: string;

  // Money
  @IsOptional()
  @IsDecimal()
  money?: string;

  // Status
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
