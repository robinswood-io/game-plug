import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
