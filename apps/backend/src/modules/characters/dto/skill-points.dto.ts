import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SkillPointsDto {
  @ApiProperty({
    example: 10,
    description: 'Number of skill points to grant to the character',
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  points: number;
}
