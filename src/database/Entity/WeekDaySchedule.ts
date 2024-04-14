import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Weekdays } from './Enum/WeekDaysEnum';
import { Schedule } from './Schedule';

@Entity({ name: 'weekday_schedules' })
export class WeekdaySchedule {
  @PrimaryGeneratedColumn({ name: 'weekdayScheduleId' })
  id: number;

  @Column({ name: 'index', type: 'int' })
  index: number;

  @Column({ type: 'enum', enum: Weekdays, name: 'weekday' })
  weekday: Weekdays;

  @Column({ type: 'timestamp', name: 'openTime', nullable: true })
  openTime: string;

  @Column({ type: 'timestamp', name: 'endTime', nullable: true })
  endTime: string;

  @Column({ type: 'boolean', default: false })
  closed: boolean;

  @ManyToOne(() => Schedule, (schedule) => schedule.weekdaySchedules, {
    cascade: true,
  })
  @JoinColumn({ name: 'scheduleId' })
  schedule: Schedule;

  @Column({ name: 'scheduleId' })
  scheduleId: number;
}
