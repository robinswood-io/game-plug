import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';

export enum SessionStatus {
  PREPARATION = 'preparation',
  ACTIVE = 'active',
  ENDED = 'ended',
}

export class UpdateSessionDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsEnum(SessionStatus)
  status?: SessionStatus;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
