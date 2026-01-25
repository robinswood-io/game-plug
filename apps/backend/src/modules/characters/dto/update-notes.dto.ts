import { IsString, IsOptional } from 'class-validator';

export class UpdateNotesDto {
  @IsOptional()
  @IsString()
  notes?: string;
}
