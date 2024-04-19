import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Weekdays } from 'src/database/Entity/Enum/WeekDaysEnum';

export class CreateWeekdayScheduleDto {
  @IsEnum(Weekdays)
  weekday: Weekdays;
  @IsString()
  openTime: string;
  @IsString()
  endTime: string;
  @IsBoolean()
  closed: boolean;
  @IsOptional()
  @IsNumber()
  id?: number;
  @IsNumber()
  scheduleId: number;
}
