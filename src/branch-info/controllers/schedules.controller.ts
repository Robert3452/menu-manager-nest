import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ScheduleService } from '../services/schedule.service';
import { WeekdayScheduleService } from '../services/weekday-schedule.service';
import { CreateScheduleDto } from '../dto/create-schedule.dto';
import { Weekdays } from 'src/database/Entity/Enum/WeekDaysEnum';
import { UpdateWeekdayScheduleDto } from '../dto/update-weekday-schedule.dto';
import { CreateWeekdayScheduleDto } from '../dto/create-weekday-schedule.dto';

@Controller('schedules')
export class SchedulesController {
  constructor(
    private scheduleService: ScheduleService,
    private weekdaySchedule: WeekdayScheduleService,
  ) {}

  @Post()
  async createSchedule(@Body() body: CreateScheduleDto) {
    return this.scheduleService.create(body);
  }

  @Get(':scheduleId')
  async getScheduleById(@Param('scheduleId') scheduleId: string) {
    return this.scheduleService.getScheduleById(+scheduleId);
  }

  @Post(':scheduleId/weekdays')
  async getScheduleWeekdaysById(
    @Param('scheduleId') scheduleId: string,
    @Body() body: CreateWeekdayScheduleDto,
  ) {
    return this.scheduleService.addWeekdaySchedule(+scheduleId, body);
  }
  @Put(':scheduleId/weekdays/:weekday')
  async updateWeekdaySchedule(
    @Param('scheduleId') scheduleId: string,
    @Param('weekday') weekday: Weekdays,
    @Body() body: UpdateWeekdayScheduleDto,
  ) {
    return this.weekdaySchedule.update(+scheduleId, weekday, body);
  }
  @Delete(':scheduleId')
  async deleteScheduleById(@Param('scheduleId') scheduleId: string) {
    return this.scheduleService.delete(+scheduleId);
  }
  @Delete(':scheduleId/weekdays/:weekday')
  async deleteWeekday(
    @Param('scheduleId') scheduleId: string,
    @Param('weekday') weekday: Weekdays,
  ) {
    return this.scheduleService.deleteWeekdaySchedule(+scheduleId, weekday);
  }
}
