import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

export class MigrateAvatarsDto {
  @ApiPropertyOptional({
    description: 'Optional dry-run mode to preview migrations without executing',
  })
  @IsOptional()
  @IsBoolean()
  dryRun?: boolean;
}
