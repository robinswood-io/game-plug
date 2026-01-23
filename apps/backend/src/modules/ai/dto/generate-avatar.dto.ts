import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateAvatarDto {
  @ApiProperty({ description: 'Character name' })
  @IsString()
  characterName: string;

  @ApiProperty({ description: 'Character occupation' })
  @IsString()
  occupation: string;

  @ApiPropertyOptional({ description: 'Physical description (height, build, hair, eyes, etc.)' })
  @IsOptional()
  @IsString()
  physicalDescription?: string;

  @ApiPropertyOptional({ description: 'Character age' })
  @IsOptional()
  @IsString()
  age?: string;

  @ApiPropertyOptional({ description: 'Character gender' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ description: 'Additional style instructions for the AI' })
  @IsOptional()
  @IsString()
  styleHints?: string;
}
