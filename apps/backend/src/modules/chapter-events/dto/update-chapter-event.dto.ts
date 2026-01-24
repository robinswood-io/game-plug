import { PartialType } from '@nestjs/swagger';
import { CreateChapterEventDto } from './create-chapter-event.dto';

export class UpdateChapterEventDto extends PartialType(CreateChapterEventDto) {}
