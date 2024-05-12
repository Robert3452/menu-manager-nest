import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Corridor } from './Corridor';
import { ToppingsCategory } from './ToppingCategories';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn({ name: 'productId' })
  id: number;

  @Column({ type: 'varchar', length: 100, name: 'name' })
  name: string;

  @Column({ type: 'varchar', length: 500, name: 'content' })
  content: string;

  @Column({ type: 'varchar', length: 300, name: 'image' })
  image: string;

  @Column({ type: 'integer' })
  index: number;

  @Column({ type: 'decimal', name: 'realPrice' })
  realPrice: number;

  @ManyToOne(() => Corridor, (corridor) => corridor.products, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'corridorId' })
  corridor: Corridor;
  @Column({ name: 'corridorId' })
  corridorId: number;

  @OneToMany(
    () => ToppingsCategory,
    (toppingsCategory) => toppingsCategory.product,
  )
  toppingCategories: ToppingsCategory[];
}
