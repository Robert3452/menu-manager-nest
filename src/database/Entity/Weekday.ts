import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'weekdays' })
export class Weekday {
  @PrimaryGeneratedColumn({ name: 'weekdayId' })
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  name: string;
}
