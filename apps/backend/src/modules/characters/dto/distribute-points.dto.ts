import { IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DistributePointsDto {
  @ApiProperty({
    example: { 'Archaeology': 75, 'Library Use': 65, 'Occult': 55 },
    description: 'Skill updates mapping skill names to new values (points will be deducted from available pool)',
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  @IsObject()
  skillUpdates: Record<string, number>;
}
