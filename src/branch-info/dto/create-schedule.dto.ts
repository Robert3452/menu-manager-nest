import { Type } from 'class-transformer';
import { IsArray, IsNumber } from 'class-validator';
import { CreateWeekdayScheduleDto } from './create-weekday-schedule.dto';

export class CreateScheduleDto {
  @IsArray()
  @Type(() => CreateWeekdayScheduleDto)
  weekdaySchedules: CreateWeekdayScheduleDto[];
  @IsNumber()
  branchId: number;
}
