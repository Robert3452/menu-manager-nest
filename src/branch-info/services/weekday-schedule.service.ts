import { Injectable } from '@nestjs/common';
import { CreateWeekdayScheduleDto } from '../dto/create-weekday-schedule.dto';
import { WeekdaySchedule } from 'src/database/Entity/WeekDaySchedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateWeekdayScheduleDto } from '../dto/update-weekday-schedule.dto';
import { Weekdays } from 'src/database/Entity/Enum/WeekDaysEnum';

@Injectable()
export class WeekdayScheduleService {
  constructor(
    @InjectRepository(WeekdaySchedule)
    private repo: Repository<WeekdaySchedule>,
  ) {}
  async create(body: CreateWeekdayScheduleDto) {
    try {
      const x = { ...body } as WeekdaySchedule;
      const savedScheduleWeekday = await this.repo.create(x);
      return savedScheduleWeekday;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number) {
    try {
      const deleted = await this.repo.delete(id);
      return deleted;
    } catch (error) {
      throw error;
    }
  }

  async upsert(body: WeekdaySchedule[]) {
    try {
      const result = [];
      for (const item of body) {
        let weekdaySchedule;
        // Assuming id is the primary key
        const existingSchedule = await this.repo.findOneBy({
          id: item?.id,
          weekday: item.weekday,
        });

        if (existingSchedule) {
          weekdaySchedule = await this.update(
            item.scheduleId,
            item.weekday,
            item,
          );
        } else {
          // If the schedule doesn't exist, create a new one
          weekdaySchedule = await this.create(item);
          // await weekdayScheduleRepository.create(newSchedule);
        }
        result.push(weekdaySchedule);
      }
      return result.sort((a, b) => a.id + b.id);
    } catch (error) {
      console.error(error);
    }
  }
  async update(
    scheduleId: number,
    weekday: Weekdays,
    body: UpdateWeekdayScheduleDto,
  ) {
    try {
      const weekdaySchedule = await this.repo
        .createQueryBuilder('weekdays')
        .innerJoin('weekday.schedule', 'schedule')
        .where(
          'schedule.scheduleId=:scheduleId and weekdays.weekday=:weekday',
          { scheduleId, weekday },
        )
        .getOne();
      const saved = await this.repo.update(weekdaySchedule.id, {
        ...weekdaySchedule,
        ...body,
      });
      return saved;
    } catch (error) {
      throw error;
    }
  }
}
