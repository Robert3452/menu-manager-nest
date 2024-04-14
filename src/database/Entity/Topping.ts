import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ToppingsCategory } from './ToppingsCategories';

@Entity({ name: 'toppings' })
export class Topping {
  @PrimaryGeneratedColumn({ name: 'toppingId' })
  id: number;

  @Column({ type: 'boolean', default: true })
  available: boolean;

  @Column({ type: 'varchar', length: 300 })
  title: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ name: 'maxLimit', type: 'integer' })
  maxLimit: number;

  @Column({ name: 'index', type: 'integer' })
  index: number;

  @Column({ type: 'boolean', default: true })
  required: boolean;

  @ManyToOne(() => ToppingsCategory, (tc) => tc.toppings, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'toppingCategoryId' })
  toppingsCategory: ToppingsCategory;

  @Column({ name: 'toppingCategoryId' })
  toppingCategoryId: number;
}
