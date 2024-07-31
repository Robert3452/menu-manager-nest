import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from './Address';
import { Corridor } from './Corridor';
import { Schedule } from './Schedule';
import { Store } from './Store';

@Entity({ name: 'branches' })
export class Branch {
  @PrimaryGeneratedColumn({ name: 'branchId' })
  id: number;

  @Column({ name: 'branchName', type: 'varchar', length: 200 })
  branchName: string;

  @ManyToOne(() => Store, (store) => store.branches, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @Column({ name: 'storeId' })
  storeId: number;

  @OneToOne(() => Schedule, (schedule) => schedule.branch)
  schedule: Schedule;

  @OneToOne(() => Address, (address) => address.branch)
  address: Address;

  @ManyToMany(() => Corridor, (corridor) => corridor.branches, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  corridors: Corridor[];
}
