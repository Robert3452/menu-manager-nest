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
    const result = await this.scheduleService.create(body);
    return {
      message: 'Schedule created Successfully',
      success: true,
      data: result,
    };
  }

  @Get(':scheduleId')
  async getScheduleById(@Param('scheduleId') scheduleId: string) {
    const result = await this.scheduleService.getScheduleById(+scheduleId);
    return {
      success: true,
      data: result,
      message: 'Schedule view',
    };
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
    const result = await this.weekdaySchedule.update(
      +scheduleId,
      weekday,
      body,
    );
    return {
      success: true,
      message: 'Weekday schedule created',
      data: result,
    };
  }
  @Delete(':scheduleId')
  async deleteScheduleById(@Param('scheduleId') scheduleId: string) {
    const result = await this.scheduleService.delete(+scheduleId);
    return {
      success: true,
      message: 'Schedule deleted successfully',
      data: result,
    };
  }
  @Delete(':scheduleId/weekdays/:weekday')
  async deleteWeekday(
    @Param('scheduleId') scheduleId: string,
    @Param('weekday') weekday: Weekdays,
  ) {
    const result = await this.scheduleService.deleteWeekdaySchedule(
      +scheduleId,
      weekday,
    );
    return {
      success: true,
      message: 'Weekday removed',
      data: result,
    };
  }
}
