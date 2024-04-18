import { PartialType } from '@nestjs/swagger';
import { CreateCorridorDto } from './create-corridor.dto';

export class UpdateCorridorDto extends PartialType(CreateCorridorDto) {}
