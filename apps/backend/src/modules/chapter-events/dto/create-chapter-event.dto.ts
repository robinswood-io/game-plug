import { IsString, IsOptional, IsBoolean, IsNotEmpty, IsUUID, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChapterEventDto {
  @ApiProperty({ example: 'uuid-chapter-id', description: 'Chapter ID' })
  @IsString()
  @IsNotEmpty({ message: 'L\'ID du chapitre est requis' })
  chapterId: string;

  @ApiPropertyOptional({ example: 'uuid-session-id', description: 'Session ID' })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiProperty({
    example: 'combat',
    description: 'Event type: roll, narration, decision, sanity, combat, discovery, milestone'
  })
  @IsString()
  @IsNotEmpty({ message: 'Le type d\'evenement est requis' })
  eventType: string;

  @ApiProperty({ example: 'Combat contre le Profond', description: 'Event title' })
  @IsString()
  @IsNotEmpty({ message: 'Le titre de l\'evenement est requis' })
  title: string;

  @ApiPropertyOptional({ example: 'Les investigateurs font face a...', description: 'Event description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Additional metadata (roll results, etc.)' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ApiPropertyOptional({ example: 'uuid-character-id', description: 'Related character ID' })
  @IsOptional()
  @IsString()
  characterId?: string;

  @ApiPropertyOptional({ example: 'uuid-user-id', description: 'User ID who triggered the event' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ example: true, description: 'Mark as important event' })
  @IsOptional()
  @IsBoolean()
  isImportant?: boolean;
}
