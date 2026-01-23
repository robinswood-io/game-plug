import { PartialType } from '@nestjs/swagger';
import { CreateSanityConditionDto } from './create-sanity-condition.dto';

export class UpdateSanityConditionDto extends PartialType(CreateSanityConditionDto) {}
