import { PartialType } from '@nestjs/swagger';
import { CreateGameboardDto } from './create-gameboard.dto';

export class UpdateGameboardDto extends PartialType(CreateGameboardDto) {}
