import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Branch } from './Branch';
import { Product } from './Product';

@Entity({ name: 'corridors' })
export class Corridor {
  @PrimaryGeneratedColumn({ name: 'corridorId' })
  id: number;

  @Column({ type: 'varchar', length: 300 })
  name: string;
  @Column({ type: 'varchar', length: 400 })
  description: string;
  @Column({ type: 'integer' })
  index: number;

  @ManyToMany(() => Branch, (branch) => branch.corridors)
  @JoinTable({
    name: 'branchesHasCorridors',
    joinColumn: {
      name: 'corridorId',
    },
    inverseJoinColumn: {
      name: 'branchId',
    },
  })
  branches: Branch[];

  @OneToMany(() => Product, (product) => product.corridor)
  products: Product[];
}
