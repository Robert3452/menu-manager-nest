import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateScheduleDto } from '../dto/create-schedule.dto';
import { WeekdaySchedule } from 'src/database/Entity/WeekDaySchedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from 'src/database/Entity/Schedule';
import { Repository } from 'typeorm';
import { BranchesService } from 'src/stores/services/branches.service';
import { Weekdays } from 'src/database/Entity/Enum/WeekDaysEnum';
import { WeekdayScheduleService } from './weekday-schedule.service';
import { CreateWeekdayScheduleDto } from '../dto/create-weekday-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule) private scheduleRepo: Repository<Schedule>,
    private branchService: BranchesService,
    private weekDayScheduleService: WeekdayScheduleService,
  ) {}
  async create(body: CreateScheduleDto) {
    const branch = await this.branchService.getById(body.branchId);
    // const weekdays = ßawait Promise.all(body.weekdaySchedules.map(el => weekDayScheduleService.create(el)))
    const newSchedule = await this.scheduleRepo.create({ branch } as Schedule);
    return newSchedule;
  }
  async upsert(body: CreateScheduleDto) {
    try {
      let schedule;
      const branch = await this.branchService.getBranchById(body.branchId);
      if (branch.schedule) {
        schedule = branch.schedule;
      } else {
        schedule = await this.create({
          branchId: body.branchId,
        } as Schedule);
      }
      const arr = body.weekdaySchedules.map(
        (el) =>
          ({
            ...el,
            scheduleId: schedule.id,
            weekday: Weekdays[el.weekday.toLowerCase()],
          }) as WeekdaySchedule,
      );
      await this.weekDayScheduleService.upsert(arr);
      return this.scheduleRepo
        .createQueryBuilder('schedules')
        .leftJoinAndSelect('schedules.weekdaySchedules', 'weekdaySchedules')
        .where('schedules.id = :scheduleId', { scheduleId: schedule.id })
        .getOne();
    } catch (error) {
      console.error(error);
    }
  }
  async addWeekdaySchedule(scheduleId: number, body: CreateWeekdayScheduleDto) {
    const found = await this.getScheduleById(scheduleId);
    let newWeekday;
    const oldWeekday = found.weekdaySchedules.find(
      (el) => el.weekday === body.weekday,
    );
    if (oldWeekday) {
      const index = found.weekdaySchedules.findIndex(
        (el) => el.weekday === body.weekday,
      );
      newWeekday = await this.weekDayScheduleService.update(
        oldWeekday.scheduleId,
        oldWeekday.weekday,
        body,
      );
      found.weekdaySchedules[index] = newWeekday;
    } else {
      newWeekday = await this.weekDayScheduleService.create(body);
      found.weekdaySchedules.push(newWeekday);
    }
    // found.weekdaySchedules = found.weekdaySchedules.sort((a, b) => a.weekday - b.weekday);
    await this.scheduleRepo.update(found.id, found);
    return await this.getScheduleById(scheduleId);
  }

  async deleteWeekdaySchedule(scheduleId: number, weekdaySchedule: Weekdays) {
    const found = await this.getScheduleById(scheduleId);
    const index = found.weekdaySchedules.findIndex(
      (el) => el.weekday === weekdaySchedule,
    );
    if (index > -1) {
      found.weekdaySchedules.splice(index, 1);
      await this.scheduleRepo.update(found.id, found);
      return found;
    }
    throw new NotFoundException("This weekday doesn't exist");
  }

  async delete(scheduleId: number) {
    const deleted = await this.scheduleRepo.delete(scheduleId);
    return deleted;
  }

  async getScheduleById(scheduleId: number) {
    const result = await this.scheduleRepo
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.weekdaySchedules', 'weekdays')
      .leftJoinAndSelect('schedule.branch', 'branch')
      .where('schedule.id = :scheduleId', { scheduleId })
      .getOne();
    return result;
  }
}
