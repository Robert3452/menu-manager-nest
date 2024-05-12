import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ToppingType } from './Enum/ToppingTypeEnum';
import { Product } from './Product';
import { Topping } from './Topping';

@Entity({ name: 'toppings_categories' })
export class ToppingsCategory {
  @PrimaryGeneratedColumn({ name: 'toppingsCategoryId' })
  id: number;

  @Column({ name: 'title', type: 'varchar', length: 50, unique: false })
  title: string;

  @Column({ name: 'mandatory', type: 'boolean', default: false })
  mandatory: boolean;

  @Column({ name: 'minToppingsForCategory', type: 'integer' })
  minToppingsForCategory: number;

  @Column({ name: 'maxToppingsForCategory', type: 'integer' })
  maxToppingsForCategory: number;

  @Column({ name: 'toppingType', type: 'enum', enum: ToppingType })
  toppingType: ToppingType;

  @Column({ name: 'index', type: 'integer' })
  index: number;

  @ManyToOne(() => Product, (product) => product.toppingCategories, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ name: 'productId' })
  productId: number;

  @OneToMany(() => Topping, (toppings) => toppings.toppingsCategory)
  toppings: Topping[];
}
