import { PartialType } from '@nestjs/swagger';
import { CreateWeekdayScheduleDto } from './create-weekday-schedule.dto';

export class UpdateWeekdayScheduleDto extends PartialType(
  CreateWeekdayScheduleDto,
) {}
