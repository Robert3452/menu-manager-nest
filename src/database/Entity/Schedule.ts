import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Branch } from './Branch';
import { WeekdaySchedule } from './WeekDaySchedule';

@Entity({ name: 'schedules' })
export class Schedule {
  @PrimaryGeneratedColumn({ name: 'scheduleId' })
  id: number;

  @OneToOne(() => Branch, (branch) => branch.schedule, { cascade: true })
  @JoinColumn({ name: 'branchId' })
  branch: Branch;

  @Column({ name: 'branchId' })
  branchId: number;

  @OneToMany(
    () => WeekdaySchedule,
    (scheduleWeekday) => scheduleWeekday.schedule,
  )
  weekdaySchedules: WeekdaySchedule[];
}
